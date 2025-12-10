import React, { useState } from 'react';
import { Button, ScreenHeader, Input } from '../components/UI';
import { LogType } from '../types';
import { saveLog } from '../services/storage';
import { t } from '../services/localization';

const Pumping: React.FC = () => {
  const [leftAmount, setLeftAmount] = useState<string>('');
  const [rightAmount, setRightAmount] = useState<string>('');
  const [notes, setNotes] = useState('');

  const total = (parseInt(leftAmount || '0') + parseInt(rightAmount || '0'));

  const handleSave = () => {
    if (total === 0) return;
    saveLog({
      type: LogType.PUMP,
      amount_ml: total,
      amount_ml_left: parseInt(leftAmount || '0'),
      amount_ml_right: parseInt(rightAmount || '0'),
      notes: notes || undefined,
    });
    setLeftAmount('');
    setRightAmount('');
    setNotes('');
    alert(t('saved'));
  };

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 space-y-6">
      <ScreenHeader title={t('pump_title')} />

      {/* Total Display */}
      <div className="flex justify-center py-6">
        <div className="flex flex-col items-center bg-slate-900 rounded-[32px] p-6 w-48 shadow-lg ring-1 ring-white/5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('total_output')}</span>
            <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-slate-100">{total}</span>
                <span className="text-xl font-medium text-slate-500">{t('ml')}</span>
            </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Input 
                label={t('left')}
                type="number"
                inputMode="numeric"
                value={leftAmount}
                onChange={(e) => setLeftAmount(e.target.value)}
                className="!text-3xl font-mono text-center !h-20"
                placeholder="0"
            />
        </div>
        <div className="space-y-2">
            <Input 
                label={t('right')}
                type="number"
                inputMode="numeric"
                value={rightAmount}
                onChange={(e) => setRightAmount(e.target.value)}
                className="!text-3xl font-mono text-center !h-20"
                placeholder="0"
            />
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <input 
          type="text" 
          placeholder={t('notes_placeholder')}
          className="w-full bg-transparent border-b border-slate-800 text-slate-300 p-3 placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-colors"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button variant="primary" size="lg" fullWidth onClick={handleSave} disabled={total === 0}>
          {t('save_log')}
        </Button>
      </div>
    </div>
  );
};

export default Pumping;