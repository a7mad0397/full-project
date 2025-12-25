from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey,
    Boolean, UniqueConstraint, Index, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


# ================================================================
# 1️⃣ جدول المستخدمين (Users)
# ================================================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(10), default="user")  # user / admin
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # علاقة المستخدم مع التنبؤات التي أنشأها
    predictions = relationship("Prediction", back_populates="created_by_user")

    def __repr__(self):
        return f"<User id={self.id}, username={self.username!r}>"


# ================================================================
# 2️⃣ جدول بيانات الأسعار التاريخية (Candle OHLCV)
# ================================================================
class Candle(Base):
    __tablename__ = "candle_ohlcv"

    id = Column(Integer, primary_key=True)
    asset = Column(String(20), nullable=False)          # مثل BTC, ETH
    exchange = Column(String(30), default="binance")    # المنصة
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(Float, nullable=False)

    # لمنع التكرار لنفس الأصل والزمن والمنصة
    __table_args__ = (
        UniqueConstraint("asset", "exchange", "timestamp", name="uq_candle_asset_exch_ts"),
        Index("ix_candle_asset_ts", "asset", "timestamp"),
    )

    def __repr__(self):
        return f"<Candle {self.asset}@{self.timestamp}>"


# ================================================================
# 3️⃣ جدول إشارات المشاعر (Sentiment Signal)
# ================================================================
class Sentiment(Base):
    __tablename__ = "sentiment_signal"

    id = Column(Integer, primary_key=True)
    asset = Column(String(20), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    score = Column(Float, nullable=False)               # من -1 إلى 1
    label = Column(String(10), nullable=False)          # positive / negative / neutral
    source = Column(String(50), nullable=False)         # twitter / news / reddit
    source_url = Column(String(255))                    # رابط التغريدة أو المقال
    meta = Column(JSON)                                 # بيانات إضافية (اختياري)

    __table_args__ = (
        Index("ix_sentiment_asset_ts", "asset", "timestamp"),
    )

    def __repr__(self):
        return f"<Sentiment {self.asset} {self.label} {self.score}>"


# ================================================================
# 4️⃣ جدول التنبؤات (Predictions)
# ================================================================
class Prediction(Base):
    __tablename__ = "prediction"

    id = Column(Integer, primary_key=True)
    asset = Column(String(20), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    predicted_price = Column(Float, nullable=False)
    model_used = Column(String(50), nullable=False)
    confidence = Column(Float)                          # نسبة الثقة بالتنبؤ
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # علاقة التنبؤ مع المستخدم الذي أنشأه
    created_by_user_id = Column(Integer, ForeignKey("users.id"))
    created_by_user = relationship("User", back_populates="predictions")

    __table_args__ = (
        Index("ix_prediction_asset_ts", "asset", "timestamp"),
    )

    def __repr__(self):
        return f"<Prediction {self.asset}@{self.timestamp}={self.predicted_price}>"


# ================================================================
# 5️⃣ جدول سجل النماذج الذكية (Model Registry)
# ================================================================
class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)          # اسم النموذج مثل LSTM_v1
    version = Column(String(50), nullable=False)        # 1.0.0 مثلاً
    path = Column(String(255))                          # مكان تخزين النموذج
    params = Column(JSON)                               # إعدادات التدريب
    metrics = Column(JSON)                              # نتائج التقييم (MAE, RMSE, MAPE)
    is_active = Column(Boolean, default=True)
    registered_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("name", "version", name="uq_model_name_version"),
    )

    def __repr__(self):
        return f"<ModelRegistry {self.name}:{self.version}>"
