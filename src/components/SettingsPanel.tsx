import React from 'react';
import { Settings, ArrowLeft } from 'lucide-react';

interface SettingsPanelProps {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onToggleSound: () => void;
  onToggleVibration: () => void;
  onResetTutorial: () => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  soundEnabled,
  vibrationEnabled,
  onToggleSound,
  onToggleVibration,
  onResetTutorial,
  onClose
}) => {
  return (
    <div className="absolute inset-0 bg-[#071324]/95 backdrop-blur-md flex flex-col justify-center items-center p-6 z-20 font-sans select-none text-slate-100">
      <div className="max-w-md w-full flex flex-col bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">

        {/* Title */}
        <h2 className="text-2xl font-black text-center tracking-wider uppercase mb-8 flex items-center justify-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>SETTINGS</span>
        </h2>

        {/* Options list */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between bg-slate-950/40 border border-slate-800/40 p-4 rounded-2xl">
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-slate-200">SOUND EFFECTS</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Audio Synth Feedback</span>
            </div>
            <button
              onClick={onToggleSound}
              className={`font-black text-xs px-5 py-2.5 rounded-xl transition ${
                soundEnabled
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between bg-slate-950/40 border border-slate-800/40 p-4 rounded-2xl">
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-slate-200">VIBRATION HAPTICS</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Capacitor Feedback</span>
            </div>
            <button
              onClick={onToggleVibration}
              className={`font-black text-xs px-5 py-2.5 rounded-xl transition ${
                vibrationEnabled
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
              }`}
            >
              {vibrationEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between bg-slate-950/40 border border-slate-800/40 p-4 rounded-2xl">
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-slate-200">LAUNCH TUTORIAL</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Show helpful guide</span>
            </div>
            <button
              onClick={onResetTutorial}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700/50 transition active:scale-95"
            >
              RESET
            </button>
          </div>
        </div>

        {/* Back navigation button CTA */}
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 bg-slate-950/60 hover:bg-slate-950 text-slate-300 font-extrabold py-3.5 px-6 rounded-2xl border border-slate-800 transition active:scale-98"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>CLOSE SETTINGS</span>
        </button>

      </div>
    </div>
  );
};

export default SettingsPanel;
