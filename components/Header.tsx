
import React from 'react';
import type { Language, TranslationSet } from '../types';
import { ShieldAlert } from 'lucide-react';

interface HeaderProps {
  t: TranslationSet;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ t, language, setLanguage }) => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
      <div className="flex items-center gap-2">
        <ShieldAlert className="text-amber-400" size={24}/>
        <h1 className="text-xl font-bold text-slate-200 tracking-wide">{t.app_title}</h1>
      </div>
      <div className="flex items-center text-sm border border-slate-600 rounded-full bg-slate-800/50">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-full transition-colors ${language === 'en' ? 'bg-amber-500 text-white' : 'text-slate-300'}`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('hi')}
          className={`px-3 py-1 rounded-full transition-colors ${language === 'hi' ? 'bg-amber-500 text-white' : 'text-slate-300'}`}
        >
          HI
        </button>
      </div>
    </header>
  );
};

export default Header;