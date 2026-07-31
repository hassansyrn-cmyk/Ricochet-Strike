import { Vector2D, Level, Obstacle } from '../types/game';
import { vec, checkRayRotatedRect, segmentDistance } from './vectorMath';

export interface ActiveProjectile {
  id: string;
  type: string;
  pos: Vector2D;
  vel: Vector2D;
  radius: number;
  bounceCount: number;
  phantomObstaclePassedCount: number; // For Phantom projectile
  hasSplit: boolean; // For Split projectile
  color: string;
  mass: number;
  restitution: number;
  breakForce: number;
}

export interface Particle {
  pos: Vector2D;
  vel: Vector2D;
  color: string;
  life: number; // 0 to 1
  maxLife: number;
  size: number;
}

export interface ImpactSpark {
  pos: Vector2D;
  vel: Vector2D;
  color: string;
  life: number;
}

export interface GlassFragment {
  pos: Vector2D;
  vel: Vector2D;
  rot: number;
  rotVel: number;
  size: Vector2D;
  life: number;
}

export interface GameplayEngineState {
  launcher: Vector2D;
  projectiles: ActiveProjectile[];
  particles: Particle[];
  sparks: ImpactSpark[];
  glassFragments: GlassFragment[];

  levelTime: number;
  timeLimit: number;
  portalLockTime: number; // Cooldown to prevent repeating portal teleports instantly
  shakeIntensity: number;
  hitFlashOpacity: number;

  bounceCount: number;
  shotsUsed: number;
  ammo: number;

  aimStart: Vector2D | null;
  aimCurrent: Vector2D | null;
  isAiming: boolean;
  predictedTrajectory: Vector2D[];

  message: string;
  frostSlowdownEndTime: number; // Timestamps for Frost slowdown effects

  // Game state flags
  levelCompleted: boolean;
  levelFailed: boolean;
  failReason: string;
}

export const GAME_WIDTH = 1080;
export const GAME_HEIGHT = 1920;

export class GameplayEngine {
  public state: GameplayEngineState;
  public currentLevel: Level;
  private onStateChange: (state: GameplayEngineState) => void;
  private onSoundEffect: (sound: string) => void;
  private onHapticEffect: (intensity: 'light' | 'medium' | 'heavy') => void;

  constructor(
    level: Level,
    ammo: number,
    onStateChange: (state: GameplayEngineState) => void,
    onSoundEffect: (sound: string) => void,
    onHapticEffect: (intensity: 'light' | 'medium' | 'heavy') => void
  ) {
    this.currentLevel = level;
    this.onStateChange = onStateChange;
    this.onSoundEffect = onSoundEffect;
    this.onHapticEffect = onHapticEffect;

    this.state = this.initEngineState(level, ammo);
  }

  private initEngineState(level: Level, ammo: number): GameplayEngineState {
    return {
      launcher: { x: 540, y: 1650 },
      projectiles: [],
      particles: [],
      sparks: [],
      glassFragments: [],
      levelTime: 0,
      timeLimit: level.timeLimit || 0,
      portalLockTime: 0,
      shakeIntensity: 0,
      hitFlashOpacity: 0,
      bounceCount: 0,
      shotsUsed: 0,
      ammo: ammo,
      aimStart: null,
      aimCurrent: null,
      isAiming: false,
      predictedTrajectory: [],
      message: 'DRAG BACK TO AIM',
      frostSlowdownEndTime: 0,
      levelCompleted: false,
      levelFailed: false,
      failReason: ''
    };
  }

  public reset(level: Level, ammo: number) {
    this.currentLevel = level;
    this.state = this.initEngineState(level, ammo);
    this.notify();
  }

  private notify() {
    this.onStateChange({ ...this.state });
  }

  // Set selected projectile and trigger start of level setups
  public handleStartAim(pos: Vector2D) {
    if (this.state.levelCompleted || this.state.levelFailed || this.state.projectiles.length > 0 || this.state.ammo <= 0) {
      return;
    }
    this.state.aimStart = pos;
    this.state.aimCurrent = pos;
    this.state.isAiming = true;
    this.state.predictedTrajectory = [this.state.launcher];
    this.notify();
  }

