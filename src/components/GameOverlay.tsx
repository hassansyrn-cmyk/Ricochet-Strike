import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Zap, ChevronLeft } from 'lucide-react';
import { Level } from '../types/game';

interface GameOverlayProps {
  level: Level;
  ammo: number;
  maxAmmo: number;
  requiredBounces: number;
  levelTime: number;
  timeLimit?: number;
  message: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onExit: () => void;
  isAiming: boolean;
  activeProjectileCount: number;
  selectedProjectileType: string;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  level,
  ammo,
  maxAmmo,
  requiredBounces,
  levelTime,
  timeLimit,
  message,
  soundEnabled,
  onToggleSound,
  onRestart,
  onExit,
  isAiming,
  activeProjectileCount,
  selectedProjectileType
}) => {
  const getProgressColor = () => {
    if (activeProjectileCount > 0) return 'text-cyan-400';
    if (ammo === 0) return 'text-red-500 animate-pulse';
    return 'text-slate-200';
  };

  const formattedTime = timeLimit ? Math.max(0, timeLimit - levelTime).toFixed(1) : null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none font-sans">
      {/* Top Header bar with sound controls & levels indicator */}
      <div className="flex items-center justify-between pointer-events-auto">
        <button
          onClick={onExit}
          className="flex items-center gap-1 bg-slate-900/80 hover:bg-slate-800 text-slate-100 px-4 py-2 rounded-xl border border-slate-700/50 backdrop-blur-md active:scale-95 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">BACK</span>
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-slate-100 font-extrabold text-lg tracking-wider">LEVEL {level.id}</h2>
          <span className="text-cyan-400 font-bold text-xs">{level.name}</span>
        </div>

        <button
          onClick={onToggleSound}
          className="bg-slate-900/80 hover:bg-slate-800 text-slate-100 p-2.5 rounded-xl border border-slate-700/50 backdrop-blur-md active:scale-95 transition"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
        </button>
      </div>

      {/* Ammo & Multipliers details panel */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/40 rounded-2xl px-5 py-3 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">AMMO STATUS</span>
            <div className={`flex items-baseline gap-1 font-black text-2xl ${getProgressColor()}`}>
              <span>{ammo}</span>
              <span className="text-slate-500 text-sm font-semibold">/ {maxAmmo}</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">REQUIRED BOUNCES</span>
            <div className="flex items-center gap-1.5 text-yellow-400 font-black text-xl">
              <Zap className="w-5 h-5 animate-pulse" />
              <span>{requiredBounces}</span>
            </div>
          </div>
        </div>

        {formattedTime && (
          <div className="flex items-center justify-between bg-red-950/40 border border-red-900/40 rounded-2xl px-5 py-2.5 backdrop-blur-sm">
            <span className="text-red-400 text-xs font-black uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" /> TIME LIMIT
            </span>
            <span className="text-red-400 font-black text-lg">{formattedTime}s</span>
          </div>
        )}
      </div>

      {/* Main Dynamic Status Toast Messages (e.g., MULTIPLIER POPUPS, HAZARDS) */}
      <div className="flex-1 flex items-center justify-center">
        {message && (
          <div className="bg-slate-950/90 border border-yellow-500/30 text-yellow-400 font-extrabold text-2xl tracking-widest px-8 py-3.5 rounded-2xl shadow-2xl animate-bounce backdrop-blur-xl">
            {message}
          </div>
        )}
      </div>

      {/* Bottom controls dashboard */}
      <div className="flex items-center justify-between gap-4 pointer-events-auto mt-auto">
        <button
          onClick={onRestart}
          className="flex-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-100 font-bold py-4 rounded-2xl backdrop-blur-md shadow-lg active:scale-95 transition"
        >
          RESTART
        </button>

        <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 backdrop-blur-md">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">ACTIVE TYPE</span>
          <span className="text-cyan-400 font-extrabold text-sm uppercase tracking-wide">{selectedProjectileType}</span>
        </div>
      </div>
    </div>
  );
};

export default GameOverlay;
