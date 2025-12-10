import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Pause, Play } from 'lucide-react';
import { Button, ScreenHeader } from '../components/UI';
import { LogType, Side } from '../types';
import { saveLog, getLastNursingSide } from '../services/storage';
import { t } from '../services/localization';

const Nursing: React.FC = () => {
  const [activeSide, setActiveSide] = useState<Side | null>(null);
  const [leftSeconds, setLeftSeconds] = useState(0);
  const [rightSeconds, setRightSeconds] = useState(0);
  const [lastSide, setLastSide] = useState<Side | null>(null);
  const [notes, setNotes] = useState('');
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const last = getLastNursingSide();
    setLastSide(last);
  }, []);

  useEffect(() => {
    if (activeSide) {
      intervalRef.current = setInterval(() => {
        if (activeSide === 'LEFT') setLeftSeconds(s => s + 1);
        else setRightSeconds(s => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeSide]);

  const toggleSide = (side: Side) => {
    if (activeSide === side) setActiveSide(null);
    else setActiveSide(side);
  };

  const handleSave = () => {
    const total = leftSeconds + rightSeconds;
    if (total === 0) return;
    const primarySide: Side = leftSeconds > 0 && rightSeconds === 0 ? 'LEFT' : (rightSeconds > 0 && leftSeconds === 0 ? 'RIGHT' : 'LEFT');

    saveLog({
      type: LogType.NURSING,
      side: primarySide,
      duration_seconds: total,
      notes: notes || undefined,
      amount_ml_left: leftSeconds,
    });

    setLeftSeconds(0);
    setRightSeconds(0);
    setActiveSide(null);
    setNotes('');
    setLastSide(primarySide);
    alert(t('saved'));
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 space-y-6">
      <ScreenHeader title={t('nursing_title')}>
        {lastSide && (
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('last_side')}</span>
             <span className="text-sm font-bold text-indigo-400">{lastSide === 'LEFT' ? t('left') : t('right')}</span>
          </div>
        )}
      </ScreenHeader>

      {/* Hero Timer */}
      <div className="flex justify-center py-6">
        <div className="relative">
             <div className="text-7xl font-mono font-bold text-slate-100 tracking-tighter tabular-nums">
                {formatTime(leftSeconds + rightSeconds)}
            </div>
            {activeSide && (
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        {t('active')}
                    </span>
                </div>
            )}
        </div>
      </div>

      {/* Big Toggle Pads */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        <button 
          onClick={() => toggleSide('LEFT')}
          className={`relative rounded-[32px] p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 min-h-[200px] ${
            activeSide === 'LEFT' 
            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 scale-[1.02]' 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
          }`}
        >
          <div className="text-4xl font-bold">{t('left_initial')}</div>
          <div className="font-mono text-lg opacity-80">{formatTime(leftSeconds)}</div>
          {/* Changed 'right-4' to 'end-4' which automatically handles RTL flipping */}
          {activeSide === 'LEFT' ? <Pause className="absolute top-4 end-4 w-5 h-5" /> : <Play className="absolute top-4 end-4 w-5 h-5 opacity-50" />}
        </button>

        <button 
          onClick={() => toggleSide('RIGHT')}
          className={`relative rounded-[32px] p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 min-h-[200px] ${
            activeSide === 'RIGHT' 
            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 scale-[1.02]' 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
          }`}
        >
          <div className="text-4xl font-bold">{t('right_initial')}</div>
          <div className="font-mono text-lg opacity-80">{formatTime(rightSeconds)}</div>
          {activeSide === 'RIGHT' ? <Pause className="absolute top-4 end-4 w-5 h-5" /> : <Play className="absolute top-4 end-4 w-5 h-5 opacity-50" />}
        </button>
      </div>

      {/* Footer Controls */}
      <div className="space-y-4 pt-4 mt-auto">
        <input 
          type="text" 
          placeholder={t('notes_placeholder')} 
          className="w-full bg-transparent border-b border-slate-800 text-slate-300 p-3 placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-colors"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        
        <div className="flex gap-4">
          <Button variant="secondary" className="aspect-square !px-0 w-16 !rounded-2xl" onClick={() => { setLeftSeconds(0); setRightSeconds(0); setActiveSide(null); }}>
            <RotateCcw className="w-6 h-6" />
          </Button>
          <Button variant="primary" className="flex-1 !rounded-2xl" size="lg" onClick={handleSave} disabled={leftSeconds + rightSeconds === 0}>
            {t('save_session')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Nursing;