import { describe, it, expect } from 'vitest';
import { generateLevel, validateLevel } from '../levels/levels';

describe('Level Validation and Design Systems', () => {
  it('should generate valid onboarding hand-crafted levels 1 to 20', () => {
    for (let i = 1; i <= 20; i++) {
      const lvl = generateLevel(i);
      expect(lvl.id).toBe(i);
      expect(lvl.world).toBe(1);
      expect(validateLevel(lvl)).toBe(true);
    }
  });

  it('should generate valid seeded procedural templates for levels 21 to 100', () => {
    for (let i = 21; i <= 100; i++) {
      const lvl = generateLevel(i);
      expect(lvl.id).toBe(i);
      expect(validateLevel(lvl)).toBe(true);
    }
  });
});
