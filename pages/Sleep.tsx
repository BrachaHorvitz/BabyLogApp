
import React, { useState, useEffect } from 'react';
import { Moon, Clock, ArrowRight } from 'lucide-react';
import { Button, Card, ScreenHeader } from '../components/UI';
import { LogType } from '../types';
import { saveLog } from '../services/storage';
import { t, isRTL } from '../services/localization';

const Sleep: React.FC = () => {
  // Helpers for datetime-local strings
  const toLocalISO = (d: Date) => {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [startTime, setStartTime] = useState<string>(() => {
    const d = new Date();
    d.setHours(d.getHours() - 1); // Default to 1 hour ago
    return toLocalISO(d);
  });
  
  const [endTime, setEndTime] = useState<string>(() => toLocalISO(new Date()));
  const [notes, setNotes] = useState('');
  const [durationStr, setDurationStr] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (startTime && endTime) {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const diff = end - start;
        
        if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setDurationStr(`${hours}h ${mins}m`);
            setIsValid(true);
        } else {
            setDurationStr('--');
            setIsValid(false);
        }
    }
  }, [startTime, endTime]);

  const handleSave = () => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end.getTime() - start.getTime();

    if (diff <= 0) {
        alert(t('invalid_duration'));
        return;
    }

    saveLog({
      type: LogType.SLEEP,
      created_at: start.toISOString(),
      duration_seconds: diff / 1000,
      notes: notes || undefined,
    });
    
    alert(t('saved'));
    setNotes('');
    
    // Reset to "Now"
    const now = new Date();
    setEndTime(toLocalISO(now));
    const oneHourAgo = new Date(now);
    oneHourAgo.setHours(now.getHours() - 1);
    setStartTime(toLocalISO(oneHourAgo));
  };

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 space-y-6">
      <ScreenHeader title={t('sleep_log')} />

      {/* Duration Display */}
      <div className="flex justify-center py-6">
        <div className={`flex flex-col items-center bg-slate-900 rounded-[32px] p-8 w-64 shadow-lg ring-1 transition-all ${isValid ? 'ring-purple-500/30' : 'ring-red-500/30'}`}>
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                <Moon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('duration')}</span>
            <div className={`text-4xl font-bold font-mono ${isValid ? 'text-slate-100' : 'text-slate-600'}`}>
                {durationStr}
            </div>
        </div>
      </div>

      <Card className="flex flex-col gap-6 !bg-slate-900 shadow-xl">
         {/* Start Time */}
         <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ms-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div> {t('fell_asleep')}
            </label>
            <div className="bg-slate-950 rounded-2xl p-3 flex items-center ring-1 ring-white/5 focus-within:ring-indigo-500/50 transition-all">
                <Clock className="w-5 h-5 text-slate-500 me-3" />
                <input 
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-transparent text-slate-200 font-medium text-lg w-full outline-none [color-scheme:dark]"
                />
            </div>
         </div>

         {/* Visual Connector */}
         <div className="flex justify-center -my-2 opacity-20">
            <ArrowRight className={`w-5 h-5 text-slate-500 ${isRTL() ? 'rotate-180' : 'rotate-90'}`} />
         </div>

         {/* End Time */}
         <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ms-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]"></div> {t('woke_up')}
            </label>
            <div className="bg-slate-950 rounded-2xl p-3 flex items-center ring-1 ring-white/5 focus-within:ring-indigo-500/50 transition-all">
                <Clock className="w-5 h-5 text-purple-400 me-3" />
                <input 
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-transparent text-slate-200 font-medium text-lg w-full outline-none [color-scheme:dark]"
                />
            </div>
         </div>
      </Card>

      <div className="mt-auto space-y-4">
         <input 
          type="text" 
          placeholder={t('notes_placeholder')}
          className="w-full bg-transparent border-b border-slate-800 text-slate-300 p-3 placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-colors"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button variant="primary" size="lg" fullWidth onClick={handleSave} disabled={!isValid}>
          {t('save_log')}
        </Button>
      </div>
    </div>
  );
};

export default Sleep;
