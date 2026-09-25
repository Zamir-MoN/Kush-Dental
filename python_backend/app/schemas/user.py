from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from app.models import Role

class UserBase(BaseModel):
    email: EmailStr
    role: Role

class UserCreate(UserBase):
    password: str

    @field_validator('role')
    @classmethod
    def validate_role(cls, v: Role) -> Role:
        if v == Role.ADMIN:
            raise ValueError("ADMIN role is not supported for creation")
        return v

class UserResponse(UserBase):
    id: UUID
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)

class UserListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    data: List[UserResponse]

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[Role] = None

    model_config = ConfigDict(extra="forbid")

    @field_validator('role')
    @classmethod
    def validate_role(cls, v: Optional[Role]) -> Optional[Role]:
        if v == Role.ADMIN:
            raise ValueError("ADMIN role is not supported for update")
        return v
