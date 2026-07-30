# Ricochet Strike Complete

Mobile-first Godot 4.7 hyper-casual ricochet puzzle game.

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

## SDK 36 Gradle requirement
Both Android presets use the Gradle build because Godot only permits overriding minSdk and targetSdk with Gradle enabled. The CI workflow extracts the matching `android_source.zip` into `android/build` before validation and export.


## Godot 4.7 requirement
API 36 export uses Godot 4.7 and matching 4.7.stable templates. Godot 4.6 rejects targetSdk 36 during preset validation because its default Android target is API 35.

## Android texture compression
The project explicitly enables ETC2/ASTC importing through `rendering/textures/vram_compression/import_etc2_astc=true`, which is required by Godot for Android export.
