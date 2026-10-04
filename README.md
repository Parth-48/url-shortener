# Shortly — URL Shortener

A production-grade URL shortener built with FastAPI, React, MySQL, Redis, and Docker.

**API Docs:** http://localhost:8000/docs

---

## Features

- **URL Shortening** — Base62 encoding generating 218 trillion unique short codes
- **Redis Caching** — Cache-aside pattern reducing database load by ~80%
- **Rate Limiting** — Sliding window algorithm (10 req/min per IP) using Redis sorted sets
- **Click Analytics** — Track click counts, creation time, and last accessed time
- **REST API** — Full OpenAPI documentation via Swagger UI
- **Dockerized** — One command spins up the entire stack

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3.11 |
| Database | MySQL 8.0 + SQLAlchemy ORM |
| Cache | Redis 7 |
| Server | Nginx |
| DevOps | Docker, Docker Compose |

---

## System Design

```
React (Port 3000)
      │
      │ HTTP
      ▼
FastAPI Backend (Port 8000)
      │
      ├──► Redis Cache ──► Cache HIT → redirect instantly (<1ms)
      │         │
      │         └──► Cache MISS
      │                   │
      └──────────────────►▼
                    MySQL Database
```

### Key Concepts Implemented

- **Base62 Encoding** — MD5 hash → integer → Base62 → 8 char short code
- **Cache-aside Pattern** — Check Redis first, fallback to MySQL on miss
- **Sliding Window Rate Limiter** — Redis sorted sets track request timestamps per IP
- **Async Analytics** — Click tracking without blocking redirect response
- **Read/Write Separation** — Analytics reads separated from redirect writes

---

## Project Structure

```
url-shortener/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── database.py
│       ├── models/
│       │   └── url.py
│       ├── schemas/
│       │   └── url.py
│       ├── routes/
│       │   ├── url.py
│       │   └── analytics.py
│       ├── services/
│       │   ├── shortener.py
│       │   ├── cache.py
│       │   └── limiter.py
│       └── middleware/
│           └── rate_limit.py
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── App.jsx
        ├── api.js
        ├── pages/
        │   ├── Home.jsx
        │   └── Dashboard.jsx
        └── components/
            └── Navbar.jsx
```

---

## Getting Started

### Prerequisites

- Docker Desktop installed and running
- Git

### Run with Docker

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener

# Start everything with one command
docker-compose up --build
```

Open in browser:
- Frontend → http://localhost:3000
- API Docs → http://localhost:8000/docs


## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/shorten` | Shorten a long URL |
| `GET` | `/{short_code}` | Redirect to original URL |
| `GET` | `/analytics/` | Get all URLs with stats |
| `GET` | `/analytics/{code}` | Get stats for one URL |

### Example

**Request:**
```bash
curl -X POST http://localhost:8000/shorten \
  -H "Content-Type: application/json" \
  -d '{"original_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

**Response:**
```json
{
  "short_code": "aX9kP2mQ",
  "short_url": "http://localhost:8000/aX9kP2mQ",
  "original_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "click_count": 0,
  "created_at": "2026-06-28T12:00:00"
}
```

---

## Rate Limiting

Every endpoint is rate limited to **10 requests per minute per IP**.

Exceeded requests return:
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please wait 1 minute.",
  "limit": 10,
  "window": "60 seconds"
}
```

Response headers on every request:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Window: 60s
```

---

## Docker Services

| Service | Image | Port |
|---|---|---|
| Frontend | nginx:alpine | 3000 |
| Backend | python:3.11-slim | 8000 |
| MySQL | mysql:8.0 | 3308 |
| Redis | redis:7-alpine | 6380 |

```bash
# Stop all containers
docker-compose down

# Rebuild and restart
docker-compose up --build

# View logs
docker-compose logs backend

# Check running containers
docker ps
```

---

## What I Learned

- Designing a scalable system with caching, rate limiting, and analytics
- Implementing Base62 encoding and collision handling
- Redis data structures — strings for cache, sorted sets for rate limiting
- Docker multi-stage builds to reduce image size
- FastAPI dependency injection and middleware
- React state management and API integration

---

## Author

**Parth Ukarde** — IIT Bhubaneswar, CSE 2027

