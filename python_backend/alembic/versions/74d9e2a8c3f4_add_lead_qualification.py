"""add_lead_qualification

Revision ID: 74d9e2a8c3f4
Revises: 0cf93c18e736
Create Date: 2026-10-05 10:09:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '74d9e2a8c3f4'
down_revision: Union[str, None] = '0cf93c18e736'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create LeadQualification enum type
    lead_qualification_enum = postgresql.ENUM('UNREVIEWED', 'POSITIVE', 'NEGATIVE', name='LeadQualification')
    lead_qualification_enum.create(op.get_bind(), checkfirst=True)
    
    # Add columns
    op.add_column('Lead', sa.Column('leadQualification', lead_qualification_enum, nullable=False, server_default='UNREVIEWED'))
    op.add_column('Lead', sa.Column('negativeReason', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('Lead', 'negativeReason')
    op.drop_column('Lead', 'leadQualification')
    
    lead_qualification_enum = postgresql.ENUM('UNREVIEWED', 'POSITIVE', 'NEGATIVE', name='LeadQualification')
    lead_qualification_enum.drop(op.get_bind(), checkfirst=True)
