
import React from 'react';
import type { TranslationSet } from '../types';

interface SOSButtonProps {
  onClick: () => void;
  t: TranslationSet;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onClick, t }) => {
  return (
    <div className="text-center animate-fade-in">
        <div className="relative flex items-center justify-center w-64 h-64 md:w-72 md:h-72">
        <button
            onClick={onClick}
            className="relative z-10 w-48 h-48 md:w-56 md:h-56 bg-slate-800 rounded-full flex items-center justify-center text-white text-5xl font-black tracking-widest
            border-4 border-amber-500/50
            shadow-2xl shadow-amber-900/50 
            transition-transform transform 
            hover:scale-105 hover:bg-slate-700
            active:scale-95 
            focus:outline-none focus:ring-4 focus:ring-amber-400/50"
            style={{
                animation: 'pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1)',
            }}
        >
            {t.sos_button}
        </button>
        <style>{`
            @keyframes pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
                50% { box-shadow: 0 0 0 30px rgba(245, 158, 11, 0); }
            }
        `}</style>
        </div>
         <p className="mt-8 text-slate-400">{t.sos_button_subtitle}</p>
    </div>
  );
};

export default SOSButton;