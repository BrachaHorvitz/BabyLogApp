import React, { useState } from 'react';
import { Milk, Droplets, Clock } from 'lucide-react';
import { Button, Card, ScreenHeader } from '../components/UI';
import { LogType, BottleSubType } from '../types';
import { saveLog } from '../services/storage';
import { t } from '../services/localization';

const Bottle: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [subType, setSubType] = useState<BottleSubType>(BottleSubType.FORMULA);
  const [notes, setNotes] = useState('');
  
  const [date, setDate] = useState<string>(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  const handleSave = () => {
    if (!amount) return;
    const logDate = new Date(date);
    
    saveLog({
      type: LogType.BOTTLE,
      sub_type: subType,
      amount_ml: parseInt(amount),
      notes: notes || undefined,
      created_at: logDate.toISOString(),
    });
    setAmount('');
    setNotes('');
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDate(now.toISOString().slice(0, 16));
    alert(t('saved'));
  };

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 space-y-6">
      <ScreenHeader title={t('bottle_title')} />

      {/* Date Picker (Inline Style) */}
      <div className="bg-slate-900 rounded-2xl p-2 flex items-center">
         <div className="w-10 h-10 flex items-center justify-center text-slate-500"><Clock className="w-5 h-5" /></div>
         <input 
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-slate-300 font-medium text-sm w-full outline-none [color-scheme:dark]"
         />
      </div>

      <Card className="flex flex-col gap-8 py-8 items-center !bg-slate-900 shadow-xl">
        {/* Toggle Segmented Control */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1.5 rounded-2xl w-full">
          <button
            onClick={() => setSubType(BottleSubType.FORMULA)}
            className={`flex items-center justify-center py-3 rounded-xl text-sm font-bold transition-all ${
              subType === BottleSubType.FORMULA ? 'bg-slate-800 text-indigo-400 shadow-md' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Droplets className="w-4 h-4 me-2" fill="currentColor" fillOpacity={0.2} />
            {t('formula')}
          </button>
          <button
            onClick={() => setSubType(BottleSubType.BREAST_MILK)}
            className={`flex items-center justify-center py-3 rounded-xl text-sm font-bold transition-all ${
              subType === BottleSubType.BREAST_MILK ? 'bg-slate-800 text-pink-400 shadow-md' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Milk className="w-4 h-4 me-2" fill="currentColor" fillOpacity={0.2} />
            {t('breast_milk')}
          </button>
        </div>

        {/* Amount Display */}
        <div className="flex flex-col items-center gap-2">
            <div className="relative">
                <input
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-slate-100 text-7xl font-mono font-bold text-center w-48 outline-none placeholder:text-slate-800 transition-all focus:scale-110"
                placeholder="0"
                />
            </div>
            <span className="text-slate-500 font-bold tracking-widest text-sm uppercase">
              {t('ml') === 'mL' ? 'MILLILITERS' : 'מיליליטרים'}
            </span>
        </div>
        
        {/* Quick Add Buttons */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {[30, 60, 90, 120].map(val => (
            <button 
              key={val}
              onClick={() => setAmount(val.toString())}
              className="bg-slate-800 active:bg-slate-700 text-slate-300 py-3 rounded-xl text-sm font-bold transition-colors"
            >
              {val}
            </button>
          ))}
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
        <Button variant="primary" size="lg" fullWidth onClick={handleSave} disabled={!amount}>
          {t('save_log')}
        </Button>
      </div>
    </div>
  );
};

export default Bottle;