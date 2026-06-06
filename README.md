# Fish Tank Community Web App

A shared, living aquarium where every visitor designs a fish and releases it into a community tank. The magic moment: your fish jumps into the water and swims forever alongside creations from others.

## Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | Next.js, React, Konva.js, Framer Motion |
| Backend  | FastAPI                       |
| Database | PostgreSQL                    |
| Storage  | Local filesystem (uploads/)   |

## Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python seed.py             # optional: add demo fish
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## User Journey

1. **Aquarium** — Animated tank with swimming fish, stats, and an "Add Your Fish" button
2. **Fish Designer** — Color a fish template with pencil, eraser, fill bucket, and color picker
3. **Release** — Name your fish, hit Release, and watch it jump into the tank

## API Endpoints

| Method | Path              | Description        |
|--------|-------------------|--------------------|
| GET    | `/fish`           | List all fish + stats |
| GET    | `/fish/{id}`      | Get single fish    |
| POST   | `/fish`           | Create fish (multipart: name, image, drawing_data) |
| POST   | `/fish/{id}/like` | Like a fish        |

## Fish Data Model

```json
{
  "id": "uuid",
  "name": "Bubbles",
  "image_url": "/uploads/abc.png",
  "drawing_data": "...",
  "creator_name": "Alex",
  "speed": 1.2,
  "direction": "right",
  "likes": 0,
  "created_at": "2026-06-06T..."
}
```

## Project Structure

```
fishTank/
├── backend/
│   ├── app/
│   │   ├── main.py       # FastAPI routes
│   │   ├── models.py     # SQLAlchemy models
│   │   ├── schemas.py    # Pydantic schemas
│   │   └── utils.py      # Validation, image save
│   ├── uploads/          # Fish PNG images
│   └── seed.py           # Demo data
├── frontend/
│   └── src/
│       ├── app/          # Next.js pages
│       └── components/   # Aquarium, FishDesigner, etc.
└── docker-compose.yml
```

## Future Ideas

- Fish birthday celebrations
- Daily featured fish
- Search by name
- Fish families (parent/child links)
- Zone layers when fish count grows (surface / middle / deep)
- S3 storage for production deployments
