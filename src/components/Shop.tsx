import React from 'react';
import { Coins, Check, ChevronLeft } from 'lucide-react';
import { SaveData } from '../types/game';
import { PROJECTILE_CONFIGS } from '../physics/projectileConfig';

interface ShopProps {
  saveData: SaveData;
  onSelectBall: (id: number) => void;
  onBuyBall: (id: number, price: number) => void;
  onBack: () => void;
}

export const Shop: React.FC<ShopProps> = ({
  saveData,
  onSelectBall,
  onBuyBall,
  onBack
}) => {
  return (
    <div className="absolute inset-0 bg-[#071324] flex flex-col p-6 font-sans select-none text-slate-100 z-10">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 bg-slate-900/80 hover:bg-slate-800 text-slate-100 px-4 py-2 rounded-xl border border-slate-700/50 backdrop-blur-md active:scale-95 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">BACK</span>
        </button>

        <h1 className="text-xl font-extrabold tracking-wider text-slate-100">PROJECTILE SHOP</h1>

        <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3.5 py-1.5 rounded-2xl">
          <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 font-extrabold text-sm">{saveData.coins}</span>
        </div>
      </div>

      {/* Product Projectiles scroll grid */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-12 pr-1 select-none">
        {PROJECTILE_CONFIGS.map((proj, idx) => {
          const isOwned = saveData.ownedBalls.includes(idx);
          const isSelected = saveData.selectedBall === idx;
          const canAfford = saveData.coins >= proj.price;

          return (
            <div
              key={proj.type}
              className={`flex items-center gap-4 bg-slate-900/40 border p-4 rounded-2xl backdrop-blur-md relative overflow-hidden transition-all duration-200 ${
                isSelected
                  ? 'border-yellow-400/50 bg-slate-900/60 shadow-[0_0_15px_rgba(250,204,21,0.06)]'
                  : 'border-slate-800/60'
              }`}
            >
              {/* Product preview ball circle */}
              <div
                className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center relative shadow-lg"
                style={{
                  backgroundColor: 'rgba(7, 19, 36, 0.4)',
                  boxShadow: `inset 0 0 12px ${proj.color}, 0 0 10px ${proj.color}33`
                }}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: proj.color }}
                />
              </div>

              {/* Product Details info */}
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-black text-slate-100 tracking-wide text-base leading-tight flex items-center gap-1.5">
                  {proj.name}
                </h3>
                <p className="text-slate-400 text-xs mt-1 leading-normal font-medium max-w-[240px]">
                  {proj.description}
                </p>
              </div>

              {/* Action purchase/selection button */}
              <div className="flex-shrink-0">
                {isOwned ? (
                  isSelected ? (
                    <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-extrabold text-xs px-3.5 py-2.5 rounded-xl">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>EQUIPPED</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectBall(idx)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700/60 active:scale-95 transition"
                    >
                      EQUIP
                    </button>
                  )
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => onBuyBall(idx, proj.price)}
                    className={`flex items-center gap-1 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl active:scale-95 transition ${
                      canAfford
                        ? 'bg-yellow-400 hover:bg-yellow-300'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/30'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5 fill-current" />
                    <span>{proj.price}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shop;