  public handleAiming(pos: Vector2D) {
    if (!this.state.isAiming || !this.state.aimStart) return;
    this.state.aimCurrent = pos;

    const pull = vec.sub(this.state.aimStart, pos);
    const pullLen = vec.len(pull);

    if (pullLen > 15) {
      const aimDir = vec.norm(pull);
      this.predictTrajectory(aimDir);
      this.onSoundEffect('aim');
    } else {
      this.state.predictedTrajectory = [this.state.launcher];
    }
    this.notify();
  }

  public handleReleaseAim(selectedProjConfig: any) {
    if (!this.state.isAiming || !this.state.aimStart || !this.state.aimCurrent) return;

    const pull = vec.sub(this.state.aimStart, this.state.aimCurrent);
    const pullLen = vec.len(pull);
    this.state.isAiming = false;
    this.state.predictedTrajectory = [];

    // Trigger launching only if substantial pull-back detected
    if (pullLen >= 45 && this.state.ammo > 0) {
      const dir = vec.norm(pull);
      const power = Math.min(pullLen / 300, 1.0); // capped pull strength coefficient [0.15, 1.0]
      this.launchProjectile(dir, power, selectedProjConfig);
    }
    this.notify();
  }

  private launchProjectile(dir: Vector2D, power: number, proj: any) {
    this.state.ammo -= 1;
    this.state.shotsUsed += 1;
    this.state.bounceCount = 0;
    this.state.portalLockTime = 0;
    this.state.message = '';

    const speed = proj.speed * power;
    const initialProjectile: ActiveProjectile = {
      id: Math.random().toString(),
      type: proj.type,
      pos: { ...this.state.launcher },
      vel: vec.scale(dir, speed),
      radius: 18,
      bounceCount: 0,
      phantomObstaclePassedCount: 0,
      hasSplit: false,
      color: proj.color,
      mass: proj.mass,
      restitution: proj.restitution,
      breakForce: proj.breakForce
    };

    this.state.projectiles = [initialProjectile];
    this.onSoundEffect('launch');
    this.onHapticEffect('light');
    this.spawnBurst(this.state.launcher, proj.color, 12);
  }

  // Trajectory prediction using shared physics logic
  private predictTrajectory(dir: Vector2D) {
    this.state.predictedTrajectory = [];
    let p = { ...this.state.launcher };
    let v = { ...dir };

    this.state.predictedTrajectory.push(p);

    // Show dynamic number of prediction bounces based on world settings to preserve difficulty scaling
    const maxBounces = Math.max(2, 5 - this.currentLevel.world);

    for (let bounce = 0; bounce < maxBounces; bounce++) {
      let bestT = 1500; // Ray segment reach limit
      let hitNormal: Vector2D | null = null;
      let hitObs: Obstacle | null = null;

      for (const obs of this.currentLevel.obstacles) {
        if (!obs.alive) continue;
        if (obs.type === 'disappearing') {
          // If disappearing Wall is blinking, ignore it half the time during prediction
          const cycle = obs.cycle || 1.2;
          if ((this.state.levelTime % (cycle * 2.0)) > cycle) continue;
        }

        if (obs.size) {
          const hit = checkRayRotatedRect(p, v, obs.pos, obs.size, obs.rot || 0);
          if (hit && hit.t > 0 && hit.t < bestT) {
            bestT = hit.t;
            hitNormal = hit.normal;
            hitObs = obs;
          }
        }
      }

      if (!hitNormal) {
        // No collision, extend trajectory to the prediction limit
        this.state.predictedTrajectory.push(vec.add(p, vec.scale(v, bestT)));
        break;
      }

      p = vec.add(p, vec.scale(v, bestT));
      this.state.predictedTrajectory.push(p);

      // Stop prediction path if hitting hazard, targets or un-bounceable obstacles
      if (hitObs && (hitObs.type === 'hazard' || hitObs.type === 'well' || hitObs.type === 'portal')) {
        break;
      }

      // Calculate bounce direction
      v = vec.bounce(v, hitNormal);
      p = vec.add(p, vec.scale(v, 1.5)); // push slightly outwards of wall bounds
    }
  }

