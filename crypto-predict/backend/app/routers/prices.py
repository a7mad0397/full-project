from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.candle_schema import CandleResponse
from app.core.security import get_current_user
from app.services.prices_service import fetch_prices_from_api

router = APIRouter(prefix="/prices", tags=["Prices"])

@router.get("/{symbol}", response_model=list[CandleResponse])
def get_prices(symbol: str,
               days: int = 7,
               db: Session = Depends(get_db),
               current_user = Depends(get_current_user)):
    """
    جلب أسعار عملة معينة لعدد من الأيام من CoinGecko
    """
    try:
        return fetch_prices_from_api(symbol, days, db)
    except Exception:
        raise HTTPException(status_code=400, detail="حدث خطأ أثناء جلب الأسعار")
