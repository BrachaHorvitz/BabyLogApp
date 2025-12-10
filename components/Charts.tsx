
import React from 'react';
import { Log, LogType, DiaperSubType } from '../types';
import { t } from '../services/localization';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface StatsViewProps {
  logs: Log[];
}

// Helper to get last 7 days keys (YYYY-MM-DD)
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

// Helper to format date label (Mon, Tue...)
const formatDayLabel = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
};

const BarChart: React.FC<{ 
  data: ChartDataPoint[]; 
  color: string; 
  unit: string; 
  title: string;
  height?: number;
}> = ({ data, color, unit, title, height = 180 }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = 100 / data.length;
  
  return (
    <div className="bg-slate-900 p-6 rounded-3xl shadow-lg ring-1 ring-white/5">
      <div className="flex justify-between items-end mb-6">
         <h3 className="font-bold text-slate-100 text-lg">{title}</h3>
         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('last_7_days')}</span>
      </div>
      
      <div className="flex items-end space-x-2 relative" style={{ height: `${height}px` }}>
        {data.map((point, i) => {
          const barHeight = (point.value / maxValue) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center group">
              {/* Tooltip-ish value on top */}
              <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded absolute -top-4">
                {point.value}{unit}
              </div>
              
              {/* Bar */}
              <div 
                className={`w-full max-w-[24px] rounded-t-lg transition-all duration-500 ease-out hover:opacity-80 ${color}`}
                style={{ height: `${barHeight}%`, minHeight: point.value > 0 ? '4px' : '0' }}
              />
              
              {/* Label */}
              <div className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {point.label.slice(0, 1)}
              </div>
            </div>
          );
        })}
        
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between -z-10 opacity-20">
             <div className="border-t border-slate-500 w-full" />
             <div className="border-t border-slate-500 w-full" />
             <div className="border-t border-slate-500 w-full" />
             <div className="border-t border-slate-500 w-full" />
        </div>
      </div>
    </div>
  );
};

export const StatisticsView: React.FC<StatsViewProps> = ({ logs }) => {
  const days = getLast7Days();

  // Process Volume (Bottle + Pump)
  const volumeData: ChartDataPoint[] = days.map(date => {
    const dayLogs = logs.filter(l => l.created_at.startsWith(date) && (l.type === LogType.BOTTLE || l.type === LogType.PUMP));
    const total = dayLogs.reduce((acc, curr) => acc + (curr.amount_ml || 0), 0);
    return { label: formatDayLabel(date), value: total };
  });

  // Process Nursing Duration
  const nursingData: ChartDataPoint[] = days.map(date => {
    const dayLogs = logs.filter(l => l.created_at.startsWith(date) && l.type === LogType.NURSING);
    const totalSecs = dayLogs.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
    return { label: formatDayLabel(date), value: Math.round(totalSecs / 60) }; // in Minutes
  });

  // Process Diapers (Total counts)
  const last7DaysLogs = logs.filter(l => {
     const logDate = l.created_at.slice(0, 10);
     return days.includes(logDate);
  });
  
  const diaperLogs = last7DaysLogs.filter(l => l.type === LogType.DIAPER);
  const wetCount = diaperLogs.filter(l => l.sub_type === DiaperSubType.WET || l.sub_type === DiaperSubType.BOTH).length;
  const dirtyCount = diaperLogs.filter(l => l.sub_type === DiaperSubType.DIRTY || l.sub_type === DiaperSubType.BOTH).length;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-5 rounded-3xl shadow-sm ring-1 ring-white/5">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t('avg_vol')}</div>
            <div className="text-3xl font-bold text-slate-100">
                {Math.round(volumeData.reduce((a,b) => a + b.value, 0) / 7)}
                <span className="text-sm text-slate-500 ms-1">{t('ml')}</span>
            </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl shadow-sm ring-1 ring-white/5">
             <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t('avg_nurse')}</div>
             <div className="text-3xl font-bold text-slate-100">
                {Math.round(nursingData.reduce((a,b) => a + b.value, 0) / 7)}
                <span className="text-sm text-slate-500 ms-1">{t('min')}</span>
            </div>
        </div>
      </div>

      <BarChart 
        title={t('feeding_volume')} 
        data={volumeData} 
        unit={t('ml')} 
        color="bg-pink-500"
      />

      <BarChart 
        title={t('nursing_time')} 
        data={nursingData} 
        unit={t('min')} 
        color="bg-indigo-500"
      />

      {/* Diaper Stats */}
      <div className="bg-slate-900 p-6 rounded-3xl shadow-lg ring-1 ring-white/5">
         <h3 className="font-bold text-slate-100 text-lg mb-6">{t('diaper_count')}</h3>
         <div className="flex gap-4">
            <div className="flex-1 bg-slate-950/50 rounded-2xl p-4 border border-blue-500/20">
                <div className="text-blue-400 font-bold text-3xl mb-1">{wetCount}</div>
                <div className="text-slate-500 text-xs font-bold uppercase">{t('wet')}</div>
            </div>
            <div className="flex-1 bg-slate-950/50 rounded-2xl p-4 border border-amber-600/20">
                <div className="text-amber-500 font-bold text-3xl mb-1">{dirtyCount}</div>
                <div className="text-slate-500 text-xs font-bold uppercase">{t('dirty')}</div>
            </div>
         </div>
      </div>

    </div>
  );
};
