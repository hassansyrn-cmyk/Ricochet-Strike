import React from 'react';
import { Zap, Coins, Play, Trophy, Gift } from 'lucide-react';
import { SaveData } from '../types/game';

interface HomeScreenProps {
  saveData: SaveData;
  onNavigate: (screen: 'levels' | 'shop' | 'daily' | 'settings') => void;
  onQuickPlay: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  saveData,
  onNavigate,
  onQuickPlay
}) => {
  // Aggregate total campaign rating stars earned
  const getTotalStars = () => {
    return Object.values(saveData.stars).reduce((acc, curr) => acc + curr, 0);
  };

  return (
    <div className="absolute inset-0 bg-[#071324] flex flex-col justify-between p-6 select-none font-sans text-slate-100 z-10">

      {/* Top statistics dashboard */}
      <div className="flex items-center justify-between mt-4">
        {/* Total Stars stats */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/40 px-4 py-2 rounded-2xl backdrop-blur-md">
          <Trophy className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 font-extrabold text-sm tracking-wide">{getTotalStars()} ★</span>
        </div>

        {/* Player coins balance stats */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/40 px-4 py-2 rounded-2xl backdrop-blur-md">
          <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 font-extrabold text-sm tracking-wide">{saveData.coins}</span>
        </div>
      </div>

      {/* Main Title Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-black tracking-widest text-slate-100 leading-none">RICOCHET</h1>
        <h2 className="text-4xl font-extrabold tracking-widest text-cyan-400 mt-1 leading-none">STRIKE</h2>

        <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mt-4 flex items-center gap-1">
          <Zap className="w-4 h-4 animate-bounce" /> DIRECT HITS ARE FORBIDDEN
        </p>
      </div>

      {/* Bottom CTA menu buttons */}
      <div className="space-y-3.5 mb-8 w-full max-w-sm mx-auto">
        <button
          onClick={onQuickPlay}
          className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-4.5 px-6 rounded-2xl shadow-xl shadow-cyan-500/15 active:scale-98 transition duration-150"
        >
          <span>QUICK PLAY</span>
          <Play className="w-5 h-5 fill-current" />
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('levels')}
            className="bg-slate-900/60 hover:bg-slate-800 border border-slate-800/60 font-bold py-3.5 px-4 rounded-2xl active:scale-95 transition"
          >
            CAMPAIGN
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="bg-slate-900/60 hover:bg-slate-800 border border-slate-800/60 font-bold py-3.5 px-4 rounded-2xl active:scale-95 transition"
          >
            PROJECTILES
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('daily')}
            className="flex items-center justify-center gap-1.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/60 font-bold py-3 px-4 rounded-2xl active:scale-95 transition"
          >
            <Gift className="w-4 h-4 text-yellow-400" />
            <span>DAILY PORTAL</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="bg-slate-900/60 hover:bg-slate-800 border border-slate-800/60 font-bold py-3 px-4 rounded-2xl active:scale-95 transition"
          >
            SETTINGS
          </button>
        </div>
      </div>

    </div>
  );
};

export default HomeScreen;
