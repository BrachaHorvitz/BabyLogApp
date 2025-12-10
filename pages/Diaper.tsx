import React, { useState } from 'react';
import { Droplets, CloudRain, Wind } from 'lucide-react'; 
import { Button, ScreenHeader } from '../components/UI';
import { LogType, DiaperSubType } from '../types';
import { saveLog } from '../services/storage';
import { t } from '../services/localization';

const Diaper: React.FC = () => {
  const [notes, setNotes] = useState('');

  const handleSave = (subType: DiaperSubType) => {
    saveLog({
      type: LogType.DIAPER,
      sub_type: subType,
      notes: notes || undefined,
    });
    setNotes('');
    alert(t('saved'));
  };

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 space-y-6">
      <ScreenHeader title={t('diaper_title')} />

      <div className="flex flex-col gap-4 flex-1 justify-center">
        <button 
            onClick={() => handleSave(DiaperSubType.WET)}
            className="group relative bg-slate-800 hover:bg-slate-800/80 active:scale-[0.98] transition-all h-28 rounded-3xl overflow-hidden shadow-lg border-s-4 border-blue-500"
        >
             <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
             <div className="flex items-center px-6 sm:px-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 me-6 shrink-0">
                    <Droplets className="w-8 h-8" fill="currentColor" fillOpacity={0.2} />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-2xl font-bold text-slate-100">{t('wet')}</span>
                    <span className="text-sm font-medium text-slate-500">{t('wet_desc')}</span>
                </div>
             </div>
        </button>

        <button 
            onClick={() => handleSave(DiaperSubType.DIRTY)}
            className="group relative bg-slate-800 hover:bg-slate-800/80 active:scale-[0.98] transition-all h-28 rounded-3xl overflow-hidden shadow-lg border-s-4 border-amber-600"
        >
             <div className="absolute inset-0 bg-amber-600/5 group-hover:bg-amber-600/10 transition-colors" />
             <div className="flex items-center px-6 sm:px-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-amber-600/20 flex items-center justify-center text-amber-500 me-6 shrink-0">
                    <Wind className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-2xl font-bold text-slate-100">{t('dirty')}</span>
                    <span className="text-sm font-medium text-slate-500">{t('dirty_desc')}</span>
                </div>
             </div>
        </button>

        <button 
             onClick={() => handleSave(DiaperSubType.BOTH)}
             className="group relative bg-slate-800 hover:bg-slate-800/80 active:scale-[0.98] transition-all h-28 rounded-3xl overflow-hidden shadow-lg border-s-4 border-orange-500"
        >
             <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors" />
             <div className="flex items-center px-6 sm:px-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 me-6 shrink-0">
                    <CloudRain className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-2xl font-bold text-slate-100">{t('both')}</span>
                    <span className="text-sm font-medium text-slate-500">{t('both_desc')}</span>
                </div>
             </div>
        </button>
      </div>

      <div className="mt-auto">
         <input 
          type="text" 
          placeholder={t('diaper_notes')}
          className="w-full bg-transparent border-b border-slate-800 text-slate-300 p-3 placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-colors mb-4"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Diaper;