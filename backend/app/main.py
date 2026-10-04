from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.database import engine, Base
from app.models import url
from app.routes import url as url_routes
from app.routes import analytics as analytics_routes
from app.services.cache import redis_client
from app.middleware.rate_limit import rate_limit_middleware
import time

# Retry MySQL connection on startup
# MySQL takes a few seconds to fully initialize in Docker
def create_tables_with_retry():
    max_retries = 10
    for attempt in range(max_retries):
        try:
            Base.metadata.create_all(bind=engine)
            print("MySQL connected successfully")
            return
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"MySQL not ready yet, retrying in 3s... (attempt {attempt + 1}/{max_retries})")
                time.sleep(3)
            else:
                print(f"Could not connect to MySQL after {max_retries} attempts")
                raise e

create_tables_with_retry()

app = FastAPI(title="URL Shortener", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173","http://localhost:8000",
        "http://127.0.0.1:8000",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(BaseHTTPMiddleware, dispatch=rate_limit_middleware)

app.include_router(url_routes.router)
app.include_router(analytics_routes.router)

@app.on_event("startup")
def startup_event():
    try:
        redis_client.ping()
        print("Redis connected successfully")
    except Exception as e:
        print(f"Redis not available: {e}")

@app.get("/")
def home():
    return {"message": "URL Shortener is running!"}