  // Update Game Physics Timestep
  public update(delta: float) {
    if (this.state.levelCompleted || this.state.levelFailed) return;

    this.state.levelTime += delta;
    this.state.portalLockTime = Math.max(0, this.state.portalLockTime - delta);
    this.state.shakeIntensity = Math.max(0, this.state.shakeIntensity - delta * 30.0);
    this.state.hitFlashOpacity = Math.max(0, this.state.hitFlashOpacity - delta * 4.0);

    // Frost slowdown check
    const isSlowed = this.state.frostSlowdownEndTime > this.state.levelTime;
    const speedMult = isSlowed ? 0.55 : 1.0;

    // 1. Update obstacles & target movements
    const target = this.currentLevel.target;
    if (target.isMoving && target.moveRange > 0) {
      target.pos.x = target.basePos.x + Math.sin(this.state.levelTime * target.moveSpeed * speedMult) * target.moveRange;
    }
    target.shieldAngle += delta * 1.4 * speedMult;

    // 2. Active Physics Updates (Fixed Sub-stepping to prevent fast-moving tunneling)
    if (this.state.projectiles.length > 0) {
      const gravityWells = this.currentLevel.obstacles.filter(o => o.type === 'well' && o.alive);

      // Apply Gravity Well pull forces
      for (const p of this.state.projectiles) {
        for (const well of gravityWells) {
          const dVec = vec.sub(well.pos, p.pos);
          const dist = vec.len(dVec);
          const pullRadius = well.radius || 180;
          if (dist < pullRadius && dist > 5) {
            const pullForce = (well.strength || 430) * speedMult;
            const forceDir = vec.norm(dVec);
            p.vel = vec.add(p.vel, vec.scale(forceDir, pullForce * delta));
          }
        }
      }

      const SUB_STEPS = 4;
      const stepDelta = delta / SUB_STEPS;

      for (let step = 0; step < SUB_STEPS; step++) {
        for (let i = this.state.projectiles.length - 1; i >= 0; i--) {
          const p = this.state.projectiles[i];
          const previousPos = { ...p.pos };
          p.pos = vec.add(p.pos, vec.scale(p.vel, stepDelta));

          // A. Target hit segment distance verification
          if (this.checkTargetHit(p, previousPos, p.pos)) {
            return;
          }

          // B. Screen outer boundaries bounce constraints
          const padding = p.radius;
          if (p.pos.x < padding) {
            p.pos.x = padding;
            p.vel.x = Math.abs(p.vel.x) * 0.92; // bounce dampening
            this.handleBounceEffect(p);
          } else if (p.pos.x > GAME_WIDTH - padding) {
            p.pos.x = GAME_WIDTH - padding;
            p.vel.x = -Math.abs(p.vel.x) * 0.92;
            this.handleBounceEffect(p);
          }

          if (p.pos.y < 245) { // Upper header bounds
            p.pos.y = 245;
            p.vel.y = Math.abs(p.vel.y) * 0.92;
            this.handleBounceEffect(p);
          } else if (p.pos.y > GAME_HEIGHT + 100) {
            // Fell out bottom
            this.state.projectiles.splice(i, 1);
            this.handleMiss();
            continue;
          }

          // C. Custom dynamic Obstacles collision handling
          if (this.checkObstacleCollisions(p)) {
            // Check Volt automatic chain eligibility in this same step
            if (p.type === 'volt' && p.bounceCount >= this.currentLevel.requiredBounces) {
              this.checkVoltChain(p);
            }
          }
        }
      }

      // Velocity friction / expiration
      for (const p of this.state.projectiles) {
        p.vel = vec.scale(p.vel, Math.pow(0.996, delta * 60)); // minimum velocity dampening
        if (vec.len(p.vel) < 65) {
          this.state.projectiles = [];
          this.handleMiss();
        }
      }
    }

    // 3. Update Visual Polish Particles
    this.updateParticles(delta);

    // 4. Level Timed Failure condition
    if (this.state.timeLimit > 0 && this.state.levelTime >= this.state.timeLimit) {
      this.failLevel("TIME UP");
    }
  }

