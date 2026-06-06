import random
from pathlib import Path
from uuid import UUID

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import settings
from app.database import Base, engine, get_db
from app.models import Fish
from app.schemas import FishListResponse, FishResponse, TankStats
from app.utils import save_image, validate_fish_name

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fish Tank API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/fish", response_model=FishListResponse)
def list_fish(db: Session = Depends(get_db)):
    fish_list = db.query(Fish).order_by(Fish.created_at.desc()).all()
    total_creators = (
        db.query(func.count(func.distinct(Fish.creator_name))).scalar() or 0
    )
    return FishListResponse(
        fish=[FishResponse.model_validate(f) for f in fish_list],
        stats=TankStats(
            total_fish=len(fish_list),
            total_creators=total_creators,
        ),
    )


@app.get("/fish/{fish_id}", response_model=FishResponse)
def get_fish(fish_id: UUID, db: Session = Depends(get_db)):
    fish = db.query(Fish).filter(Fish.id == fish_id).first()
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found")
    return FishResponse.model_validate(fish)


@app.post("/fish", response_model=FishResponse, status_code=201)
async def create_fish(
    name: str = Form(...),
    creator_name: str = Form(default="Anonymous"),
    drawing_data: str | None = Form(default=None),
    image: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
):
    try:
        validated_name = validate_fish_name(name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    image_url = None
    if image and image.filename:
        image_bytes = await image.read()
        if len(image_bytes) > 0:
            image_url = save_image(image_bytes, settings.upload_dir)

    fish = Fish(
        name=validated_name,
        creator_name=creator_name.strip()[:50] or "Anonymous",
        drawing_data=drawing_data,
        image_url=image_url,
        speed=round(random.uniform(0.8, 2.0), 1),
        direction=random.choice(["left", "right"]),
    )
    db.add(fish)
    db.commit()
    db.refresh(fish)
    return FishResponse.model_validate(fish)


@app.post("/fish/{fish_id}/restore-image", response_model=FishResponse)
async def restore_fish_image(
    fish_id: UUID,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    fish = db.query(Fish).filter(Fish.id == fish_id).first()
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found")
    if not fish.drawing_data:
        raise HTTPException(status_code=400, detail="No drawing data available")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image")

    if fish.image_url:
        old_path = Path(settings.upload_dir) / fish.image_url.removeprefix("/uploads/")
        if old_path.is_file():
            old_path.unlink()

    fish.image_url = save_image(image_bytes, settings.upload_dir)
    db.commit()
    db.refresh(fish)
    return FishResponse.model_validate(fish)


@app.post("/fish/{fish_id}/like", response_model=FishResponse)
def like_fish(fish_id: UUID, db: Session = Depends(get_db)):
    fish = db.query(Fish).filter(Fish.id == fish_id).first()
    if not fish:
        raise HTTPException(status_code=404, detail="Fish not found")
    fish.likes += 1
    db.commit()
    db.refresh(fish)
    return FishResponse.model_validate(fish)
