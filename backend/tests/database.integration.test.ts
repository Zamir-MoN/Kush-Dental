import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    // Clear the DB before running tests
    try {
      await prisma.appointment.deleteMany();
      await prisma.patient.deleteMany();
      await prisma.user.deleteMany();
    } catch (e) {
      console.warn("Could not clear database. Ensure it is running.");
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should successfully create a valid Appointment', async () => {
    const doctor = await prisma.user.create({
      data: {
        email: 'doc1@test.com',
        passwordHash: 'hashed',
        role: 'DOCTOR',
      },
    });

    const patient = await prisma.patient.create({
      data: {
        fullName: 'Test Patient',
        phone: '1234567890',
      },
    });

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        treatment: 'Checkup',
        startsAt: new Date('2024-11-01T10:00:00Z'),
        endsAt: new Date('2024-11-01T10:30:00Z'),
        status: 'REQUESTED',
      },
    });

    expect(appointment).toBeDefined();
    expect(appointment.id).toBeDefined();
  });

  it('should reject overlapping appointments for the same doctor (GiST exclusion)', async () => {
    const doctor = await prisma.user.create({
      data: {
        email: 'doc2@test.com',
        passwordHash: 'hashed',
        role: 'DOCTOR',
      },
    });

    const patient = await prisma.patient.create({
      data: {
        fullName: 'Test Patient 2',
        phone: '0987654321',
      },
    });

    // Appointment 1: 10:00 - 10:30
    await prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        treatment: 'Checkup',
        startsAt: new Date('2024-11-01T10:00:00Z'),
        endsAt: new Date('2024-11-01T10:30:00Z'),
        status: 'REQUESTED',
      },
    });

    // Appointment 2: 10:15 - 10:45 (Overlaps!)
    await expect(
      prisma.appointment.create({
        data: {
          doctorId: doctor.id,
          patientId: patient.id,
          treatment: 'Cleaning',
          startsAt: new Date('2024-11-01T10:15:00Z'),
          endsAt: new Date('2024-11-01T10:45:00Z'),
          status: 'REQUESTED', // Reserves slot
        },
      })
    ).rejects.toThrow();
  });

  it('should allow adjacent appointments (10:00-10:30, 10:30-11:00)', async () => {
    const doctor = await prisma.user.create({
      data: {
        email: 'doc3@test.com',
        passwordHash: 'hashed',
        role: 'DOCTOR',
      },
    });

    const patient = await prisma.patient.create({
      data: {
        fullName: 'Test Patient 3',
        phone: '1122334455',
      },
    });

    // Appointment 1: 10:00 - 10:30
    await prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        treatment: 'Checkup',
        startsAt: new Date('2024-11-01T10:00:00Z'),
        endsAt: new Date('2024-11-01T10:30:00Z'),
        status: 'REQUESTED',
      },
    });

    // Appointment 2: 10:30 - 11:00 (Adjacent, no overlap)
    const apt2 = await prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        treatment: 'Cleaning',
        startsAt: new Date('2024-11-01T10:30:00Z'),
        endsAt: new Date('2024-11-01T11:00:00Z'),
        status: 'REQUESTED',
      },
    });

    expect(apt2).toBeDefined();
  });

  it('should allow overlapping appointments if historical/cancelled', async () => {
    const doctor = await prisma.user.create({
      data: {
        email: 'doc4@test.com',
        passwordHash: 'hashed',
        role: 'DOCTOR',
      },
    });

    const patient = await prisma.patient.create({
      data: {
        fullName: 'Test Patient 4',
        phone: '5544332211',
      },
    });

    // Appointment 1: 10:00 - 10:30 (CANCELLED, does not reserve slot)
    await prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        treatment: 'Checkup',
        startsAt: new Date('2024-11-01T10:00:00Z'),
        endsAt: new Date('2024-11-01T10:30:00Z'),
        status: 'CANCELLED',
      },
    });

    // Appointment 2: 10:15 - 10:45 (Overlaps, but previous is cancelled)
    const apt2 = await prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        treatment: 'Cleaning',
        startsAt: new Date('2024-11-01T10:15:00Z'),
        endsAt: new Date('2024-11-01T10:45:00Z'),
        status: 'REQUESTED',
      },
    });

    expect(apt2).toBeDefined();
  });

  it('should reject invalid times (startsAt >= endsAt)', async () => {
    const doctor = await prisma.user.create({
      data: {
        email: 'doc5@test.com',
        passwordHash: 'hashed',
        role: 'DOCTOR',
      },
    });

    const patient = await prisma.patient.create({
      data: {
        fullName: 'Test Patient 5',
        phone: '9988776655',
      },
    });

    await expect(
      prisma.appointment.create({
        data: {
          doctorId: doctor.id,
          patientId: patient.id,
          treatment: 'Checkup',
          startsAt: new Date('2024-11-01T10:30:00Z'),
          endsAt: new Date('2024-11-01T10:00:00Z'), // ends before it starts
          status: 'REQUESTED',
        },
      })
    ).rejects.toThrow();
  });

  it('should prevent concurrent overlapping bookings (Race Condition Test)', async () => {
    const doctor = await prisma.user.create({
      data: {
        email: 'doc6_concurrent@test.com',
        passwordHash: 'hashed',
        role: 'DOCTOR',
      },
    });

    const patient1 = await prisma.patient.create({
      data: {
        fullName: 'Test Patient 6',
        phone: '1112223334',
      },
    });

    const patient2 = await prisma.patient.create({
      data: {
        fullName: 'Test Patient 7',
        phone: '4443332221',
      },
    });

    // Fire two identical bookings concurrently
    const p1 = prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient1.id,
        treatment: 'Checkup',
        startsAt: new Date('2024-11-02T10:00:00Z'),
        endsAt: new Date('2024-11-02T10:30:00Z'),
        status: 'REQUESTED',
      },
    });

    const p2 = prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient2.id,
        treatment: 'Checkup',
        startsAt: new Date('2024-11-02T10:00:00Z'),
        endsAt: new Date('2024-11-02T10:30:00Z'),
        status: 'REQUESTED',
      },
    });

    const results = await Promise.allSettled([p1, p2]);

    const fulfilled = results.filter(r => r.status === 'fulfilled');
    const rejected = results.filter(r => r.status === 'rejected');

    // Exactly one should succeed, exactly one should fail due to DB exclusion constraint
    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);
  });
});
