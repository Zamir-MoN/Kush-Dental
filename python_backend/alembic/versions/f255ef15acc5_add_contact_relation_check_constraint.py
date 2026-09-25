"""Add contact relation check constraint

Revision ID: f255ef15acc5
Revises: f811432d2f23
Create Date: 2026-09-23 05:11:03.009487

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f255ef15acc5'
down_revision: Union[str, None] = 'f811432d2f23'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_check_constraint(
        'chk_contact_has_relation',
        'Contact',
        '"patientId" IS NOT NULL OR "leadId" IS NOT NULL OR "appointmentId" IS NOT NULL'
    )


def downgrade() -> None:
    op.drop_constraint('chk_contact_has_relation', 'Contact', type_='check')
