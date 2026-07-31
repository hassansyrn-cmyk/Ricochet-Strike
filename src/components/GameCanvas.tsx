import React, { useEffect, useRef } from 'react';
import { GameplayEngine, GAME_WIDTH, GAME_HEIGHT } from '../physics/gameplayEngine';
import { Level, ProjectileConfig } from '../types/game';

interface GameCanvasProps {
  engine: GameplayEngine;
  level: Level;
  selectedProjConfig: ProjectileConfig;
  onLaunchComplete: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  engine,
  level,
  selectedProjConfig,
  onLaunchComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  // Maintain actual internal viewport dimensions and physical canvas scaling parameters
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const scaleX = containerWidth / GAME_WIDTH;
      const scaleY = containerHeight / GAME_HEIGHT;
      const scale = Math.min(scaleX, scaleY); // uniform letterboxing/scaling

      canvas.style.width = `${GAME_WIDTH * scale}px`;
      canvas.style.height = `${GAME_HEIGHT * scale}px`;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Set up animation frames with fixed step timing loop
  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined && previousTimeRef.current !== null) {
        let deltaTime = (time - previousTimeRef.current) / 1000;

        // Clamp huge frames to prevent massive jumps after resume
        if (deltaTime > 0.1) deltaTime = 0.1;

        // Custom capped physics fixed timestepping accumulator (1/120 second resolution)
        const fixedStep = 1 / 120;
        let accumulator = deltaTime;
        while (accumulator >= fixedStep) {
          engine.update(fixedStep);
          accumulator -= fixedStep;
        }

        // Draw Canvas State Frame
        renderFrame();
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [engine]);

  // Pointer aiming drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capture pointers for perfect vertical mobile drag aiming precision
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * GAME_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT;

    engine.handleStartAim({ x, y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * GAME_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT;

    engine.handleAiming({ x, y });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.releasePointerCapture(e.pointerId);
    engine.handleReleaseAim(selectedProjConfig);
  };

  // Perform full HTML5 Canvas drawing procedures
  const renderFrame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Apply shake translation logic
    ctx.save();
    const shake = engine.state.shakeIntensity;
    if (shake > 0) {
      const shakeX = (Math.random() - 0.5) * shake;
      const shakeY = (Math.random() - 0.5) * shake;
      ctx.translate(shakeX, shakeY);
    }

    // A. Dark navy background
    ctx.fillStyle = '#071324';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // B. Draw futuristic neon digital background grid lines
    ctx.strokeStyle = 'rgba(56, 228, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < GAME_WIDTH; x += 90) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GAME_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < GAME_HEIGHT; y += 90) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GAME_WIDTH, y);
      ctx.stroke();
    }

    // C. Draw Portals and Gravity Wells (Purple)
    for (const obs of level.obstacles) {
      if (!obs.alive) continue;
      if (obs.type === 'well' && obs.radius) {
        ctx.fillStyle = 'rgba(185, 108, 255, 0.06)';
        ctx.strokeStyle = '#b96cff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(obs.pos.x, obs.pos.y, obs.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (obs.type === 'portal' && obs.radius) {
        // Draw spinning portals visual ring
        ctx.strokeStyle = '#b96cff';
        ctx.lineWidth = 8;
        ctx.beginPath();
        const spinAngle = engine.state.levelTime * 2.5;
        ctx.arc(obs.pos.x, obs.pos.y, obs.radius, spinAngle, spinAngle + 4.8);
        ctx.stroke();
      }
    }

    // D. Draw obstacles (Walls, Hazards, Glass, Disappearing Timers)
    for (const obs of level.obstacles) {
      if (!obs.alive || !obs.size) continue;

      // Handle disappearing / timed blink kind timing animation
      if (obs.type === 'disappearing' && obs.cycle) {
        if ((engine.state.levelTime % (obs.cycle * 2.0)) > obs.cycle) {
          continue; // Blink skip rendering
        }
      }

      ctx.save();
      ctx.translate(obs.pos.x, obs.pos.y);
      ctx.rotate(obs.rot || 0);

      // Color scheme setup
      let color = '#38e4ff'; // Cyan standard wall
      let fillStyle = 'rgba(56, 228, 255, 0.28)';
      if (obs.type === 'hazard') {
        color = '#ff496c'; // Red hazard
        fillStyle = 'rgba(255, 73, 108, 0.32)';
      } else if (obs.type === 'glass') {
        color = 'rgba(102, 230, 255, 0.75)'; // Ice glass
        fillStyle = 'rgba(102, 230, 255, 0.25)';
      }

      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;

      const w = obs.size.x;
      const h = obs.size.y;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);

      // Draw glass diagonal details reflection line
      if (obs.type === 'glass') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-w / 2 + 10, -h / 2 + 4);
        ctx.lineTo(w / 2 - 10, h / 2 - 4);
        ctx.stroke();
      }

      ctx.restore();
    }

    // E. Draw target (Red target body with dynamic rotating shield & weak openings)
    const target = level.target;
    ctx.fillStyle = 'rgba(255, 73, 108, 0.25)';
    ctx.strokeStyle = '#ff496c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(target.pos.x, target.pos.y, target.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bullseye center circle
    ctx.fillStyle = '#ffd45c'; // gold center bullseye
    ctx.beginPath();
    ctx.arc(target.pos.x, target.pos.y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Shield outline
    if (target.shield) {
      ctx.strokeStyle = '#eef8ff';
      ctx.lineWidth = 12;
      ctx.beginPath();
      // Draw circular shield segment leaving a weak opening gap
      const gapCenterAngle = target.shieldAngle;
      ctx.arc(target.pos.x, target.pos.y, target.radius + 22, gapCenterAngle + 0.85, gapCenterAngle + Math.PI * 2 - 0.85);
      ctx.stroke();
    }

    // F. Draw Sling launcher ring
    const launcher = engine.state.launcher;
    ctx.fillStyle = 'rgba(56, 228, 255, 0.15)';
    ctx.strokeStyle = '#38e4ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(launcher.x, launcher.y, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // H. Draw Active Ball projectiles with motion trails
    for (const p of engine.state.projectiles) {
      // Trail
      const speed = Math.sqrt(p.vel.x * p.vel.x + p.vel.y * p.vel.y);
      if (speed > 5) {
        ctx.save();
        const normX = p.vel.x / speed;
        const normY = p.vel.y / speed;
        for (let j = 4; j > 0; j--) {
          const trailX = p.pos.x - normX * j * 15;
          const trailY = p.pos.y - normY * j * 15;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.12 * j;
          ctx.beginPath();
          ctx.arc(trailX, trailY, p.radius - j * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Main core ball body
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }

    // I. Draw Visual Particles & Glass Fragments
    for (const p of engine.state.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    for (const f of engine.state.glassFragments) {
      ctx.save();
      ctx.translate(f.pos.x, f.pos.y);
      ctx.rotate(f.rot);
      ctx.fillStyle = 'rgba(102, 230, 255, 0.45)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = f.life;
      ctx.fillRect(-f.size.x / 2, -f.size.y / 2, f.size.x, f.size.y);
      ctx.strokeRect(-f.size.x / 2, -f.size.y / 2, f.size.x, f.size.y);
      ctx.restore();
    }

    // J. Screen Overlay Flashing FX
    if (engine.state.hitFlashOpacity > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${engine.state.hitFlashOpacity * 0.28})`;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    ctx.restore(); // restore from shake
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950"
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="block bg-[#071324] shadow-2xl max-w-full max-h-full select-none touch-none cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
};

export default GameCanvas;
