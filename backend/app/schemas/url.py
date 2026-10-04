from pydantic import BaseModel, HttpUrl
from datetime import datetime 
from typing import Optional

class URLCreate(BaseModel):
    original_url: str

    class Config:
        json_schema_extra = {
            "example": {
                "original_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            }
        }

class URLResponse(BaseModel):
    short_code: str
    short_url: str
    original_url: str
    click_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class URLAnalytics(BaseModel):
    short_code: str
    short_url: str
    original_url: str
    click_count: int
    created_at: datetime
    last_clicked: Optional[datetime] = None

    class Config:
        from_attributes = True

class URLList(BaseModel):
    urls : list[URLAnalytics]
    total : int