import time
from app.services.cache import redis_client

RATE_LIMIT = 10
WINDOW_SECONDS = 60

def is_rate_limited(ip: str) -> bool:

    key = f"rate:{ip}"

    now = time.time()

    window_start = now - WINDOW_SECONDS

    pipe = redis_client.pipeline()
    pipe.zremrangebyscore(key, 0, window_start)
    pipe.zcard(key)
    pipe.zadd(key, {str(now): now})
    pipe.expire(key, WINDOW_SECONDS)

    results = pipe.execute()
    request_count = results[1]

    if request_count >= RATE_LIMIT:
        return True
    
    return False

def get_remaining_requests(ip: str) -> int:

    key = f"rate:{ip}"
    now = time.time()
    window_start = now - WINDOW_SECONDS

    redis_client.zremrangebyscore(key, 0, window_start)

    current = redis_client.zcard(key)

    return max(0, RATE_LIMIT - current)

