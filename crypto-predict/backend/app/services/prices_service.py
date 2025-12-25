from datetime import datetime
import requests
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert

from app.db import models


def fetch_prices_from_api(symbol: str, days: int, db: Session):
    """
    🪙 Fetch prices from CoinGecko
    ✅ Safely insert candles using ON CONFLICT DO NOTHING
    """

    url = (
        f"https://api.coingecko.com/api/v3/coins/"
        f"{symbol}/market_chart?vs_currency=usd&days={days}"
    )

    resp = requests.get(url)
    resp.raise_for_status()

    data = resp.json()["prices"]  # [[timestamp_ms, price], ...]

    values = []

    for ts_ms, price in data:
        ts = datetime.utcfromtimestamp(ts_ms / 1000)

        values.append(
            {
                "asset": symbol.upper(),
                "exchange": "binance",
                "timestamp": ts,
                "open": price,
                "high": price,
                "low": price,
                "close": price,
                "volume": 0.0,
            }
        )

    if not values:
        return 0

    stmt = insert(models.Candle).values(values)

    stmt = stmt.on_conflict_do_nothing(
        index_elements=["asset", "exchange", "timestamp"]
    )

    db.execute(stmt)
    db.commit()

    return len(values)
