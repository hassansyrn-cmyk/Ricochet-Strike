import React from 'react';
import { Star, ShieldAlert, Award, RotateCcw, ArrowRight, Home } from 'lucide-react';

interface ResultScreenProps {
  isWin: boolean;
  score: number;
  starsEarned: number;
  message: string;
  bounceCount: number;
  levelId: number;
  onRetry: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  isWin,
  score,
  starsEarned,
  message,
  bounceCount,
  levelId,
  onRetry,
  onNext,
  onBackToLevels
}) => {
  return (
    <div className="absolute inset-0 bg-[#071324]/95 backdrop-blur-md flex flex-col justify-center items-center p-6 z-20 font-sans select-none text-slate-100 animate-fade-in">
      <div className="max-w-md w-full flex flex-col items-center text-center bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        {isWin ? (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4">
              <Award className="w-10 h-10 text-green-400 animate-pulse" />
            </div>

            <h1 className="text-3xl font-black text-green-400 tracking-wider uppercase mb-1">
              RICOCHET COMPLETE
            </h1>
            <p className="text-slate-400 font-medium text-sm mb-6">You hit the target with perfect bounces!</p>

            {/* Stars rating displays */}
            <div className="flex items-center gap-2.5 mb-8">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-12 h-12 stroke-[1.5] ${
                    s <= starsEarned
                      ? 'text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] scale-110'
                      : 'text-slate-600 fill-slate-800'
                  } transition duration-500`}
                />
              ))}
            </div>

            {/* Scoring & bouncing details breakdown */}
            <div className="w-full space-y-3 mb-8 bg-slate-950/60 border border-slate-800/40 rounded-2xl p-4 text-sm font-semibold">
              <div className="flex justify-between items-center text-slate-400 border-b border-slate-800/50 pb-2">
                <span>RICOCHETS</span>
                <span className="text-cyan-400 font-extrabold">{bounceCount}x</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>FINAL SCORE</span>
                <span className="text-yellow-400 font-extrabold text-lg">{score}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>

            <h1 className="text-3xl font-black text-red-500 tracking-wider uppercase mb-1">
              SHOT FAILED
            </h1>
            <p className="text-slate-400 font-medium text-sm mb-4">Direct hits or hazards triggered failure.</p>

            <div className="bg-red-950/20 border border-red-900/30 text-red-400 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest mb-8">
              {message || 'OUT OF AMMO'}
            </div>
          </>
        )}

        {/* Bottom controls dashboard CTA buttons */}
        <div className="w-full space-y-3">
          {isWin && levelId < 100 && (
            <button
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-4.5 px-6 rounded-2xl active:scale-98 transition duration-150 shadow-lg shadow-cyan-500/20"
            >
              <span>NEXT LEVEL</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold py-3.5 px-6 rounded-2xl active:scale-98 transition duration-150 border border-slate-700/40"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{isWin ? 'REPLAY LEVEL' : 'RETRY SHOT'}</span>
          </button>

          <button
            onClick={onBackToLevels}
            className="w-full flex items-center justify-center gap-2 bg-slate-950/80 hover:bg-slate-900 text-slate-400 font-semibold py-3 px-6 rounded-2xl active:scale-98 transition duration-150 border border-slate-900/60"
          >
            <Home className="w-4 h-4" />
            <span>LEVEL SELECTION</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
