import { Level, Obstacle, Target } from '../types/game';
import { SeededRandom } from './seededPRNG';

// Hand-crafted onboarding levels 1 to 20
export const HAND_CRAFTED_LEVELS: Level[] = [
  // World 1: levels 1 to 20
  {
    id: 1,
    world: 1,
    name: "Angle Training",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 760, y: 520 },
      basePos: { x: 760, y: 520 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 540, y: 1130 },
        size: { x: 720, y: 36 },
        rot: -22 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 2,
    world: 1,
    name: "The Slanted Wall",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 300, y: 450 },
      basePos: { x: 300, y: 450 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 540, y: 1000 },
        size: { x: 600, y: 36 },
        rot: 15 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 3,
    world: 1,
    name: "Double Slant",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 350 },
      basePos: { x: 540, y: 350 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 300, y: 900 },
        size: { x: 300, y: 30 },
        rot: 30 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 780, y: 900 },
        size: { x: 300, y: 30 },
        rot: -30 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 4,
    world: 1,
    name: "Corridor Shot",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 300 },
      basePos: { x: 540, y: 300 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 250, y: 800 },
        size: { x: 400, y: 40 },
        rot: 90 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 830, y: 800 },
        size: { x: 400, y: 40 },
        rot: 90 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w3",
        type: "wall",
        pos: { x: 540, y: 1100 },
        size: { x: 400, y: 30 },
        rot: 0,
        alive: true
      }
    ]
  },
  {
    id: 5,
    world: 1,
    name: "Funnel Bounce",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 400 },
      basePos: { x: 540, y: 400 },
      radius: 40,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 250, y: 1000 },
        size: { x: 400, y: 30 },
        rot: 45 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 830, y: 1000 },
        size: { x: 400, y: 30 },
        rot: -45 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 6,
    world: 1,
    name: "Offset Block",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 800, y: 400 },
      basePos: { x: 800, y: 400 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 540, y: 800 },
        size: { x: 500, y: 40 },
        rot: 10 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 7,
    world: 1,
    name: "Narrow Window",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 250 },
      basePos: { x: 540, y: 250 },
      radius: 35,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 250, y: 700 },
        size: { x: 450, y: 35 },
        rot: 0,
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 830, y: 700 },
        size: { x: 450, y: 35 },
        rot: 0,
        alive: true
      },
      {
        id: "w3",
        type: "wall",
        pos: { x: 540, y: 1200 },
        size: { x: 500, y: 35 },
        rot: 15 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 8,
    world: 1,
    name: "Diamond Maze",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 350 },
      basePos: { x: 540, y: 350 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 540, y: 900 },
        size: { x: 250, y: 250 },
        rot: 45 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 9,
    world: 1,
    name: "Wall Splitter",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 200, y: 350 },
      basePos: { x: 200, y: 350 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 540, y: 800 },
        size: { x: 40, y: 800 },
        rot: 0,
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 800, y: 1200 },
        size: { x: 300, y: 30 },
        rot: -30 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 10,
    world: 1,
    name: "Bouncing Roof",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 650 },
      basePos: { x: 540, y: 650 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 540, y: 350 },
        size: { x: 800, y: 40 },
        rot: 0,
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 540, y: 1000 },
        size: { x: 500, y: 40 },
        rot: 20 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 11,
    world: 1,
    name: "V-Shaped Redirect",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 250 },
      basePos: { x: 540, y: 250 },
      radius: 38,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 540, y: 850 },
        size: { x: 320, y: 30 },
        rot: 45 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 540, y: 1150 },
        size: { x: 320, y: 30 },
        rot: -45 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 12,
    world: 1,
    name: "The Guarded Corner",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 150, y: 300 },
      basePos: { x: 150, y: 300 },
      radius: 40,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 150, y: 550 },
        size: { x: 250, y: 30 },
        rot: 0,
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 600, y: 1000 },
        size: { x: 600, y: 30 },
        rot: -25 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 13,
    world: 1,
    name: "Alternating Slants",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 320 },
      basePos: { x: 540, y: 320 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 300, y: 1100 },
        size: { x: 400, y: 30 },
        rot: 20 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 780, y: 750 },
        size: { x: 400, y: 30 },
        rot: -20 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 14,
    world: 1,
    name: "Precision Funnel",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 300 },
      basePos: { x: 540, y: 300 },
      radius: 35,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 300, y: 800 },
        size: { x: 450, y: 30 },
        rot: 65 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 780, y: 800 },
        size: { x: 450, y: 30 },
        rot: -65 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w3",
        type: "wall",
        pos: { x: 540, y: 1300 },
        size: { x: 500, y: 30 },
        rot: 0,
        alive: true
      }
    ]
  },
  {
    id: 15,
    world: 1,
    name: "The Big Wedge",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 900, y: 350 },
      basePos: { x: 900, y: 350 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 450, y: 900 },
        size: { x: 600, y: 120 },
        rot: 35 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 16,
    world: 1,
    name: "Zig-Zag",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 150, y: 250 },
      basePos: { x: 150, y: 250 },
      radius: 40,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 500, y: 1100 },
        size: { x: 700, y: 30 },
        rot: 15 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 580, y: 700 },
        size: { x: 700, y: 30 },
        rot: -15 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 17,
    world: 1,
    name: "Launch Ramp",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 800, y: 400 },
      basePos: { x: 800, y: 400 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 300, y: 1350 },
        size: { x: 400, y: 40 },
        rot: -35 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 800, y: 900 },
        size: { x: 400, y: 40 },
        rot: 15 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 18,
    world: 1,
    name: "Pillar Bounce",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 300 },
      basePos: { x: 540, y: 300 },
      radius: 40,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 540, y: 800 },
        size: { x: 180, y: 180 },
        rot: 45 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 150, y: 1100 },
        size: { x: 250, y: 30 },
        rot: 25 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w3",
        type: "wall",
        pos: { x: 930, y: 1100 },
        size: { x: 250, y: 30 },
        rot: -25 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 19,
    world: 1,
    name: "The Gated Wall",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 250 },
      basePos: { x: 540, y: 250 },
      radius: 42,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 540, y: 650 },
        size: { x: 600, y: 35 },
        rot: 0,
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 540, y: 1150 },
        size: { x: 600, y: 35 },
        rot: 15 * (Math.PI / 180),
        alive: true
      }
    ]
  },
  {
    id: 20,
    world: 1,
    name: "World 1 Climax",
    maxAmmo: 4,
    requiredBounces: 1,
    target: {
      pos: { x: 540, y: 350 },
      basePos: { x: 540, y: 350 },
      radius: 40,
      moveRange: 0,
      moveSpeed: 0,
      shield: false,
      shieldAngle: 0,
      shieldArc: 0,
      isMoving: false
    },
    obstacles: [
      {
        id: "w1",
        type: "wall",
        pos: { x: 540, y: 700 },
        size: { x: 300, y: 300 },
        rot: 15 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w2",
        type: "wall",
        pos: { x: 200, y: 1200 },
        size: { x: 300, y: 35 },
        rot: 35 * (Math.PI / 180),
        alive: true
      },
      {
        id: "w3",
        type: "wall",
        pos: { x: 880, y: 1200 },
        size: { x: 300, y: 35 },
        rot: -35 * (Math.PI / 180),
        alive: true
      }
    ]
  }
];

