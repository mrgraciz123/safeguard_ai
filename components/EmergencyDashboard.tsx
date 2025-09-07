
import React, { useState } from 'react';
import type { Contact, TranslationSet } from '../types';
import { X, UserPlus, Trash2 } from 'lucide-react';

interface EmergencyDashboardProps {
  isOpen: boolean;
  t: TranslationSet;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  settings: {
    isSoundDetectionEnabled: boolean;
    isVoiceCommandEnabled: boolean;
    isLiveLocationEnabled: boolean;
  };
  onSettingsChange: (settings: EmergencyDashboardProps['settings']) => void;
  onClose: () => void;
}

const EmergencyDashboard: React.FC<EmergencyDashboardProps> = ({ isOpen, t, contacts, setContacts, settings, onSettingsChange, onClose }) => {
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const addContact = () => {
    if (newContactName.trim() && newContactPhone.trim()) {
      setContacts([
        ...contacts,
        { id: Date.now(), name: newContactName.trim(), phone: newContactPhone.trim() },
      ]);
      setNewContactName('');
      setNewContactPhone('');
    }
  };

  const removeContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const handleToggle = (setting: keyof typeof settings) => {
    onSettingsChange({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="w-full max-w-sm h-full bg-slate-900 shadow-2xl p-6 flex flex-col overflow-y-auto ml-auto"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideInRight 0.3s ease-out forwards' }}
      >
        <style>{`
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `}</style>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{t.emergency_dashboard}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Settings Card */}
        <div className="mb-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-amber-400 mb-4">{t.settings}</h3>
          <div className="space-y-3">
            <ToggleSwitch label={t.sound_detection} isEnabled={settings.isSoundDetectionEnabled} onToggle={() => handleToggle('isSoundDetectionEnabled')} />
            <ToggleSwitch label={t.voice_command} isEnabled={settings.isVoiceCommandEnabled} onToggle={() => handleToggle('isVoiceCommandEnabled')} />
            <ToggleSwitch label={t.live_location} isEnabled={settings.isLiveLocationEnabled} onToggle={() => handleToggle('isLiveLocationEnabled')} />
          </div>
        </div>

        {/* Emergency Contacts Card */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-amber-400 mb-4">{t.emergency_contacts}</h3>
          <div className="space-y-3 mb-4 overflow-y-auto flex-1">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                <div>
                  <p className="font-medium text-slate-100">{contact.name}</p>
                  <p className="text-sm text-slate-400">{contact.phone}</p>
                </div>
                <button onClick={() => removeContact(contact.id)} className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
             {contacts.length === 0 && <p className="text-slate-400 text-center py-4">No contacts added yet.</p>}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-700">
            <h4 className="font-semibold mb-3 flex items-center gap-2"><UserPlus size={18} /> {t.add_contact}</h4>
            <div className="space-y-3">
              <input
                type="text"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder={t.contact_name}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="tel"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                placeholder={t.contact_phone}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button onClick={addContact} className="w-full bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors hover:bg-amber-500">
                {t.add_contact}
              </button>
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-slate-500 text-center">{t.privacy_notice}</p>
      </div>
    </div>
  );
};

interface ToggleSwitchProps {
    label: string;
    isEnabled: boolean;
    onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, isEnabled, onToggle }) => (
    <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
        <label className="text-sm font-medium text-slate-300 pr-4">{label}</label>
        <button
            onClick={onToggle}
            className={`relative inline-flex items-center h-7 rounded-full w-12 transition-colors flex-shrink-0 ${
            isEnabled ? 'bg-amber-500' : 'bg-slate-600'
            }`}
        >
            <span
                className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);

export default EmergencyDashboard;