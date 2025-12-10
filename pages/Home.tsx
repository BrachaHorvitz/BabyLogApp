
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Baby, Droplets, Layers, Bell, X, Globe, Settings, Milk, Moon } from 'lucide-react';
import { getLogs, getReminderInterval, saveReminderInterval, getLanguage, saveLanguage } from '../services/storage';
import { Log, LogType } from '../types';
import { t, isRTL } from '../services/localization';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [lastLog, setLastLog] = useState<Log | null>(null);
  const [lastFeed, setLastFeed] = useState<Log | null>(null);
  const [lastDiaper, setLastDiaper] = useState<Log | null>(null);
  const [lastSleep, setLastSleep] = useState<Log | null>(null);
  
  const [reminderHours, setReminderHours] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [now, setNow] = useState(new Date());
  
  const currentLang = getLanguage(); 
  const lastNotificationTimeRef = useRef<number>(0);
  const rtl = isRTL();

  useEffect(() => {
    setReminderHours(getReminderInterval());
    if ('Notification' in window) setPermission(Notification.permission);

    const loadData = () => {
      const logs = getLogs();
      setNow(new Date());
      if (logs.length > 0) {
        setLastLog(logs[0]);
        setLastFeed(logs.find(l => l.type === LogType.NURSING || l.type === LogType.BOTTLE) || null);
        setLastDiaper(logs.find(l => l.type === LogType.DIAPER) || null);
        setLastSleep(logs.find(l => l.type === LogType.SLEEP) || null);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (reminderHours === 0 || !lastFeed) return;
    const checkOverdue = () => {
      const diffMs = new Date().getTime() - new Date(lastFeed.created_at).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours >= reminderHours) {
        const timeSinceLastNotify = Date.now() - lastNotificationTimeRef.current;
        if (timeSinceLastNotify > 60 * 60 * 1000) {
            sendNotification();
            lastNotificationTimeRef.current = Date.now();
        }
      }
    };
    const notifyInterval = setInterval(checkOverdue, 60000); 
    checkOverdue();
    return () => clearInterval(notifyInterval);
  }, [reminderHours, lastFeed]);

  const sendNotification = () => {
    if (permission === 'granted') {
      new Notification('BabyLog Reminder', {
        body: `It's been over ${reminderHours} hours since the last feed.`,
        icon: '/favicon.ico'
      });
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const saveSettings = (hours: number) => {
    setReminderHours(hours);
    saveReminderInterval(hours);
    if (hours > 0 && permission === 'default') requestPermission();
  };
  
  const handleLanguageChange = (lang: 'en' | 'he') => {
    saveLanguage(lang);
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = (now.getTime() - new Date(dateStr).getTime()) / 60000;
    if (diff < 1) return 'Now';
    if (diff < 60) return `${Math.floor(diff)}m`;
    const hours = Math.floor(diff / 60);
    const mins = Math.floor(diff % 60);
    return `${hours}h ${mins}m`;
  };

  const getLastSleepTime = (log: Log) => {
    // If we have duration, the event time is usually the start time.
    // For "Last Sleep" dashboard, users care about when they woke up (end time).
    if (!log.duration_seconds) return log.created_at;
    const end = new Date(new Date(log.created_at).getTime() + log.duration_seconds * 1000);
    return end.toISOString();
  };

  const getNextFeedTime = () => {
    if (!lastFeed || reminderHours === 0) return null;
    return new Date(new Date(lastFeed.created_at).getTime() + reminderHours * 60 * 60 * 1000);
  };

  const nextFeed = getNextFeedTime();
  const isOverdue = nextFeed && now > nextFeed;

  const getLogSummary = (log: Log) => {
    switch (log.type) {
      case LogType.NURSING: return `${t('nursing_title')} • ${Math.floor((log.duration_seconds || 0) / 60)}${t('min')}`;
      case LogType.BOTTLE: return `${t('bottle_title')} • ${log.amount_ml}${t('ml')}`;
      case LogType.PUMP: return `${t('pump_title')} • ${log.amount_ml}${t('ml')}`;
      case LogType.DIAPER: return `${t('diaper_title')} • ${log.sub_type === 'BOTH' ? t('both') : log.sub_type === 'WET' ? t('wet') : t('dirty')}`;
      case LogType.SLEEP: return t('sleep_title');
      default: return 'Activity Logged';
    }
  };

  const getLogIcon = (type: LogType) => {
    switch (type) {
        case LogType.NURSING: return <Baby className="w-5 h-5 text-indigo-400" />;
        case LogType.BOTTLE: return <Milk className="w-5 h-5 text-pink-400" />;
        case LogType.PUMP: return <Droplets className="w-5 h-5 text-cyan-400" />;
        case LogType.DIAPER: return <Layers className="w-5 h-5 text-yellow-400" />;
        case LogType.SLEEP: return <Moon className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end pt-2 px-1">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">{t('app_name')}</h1>
          <p className="text-slate-400 text-sm font-medium">
             {now.getHours() < 12 ? t('greeting_morning') : now.getHours() < 18 ? t('greeting_afternoon') : t('greeting_evening')}
          </p>
        </div>
        <button 
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center active:scale-95 transition-all hover:bg-slate-700 hover:text-slate-200"
            aria-label={t('settings')}
        >
            <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Dashboard Status Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Last Feed */}
        <div className={`p-4 rounded-3xl flex flex-col items-center justify-between aspect-[3/4] shadow-lg relative overflow-hidden ${
             isOverdue 
             ? 'bg-gradient-to-b from-red-900/40 to-slate-900 ring-1 ring-red-500/30' 
             : 'bg-slate-900 ring-1 ring-white/5'
        }`}>
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-1">
                 {lastFeed?.type === 'BOTTLE' ? <Milk className="w-5 h-5 text-pink-400" /> : <Baby className="w-5 h-5 text-indigo-400" />}
             </div>
             <div className="text-center">
                 <div className="text-2xl font-bold text-slate-100 mb-0.5">{lastFeed ? getTimeAgo(lastFeed.created_at) : '--'}</div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('last_feed')}</div>
             </div>
             {/* Small overdue indicator dot */}
             {isOverdue && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
        </div>

        {/* Last Diaper */}
        <div className="p-4 rounded-3xl flex flex-col items-center justify-between aspect-[3/4] bg-slate-900 ring-1 ring-white/5 shadow-lg">
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-1">
                 <Layers className="w-5 h-5 text-yellow-400" />
             </div>
             <div className="text-center">
                 <div className="text-2xl font-bold text-slate-100 mb-0.5">{lastDiaper ? getTimeAgo(lastDiaper.created_at) : '--'}</div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('last_diaper')}</div>
             </div>
        </div>

        {/* Last Sleep */}
        <div className="p-4 rounded-3xl flex flex-col items-center justify-between aspect-[3/4] bg-slate-900 ring-1 ring-white/5 shadow-lg">
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-1">
                 <Moon className="w-5 h-5 text-purple-400" />
             </div>
             <div className="text-center">
                 <div className="text-2xl font-bold text-slate-100 mb-0.5">{lastSleep ? getTimeAgo(getLastSleepTime(lastSleep)) : '--'}</div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('last_sleep')}</div>
             </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={() => navigate('/nursing')}
                className="group relative bg-slate-800 p-5 rounded-3xl h-32 flex flex-col justify-between overflow-hidden shadow-lg transition-all active:scale-95"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-active:scale-90 transition-transform">
                    <Baby className="w-6 h-6" />
                </div>
                <div className="text-start">
                    <div className="font-bold text-slate-100 text-lg">{t('nursing_title')}</div>
                    <div className="text-indigo-300/60 text-xs font-medium">{t('nursing_timer')}</div>
                </div>
            </button>

            <button 
                onClick={() => navigate('/bottle')}
                className="group relative bg-slate-800 p-5 rounded-3xl h-32 flex flex-col justify-between overflow-hidden shadow-lg transition-all active:scale-95"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 group-active:scale-90 transition-transform">
                    <Milk className="w-6 h-6" />
                </div>
                <div className="text-start">
                    <div className="font-bold text-slate-100 text-lg">{t('bottle_title')}</div>
                    <div className="text-pink-300/60 text-xs font-medium">{t('bottle_log')}</div>
                </div>
            </button>

             {/* Sleep Button (Full Width) */}
             <button 
                onClick={() => navigate('/sleep')}
                className="col-span-2 group bg-slate-800 p-5 rounded-3xl h-24 flex items-center gap-4 shadow-lg active:scale-95 transition-all relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Moon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-start">
                     <div className="font-bold text-slate-100 text-base">{t('sleep_log')}</div>
                     <div className="text-xs text-purple-300/60 font-medium">{t('sleep_title')}</div>
                </div>
            </button>

            <button 
                onClick={() => navigate('/diaper')}
                className="group bg-slate-800 p-5 rounded-3xl h-24 flex items-center gap-4 shadow-lg active:scale-95 transition-all"
            >
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0">
                    <Layers className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-100 text-base text-start">{t('diaper_title')}</div>
            </button>

             <button 
                onClick={() => navigate('/pump')}
                className="group bg-slate-800 p-5 rounded-3xl h-24 flex items-center gap-4 shadow-lg active:scale-95 transition-all"
            >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Droplets className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-100 text-base text-start">{t('pump_title')}</div>
            </button>
      </div>

      {/* Recent Activity Section */}
      <div className="">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ms-1">{t('recent_activity')}</h3>
        <div className="space-y-3">
            {/* AI Insights Button Removed */}

            {lastLog && (
                <div className="bg-slate-900 p-4 rounded-3xl flex items-center gap-4 ring-1 ring-white/5">
                     <div className="bg-slate-800 p-2.5 rounded-2xl">
                        {getLogIcon(lastLog.type)}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-slate-200">{getLogSummary(lastLog)}</span>
                            <span className="text-xs text-slate-500 font-medium">{getTimeAgo(lastLog.created_at)}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 capitalize font-medium">
                            {lastLog.type === LogType.SLEEP ? t('sleep_title') : t(lastLog.type === 'NURSING' ? 'nursing_title' : lastLog.type === 'BOTTLE' ? 'bottle_title' : lastLog.type === 'PUMP' ? 'pump_title' : 'diaper_title')}
                        </div>
                     </div>
                </div>
            )}
            
            {!lastLog && (
                <div className="text-slate-500 text-center text-sm py-4 italic">
                    {t('no_logs_yet')}
                </div>
            )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowSettings(false)} />
            <div className="relative bg-slate-900 w-full max-w-md rounded-t-[32px] border-t border-slate-700/50 p-6 pb-12 animate-in slide-in-from-bottom duration-300 shadow-2xl overflow-y-auto max-h-[85vh]">
                <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6 opacity-50" />
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                        <Settings className="w-6 h-6 text-indigo-400" />
                        {t('settings')}
                    </h2>
                    <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-slate-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <Bell className="w-4 h-4" /> {t('reminders')}
                </h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {t('reminders_desc')}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    {[0, 2, 2.5, 3, 4].map((hours) => (
                        <button
                            key={hours}
                            onClick={() => saveSettings(hours)}
                            className={`p-4 rounded-2xl text-center font-bold transition-all ${
                                reminderHours === hours 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 scale-[1.02]' 
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {hours === 0 ? t('off') : `${hours} ${t('hours')}`}
                        </button>
                    ))}
                </div>

                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> {t('language')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleLanguageChange('en')}
                        className={`p-4 rounded-2xl text-center font-bold transition-all ${
                            currentLang === 'en'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 scale-[1.02]'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => handleLanguageChange('he')}
                        className={`p-4 rounded-2xl text-center font-bold transition-all ${
                            currentLang === 'he'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 scale-[1.02]'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        עברית
                    </button>
                </div>

            </div>
        </div>
      )}
    </div>
  );
};

export default Home;