export function generateLevel(id: number): Level {
  if (id >= 1 && id <= 20) {
    return HAND_CRAFTED_LEVELS[id - 1];
  }

  // Deterministic seeded procedural generator for Levels 21 to 100
  const rng = new SeededRandom(id * 739);
  const world = Math.min(5, Math.floor((id - 1) / 20) + 1);
  const local = ((id - 1) % 20) + 1;

  // Set limits and configuration based on world/difficulty
  let maxAmmo = 4;
  if (world >= 3) maxAmmo = 3;
  if (id >= 91) maxAmmo = 2;

  let requiredBounces = 1;
  if (world === 2 || world === 3) requiredBounces = 2;
  if (world === 4 || world === 5) requiredBounces = 3;
  if (id >= 96) requiredBounces = 4;

  const timeLimit = world === 5 && local > 10 ? 12.0 : undefined;

  // Generate target position
  const targetX = rng.range(250, 830);
  const targetY = rng.range(300, 550);
  const target: Target = {
    pos: { x: targetX, y: targetY },
    basePos: { x: targetX, y: targetY },
    radius: rng.range(35, 45),
    moveRange: world >= 2 ? rng.range(80, 150) : 0,
    moveSpeed: world >= 2 ? rng.range(0.8, 1.8) : 0,
    shield: world >= 4,
    shieldAngle: rng.range(0, Math.PI * 2),
    shieldArc: rng.range((120 * Math.PI) / 180, (220 * Math.PI) / 180), // shield with gap
    isMoving: world >= 2
  };

  const obstacles: Obstacle[] = [];

  // Generate standard bounceable walls
  // Always add one main diagonal or flat wall to act as primary bounce surface
  const w1Rot = rng.range(-30, 30) * (Math.PI / 180);
  obstacles.push({
    id: "w1",
    type: "wall",
    pos: { x: rng.range(340, 740), y: rng.range(1000, 1200) },
    size: { x: rng.range(400, 650), y: rng.range(30, 45) },
    rot: w1Rot,
    alive: true
  });

  // Second defensive wall for harder levels
  if (local > 4 || world >= 3) {
    const isLeft = rng.next() > 0.5;
    obstacles.push({
      id: "w2",
      type: "wall",
      pos: { x: isLeft ? rng.range(150, 350) : rng.range(730, 930), y: rng.range(750, 950) },
      size: { x: rng.range(250, 400), y: rng.range(28, 38) },
      rot: (isLeft ? 1 : -1) * rng.range(15, 45) * (Math.PI / 180),
      alive: true
    });
  }

  // World 2 feature: Moving hazards & breakable glass
  if (world === 2) {
    // Add a hazard (red colored block)
    obstacles.push({
      id: "h1",
      type: "hazard",
      pos: { x: rng.range(300, 780), y: rng.range(1250, 1400) },
      size: { x: rng.range(200, 400), y: rng.range(25, 35) },
      rot: rng.range(-15, 15) * (Math.PI / 180),
      alive: true
    });

    // Add breakable glass (semi-transparent blue block)
    obstacles.push({
      id: "g1",
      type: "glass",
      pos: { x: rng.range(250, 830), y: rng.range(800, 950) },
      size: { x: rng.range(150, 250), y: rng.range(20, 28) },
      rot: rng.range(-20, 20) * (Math.PI / 180),
      alive: true
    });
  }

  // World 3 feature: Linked portals & gravity wells
  if (world === 3) {
    // 2 paired portals
    const p1X = rng.range(180, 320);
    const p1Y = rng.range(750, 850);
    const p2X = rng.range(760, 900);
    const p2Y = rng.range(850, 950);

    obstacles.push({
      id: "p1",
      type: "portal",
      pos: { x: p1X, y: p1Y },
      radius: 38,
      pairId: "p2",
      alive: true
    });

    obstacles.push({
      id: "p2",
      type: "portal",
      pos: { x: p2X, y: p2Y },
      radius: 38,
      pairId: "p1",
      alive: true
    });

    // Add a gravity well (ensure it is placed further down below target position)
    obstacles.push({
      id: "well1",
      type: "well",
      pos: { x: rng.range(450, 630), y: rng.range(850, 1050) },
      radius: rng.range(150, 200),
      strength: rng.range(380, 460),
      alive: true
    });
  }

  // World 4 features are handled via Target Shield (already configured in target definition above)
  // Let's add extra guards and narrow slots
  if (world === 4) {
    obstacles.push({
      id: "g1",
      type: "wall",
      pos: { x: target.basePos.x + rng.range(-150, 150), y: target.basePos.y + 120 },
      size: { x: rng.range(180, 280), y: rng.range(24, 30) },
      rot: rng.range(-15, 15) * (Math.PI / 180),
      alive: true
    });
  }

  // World 5 feature: Precision challenges, Disappearing walls, limited ammo, timed
  if (world === 5) {
    // Add disappearing wall (blinkKind)
    obstacles.push({
      id: "dw1",
      type: "disappearing",
      pos: { x: rng.range(400, 680), y: rng.range(600, 750) },
      size: { x: rng.range(220, 300), y: rng.range(22, 28) },
      rot: rng.range(-20, 20) * (Math.PI / 180),
      cycle: rng.range(1.0, 1.6),
      alive: true
    });

    // Glass panel marked phantomPassable for Phantom projectile use-case
    obstacles.push({
      id: "glass_phantom",
      type: "glass",
      pos: { x: rng.range(250, 830), y: rng.range(850, 950) },
      size: { x: rng.range(180, 260), y: 22 },
      rot: rng.range(-10, 10) * (Math.PI / 180),
      phantomPassable: true,
      alive: true
    });
  }

  return {
    id,
    world,
    name: `Sector ${world}-${local}`,
    maxAmmo,
    requiredBounces,
    timeLimit,
    target,
    obstacles
  };
}

