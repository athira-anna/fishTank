"""Seed the aquarium with sample fish for demo purposes."""

import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal, engine, Base
from app.models import Fish

Base.metadata.create_all(bind=engine)

SAMPLE_FISH = [
    ("Bubbles", "Alex"),
    ("Nemo", "Sarah"),
    ("Goldie", "Mike"),
    ("Splash", "Jordan"),
    ("Finley", "Casey"),
    ("Coral", "Riley"),
    ("Wave", "Sam"),
    ("Dory", "Taylor"),
]

def seed():
    db = SessionLocal()
    existing = db.query(Fish).count()
    if existing > 0:
        print(f"Tank already has {existing} fish. Skipping seed.")
        db.close()
        return

    for name, creator in SAMPLE_FISH:
        fish = Fish(
            name=name,
            creator_name=creator,
            speed=round(random.uniform(0.8, 2.0), 1),
            direction=random.choice(["left", "right"]),
            likes=random.randint(0, 50),
        )
        db.add(fish)

    db.commit()
    print(f"Seeded {len(SAMPLE_FISH)} fish into the tank!")
    db.close()

if __name__ == "__main__":
    seed()
