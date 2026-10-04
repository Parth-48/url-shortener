from fastapi import Request 
from fastapi.responses import JSONResponse
from app.services.limiter import is_rate_limited, get_remaining_requests

async def rate_limit_middleware(request: Request, call_next):

    ip = request.client.host

    if request.url.path in ["/docs", "/openapi.json", '/redoc', "/"]:
        response = await call_next(request)
        return response

    if is_rate_limited(ip):
        return JSONResponse(
            status_code=429,
            content={
                "error": "Rate limit exceeded",
                "message":  "Too many requests. Please wait 1 min before trying again.",
                "limit": 10,
                "window": "60 seconds"
            }
        )

    response = await call_next(request)

    remaining = get_remaining_requests(ip)
    response.headers["X-RateLimit-Limit"] = "10"
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    response.headers["X-RateLimit-Window"] = "60s"

    return response