// Function to validate level configurations
export function validateLevel(level: Level): boolean {
  const errors: string[] = [];

  // Check mandatory level bounds
  if (level.id < 1 || level.id > 100) errors.push("Level ID out of bounds");
  if (level.world < 1 || level.world > 5) errors.push("World index invalid");

  // Check Target
  if (level.target.pos.x < 50 || level.target.pos.x > 1030) errors.push("Target x coordinate out of bounds");
  if (level.target.pos.y < 200 || level.target.pos.y > 1500) errors.push("Target y coordinate out of bounds");

  // Check portal pairs
  const portals = level.obstacles.filter(o => o.type === 'portal');
  if (portals.length > 0) {
    if (portals.length % 2 !== 0) {
      errors.push("Odd number of portals defined in level.");
    }
    for (const portal of portals) {
      const pair = portals.find(p => p.id === portal.pairId);
      if (!pair) {
        errors.push(`Portal ${portal.id} is missing its pair ${portal.pairId}`);
      }
    }
  }

  // Verify obstacles overlap target
  for (const obs of level.obstacles) {
    if (obs.type === 'portal' || obs.type === 'well') {
      const radius = obs.radius || 0;
      const dx = obs.pos.x - level.target.pos.x;
      const dy = obs.pos.y - level.target.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < (radius + level.target.radius)) {
        errors.push(`Obstacle ${obs.id} overlaps too close to target`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`Validation failed for level ${level.id}:`, errors);
    return false;
  }
  return true;
}
