# Ricochet Strike (React + Capacitor)

A polished, playable vertical mobile 2D physics puzzle game built with React, TypeScript, Vite, HTML5 Canvas, and Capacitor Android, targeting Android SDK 36.

## 🎯 Gameplay Concept

In **Ricochet Strike**, **DIRECT HITS ARE FORBIDDEN**.
- The projectile must bounce from at least one valid wall or surface before hitting the target.
- If the projectile hits the target with zero valid bounces, the attempt immediately fails.

### Core Gameplay Mechanics
- **Physics Engine**: Clean, custom, deterministic 2D physics running on a fixed sub-stepped physics timestep (1/120s) to prevent tunneling.
- **Trajectory Predictor**: Displays expected bounce and reflection paths in real-time while aiming, using the exact same collision models.
- **Exponential Score Multipliers**:
  - 1 bounce = 1x
  - 2 bounces = 2x
  - 3 bounces = 4x
  - 4 bounces = 8x
  - 5+ bounces = 16x

## 🚀 Branch Strategy

- `main`: Preserved original Godot reference version. **Do not modify.**
- `react-capacitor`: The active production branch containing the fully migrated React + Capacitor implementation.

## 🎮 Game Content

**100 Progressive levels** across **5 unique worlds**:
1. **World 1 (Levels 1-20)**: Onboarding levels with fixed walls, angled surfaces, and single-bounce training.
2. **World 2 (Levels 21-40)**: Moving hazards, breakable glass panels, and 2+ bounces.
3. **World 3 (Levels 41-60)**: Linked portals, gravity wells, and gravity/warp combos.
4. **World 4 (Levels 61-80)**: Moving targets and rotating defensive shields with weak openings.
5. **World 5 (Levels 81-100)**: Timed precision mechanisms, disappearing blinking walls, 4 mandatory bounces, and highly restricted ammo limits.

---

## ⚡ Six Unlockable Projectile Types

Centralized balance profiles configured under `src/physics/projectileConfig.ts`:
1. **Pulse**: Balanced default projectile with standard restitution and mass.
2. **Heavy**: lower speed, high mass, and maximum break force. Perfect for breaking glass.
3. **Volt**: Can chain electrical energy to the target from a distance (140 units max) if bounce requirements are met and line-of-sight is clear.
4. **Frost**: Applies a temporary 45% speed slowdown for 2.5 seconds on targets, rotating shields, or moving obstacles on impact.
5. **Phantom**: Can phase straight through one specially marked `phantomPassable: true` obstacle wall.
6. **Split**: Splits into two child projectiles at ±18-degree angles after its first bounce, preserving 92% speed and inheriting individual bounce tracking.

---

## 🏗️ Technical Stack & SDK Versions

- **Node.js**: v22
- **Java**: JDK 21
- **Android Target SDK**: 36
- **Android Compile SDK**: 36
- **Android Min SDK**: 24
- **Capacitor App ID**: `com.ricochetstrike.game`
- **Capacitor Name**: `Ricochet Strike`

---

## 🛠️ Development and Build Commands

### 1. Installation
Installs both production dependencies and development testing/compilation libraries:
```bash
npm install
```

### 2. Run Local Web Server
Runs Vite's hot-reloading development preview web server:
```bash
npm run dev
```

### 3. Running Unit Tests
Runs the test suites to assert vector maths, seeded procedurals, and save-upgrade structures:
```bash
npm run test
```

### 4. Code Type-checking
Validates type constraints using the TypeScript compiler:
```bash
npm run typecheck
```

### 5. Compile Web Bundle
Generates production-optimized distribution files into the `dist/` folder:
```bash
npm run build
```

---

## 📱 Mobile Android Builds

### 1. Synchronize Web Assets
Syncs the compiled static web bundle from the `dist/` directory into the native Android application shell:
```bash
npx cap sync android
```

### 2. Compile Debug APK
Compiles the developer-signed test APK:
```bash
cd android
./gradlew assembleDebug
```
- **Output Path**: `android/app/build/outputs/apk/debug/app-debug.apk`

### 3. Compile Release AAB
Builds the unsigned distribution bundle:
```bash
cd android
./gradlew bundleRelease
```
- **Output Path**: `android/app/build/outputs/bundle/release/app-release.aab`

> ⚠️ *Note on AAB Release Signing*: The compiled `.aab` is locally generated as an **unsigned release bundle**. For Google Play deployment, a production release keystore must be configured. Never commit or push private signing keystores to Git.

---

## 🤖 GitHub Actions CI/CD Pipeline

The `.github/workflows/android-build.yml` automated workflow runs on every push and pull request to the `react-capacitor` branch.

**Workflow Operations**:
1. Checks out repository files.
2. Seeds Node.js 22, Java 21, and Android SDK 36 platform platforms.
3. Installs clean dependencies via `npm ci`.
4. Executes TypeScript type-checks and runs all 8 Vitest unit tests.
5. Generates the production web bundle and syncs it with Capacitor.
6. Compiles the native debug APK and release AAB.
7. Uploads the verified non-empty output debug APK as a build artifact named `Ricochet-Strike-debug-apk`.
