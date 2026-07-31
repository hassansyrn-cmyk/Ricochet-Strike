// Simple seedable pseudorandom number generator (LCG)
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Returns [0, 1)
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  // Returns range [min, max)
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Returns random element from array
  choice<T>(arr: T[]): T {
    const idx = Math.floor(this.next() * arr.length);
    return arr[idx];
  }
}
