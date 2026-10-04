from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.url import URL
from app.schemas.url import URLAnalytics, URLList
from app.config import BASE_URL

router = APIRouter(
    prefix='/analytics',
    tags=["Analytics"]
)

@router.get("/{short_code}", response_model=URLAnalytics)
def get_url_analytics(short_code: str, db: Session = Depends(get_db)):

    url_entry = db.query(URL).filter(URL.short_code == short_code).first()

    if not url_entry:
        raise HTTPException(
            status_code=404,
            detail=f"Short code '{short_code}' not found"
        )

    return {
        "short_code": url_entry.short_code,
        "short_url": f"{BASE_URL}/{url_entry.short_code}",
        "original_url": url_entry.original_url,
        "click_count": url_entry.click_count,
        "created_at": url_entry.created_at,
        "last_clicked": url_entry.last_clicked
    }

@router.get("/", response_model=URLList)
def get_all_urls(skip: int=0, limit: int=10, db: Session = Depends(get_db)):

    total = db.query(URL).count()

    urls = db.query(URL)\
            .order_by(URL.created_at.desc())\
            .offset(skip)\
            .limit(limit)\
            .all()

    url_list = [
        {
            "short_code": u.short_code,
            "short_url": f"{BASE_URL}/{u.short_code}",
            "original_url": u.original_url,
            "click_count": u.click_count,
            "created_at": u.created_at,
            "last_clicked": u.last_clicked
        }
        for u in urls
    ]

    return {
        "urls": url_list,
        "total": total
    }