import re
from pathlib import Path
from uuid import uuid4

from better_profanity import profanity

profanity.load_censor_words()


def validate_fish_name(name: str) -> str:
    cleaned = name.strip()
    if len(cleaned) < 2 or len(cleaned) > 20:
        raise ValueError("Fish name must be 2–20 characters")
    if not re.match(r"^[\w\s\-'.]+$", cleaned, re.UNICODE):
        raise ValueError("Fish name contains invalid characters")
    if profanity.contains_profanity(cleaned):
        raise ValueError("Fish name contains inappropriate language")
    return cleaned


def save_image(image_bytes: bytes, upload_dir: str) -> str:
    Path(upload_dir).mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4()}.png"
    filepath = Path(upload_dir) / filename
    filepath.write_bytes(image_bytes)
    return f"/uploads/{filename}"
