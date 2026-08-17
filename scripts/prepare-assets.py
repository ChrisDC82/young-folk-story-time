"""Create deterministic runtime derivatives without changing protected originals."""

from collections import deque
from pathlib import Path
from shutil import copy2

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ORIGINALS = ROOT / "assets-original"
PUBLIC = ROOT / "public" / "assets"

CHARACTER_POSES = {
    "lexi": {
        "source": "Lexi Character Sheet.png",
        "poses": {
            "front": (26, 70, 385, 560),
            "happy": (25, 645, 380, 1125),
            "excited": (1010, 645, 1350, 1135),
        },
    },
    "angel": {
        "source": "Angel Character Sheet.png",
        "poses": {
            "front": (45, 45, 430, 485),
            "happy": (45, 545, 420, 945),
            "thinking": (430, 545, 745, 945),
            "excited": (1120, 545, 1500, 945),
        },
    },
    "junior": {
        "source": "Junior Character Sheet.png",
        "poses": {
            "front": (40, 55, 360, 530),
            "happy": (35, 640, 360, 1105),
            "thinking": (385, 640, 690, 1105),
            "surprised": (690, 640, 1010, 1105),
        },
    },
}


def connected_white_to_alpha(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    queue: deque[tuple[int, int]] = deque()
    visited: set[tuple[int, int]] = set()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        red, green, blue, _ = pixels[x, y]
        if min(red, green, blue) < 238 or max(red, green, blue) - min(red, green, blue) > 10:
            continue
        pixels[x, y] = (red, green, blue, 0)
        if x > 0:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    alpha_box = rgba.getchannel("A").getbbox()
    if alpha_box is None:
        raise RuntimeError("Lexi extraction produced an empty image")
    return rgba.crop(alpha_box)


def main() -> None:
    background_target = PUBLIC / "backgrounds" / "cc-club" / "cc-club-interior.png"
    background_target.parent.mkdir(parents=True, exist_ok=True)
    copy2(ORIGINALS / "Community Cultural Club Background.png", background_target)

    costume_background_target = PUBLIC / "backgrounds" / "cc-club" / "lexi-making-wings.png"
    costume_background_target.parent.mkdir(parents=True, exist_ok=True)
    copy2(ORIGINALS / "lexi making wings.png", costume_background_target)

    story_pot_target = PUBLIC / "backgrounds" / "cc-club" / "story-pot.png"
    story_pot_target.parent.mkdir(parents=True, exist_ok=True)
    copy2(ORIGINALS / "Story pot.png", story_pot_target)

    carnival_background_target = PUBLIC / "backgrounds" / "carnival" / "kiddies-carnival-background.png"
    carnival_background_target.parent.mkdir(parents=True, exist_ok=True)
    copy2(ORIGINALS / "Kiddies Carnival Background.png", carnival_background_target)

    print(f"Prepared {background_target.relative_to(ROOT)}")
    print(f"Prepared {costume_background_target.relative_to(ROOT)}")
    print(f"Prepared {story_pot_target.relative_to(ROOT)}")
    print(f"Prepared {carnival_background_target.relative_to(ROOT)}")
    for character_id, character in CHARACTER_POSES.items():
        with Image.open(ORIGINALS / character["source"]) as sheet:
            for pose_name, crop_box in character["poses"].items():
                target = PUBLIC / "characters" / character_id / f"{character_id}-{pose_name}.png"
                target.parent.mkdir(parents=True, exist_ok=True)
                runtime_sprite = connected_white_to_alpha(sheet.crop(crop_box))
                runtime_sprite.save(target, optimize=True)
                print(f"Prepared {target.relative_to(ROOT)} ({runtime_sprite.width}x{runtime_sprite.height})")


if __name__ == "__main__":
    main()
