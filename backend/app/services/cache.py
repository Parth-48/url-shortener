import redis 
import json
from app.config import REDIS_HOST, REDIS_PORT

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True,
    protocol=2
)

CACHE_TTL = 3600 #1hr=3600s

def get_cached_url(short_code: str) -> str | None:

    try:
        cached = redis_client.get(f"url:{short_code}")
        return cached

    except Exception:
        return None

def set_cached_url(short_code: str, original_url: str) -> None:

    try:
        redis_client.setex(
            name=f"url:{short_code}",
            time=CACHE_TTL,
            value=original_url
        )

    except Exception:
        pass

def delete_cached_url(short_code: str) -> None:

    try:
        redis_client.delete(f"url:{short_code}")
    except Exception:
        pass

def increment_click_cache(short_code: str) -> None:

    try:
        redis_client.incr(f"clicks:{short_code}")
    except Exception:
        pass
    