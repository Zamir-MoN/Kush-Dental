from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from datetime import datetime, time, timezone
from zoneinfo import ZoneInfo
from typing import List, Dict, Any

from app.models import Appointment, Patient, User, Role, AppointmentStatus, Lead, LeadStatus
from app.schemas.dashboard import DashboardResponse

TODAY_APPOINTMENTS_LIMIT = 10
REQUESTED_APPOINTMENTS_LIMIT = 10
UPCOMING_APPOINTMENTS_LIMIT = 5
RECENT_LEADS_LIMIT = 5

KOLKATA_TZ = ZoneInfo("Asia/Kolkata")

def get_today_bounds_utc() -> tuple[datetime, datetime]:
    now_ist = datetime.now(KOLKATA_TZ)
    # Start of today IST
    start_ist = datetime.combine(now_ist.date(), time.min, tzinfo=KOLKATA_TZ)
    # Start of next day IST
    # timedelta is not needed for naive date, but we can do it by adding days=1 to date
    from datetime import timedelta
    next_day_ist = datetime.combine(now_ist.date() + timedelta(days=1), time.min, tzinfo=KOLKATA_TZ)
    
    return start_ist.astimezone(timezone.utc), next_day_ist.astimezone(timezone.utc)

def map_appointment(row) -> Dict[str, Any]:
    apt = row.Appointment
    patient = row.Patient
    doctor = row.User
    return {
        "id": apt.id,
        "startsAt": apt.startsAt,
        "endsAt": apt.endsAt,
        "treatment": apt.treatment,
        "status": apt.status,
        "patient": {
            "id": patient.id,
            "fullName": patient.fullName,
            "phone": patient.phone
        },
        "doctor": {
            "id": doctor.id,
            "name": doctor.email.split('@')[0]
        } if doctor else None
    }

async def get_dashboard_data(db: AsyncSession, current_user: User) -> DashboardResponse:
    start_utc, next_start_utc = get_today_bounds_utc()
    now_utc = datetime.now(timezone.utc)

    # Base query for appointments
    base_apt_query = select(Appointment, Patient, User)\
        .join(Patient, Appointment.patientId == Patient.id)\
        .outerjoin(User, Appointment.doctorId == User.id)\
        .where(Appointment.deletedAt.is_(None))

    # 1. Today's Appointments (bounded limit 10)
    today_apts_query = base_apt_query\
        .where(Appointment.startsAt >= start_utc, Appointment.startsAt < next_start_utc)\
        .order_by(Appointment.startsAt.asc())\
        .limit(TODAY_APPOINTMENTS_LIMIT)
    today_rows = await db.execute(today_apts_query)
    today_appointments = [map_appointment(r) for r in today_rows.all()]

    # 2. Pending Appointment Requests (status = REQUESTED, bounded limit 10)
    req_apts_query = base_apt_query\
        .where(Appointment.status == AppointmentStatus.REQUESTED)\
        .order_by(Appointment.startsAt.asc())\
        .limit(REQUESTED_APPOINTMENTS_LIMIT)
    req_rows = await db.execute(req_apts_query)
    requested_appointments = [map_appointment(r) for r in req_rows.all()]

    # 3. Upcoming Appointments (startsAt >= now, bounded limit 5)
    upcoming_apts_query = base_apt_query\
        .where(Appointment.startsAt >= now_utc)\
        .order_by(Appointment.startsAt.asc())\
        .limit(UPCOMING_APPOINTMENTS_LIMIT)
    upcoming_rows = await db.execute(upcoming_apts_query)
    upcoming_appointments = [map_appointment(r) for r in upcoming_rows.all()]

    # 4. Recent Leads (bounded limit 5)
    # STAFF and DOCTOR currently have the same visibility to Leads based on existing Lead API (no filtering per user).
    # We will enforce limit and order.
    recent_leads_query = select(Lead)\
        .where(Lead.deletedAt.is_(None))\
        .order_by(Lead.createdAt.desc())\
        .limit(RECENT_LEADS_LIMIT)
    recent_leads_rows = await db.execute(recent_leads_query)
    recent_leads = [
        {
            "id": l.id,
            "name": l.name,
            "phone": l.phone,
            "desiredTreatment": l.desiredTreatment,
            "status": l.status,
            "createdAt": l.createdAt
        } for l in recent_leads_rows.scalars().all()
    ]

    # 5. Summary Counts
    # Use explicit aggregate COUNT queries
    count_today_query = select(func.count())\
        .select_from(Appointment)\
        .where(Appointment.deletedAt.is_(None), Appointment.startsAt >= start_utc, Appointment.startsAt < next_start_utc)
    count_today = (await db.execute(count_today_query)).scalar() or 0

    count_req_query = select(func.count())\
        .select_from(Appointment)\
        .where(Appointment.deletedAt.is_(None), Appointment.status == AppointmentStatus.REQUESTED)
    count_req = (await db.execute(count_req_query)).scalar() or 0

    count_conf_today_query = select(func.count())\
        .select_from(Appointment)\
        .where(Appointment.deletedAt.is_(None), Appointment.startsAt >= start_utc, Appointment.startsAt < next_start_utc, Appointment.status == AppointmentStatus.CONFIRMED)
    count_conf_today = (await db.execute(count_conf_today_query)).scalar() or 0

    count_new_leads_query = select(func.count())\
        .select_from(Lead)\
        .where(Lead.deletedAt.is_(None), Lead.status == LeadStatus.NEW)
    count_new_leads = (await db.execute(count_new_leads_query)).scalar() or 0

    # Contact Follow-ups
    from app.models import Contact, ContactStatus
    count_open_query = select(func.count())\
        .select_from(Contact)\
        .where(Contact.deletedAt.is_(None), Contact.status == ContactStatus.OPEN)
    count_open_follow_ups = (await db.execute(count_open_query)).scalar() or 0
    
    count_in_progress_query = select(func.count())\
        .select_from(Contact)\
        .where(Contact.deletedAt.is_(None), Contact.status == ContactStatus.IN_PROGRESS)
    count_in_progress = (await db.execute(count_in_progress_query)).scalar() or 0

    return DashboardResponse(
        summary={
            "todayAppointments": count_today,
            "requestedAppointments": count_req,
            "confirmedToday": count_conf_today,
            "newLeads": count_new_leads,
            "openFollowUps": count_open_follow_ups,
            "inProgressFollowUps": count_in_progress
        },
        todayAppointments=today_appointments,
        requestedAppointments=requested_appointments,
        upcomingAppointments=upcoming_appointments,
        recentLeads=recent_leads
    )