  private checkTargetHit(p: ActiveProjectile, prevPos: Vector2D, nextPos: Vector2D): boolean {
    const target = this.currentLevel.target;
    const hitDistance = segmentDistance(target.pos, prevPos, nextPos);

    if (hitDistance > (target.radius + p.radius)) return false;

    // Check rotating shield obstruction
    if (target.shield) {
      const incomingAngle = Math.atan2(prevPos.y - target.pos.y, prevPos.x - target.pos.x);
      const shieldAngle = target.shieldAngle;

      // Calculate normalized relative angle between incoming vector and shield gap center
      let relativeAngle = Math.abs((incomingAngle - shieldAngle) % (Math.PI * 2));
      if (relativeAngle > Math.PI) relativeAngle = Math.PI * 2 - relativeAngle;

      // If hit inside shield solid arc (blocking range), bounce projectile off the shield
      if (relativeAngle > 0.85) { // Shield blocking coverage range (~260 deg)
        const bounceNormal = vec.norm(vec.sub(p.pos, target.pos));
        p.vel = vec.bounce(p.vel, bounceNormal);
        p.pos = vec.add(target.pos, vec.scale(bounceNormal, target.radius + p.radius + 3));
        this.handleBounceEffect(p);
        this.state.message = 'SHIELD BLOCK';
        this.onSoundEffect('bounce');
        return false;
      }
    }

    // DIRECT HITS ARE FORBIDDEN
    const totalBounces = p.bounceCount;
    if (totalBounces < this.currentLevel.requiredBounces) {
      const isZero = totalBounces === 0;
      this.failLevel(isZero ? "DIRECT HITS FORBIDDEN" : `NEED ${this.currentLevel.requiredBounces} BOUNCES`);
      return true;
    }

    // Successful target completion
    this.completeLevel(p);
    return true;
  }

  // Volt Electric Chain line-of-sight & target distance evaluation
  private checkVoltChain(p: ActiveProjectile) {
    const target = this.currentLevel.target;
    const distanceToTarget = vec.dist(p.pos, target.pos);

    if (distanceToTarget <= 140) {
      // Direct Clear Line Of Sight evaluation (no intersecting solid structures)
      let lineOfSightBlocked = false;

      for (const obs of this.currentLevel.obstacles) {
        if (obs.type === 'wall' || obs.type === 'hazard') {
          // Raycast check from projectile current pos to target
          const hit = checkRayRotatedRect(p.pos, vec.norm(vec.sub(target.pos, p.pos)), obs.pos, obs.size || { x: 0, y: 0 }, obs.rot || 0);
          if (hit && hit.t > 0 && hit.t < distanceToTarget) {
            lineOfSightBlocked = true;
            break;
          }
        }
      }

      if (!lineOfSightBlocked) {
        this.onSoundEffect('volt');
        this.spawnBurst(p.pos, '#b96cff', 20);
        this.spawnBurst(target.pos, '#b96cff', 20);
        this.completeLevel(p);
      }
    }
  }

