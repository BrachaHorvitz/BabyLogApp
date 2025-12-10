import { Log, LogType } from '../types';

const STORAGE_KEY = 'babylog_data';
const REMINDER_KEY = 'babylog_reminder_hours';
const LANGUAGE_KEY = 'babylog_language';

// Polyfill for randomUUID if not available (e.g. non-secure context)
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getLogs = (): Log[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLog = (log: Omit<Log, 'id' | 'created_at'> & { created_at?: string }): Log => {
  const logs = getLogs();
  const newLog: Log = {
    created_at: new Date().toISOString(), // Default fallback
    ...log,
    id: generateUUID(),
  };
  // Prepend to list
  const updatedLogs = [newLog, ...logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
};

export const getLastNursingSide = (): 'LEFT' | 'RIGHT' | null => {
  const logs = getLogs();
  const lastNursing = logs.find(l => l.type === LogType.NURSING);
  if (!lastNursing) return null;
  return lastNursing.side || null;
};

// Reminder Settings
export const getReminderInterval = (): number => {
  const val = localStorage.getItem(REMINDER_KEY);
  return val ? parseFloat(val) : 0; // 0 means disabled
};

export const saveReminderInterval = (hours: number) => {
  localStorage.setItem(REMINDER_KEY, hours.toString());
};

// Language Settings
export const getLanguage = (): 'en' | 'he' => {
  return (localStorage.getItem(LANGUAGE_KEY) as 'en' | 'he') || 'en';
};

export const saveLanguage = (lang: 'en' | 'he') => {
  localStorage.setItem(LANGUAGE_KEY, lang);
  // Dispatch custom event to notify app of language change without reloading
  window.dispatchEvent(new Event('language-change'));
};