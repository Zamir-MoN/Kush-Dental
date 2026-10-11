"""Add AppointmentNote

Revision ID: f811432d2f26
Revises: f811432d2f25
Create Date: 2026-10-07 01:28:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f811432d2f26'
down_revision = 'f811432d2f25'
branch_labels = None
depends_on = None

def upgrade():
    # Create AppointmentNote table
    op.create_table('AppointmentNote',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('appointmentId', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('authorId', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('note', sa.Text(), nullable=False),
        sa.Column('createdAt', postgresql.TIMESTAMP(timezone=True, precision=3), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updatedAt', postgresql.TIMESTAMP(timezone=True, precision=3), nullable=False),
        sa.Column('deletedAt', postgresql.TIMESTAMP(timezone=True, precision=3), nullable=True),
        sa.ForeignKeyConstraint(['appointmentId'], ['Appointment.id'], name='AppointmentNote_appointmentId_fkey', onupdate='CASCADE', ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['authorId'], ['User.id'], name='AppointmentNote_authorId_fkey', onupdate='CASCADE', ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('AppointmentNote_appointmentId_idx', 'AppointmentNote', ['appointmentId'], unique=False)

def downgrade():
    op.drop_index('AppointmentNote_appointmentId_idx', table_name='AppointmentNote')
    op.drop_table('AppointmentNote')
