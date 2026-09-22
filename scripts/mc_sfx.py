"""Copy sounds from a local Minecraft install into the site.

The launcher stores assets by content hash under .minecraft/assets/objects and
maps names to hashes in .minecraft/assets/indexes/<version>.json.

Usage:
    python scripts/mc_sfx.py                    # ui click + hurt into static/sfx/
    python scripts/mc_sfx.py --music            # + every track listed in static/radio/playlist.json
    python scripts/mc_sfx.py --music sweden clark   # + only these tracks (by file name, no .ogg)
    python scripts/mc_sfx.py --textures         # oak door top/bottom png from the client jar into static/img/mc/
    python scripts/mc_sfx.py --list             # show every music track in the index
    python scripts/mc_sfx.py --root D:/x/.minecraft ...

Music goes to static/radio/<name>.ogg; the server reads the duration from the
file, so playlist.json only needs title, artist and file.
"""
import argparse
import json
import os
import shutil
import sys
from pathlib import Path

SFX = {
    "minecraft/sounds/random/click.ogg": "click.ogg",  # ui button click
    "minecraft/sounds/damage/hit1.ogg": "hurt.ogg",    # player hurt ("oof")
    "minecraft/sounds/damage/hit3.ogg": "death.ogg",   # the deeper oof, for the killing blow
    "minecraft/sounds/damage/fallbig.ogg": "fall.ogg", # big fall thud, when he hits the ground
    "minecraft/sounds/block/wooden_door/open1.ogg": "door_open.ogg",
    "minecraft/sounds/block/wooden_door/close1.ogg": "door_close.ogg",
}
# Block textures live inside the client jar, not in the asset index.
TEXTURES = ["oak_door_top", "oak_door_bottom"]
ROOT = Path(__file__).resolve().parent.parent


def load_index(root: Path):
    indexes = root / "assets" / "indexes"
    if not indexes.is_dir():
        sys.exit(f"no asset index under {root}. Open the launcher and start the game once, then rerun.")
    index = max(indexes.glob("*.json"), key=lambda p: p.stat().st_mtime)
    with open(index, encoding="utf-8") as f:
        return index.name, json.load(f)["objects"]


def copy(objects, root: Path, name: str, dest: Path) -> bool:
    entry = objects.get(name)
    if not entry:
        print(f"  missing in index: {name}")
        return False
    h = entry["hash"]
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(root / "assets" / "objects" / h[:2] / h, dest)
    print(f"  {name} -> {dest.relative_to(ROOT)} ({entry['size'] / 2**20:.1f} MB)")
    return True


def copy_textures(root: Path, names) -> bool:
    """Pull textures/block/<name>.png out of the newest client jar into static/img/mc/."""
    import zipfile
    jars = sorted((root / "versions").glob("*/*.jar"), key=lambda p: p.stat().st_mtime)
    if not jars:
        print("  no client jar under versions/; start the game once")
        return False
    ok = True
    with zipfile.ZipFile(jars[-1]) as z:
        print(f"textures from {jars[-1].name}:")
        for name in names:
            entry = f"assets/minecraft/textures/block/{name}.png"
            try:
                data = z.read(entry)
            except KeyError:
                print(f"  missing in jar: {entry}")
                ok = False
                continue
            dest = ROOT / "static" / "img" / "mc" / f"{name}.png"
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
            print(f"  {entry} -> {dest.relative_to(ROOT)} ({len(data)} bytes)")
    return ok


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=os.path.join(os.environ.get("APPDATA", ""), ".minecraft"))
    ap.add_argument("--music", nargs="*", metavar="NAME", help="export music; no names = playlist.json")
    ap.add_argument("--textures", nargs="*", metavar="NAME", help=f"block textures from the jar; no names = {TEXTURES}")
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()

    root = Path(args.root)
    index_name, objects = load_index(root)
    music = {Path(k).stem: k for k in objects if k.startswith("minecraft/sounds/music/")}
    print(f"index {index_name}: {len(objects)} assets, {len(music)} music tracks")

    if args.list:
        for stem, name in sorted(music.items()):
            print(f"  {objects[name]['size'] / 2**20:5.1f} MB  {stem:24}  {name}")
        return 0

    ok = True
    print("sfx:")
    for name, target in SFX.items():
        ok &= copy(objects, root, name, ROOT / "static" / "sfx" / target)

    if args.textures is not None:
        ok &= copy_textures(root, args.textures or TEXTURES)

    if args.music is not None:
        playlist_path = ROOT / "static" / "radio" / "playlist.json"
        with open(playlist_path, encoding="utf-8") as f:
            playlist = json.load(f)
        wanted = args.music or [Path(t["file"]).stem for t in playlist["tracks"] if t["file"].endswith(".ogg")]
        print("music:")
        for stem in wanted:
            if stem not in music:
                print(f"  unknown track {stem!r}; try --list")
                ok = False
                continue
            if copy(objects, root, music[stem], ROOT / "static" / "radio" / f"{stem}.ogg"):
                if not any(t["file"] == f"{stem}.ogg" for t in playlist["tracks"]):
                    playlist["tracks"].append({"title": stem.replace("_", " "), "artist": "C418", "file": f"{stem}.ogg"})
        with open(playlist_path, "w", encoding="utf-8") as f:
            json.dump(playlist, f, indent=2)
            f.write("\n")
        print(f"  playlist: {len(playlist['tracks'])} tracks in {playlist_path.relative_to(ROOT)}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
