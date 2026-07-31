import { Vector2D, Obstacle, Target } from '../types/game';

// Standard 2D vector helpers
export const vec = {
  add: (v1: Vector2D, v2: Vector2D): Vector2D => ({ x: v1.x + v2.x, y: v1.y + v2.y }),
  sub: (v1: Vector2D, v2: Vector2D): Vector2D => ({ x: v1.x - v2.x, y: v1.y - v2.y }),
  scale: (v: Vector2D, s: number): Vector2D => ({ x: v.x * s, y: v.y * s }),
  lenSq: (v: Vector2D): number => v.x * v.x + v.y * v.y,
  len: (v: Vector2D): number => Math.sqrt(v.x * v.x + v.y * v.y),
  distSq: (v1: Vector2D, v2: Vector2D): number => {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return dx * dx + dy * dy;
  },
  dist: (v1: Vector2D, v2: Vector2D): number => Math.sqrt(vec.distSq(v1, v2)),
  dot: (v1: Vector2D, v2: Vector2D): number => v1.x * v2.x + v1.y * v2.y,
  norm: (v: Vector2D): Vector2D => {
    const l = vec.len(v);
    return l > 0.0001 ? { x: v.x / l, y: v.y / l } : { x: 0, y: 0 };
  },
  bounce: (v: Vector2D, normal: Vector2D): Vector2D => {
    const dot = vec.dot(v, normal);
    return vec.sub(v, vec.scale(normal, 2 * dot));
  },
  rotate: (v: Vector2D, angleRad: number): Vector2D => {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return {
      x: v.x * cos - v.y * sin,
      y: v.x * sin + v.y * cos
    };
  }
};

// Continuous Segment-vs-Surface (Swept) / Ray collision checking to prevent tunneling
export interface CollisionResult {
  t: number;          // normalized collision time [0, 1] or distance
  normal: Vector2D;   // collision surface normal
  point: Vector2D;    // exact point of collision contact
}

// Ray vs Rotated Rectangle collision check (adapted for prediction and sub-stepping)
export function checkRayRotatedRect(
  origin: Vector2D,
  dir: Vector2D,
  rectPos: Vector2D,
  rectSize: Vector2D,
  rectRot: number
): CollisionResult | null {
  // Transform origin & dir into local space of the rotated rectangle
  const localOrigin = vec.rotate(vec.sub(origin, rectPos), -rectRot);
  const localDir = vec.rotate(dir, -rectRot);

  const halfW = rectSize.x / 2;
  const halfH = rectSize.y / 2;

  // Intersections on X planes
  let tx1 = -Infinity;
  let tx2 = Infinity;
  if (Math.abs(localDir.x) > 0.0001) {
    tx1 = (-halfW - localOrigin.x) / localDir.x;
    tx2 = (halfW - localOrigin.x) / localDir.x;
  } else if (localOrigin.x < -halfW || localOrigin.x > halfW) {
    return null; // parallel and outside
  }

  // Intersections on Y planes
  let ty1 = -Infinity;
  let ty2 = Infinity;
  if (Math.abs(localDir.y) > 0.0001) {
    ty1 = (-halfH - localOrigin.y) / localDir.y;
    ty2 = (halfH - localOrigin.y) / localDir.y;
  } else if (localOrigin.y < -halfH || localOrigin.y > halfH) {
    return null; // parallel and outside
  }

  const tMin = Math.max(Math.min(tx1, tx2), Math.min(ty1, ty2));
  const tMax = Math.min(Math.max(tx1, tx2), Math.max(ty1, ty2));

  if (tMax < 0 || tMin > tMax) {
    return null;
  }

  const tContact = tMin;
  const hitLocal = vec.add(localOrigin, vec.scale(localDir, tContact));

  // Determine local normal
  let localNormal: Vector2D = { x: 0, y: -1 };
  if (Math.abs(Math.abs(hitLocal.x) - halfW) < 2.0) {
    localNormal = { x: Math.sign(hitLocal.x), y: 0 };
  } else {
    localNormal = { x: 0, y: Math.sign(hitLocal.y) };
  }

  const worldNormal = vec.norm(vec.rotate(localNormal, rectRot));
  const worldPoint = vec.add(rectPos, vec.rotate(hitLocal, rectRot));

  return {
    t: tContact,
    normal: worldNormal,
    point: worldPoint
  };
}

// Distance from a point (P) to a line segment defined by endpoints (A) and (B)
export function segmentDistance(p: Vector2D, a: Vector2D, b: Vector2D): number {
  const ab = vec.sub(b, a);
  const abLenSq = vec.lenSq(ab);
  if (abLenSq < 0.001) return vec.dist(p, a);

  // Project point onto segment, clamped between [0, 1]
  const t = Math.max(0, Math.min(1, vec.dot(vec.sub(p, a), ab) / abLenSq));
  const projection = vec.add(a, vec.scale(ab, t));
  return vec.dist(p, projection);
}
