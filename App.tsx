
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { translations } from './constants/translations';
import type { Contact, Language, Location } from './types';
import { getCurrentLocation, checkLocationPermission } from './services/locationService';
import { useSoundDetector } from './hooks/useSoundDetector';
import { useVoiceCommands } from './hooks/useVoiceCommands';
import EmergencyDashboard from './components/EmergencyDashboard';
import SOSButton from './components/SOSButton';
import SOSAlert from './components/SOSAlert';
import Header from './components/Header';
import { ShieldCheck, Settings } from 'lucide-react';

const LIVE_LOCATION_UPDATE_INTERVAL = 10000; // 10 seconds

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [isDashboardOpen, setDashboardOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'Jane Doe', phone: '111-222-3333' },
    { id: 2, name: 'John Smith', phone: '444-555-6666' },
  ]);
  const [settings, setSettings] = useState({
    isSoundDetectionEnabled: false,
    isVoiceCommandEnabled: false,
    isLiveLocationEnabled: true,
  });

  const [sosStatus, setSosStatus] = useState<'idle' | 'triggered' | 'error'>('idle');
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const liveLocationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const t = translations[language];

  const triggerSOS = useCallback(async () => {
    console.log('SOS Triggered!');
    setError(null);
    setSosStatus('triggered');

    // Geolocation API requires a secure context (HTTPS)
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      console.error('Insecure context. Geolocation is disabled.');
      setError(t.sos_error_insecure_context);
      setSosStatus('error');
      return;
    }

    try {
      const permissionState = await checkLocationPermission();
      if (permissionState === 'denied') {
        throw new Error('PERMISSION_DENIED');
      }

      const location = await getCurrentLocation();
      setUserLocation(location);
      console.log(`Initial location captured: https://www.google.com/maps?q=${location.latitude},${location.longitude}`);
      console.log('Simulating sending alerts to contacts:', contacts);
      
    } catch (err) {
      const errorCode = (err as Error).message;
      console.error('SOS Error Code:', errorCode);
      
      switch (errorCode) {
        case 'PERMISSION_DENIED':
          setError(t.sos_error_permission_denied);
          break;
        case 'POSITION_UNAVAILABLE':
          setError(t.sos_error_position_unavailable);
          break;
        case 'TIMEOUT':
          setError(t.sos_error_timeout);
          break;
        default:
          setError(t.sos_error_unknown);
          break;
      }
      setSosStatus('error');
    }
  }, [contacts, t]);

  useEffect(() => {
    const updateLiveLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
        console.log(`Live location update: https://www.google.com/maps?q=${location.latitude},${location.longitude}`);
        console.log('Simulating sending live location update to contacts:', contacts);
      } catch (err) {
        console.error('Failed to get live location update:', (err as Error).message);
      }
    };

    if (sosStatus === 'triggered' && settings.isLiveLocationEnabled) {
      liveLocationIntervalRef.current = setInterval(updateLiveLocation, LIVE_LOCATION_UPDATE_INTERVAL);
    }

    return () => {
      if (liveLocationIntervalRef.current) {
        clearInterval(liveLocationIntervalRef.current);
        liveLocationIntervalRef.current = null;
      }
    };
  }, [sosStatus, settings.isLiveLocationEnabled, contacts]);

  const resetSOS = () => {
    setSosStatus('idle');
    setUserLocation(null);
    setError(null);
  };

  useSoundDetector({
    enabled: settings.isSoundDetectionEnabled && sosStatus === 'idle',
    onSoundDetected: triggerSOS,
  });

  useVoiceCommands({
    enabled: settings.isVoiceCommandEnabled && sosStatus === 'idle',
    language: language,
    onCommand: triggerSOS,
  });

  return (
    <div className="min-h-screen w-full text-slate-100 flex flex-col selection:bg-amber-500/30">
      <Header
        t={t}
        language={language}
        setLanguage={setLanguage}
      />
      
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        {sosStatus === 'idle' ? (
          <SOSButton onClick={triggerSOS} t={t} />
        ) : (
          <SOSAlert
            status={sosStatus}
            location={userLocation}
            error={error}
            contacts={contacts}
            onReset={resetSOS}
            t={t}
            isLiveLocationActive={settings.isLiveLocationEnabled && sosStatus === 'triggered'}
          />
        )}
      </main>

      <footer className="w-full p-4 flex justify-between items-center text-slate-400 border-t border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
         <div className="flex items-center gap-2 text-sm">
            <ShieldCheck size={20} className={sosStatus === 'idle' ? 'text-sky-400' : 'text-amber-400'} />
            <span>{t.status_monitoring}</span>
        </div>
        <button onClick={() => setDashboardOpen(true)} className="flex items-center gap-2 text-sm hover:text-white transition-colors">
            <Settings size={20}/>
            <span>{t.dashboard_open}</span>
        </button>
      </footer>
      
      <EmergencyDashboard
        isOpen={isDashboardOpen}
        t={t}
        contacts={contacts}
        setContacts={setContacts}
        settings={settings}
        onSettingsChange={setSettings}
        onClose={() => setDashboardOpen(false)}
      />
    </div>
  );
};

export default App;