export interface Vector2D {
  x: number;
  y: number;
}

export type ProjectileType = 'pulse' | 'heavy' | 'volt' | 'frost' | 'phantom' | 'split';

export interface ProjectileConfig {
  type: ProjectileType;
  name: string;
  speed: number;
  restitution: number;
  mass: number;
  breakForce: number;
  price: number;
  color: string;
  description: string;
}

export type ObstacleType =
  | 'wall'
  | 'angled'
  | 'glass'
  | 'hazard'
  | 'portal'
  | 'well'
  | 'disappearing'
  | 'timed';

export interface Obstacle {
  id: string;
  type: ObstacleType;
  pos: Vector2D;
  size?: Vector2D; // width, height for rectangular
  rot?: number; // rotation in radians
  radius?: number; // for portals, wells
  pairId?: string; // portal mapping
  strength?: number; // well pull gravity
  alive: boolean;
  cycle?: number; // disappearing cycle in seconds
  phantomPassable?: boolean;
}

export interface Target {
  pos: Vector2D;
  basePos: Vector2D;
  radius: number;
  moveRange: number;
  moveSpeed: number;
  shield: boolean;
  shieldAngle: number;
  shieldArc: number; // arc in radians, e.g. 2 * PI - gap_arc
  isMoving: boolean;
}

export interface Level {
  id: number;
  world: number;
  name: string;
  maxAmmo: number;
  requiredBounces: number;
  timeLimit?: number; // time limit in seconds
  target: Target;
  obstacles: Obstacle[];
}

export interface SaveData {
  unlocked: number;
  coins: number;
  stars: Record<string, number>;
  bestScores: Record<string, number>;
  selectedBall: number;
  ownedBalls: number[];
  sound: boolean;
  vibration: boolean;
  daily: string; // YYYY-MM-DD
  dailyStreak: number;
  tutorialCompleted: boolean;
}
