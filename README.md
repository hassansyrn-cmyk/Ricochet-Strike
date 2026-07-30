# Ricochet Strike Complete

Mobile-first Godot 4.6 hyper-casual ricochet puzzle game.

## Included
- Home, level selection, projectile shop, daily reward, gameplay, win/loss screens.
- 100 deterministic progressive levels across five worlds.
- Mandatory ricochet rule, trajectory preview, bounce multipliers, ammo, score, and three-star grading.
- Fixed and moving targets, rotating shields, hazards, breakable glass, portals, gravity wells, disappearing walls, and timers.
- Six unlockable projectile appearances with tuned launch speed.
- Persistent progress, stars, coins, owned projectiles, settings, and daily reward.
- Particles, trails, camera shake, flash, vibration, and critical-hit presentation.
- Android SDK 36, minSdk 24, arm64, debug APK workflow, and release AAB preset.

## Build APK
Upload the contents of this folder to the repository root. Open Actions, choose Build Android APK, and run the workflow. Download the `Ricochet-Strike-debug-apk` artifact.

## Important
The GitHub workflow performs the authoritative Godot import, script parse, headless startup, and APK export checks. A release AAB needs a private release keystore stored as GitHub secrets. Never commit a release keystore.
