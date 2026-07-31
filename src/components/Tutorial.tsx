import React from 'react';
import { HelpCircle, Star, Zap, ShieldCheck, Play } from 'lucide-react';

interface TutorialProps {
  onDismiss: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onDismiss }) => {
  return (
    <div className="absolute inset-0 bg-[#071324]/98 backdrop-blur-md flex flex-col justify-center items-center p-6 z-30 font-sans select-none text-slate-100 animate-fade-in">
      <div className="max-w-md w-full flex flex-col bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">

        <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 mx-auto">
          <HelpCircle className="w-8 h-8 text-cyan-400" />
        </div>

        <h2 className="text-2xl font-black text-center tracking-wider uppercase mb-1">
          RICOCHET STRIKE
        </h2>
        <p className="text-slate-400 text-center font-semibold text-xs uppercase tracking-widest mb-6">
          Training Manual
        </p>

        {/* Tutorial guidelines list instructions */}
        <div className="space-y-4 mb-8 text-sm">
          <div className="flex gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/40">
            <Zap className="w-8 h-8 text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-extrabold text-slate-200 block mb-0.5">LAUNCHING CONTROLS</span>
              <p className="text-slate-400 text-xs leading-normal">
                Drag backward from the sling and release to shoot. Trajectory predicted dots will guide you.
              </p>
            </div>
          </div>

          <div className="flex gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/40">
            <ShieldCheck className="w-8 h-8 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-extrabold text-red-400 block mb-0.5">DIRECT HITS FORBIDDEN</span>
              <p className="text-slate-400 text-xs leading-normal font-medium">
                The projectile MUST bounce off at least one surface before hitting the target. A direct hit with 0 bounces fails immediately!
              </p>
            </div>
          </div>

          <div className="flex gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/40">
            <Star className="w-8 h-8 text-cyan-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-extrabold text-slate-200 block mb-0.5">BOUNCE MULTIPLIERS</span>
              <p className="text-slate-400 text-xs leading-normal">
                Bounces increase scores exponentially: 1 bounce (1x), 2 (2x), 3 (4x), 4 (8x), 5+ (16x). Complete with optimal ammo for 3-stars!
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onDismiss}
          className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-98 transition"
        >
          <span>START TRAINING</span>
          <Play className="w-4 h-4 fill-current" />
        </button>

      </div>
    </div>
  );
};

export default Tutorial;
