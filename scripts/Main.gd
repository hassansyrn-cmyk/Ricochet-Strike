#!/usr/bin/env python3
from pathlib import Path

path = Path("scripts/Main.gd")
if not path.exists():
    raise SystemExit("ERROR: scripts/Main.gd was not found. Run this script from the repository root.")

text = path.read_text(encoding="utf-8")
replacements = {
    'var incoming := (a-target.pos).angle()': 'var incoming: float = (a - (target.pos as Vector2)).angle()',
    'var n := (ball_pos-target.pos).normalized()': 'var n: Vector2 = (ball_pos - (target.pos as Vector2)).normalized()',
    'var o := (origin-item.pos).rotated(-float(item.rot))': 'var o: Vector2 = (origin - (item.pos as Vector2)).rotated(-float(item.rot))',
    'var tx1 := (-h.x-o.x)/d.x if absf(d.x)>0.0001 else -INF': 'var tx1: float = (-h.x - o.x) / d.x if absf(d.x) > 0.0001 else -INF',
    'var tx2 := (h.x-o.x)/d.x if absf(d.x)>0.0001 else INF': 'var tx2: float = (h.x - o.x) / d.x if absf(d.x) > 0.0001 else INF',
    'var ty1 := (-h.y-o.y)/d.y if absf(d.y)>0.0001 else -INF': 'var ty1: float = (-h.y - o.y) / d.y if absf(d.y) > 0.0001 else -INF',
    'var ty2 := (h.y-o.y)/d.y if absf(d.y)>0.0001 else INF': 'var ty2: float = (h.y - o.y) / d.y if absf(d.y) > 0.0001 else INF',
    'var hit := o+d*tmin': 'var hit: Vector2 = o + d * tmin',
    'var id := max(1, unlocked-9)+i': 'var id: int = maxi(1, unlocked - 9) + i',
    'var open := id<=unlocked': 'var is_open: bool = id <= unlocked',
    'COLORS.panel if open else': 'COLORS.panel if is_open else',
    'COLORS.cyan if open else': 'COLORS.cyan if is_open else',
    'COLORS.white if open else': 'COLORS.white if is_open else',
    'COLORS.gold if open else': 'COLORS.gold if is_open else',
    'if open: buttons.append': 'if is_open: buttons.append',
}

missing = []
for old, new in replacements.items():
    if old not in text:
        missing.append(old)
    else:
        text = text.replace(old, new)

path.write_text(text, encoding="utf-8", newline="\n")

if missing:
    print("WARNING: Some exact source patterns were not found, probably because they were already changed:")
    for item in missing:
        print(" -", item)

print("OK: Godot 4.7 Variant type annotations were applied to scripts/Main.gd")
