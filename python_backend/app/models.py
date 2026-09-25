import enum
import uuid
from sqlalchemy import (
    Column, Text, ForeignKey, Enum, CheckConstraint, text, Index
)
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP, ExcludeConstraint, ARRAY

Base = declarative_base()

class Role(enum.Enum):
    ADMIN = 'ADMIN'
    DOCTOR = 'DOCTOR'
    STAFF = 'STAFF'

class AppointmentStatus(enum.Enum):
    REQUESTED = 'REQUESTED'
    CONFIRMED = 'CONFIRMED'
    CANCELLED = 'CANCELLED'
    COMPLETED = 'COMPLETED'
    NO_SHOW = 'NO_SHOW'

class AuditResult(enum.Enum):
    SUCCESS = 'SUCCESS'
    FAILURE = 'FAILURE'

class LeadStatus(enum.Enum):
    NEW = 'NEW'
    CONTACTED = 'CONTACTED'
    CONVERTED = 'CONVERTED'
    DISMISSED = 'DISMISSED'

class BlogStatus(enum.Enum):
    DRAFT = 'DRAFT'
    PUBLISHED = 'PUBLISHED'

class User(Base):
    __tablename__ = 'User'
    
    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column('email', Text, nullable=False)
    passwordHash = Column('passwordHash', Text, nullable=False, quote=True)
    role = Column('role', Enum(Role, name='Role', create_type=False), nullable=False)
    createdAt = Column('createdAt', TIMESTAMP(timezone=True, precision=3), nullable=False, server_default=text('CURRENT_TIMESTAMP'), quote=True)
    updatedAt = Column('updatedAt', TIMESTAMP(timezone=True, precision=3), nullable=False, quote=True)
    deletedAt = Column('deletedAt', TIMESTAMP(timezone=True, precision=3), nullable=True, quote=True)

    __table_args__ = (
        Index('User_email_key', 'email', unique=True),
        {'quote': True}
    )

class Patient(Base):
    __tablename__ = 'Patient'
    
    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    fullName = Column('fullName', Text, nullable=False, quote=True)
    phone = Column('phone', Text, nullable=False)
    email = Column('email', Text, nullable=True)
    createdAt = Column('createdAt', TIMESTAMP(timezone=True, precision=3), nullable=False, server_default=text('CURRENT_TIMESTAMP'), quote=True)
    updatedAt = Column('updatedAt', TIMESTAMP(timezone=True, precision=3), nullable=False, quote=True)
    deletedAt = Column('deletedAt', TIMESTAMP(timezone=True, precision=3), nullable=True, quote=True)

    __table_args__ = (
        Index('Patient_phone_key', 'phone', unique=True),
        {'quote': True}
    )

class Appointment(Base):
    __tablename__ = 'Appointment'
    
    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patientId = Column('patientId', UUID(as_uuid=True), ForeignKey('Patient.id', name='Appointment_patientId_fkey', ondelete='RESTRICT', onupdate='CASCADE'), nullable=False, quote=True)
    doctorId = Column('doctorId', UUID(as_uuid=True), ForeignKey('User.id', name='Appointment_doctorId_fkey', ondelete='RESTRICT', onupdate='CASCADE'), nullable=True, quote=True)
    treatment = Column('treatment', Text, nullable=False)
    startsAt = Column('startsAt', TIMESTAMP(timezone=True, precision=3), nullable=False, quote=True)
    endsAt = Column('endsAt', TIMESTAMP(timezone=True, precision=3), nullable=False, quote=True)
    status = Column('status', Enum(AppointmentStatus, name='AppointmentStatus', create_type=False), nullable=False)
    cancellationReason = Column('cancellationReason', Text, nullable=True, quote=True)
    createdAt = Column('createdAt', TIMESTAMP(timezone=True, precision=3), nullable=False, server_default=text('CURRENT_TIMESTAMP'), quote=True)
    updatedAt = Column('updatedAt', TIMESTAMP(timezone=True, precision=3), nullable=False, quote=True)
    deletedAt = Column('deletedAt', TIMESTAMP(timezone=True, precision=3), nullable=True, quote=True)

    __table_args__ = (
        CheckConstraint('("endsAt" > "startsAt")', name='chk_appointment_times'),
        ExcludeConstraint(
            (text('"doctorId"'), '='),
            (text('tstzrange("startsAt", "endsAt")'), '&&'),
            where=text("status = ANY (ARRAY['REQUESTED'::\"AppointmentStatus\", 'CONFIRMED'::\"AppointmentStatus\"])"),
            name='no_overlapping_appointments',
            using='gist'
        ),
        {'quote': True}
    )

