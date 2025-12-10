
import { Log, LogType } from '../types';

const STORAGE_KEY = 'babylog_data';
const REMINDER_KEY = 'babylog_reminder_hours';
const LANGUAGE_KEY = 'babylog_language';

// Simulating Supabase interactions using LocalStorage for the demo
export const getLogs = (): Log[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLog = (log: Omit<Log, 'id' | 'created_at'> & { created_at?: string }): Log => {
  const logs = getLogs();
  const newLog: Log = {
    created_at: new Date().toISOString(), // Default fallback
    ...log,
    id: crypto.randomUUID(),
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
};
