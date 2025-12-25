from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

from app.db.models import User
from app.schemas.user_schema import UserCreate
from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()

# 🔐 تشفير كلمة المرور
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# ✅ التحقق من كلمة المرور
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# 🪪 إنشاء JWT Token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALG)

# 📝 إنشاء مستخدم جديد
def register_user(user_data: UserCreate, db: Session) -> User:
    if db.query(User).filter(User.email == user_data.email).first():
        raise ValueError("Email already registered")

    hashed_pw = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_pw,
        role="user",
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 🔐 تسجيل الدخول وإصدار التوكن
def login_user(username: str, password: str, db: Session) -> str:
    user = db.query(User).filter(User.email == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise ValueError("Invalid credentials")

    return create_access_token({"sub": user.email})
