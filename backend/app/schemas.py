from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class FishCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=20)
    creator_name: str = Field(default="Anonymous", max_length=50)
    speed: float = Field(default=1.2, ge=0.5, le=3.0)
    direction: str = Field(default="right")
    drawing_data: str | None = None


class FishResponse(BaseModel):
    id: UUID
    name: str
    image_url: str | None
    drawing_data: str | None
    creator_name: str
    speed: float
    direction: str
    likes: int
    created_at: datetime

    model_config = {"from_attributes": True}


class TankStats(BaseModel):
    total_fish: int
    total_creators: int


class FishListResponse(BaseModel):
    fish: list[FishResponse]
    stats: TankStats
