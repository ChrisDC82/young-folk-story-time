"""Create deterministic runtime derivatives without changing protected originals."""

from collections import deque
from pathlib import Path
from shutil import copy2

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ORIGINALS = ROOT / "assets-original"
PUBLIC = ROOT / "public" / "assets"


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

    lexi_target = PUBLIC / "characters" / "lexi" / "lexi-front.png"
    lexi_target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(ORIGINALS / "Lexi Character Sheet.png") as sheet:
        front_pose = sheet.crop((26, 70, 385, 560))
        runtime_sprite = connected_white_to_alpha(front_pose)
        runtime_sprite.save(lexi_target, optimize=True)

    print(f"Prepared {background_target.relative_to(ROOT)}")
    print(f"Prepared {lexi_target.relative_to(ROOT)} ({runtime_sprite.width}x{runtime_sprite.height})")


if __name__ == "__main__":
    main()
