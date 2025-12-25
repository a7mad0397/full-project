from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# Base schema (مشترك)
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: Optional[str] = "user"
    is_active: Optional[bool] = True


# عند إنشاء مستخدم جديد
class UserCreate(UserBase):
    password: str


# عند عرض بيانات المستخدم
class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