class RefreshToken(Base):
    __tablename__ = 'RefreshToken'

    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    userId = Column('userId', UUID(as_uuid=True), ForeignKey('User.id', name='RefreshToken_userId_fkey', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, quote=True)
    hashedToken = Column('hashedToken', Text, nullable=False, quote=True)
    familyId = Column('familyId', UUID(as_uuid=True), nullable=False, default=uuid.uuid4, quote=True)
    replacedBy = Column('replacedBy', UUID(as_uuid=True), ForeignKey('RefreshToken.id', name='RefreshToken_replacedBy_fkey', ondelete='SET NULL'), nullable=True, quote=True)
    revokedAt = Column('revokedAt', TIMESTAMP(timezone=True, precision=3), nullable=True, quote=True)
    expiresAt = Column('expiresAt', TIMESTAMP(timezone=True, precision=3), nullable=False, quote=True)
    createdAt = Column('createdAt', TIMESTAMP(timezone=True, precision=3), nullable=False, server_default=text('CURRENT_TIMESTAMP'), quote=True)

    __table_args__ = (
        Index('RefreshToken_hashedToken_key', 'hashedToken', unique=True),
        Index('RefreshToken_familyId_idx', 'familyId'),
        {'quote': True}
    )

class AuditLog(Base):
    __tablename__ = 'AuditLog'
    __table_args__ = {'quote': True}

    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actorId = Column('actorId', UUID(as_uuid=True), nullable=True, quote=True)
    action = Column('action', Text, nullable=False)
    resourceType = Column('resourceType', Text, nullable=False, quote=True)
    resourceId = Column('resourceId', UUID(as_uuid=True), nullable=True, quote=True)
    result = Column('result', Enum(AuditResult, name='AuditResult', create_type=False), nullable=False)
    metadata_ = Column('metadata', JSONB, nullable=True)
    timestamp = Column('timestamp', TIMESTAMP(timezone=True, precision=3), nullable=False, server_default=text('CURRENT_TIMESTAMP'))

class Lead(Base):
    __tablename__ = 'Lead'

    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column('name', Text, nullable=False)
    phone = Column('phone', Text, nullable=False)
    email = Column('email', Text, nullable=True)
    status = Column('status', Enum(LeadStatus, name='LeadStatus', create_type=False), nullable=False)
    desiredTreatment = Column('desiredTreatment', Text, nullable=True, quote=True)
    notes = Column('notes', Text, nullable=True)
    
    idempotencyKey = Column('idempotencyKey', UUID(as_uuid=True), nullable=True, quote=True)
    payloadFingerprint = Column('payloadFingerprint', Text, nullable=True, quote=True)
    
    createdAt = Column('createdAt', TIMESTAMP(timezone=True, precision=3), nullable=False, server_default=text('CURRENT_TIMESTAMP'), quote=True)
    updatedAt = Column('updatedAt', TIMESTAMP(timezone=True, precision=3), nullable=False, quote=True)
    deletedAt = Column('deletedAt', TIMESTAMP(timezone=True, precision=3), nullable=True, quote=True)

    __table_args__ = (
        Index('Lead_phone_idx', 'phone'),
        Index('Lead_idempotencyKey_key', 'idempotencyKey', unique=True, postgresql_where=text('"idempotencyKey" IS NOT NULL')),
        {'quote': True}
    )

class Blog(Base):
    __tablename__ = 'Blog'

    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column('title', Text, nullable=False)
    slug = Column('slug', Text, nullable=False)
    excerpt = Column('excerpt', Text, nullable=True)
    content = Column('content', Text, nullable=False)
    coverImage = Column('coverImage', Text, nullable=True, quote=True)
    category = Column('category', Text, nullable=True)
    tags = Column('tags', ARRAY(Text), nullable=True)
    authorId = Column('authorId', UUID(as_uuid=True), ForeignKey('User.id', name='Blog_authorId_fkey', ondelete='RESTRICT', onupdate='CASCADE'), nullable=False, quote=True)
    status = Column('status', Enum(BlogStatus, name='BlogStatus', create_type=False), nullable=False)
    publishedAt = Column('publishedAt', TIMESTAMP(timezone=True, precision=3), nullable=True, quote=True)
    createdAt = Column('createdAt', TIMESTAMP(timezone=True, precision=3), nullable=False, server_default=text('CURRENT_TIMESTAMP'), quote=True)
    updatedAt = Column('updatedAt', TIMESTAMP(timezone=True, precision=3), nullable=False, quote=True)
    deletedAt = Column('deletedAt', TIMESTAMP(timezone=True, precision=3), nullable=True, quote=True)

    __table_args__ = (
        Index('Blog_slug_key', 'slug', unique=True),
        {'quote': True}
    )

class ContactStatus(enum.Enum):
    OPEN = 'OPEN'
    IN_PROGRESS = 'IN_PROGRESS'
    CONTACTED = 'CONTACTED'
    COMPLETED = 'COMPLETED'
    NO_RESPONSE = 'NO_RESPONSE'
    CANCELLED = 'CANCELLED'

class Contact(Base):
    __tablename__ = 'Contact'

    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patientId = Column('patientId', UUID(as_uuid=True), ForeignKey('Patient.id', name='Contact_patientId_fkey', ondelete='RESTRICT', onupdate='CASCADE'), nullable=True, quote=True)
    leadId = Column('leadId', UUID(as_uuid=True), ForeignKey('Lead.id', name='Contact_leadId_fkey', ondelete='RESTRICT', onupdate='CASCADE'), nullable=True, quote=True)
    appointmentId = Column('appointmentId', UUID(as_uuid=True), ForeignKey('Appointment.id', name='Contact_appointmentId_fkey', ondelete='RESTRICT', onupdate='CASCADE'), nullable=True, quote=True)
    
    status = Column('status', Enum(ContactStatus, name='ContactStatus', create_type=False), nullable=False, default=ContactStatus.OPEN)
    notes = Column('notes', Text, nullable=True)
    outcome = Column('outcome', Text, nullable=True)
    
    nextFollowUpAt = Column('nextFollowUpAt', TIMESTAMP(timezone=True, precision=3), nullable=True, quote=True)
    
    createdAt = Column('createdAt', TIMESTAMP(timezone=True, precision=3), nullable=False, server_default=text('CURRENT_TIMESTAMP'), quote=True)
    updatedAt = Column('updatedAt', TIMESTAMP(timezone=True, precision=3), nullable=False, quote=True)
    deletedAt = Column('deletedAt', TIMESTAMP(timezone=True, precision=3), nullable=True, quote=True)

    __table_args__ = (
        Index('Contact_status_idx', 'status'),
        Index('Contact_patientId_idx', 'patientId'),
        Index('Contact_leadId_key', 'leadId', unique=True, postgresql_where=text('"leadId" IS NOT NULL')),
        CheckConstraint('"patientId" IS NOT NULL OR "leadId" IS NOT NULL OR "appointmentId" IS NOT NULL', name='chk_contact_has_relation'),
        {'quote': True}
    )
