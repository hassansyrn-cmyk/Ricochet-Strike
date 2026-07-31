import { ProjectileConfig } from '../types/game';

export const PROJECTILE_CONFIGS: ProjectileConfig[] = [
  {
    type: 'pulse',
    name: 'Pulse',
    speed: 1260,
    restitution: 0.92,
    mass: 1.0,
    breakForce: 50,
    price: 0,
    color: '#38e4ff', // Cyan
    description: 'Balanced default projectile with normal speed and bouncing.'
  },
  {
    type: 'heavy',
    name: 'Heavy',
    speed: 1108.8, // 12% lower than default Pulse speed (1260 * 0.88)
    restitution: 0.80, // slightly reduced
    mass: 1.8,
    breakForce: 150, // Higher break force
    price: 300,
    color: '#ffd45c', // Gold
    description: 'Slower, heavier, and breaks obstacles/glass easily.'
  },
  {
    type: 'volt',
    name: 'Volt',
    speed: 1320,
    restitution: 0.92,
    mass: 0.9,
    breakForce: 40,
    price: 500,
    color: '#b96cff', // Purple (Electric feel)
    description: 'Can chain electrical energy to targets close by after satisfying bounces.'
  },
  {
    type: 'frost',
    name: 'Frost',
    speed: 1200,
    restitution: 0.90,
    mass: 1.1,
    breakForce: 60,
    price: 650,
    color: '#8be5ff', // Light ice blue
    description: 'Temporarily slows down moving obstacles, rotating shields and targets.'
  },
  {
    type: 'phantom',
    name: 'Phantom',
    speed: 1250,
    restitution: 0.92,
    mass: 0.8,
    breakForce: 30,
    price: 850,
    color: '#eef8ff', // Semi-transparent white
    description: 'Can phase through exactly one specially designated wall.'
  },
  {
    type: 'split',
    name: 'Split',
    speed: 1280,
    restitution: 0.90,
    mass: 0.7,
    breakForce: 40,
    price: 1000,
    color: '#55f59a', // Green
    description: 'Splits into two valid sub-projectiles after the first wall bounce.'
  }
];
