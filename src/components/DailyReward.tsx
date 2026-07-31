import React, { useState } from 'react';
import { Gift, Check, Coins, ChevronLeft } from 'lucide-react';
import { SaveData } from '../types/game';

interface DailyRewardProps {
  saveData: SaveData;
  onClaim: (coinsReward: number, newStreak: number) => void;
  onBack: () => void;
}

const REWARD_CYCLE = [50, 75, 100, 125, 150, 200, 300];

export const DailyReward: React.FC<DailyRewardProps> = ({
  saveData,
  onClaim,
  onBack
}) => {
  const [claimLock, setClaimLock] = useState<boolean>(false);

  // Check if claimed today based on date string key match YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const todayStr = getTodayString();
  const isClaimedToday = saveData.daily === todayStr;

  // Streak calculator
  const currentStreak = saveData.dailyStreak || 0;
  const nextStreakLevel = isClaimedToday ? currentStreak : (currentStreak % 7) + 1;
  const rewardValue = REWARD_CYCLE[(nextStreakLevel - 1) % 7];

  const handleClaimReward = () => {
    if (isClaimedToday || claimLock) return;
    setClaimLock(true);

    // Calculate new streak count
    const d = new Date();
    const yesterday = new Date(d);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (saveData.daily === yesterdayStr) {
      newStreak = (saveData.dailyStreak % 7) + 1;
    }

    onClaim(REWARD_CYCLE[newStreak - 1], newStreak);
    setClaimLock(false);
  };

  return (
    <div className="absolute inset-0 bg-[#071324] flex flex-col p-6 font-sans select-none text-slate-100 z-10">
      {/* Back button and header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1 bg-slate-900/80 hover:bg-slate-800 text-slate-100 px-4 py-2 rounded-xl border border-slate-700/50 backdrop-blur-md active:scale-95 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">BACK</span>
        </button>

        <h1 className="text-xl font-extrabold tracking-wider text-slate-100">DAILY PORTAL</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="w-24 h-24 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6">
          <Gift className="w-12 h-12 text-yellow-400 animate-bounce" />
        </div>

        <h2 className="text-2xl font-black text-slate-100 uppercase tracking-wider mb-2">DAILY CHECK-IN</h2>
        <p className="text-slate-400 text-center text-sm font-medium mb-8 max-w-[300px]">
          Come back daily to increase your streak and claim high value coin multipliers!
        </p>

        {/* 7-Days Progression visual tracking boards */}
        <div className="grid grid-cols-4 gap-3 w-full mb-8">
          {REWARD_CYCLE.map((reward, idx) => {
            const dayNum = idx + 1;
            const isCompleted = dayNum <= currentStreak;
            const isCurrentClaimable = dayNum === nextStreakLevel && !isClaimedToday;

            return (
              <div
                key={dayNum}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-950/30 border-green-500/40 text-green-400'
                    : isCurrentClaimable
                    ? 'bg-yellow-500/10 border-yellow-400/50 text-yellow-400 animate-pulse'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-black tracking-widest uppercase">DAY {dayNum}</span>
                <Coins className="w-4 h-4 my-1.5 fill-current" />
                <span className="font-black text-xs">+{reward}</span>
              </div>
            );
          })}
        </div>

        {/* Active main action trigger claim box */}
        {isClaimedToday ? (
          <div className="w-full bg-slate-900/40 border border-slate-800 text-slate-400 font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2">
            <Check className="w-5 h-5 text-green-500 stroke-[3]" />
            <span>CLAIMED TODAY</span>
          </div>
        ) : (
          <button
            onClick={handleClaimReward}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-4.5 px-6 rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <Coins className="w-5 h-5 fill-current" />
            <span>CLAIM +{rewardValue} COINS</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyReward;
