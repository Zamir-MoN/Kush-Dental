"""add patient display id

Revision ID: 84d9e2a8c3f5
Revises: 74d9e2a8c3f4
Create Date: 2026-10-05 16:59:00.000000

"""
from typing import Sequence, Union
import random
import string

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '84d9e2a8c3f5'
down_revision: Union[str, None] = '74d9e2a8c3f4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add displayId column
    op.add_column('Patient', sa.Column('displayId', sa.String(length=10), nullable=True))
    
    # Create an index
    op.create_index(op.f('ix_Patient_displayId'), 'Patient', ['displayId'], unique=True)
    
    # Generate unique 6-digit IDs for existing patients
    connection = op.get_bind()
    patients = connection.execute(sa.text('SELECT id FROM "Patient" WHERE "displayId" IS NULL')).fetchall()
    
    used_ids = set()
    for patient in patients:
        while True:
            new_id = ''.join(random.choices(string.digits, k=6))
            if new_id not in used_ids:
                used_ids.add(new_id)
                break
                
        connection.execute(
            sa.text('UPDATE "Patient" SET "displayId" = :display_id WHERE id = :id'),
            {"display_id": new_id, "id": patient[0]}
        )
        
    # Make the column non-nullable
    op.alter_column('Patient', 'displayId', existing_type=sa.String(length=10), nullable=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_Patient_displayId'), table_name='Patient')
    op.drop_column('Patient', 'displayId')
