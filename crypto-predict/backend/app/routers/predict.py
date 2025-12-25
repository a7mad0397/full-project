from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.prediction_schema import PredictionResponse
from app.services.prediction_service import generate_mock_predictions
from app.core.security import get_current_user
from app.db.models import User

router = APIRouter(
    prefix="/predict",
    tags=["Prediction"],
)

@router.get("/{symbol}", response_model=list[PredictionResponse])
def predict(
    symbol: str,
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    🔮 التنبؤ بأسعار عملة رقمية معينة (Mock)
    """
    return generate_mock_predictions(symbol, days, db, current_user)
