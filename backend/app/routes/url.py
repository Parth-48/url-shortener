from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.url import URL
from app.schemas.url import URLCreate, URLResponse
from app.services.shortener import generate_short_code, generate_random_code
from app.services.cache import get_cached_url, set_cached_url
from app.config import BASE_URL

router = APIRouter()

@router.post("/shorten", response_model=URLResponse)
def shorten_url(request: URLCreate, db: Session = Depends(get_db)):

    short_code = generate_short_code(request.original_url)

    existing = db.query(URL).filter(URL.short_code == short_code).first()

    if existing:

        if existing.original_url == request.original_url:

            set_cached_url(short_code, existing.original_url)

            return {
                **existing.__dict__,
                "short_url": f"{BASE_URL}/{existing.short_code}"
            }
        
        short_code = generate_random_code()
    
    new_url = URL(
        original_url=request.original_url,
        short_code=short_code,
        click_count=0
    )
    db.add(new_url)
    db.commit()
    db.refresh(new_url)

    set_cached_url(short_code, request.original_url)

    return {
        **new_url.__dict__,
        "short_url": f"{BASE_URL}/{short_code}"
    }


@router.get("/{short_code}")
def redirect_url(short_code: str, db: Session = Depends(get_db)):

    cached_url = get_cached_url(short_code)

    if cached_url:
        db.query(URL).filter(URL.short_code == short_code).update({
            "click_count": URL.click_count + 1,
            "last_clicked": datetime.now()
            })
        db.commit()
        return RedirectResponse(url=cached_url, status_code=307)

    url_entry = db.query(URL).filter(URL.short_code == short_code).first()

    if not url_entry:
        raise HTTPException(status_code=404, detail="Short URL not found")

    set_cached_url(short_code, url_entry.original_url)
    
    url_entry.click_count += 1
    url_entry.last_clicked = datetime.now()
    db.commit()

    return RedirectResponse(url=url_entry.original_url, status_code=307)