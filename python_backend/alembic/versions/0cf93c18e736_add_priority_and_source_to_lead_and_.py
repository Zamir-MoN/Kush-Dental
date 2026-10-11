"""Add priority and source to Lead and Contact

Revision ID: 0cf93c18e736
Revises: 292993be2b20
Create Date: 2026-09-30 17:30:52.388267

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0cf93c18e736'
down_revision: Union[str, None] = '292993be2b20'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    priority_enum = sa.Enum('NORMAL', 'HIGH', 'URGENT', name='Priority')
    priority_enum.create(op.get_bind(), checkfirst=True)
    source_enum = sa.Enum('INQUIRY', 'BOOKING', 'URGENT_VISIT', name='Source')
    source_enum.create(op.get_bind(), checkfirst=True)
    
    op.add_column('Contact', sa.Column('priority', priority_enum, nullable=False, server_default='NORMAL'))
    op.add_column('Contact', sa.Column('source', source_enum, nullable=False, server_default='INQUIRY'))
    op.add_column('Lead', sa.Column('priority', priority_enum, nullable=False, server_default='NORMAL'))
    op.add_column('Lead', sa.Column('source', source_enum, nullable=False, server_default='INQUIRY'))


def downgrade() -> None:
    op.drop_column('Lead', 'source')
    op.drop_column('Lead', 'priority')
    op.drop_column('Contact', 'source')
    op.drop_column('Contact', 'priority')
    
    sa.Enum(name='Priority').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='Source').drop(op.get_bind(), checkfirst=True)