  private checkObstacleCollisions(p: ActiveProjectile): boolean {
    let hitAnything = false;

    for (const obs of this.currentLevel.obstacles) {
      if (!obs.alive) continue;

      // Handle disappearing / timed obstacle cycle skip
      if (obs.type === 'disappearing' && obs.cycle) {
        if ((this.state.levelTime % (obs.cycle * 2.0)) > obs.cycle) continue;
      }

      if (obs.size) {
        const local = vec.rotate(vec.sub(p.pos, obs.pos), -(obs.rot || 0));
        const halfW = obs.size.x / 2;
        const halfH = obs.size.y / 2;

        // Standard bounding box intersection checking
        if (Math.abs(local.x) <= halfW + p.radius && Math.abs(local.y) <= halfH + p.radius) {

          // Hazard Collision Check (instant retry)
          if (obs.type === 'hazard') {
            this.failLevel("HAZARD HIT");
            this.onSoundEffect('fail');
            return true;
          }

          // Phantom Passable wall exception
          if (p.type === 'phantom' && obs.phantomPassable && p.phantomObstaclePassedCount === 0) {
            p.phantomObstaclePassedCount++;
            continue; // Phase straight through
          }

          // Compute closest collision reflection plane normals
          const px = halfW + p.radius - Math.abs(local.x);
          const py = halfH + p.radius - Math.abs(local.y);

          let localNormal: Vector2D = { x: 0, y: 0 };
          if (px < py) {
            localNormal = { x: Math.sign(local.x), y: 0 };
          } else {
            localNormal = { x: 0, y: Math.sign(local.y) };
          }

          const worldNormal = vec.norm(vec.rotate(localNormal, obs.rot || 0));

          // Resolve overlapping depth positions
          const overlap = Math.min(px, py);
          p.pos = vec.add(p.pos, vec.scale(worldNormal, overlap));

          // Reflect velocity vec
          p.vel = vec.scale(vec.bounce(p.vel, worldNormal), p.restitution);
          hitAnything = true;

          // Glass panels breakable logic
          if (obs.type === 'glass') {
            const hitSpeed = vec.len(p.vel);
            // High break force Projectile or fast heavy pulse shatters glass panels
            if (p.type === 'heavy' || hitSpeed > 850) {
              obs.alive = false;
              this.onSoundEffect('glass');
              this.spawnGlassShards(obs.pos, obs.size, obs.rot || 0);
            }
          }

          // Handle special Frost slowdown weapon mechanics on impact
          if (p.type === 'frost') {
            this.state.frostSlowdownEndTime = this.state.levelTime + 2.5; // Apply ice slow for 2.5s duration
            this.onSoundEffect('frost');
          }

          // Handle special splitting projectile logic after first valid bounce
          if (p.type === 'split' && !p.hasSplit && p.bounceCount === 0) {
            p.hasSplit = true;
            this.triggerSplitProjectile(p);
            return true; // Main original projectile is cleaned up/removed instantly
          }

          this.handleBounceEffect(p);
        }
      } else if (obs.type === 'portal') {
        // Portal collision detection and warp
        if (this.state.portalLockTime === 0 && vec.dist(p.pos, obs.pos) < (obs.radius || 38) + p.radius) {
          const pairPortal = this.currentLevel.obstacles.find(o => o.type === 'portal' && o.id === obs.pairId);
          if (pairPortal) {
            p.pos = vec.add(pairPortal.pos, vec.scale(vec.norm(p.vel), 55));
            this.state.portalLockTime = 0.35; // lock cooldown
            this.onSoundEffect('portal');
            this.spawnBurst(p.pos, '#b96cff', 12);
            this.spawnBurst(pairPortal.pos, '#b96cff', 12);
            hitAnything = true;
          }
        }
      }
    }

    return hitAnything;
  }

  // Trigger Split weapon: create 2 sub-projectiles at +-18 degrees offsets
  private triggerSplitProjectile(p: ActiveProjectile) {
    const currentReflectedDir = vec.norm(p.vel);
    const speed = vec.len(p.vel) * 0.92; // 92% speed conservation

    const splitAngleRad = 18 * (Math.PI / 180);

    const dirLeft = vec.rotate(currentReflectedDir, -splitAngleRad);
    const dirRight = vec.rotate(currentReflectedDir, splitAngleRad);

    const leftProj: ActiveProjectile = {
      id: Math.random().toString(),
      type: 'split_child',
      pos: { ...p.pos },
      vel: vec.scale(dirLeft, speed),
      radius: 14, // smaller sub-projectiles
      bounceCount: p.bounceCount + 1, // inherit bounce count immediately
      phantomObstaclePassedCount: 0,
      hasSplit: true,
      color: '#55f59a', // Green
      mass: p.mass,
      restitution: p.restitution,
      breakForce: p.breakForce
    };

    const rightProj: ActiveProjectile = {
      id: Math.random().toString(),
      type: 'split_child',
      pos: { ...p.pos },
      vel: vec.scale(dirRight, speed),
      radius: 14,
      bounceCount: p.bounceCount + 1,
      phantomObstaclePassedCount: 0,
      hasSplit: true,
      color: '#55f59a',
      mass: p.mass,
      restitution: p.restitution,
      breakForce: p.breakForce
    };

    // Clean up parent projectile and replace with split twins
    this.state.projectiles = [leftProj, rightProj];
    this.onSoundEffect('launch');
  }

