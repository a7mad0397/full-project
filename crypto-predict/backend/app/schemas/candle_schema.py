from pydantic import BaseModel
from datetime import datetime


class CandleBase(BaseModel):
    asset: str
    exchange: str
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float


class CandleResponse(CandleBase):
    id: int

    class Config:
        from_attributes = True
