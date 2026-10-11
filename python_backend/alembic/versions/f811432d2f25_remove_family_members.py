"""remove familyMembers and make phone non-unique

Revision ID: f811432d2f25
Revises: f811432d2f24
Create Date: 2026-10-07 00:15:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f811432d2f25'
down_revision = 'f811432d2f24'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Drop familyMembers column
    op.drop_column('Patient', 'familyMembers')
    
    # Drop unique constraint/index on phone
    op.drop_index('Patient_phone_key', table_name='Patient')
    
    # Create non-unique index on phone
    op.create_index('Patient_phone_idx', 'Patient', ['phone'], unique=False)


def downgrade() -> None:
    # Drop non-unique index
    op.drop_index('Patient_phone_idx', table_name='Patient')
    
    # Create unique index back
    op.create_index('Patient_phone_key', 'Patient', ['phone'], unique=True)
    
    # Add familyMembers back
    op.add_column('Patient', sa.Column('familyMembers', postgresql.ARRAY(sa.Text()), nullable=True))
