
import React from 'react';
import type { Contact, Location, TranslationSet } from '../types';
import { CheckCircle, AlertTriangle, Loader2, User, Map } from 'lucide-react';

interface SOSAlertProps {
  status: 'triggered' | 'error';
  location: Location | null;
  error: string | null;
  contacts: Contact[];
  onReset: () => void;
  t: TranslationSet;
  isLiveLocationActive: boolean;
}

const SOSAlert: React.FC<SOSAlertProps> = ({ status, location, error, contacts, onReset, t, isLiveLocationActive }) => {
  const mapLink = location
    ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    : '#';

  if (status === 'error') {
    return (
      <div className="w-full max-w-md p-6 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg text-center animate-slide-up flex flex-col items-center">
        <AlertTriangle className="h-16 w-16 text-amber-400" />
        <h2 className="mt-4 text-2xl font-bold text-amber-400">{t.sos_error_title}</h2>
        <p className="mt-2 text-slate-300 max-w-xs">{error}</p>
        <button
          onClick={onReset}
          className="mt-8 w-full max-w-xs bg-sky-500 text-white font-bold py-3 px-4 rounded-lg transition-colors hover:bg-sky-400"
        >
          {t.sos_reset_button}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-4 sm:p-6 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg animate-slide-up space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-sky-400" />
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-sky-400">{t.sos_triggered_title}</h2>
        <p className="mt-1 text-slate-300 text-sm sm:text-base">{t.sos_triggered_desc}</p>
      </div>
      
      {/* Location Card */}
      <div className="bg-slate-700/50 p-4 rounded-xl text-left">
          <h3 className="font-semibold text-slate-200 mb-2">{t.your_location}</h3>
          {location ? (
          <>
            <p className="text-slate-300 font-mono text-sm">{`${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`}</p>
            {isLiveLocationActive && (
                 <p className="text-xs text-sky-400 mt-2 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    {t.live_location_active}
                </p>
            )}
             <a href={mapLink} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 w-full bg-sky-500/20 text-sky-300 font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-sky-500/30">
                <Map size={16} />
                {t.map_button}
            </a>
          </>
        ) : (
          <p className="text-slate-400 flex items-center justify-center gap-2 py-2"><Loader2 className="animate-spin" size={20} /> Fetching location...</p>
        )}
      </div>

      {/* Contacts Card */}
      <div className="bg-slate-700/50 p-4 rounded-xl text-left">
        <h3 className="font-semibold text-slate-200 mb-2">{t.alerting_contacts}</h3>
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li key={contact.id} className="flex items-center gap-3">
              <User className="text-slate-400 flex-shrink-0" size={20} />
              <span className="text-slate-300 truncate">{contact.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-400/50"
      >
        {t.sos_reset_button}
      </button>
    </div>
  );
};

export default SOSAlert;