import React from 'react';
import { ChevronLeft, Star, Lock } from 'lucide-react';
import { SaveData, Level } from '../types/game';
import { generateLevel } from '../levels/levels';

interface LevelSelectionProps {
  saveData: SaveData;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const LevelSelection: React.FC<LevelSelectionProps> = ({
  saveData,
  onSelectLevel,
  onBack
}) => {
  const levelsPerWorld = 20;

  // Active world selection state
  const [selectedWorld, setSelectedWorld] = React.useState<number>(1);

  // Group levels 1 to 100 in sets of 20
  const getLevelsForWorld = (worldId: number): Level[] => {
    const list: Level[] = [];
    const startIdx = (worldId - 1) * levelsPerWorld + 1;
    for (let i = 0; i < levelsPerWorld; i++) {
      list.push(generateLevel(startIdx + i));
    }
    return list;
  };

  const currentWorldLevels = getLevelsForWorld(selectedWorld);

  return (
    <div className="absolute inset-0 bg-[#071324] flex flex-col p-6 font-sans select-none text-slate-100 z-10">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 bg-slate-900/80 hover:bg-slate-800 text-slate-100 px-4 py-2 rounded-xl border border-slate-700/50 backdrop-blur-md active:scale-95 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">HOME</span>
        </button>

        <h1 className="text-xl font-extrabold tracking-wider text-slate-100">WORLD CAMPAIGN</h1>

        <div className="w-10 h-1" /> {/* empty spacer */}
      </div>

      {/* World selection slider tab buttons */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 mb-4 select-none pr-1">
        {[1, 2, 3, 4, 5].map((w) => {
          const isWorldSelected = selectedWorld === w;
          const worldTitle = `WORLD ${w}`;
          return (
            <button
              key={w}
              onClick={() => setSelectedWorld(w)}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl font-black text-xs tracking-wider border transition-all duration-200 active:scale-95 ${
                isWorldSelected
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-md shadow-cyan-500/15'
                  : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {worldTitle}
            </button>
          );
        })}
      </div>

      {/* Grid of 20 levels for selected world */}
      <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-3.5 pb-12 select-none pr-1">
        {currentWorldLevels.map((lvl) => {
          const isUnlocked = lvl.id <= saveData.unlocked;
          const starsCount = saveData.stars[lvl.id] || 0;

          return (
            <button
              key={lvl.id}
              disabled={!isUnlocked}
              onClick={() => onSelectLevel(lvl.id)}
              className={`relative flex flex-col items-center justify-between p-4.5 rounded-2xl border aspect-square transition-all duration-200 ${
                isUnlocked
                  ? 'bg-slate-900/50 border-slate-800 hover:border-cyan-500/30 active:scale-95'
                  : 'bg-slate-950/60 border-slate-950 text-slate-600 cursor-not-allowed'
              }`}
            >
              {isUnlocked ? (
                <>
                  <span className="font-black text-xl leading-none">{lvl.id}</span>

                  {/* Rating stars display */}
                  <div className="flex items-center gap-0.5 mt-2">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= starsCount ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700 fill-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-slate-700" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelection;