  private handleBounceEffect(p: ActiveProjectile) {
    p.bounceCount += 1;
    this.state.bounceCount = Math.max(this.state.bounceCount, p.bounceCount);

    const scoreMultiplier = Math.pow(2, this.state.bounceCount - 1);
    this.state.message = `BOUNCE x${scoreMultiplier}!`;

    // Visual camera shake scale and sparks burst
    this.state.shakeIntensity = Math.min(12.0, 2.0 + vec.len(p.vel) / 170.0);
    this.spawnBurst(p.pos, '#ffd45c', 8 + Math.min(this.state.bounceCount, 8));

    this.onSoundEffect('bounce');
    this.onHapticEffect('medium');

    // Perfect ricochet sound trigger feedback
    if (this.state.bounceCount >= 3) {
      this.onSoundEffect('perfect');
    }
  }

  private handleMiss() {
    if (this.state.projectiles.length === 0) {
      if (this.state.ammo <= 0) {
        this.failLevel("OUT OF AMMO");
      } else {
        this.state.message = "TRY AGAIN";
        this.notify();
      }
    }
  }

  private completeLevel(p: ActiveProjectile) {
    this.state.levelCompleted = true;
    this.state.projectiles = [];
    this.state.hitFlashOpacity = 1.0;
    this.state.shakeIntensity = 18.0;

    this.onSoundEffect('target');
    this.onHapticEffect('heavy');
    this.spawnBurst(this.currentLevel.target.pos, '#ffd45c', 45);

    this.notify();
  }

  private failLevel(reason: string) {
    this.state.levelFailed = true;
    this.state.failReason = reason;
    this.state.message = reason;
    this.state.projectiles = [];
    this.notify();
  }

  // Particle Generation and Physics Polish update loops
  private spawnBurst(pos: Vector2D, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 280;
      this.state.particles.push({
        pos: { ...pos },
        vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        color,
        life: 1.0,
        maxLife: 0.25 + Math.random() * 0.45,
        size: 3 + Math.random() * 4
      });
    }
  }

  private spawnGlassShards(pos: Vector2D, size: Vector2D, rot: number) {
    const halfW = size.x / 2;
    const halfH = size.y / 2;
    const shardCount = 18;

    for (let i = 0; i < shardCount; i++) {
      const offset: Vector2D = {
        x: (Math.random() - 0.5) * halfW,
        y: (Math.random() - 0.5) * halfH
      };
      const worldOffset = vec.rotate(offset, rot);
      const shardPos = vec.add(pos, worldOffset);

      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 240;

      this.state.glassFragments.push({
        pos: shardPos,
        vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        rot: Math.random() * Math.PI,
        rotVel: (Math.random() - 0.5) * 8.0,
        size: { x: 8 + Math.random() * 12, y: 4 + Math.random() * 8 },
        life: 1.0
      });
    }
  }

  private updateParticles(delta: float) {
    // Standard visual particles physics loop
    for (let i = this.state.particles.length - 1; i >= 0; i--) {
      const p = this.state.particles[i];
      p.pos = vec.add(p.pos, vec.scale(p.vel, delta));
      p.vel = vec.scale(p.vel, 0.94); // slow down friction
      p.life -= delta / p.maxLife;
      if (p.life <= 0) {
        this.state.particles.splice(i, 1);
      }
    }

    // Glass Shards physics loop
    for (let i = this.state.glassFragments.length - 1; i >= 0; i--) {
      const f = this.state.glassFragments[i];
      // Apply down gravity pull
      f.vel.y += 450 * delta;
      f.pos = vec.add(f.pos, vec.scale(f.vel, delta));
      f.rot += f.rotVel * delta;
      f.life -= delta * 1.5;
      if (f.life <= 0) {
        this.state.glassFragments.splice(i, 1);
      }
    }
  }
}

type float = number;
export default GameplayEngine;
