export interface Contact {
  id: number;
  name: string;
  phone: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export type Language = 'en' | 'hi';

export interface TranslationSet {
  app_title: string;
  sos_button: string;
  sos_button_subtitle: string;
  emergency_dashboard: string;
  dashboard_open: string;
  emergency_contacts: string;
  add_contact: string;
  contact_name: string;
  contact_phone: string;
  remove: string;
  settings: string;
  sound_detection: string;
  voice_command: string;
  live_location: string;
  privacy_notice: string;
  close: string;
  status_monitoring: string;
  sos_triggered_title: string;
  sos_triggered_desc: string;
  your_location: string;
  map_button: string;
  alerting_contacts: string;
  sos_error_title: string;
  sos_error_permission_denied: string;
  sos_error_position_unavailable: string;
  sos_error_timeout: string;
  sos_error_insecure_context: string;
  sos_error_unknown: string;
  sos_reset_button: string;
  live_location_active: string;
}

export type Translations = {
  [key in Language]: TranslationSet;
};