import { describe, it, expect } from 'vitest';
import { vec, checkRayRotatedRect, segmentDistance } from '../physics/vectorMath';

describe('Vector Math Calculations', () => {
  it('should correctly bounce off surfaces using restitution', () => {
    const velocity = { x: 100, y: -100 };
    const normal = { x: 0, y: 1 };
    const bounced = vec.bounce(velocity, normal);

    expect(bounced.x).toBe(100);
    expect(bounced.y).toBe(100);
  });

  it('should calculate segment distance properly', () => {
    const p = { x: 5, y: 5 };
    const a = { x: 0, y: 0 };
    const b = { x: 10, y: 0 };
    const dist = segmentDistance(p, a, b);
    expect(dist).toBe(5);
  });

  it('should detect collisions with rotated rectangles', () => {
    const origin = { x: 100, y: 50 };
    const dir = { x: 0, y: 1 };
    const rectPos = { x: 100, y: 100 };
    const rectSize = { x: 50, y: 20 };
    const result = checkRayRotatedRect(origin, dir, rectPos, rectSize, 0);

    expect(result).not.toBeNull();
    if (result) {
      expect(result.t).toBe(40); // 100 - (20/2) - 50 = 40 units distance
      expect(result.normal.x).toBe(0);
      expect(result.normal.y).toBe(-1);
    }
  });
});
