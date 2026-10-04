from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
from app.database import Base

class URL(Base):
    __tablename__ = "urls"

    id = Column(Integer, primary_key=True, index=True)

    original_url = Column(String(2048), nullable=False)

    short_code = Column(String(10), unique=True, index=True)

    click_count = Column(Integer, default=0)

    created_at = Column(DateTime, default=func.now())

    last_clicked = Column(DateTime, nullable=True)

#index=True is to fast lookup in database O(logn) time compared to normal O(n)