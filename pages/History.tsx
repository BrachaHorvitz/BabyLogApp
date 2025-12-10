import React, { useEffect, useState } from 'react';
import { getLogs } from '../services/storage';
import { Log, LogType } from '../types';
import { ScreenHeader, SegmentedControl } from '../components/UI';
import { StatisticsView } from '../components/Charts';
import { Baby, Droplets, Milk, Layers } from 'lucide-react';
import { t } from '../services/localization';

const History: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [view, setView] = useState<'log' | 'stats'>('log');

  useEffect(() => {
    // Reload logs whenever view changes to ensure fresh data
    const data = getLogs();
    setLogs(data);
  }, [view]); 

  const getIcon = (type: LogType) => {
    const baseClass = "w-5 h-5";
    switch (type) {
        case LogType.NURSING: return <Baby className={`${baseClass} text-indigo-400`} />;
        case LogType.BOTTLE: return <Milk className={`${baseClass} text-pink-400`} />;
        case LogType.PUMP: return <Droplets className={`${baseClass} text-cyan-400`} />;
        case LogType.DIAPER: return <Layers className={`${baseClass} text-yellow-400`} />;
    }
  };

  const getDetails = (log: Log) => {
    switch (log.type) {
        case LogType.NURSING:
            const m = Math.floor((log.duration_seconds || 0) / 60);
            return `${log.side === 'LEFT' ? t('left') : log.side === 'RIGHT' ? t('right') : 'Start'} • ${m} ${t('min')}`;
        case LogType.BOTTLE:
            return `${log.sub_type === 'BREAST_MILK' ? t('breast_milk') : t('formula')} • ${log.amount_ml}${t('ml')}`;
        case LogType.PUMP:
            return `${t('left_initial')}:${log.amount_ml_left || 0} / ${t('right_initial')}:${log.amount_ml_right || 0} • ${t('total_output')}: ${log.amount_ml}${t('ml')}`;
        case LogType.DIAPER:
            return log.sub_type === 'BOTH' ? t('both') : log.sub_type === 'WET' ? t('wet') : t('dirty');
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-full flex flex-col">
      <ScreenHeader title={t('history_title')} />
      
      <div className="mb-6">
        <SegmentedControl 
            value={view} 
            onChange={(v) => setView(v as 'log' | 'stats')}
            options={[
                { label: t('activity_log'), value: 'log' },
                { label: t('trends_stats'), value: 'stats' }
            ]}
        />
      </div>

      {view === 'stats' ? (
        <StatisticsView logs={logs} />
      ) : (
        <div className="flex-1 space-y-4 pb-24">
            {logs.length === 0 && (
                <div className="text-slate-500 text-center mt-20 text-lg font-medium">{t('no_logs_yet')}</div>
            )}
            {logs.map((log, index) => {
                const isDifferentDay = index === 0 || new Date(log.created_at).getDate() !== new Date(logs[index-1].created_at).getDate();
                return (
                    <div key={log.id} className="animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                        {isDifferentDay && (
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 mt-6 ms-1">
                                {new Date(log.created_at).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}
                            </div>
                        )}
                        <div className="bg-slate-900 active:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 mb-3 shadow-sm ring-1 ring-white/5 transition-colors">
                            <div className={`p-3 rounded-2xl ${
                                log.type === 'NURSING' ? 'bg-indigo-500/10' : 
                                log.type === 'BOTTLE' ? 'bg-pink-500/10' : 
                                log.type === 'DIAPER' ? 'bg-yellow-500/10' : 'bg-cyan-500/10'
                            }`}>
                                {getIcon(log.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="font-bold text-slate-200 capitalize text-base">{t(log.type === 'NURSING' ? 'nursing_title' : log.type === 'BOTTLE' ? 'bottle_title' : log.type === 'PUMP' ? 'pump_title' : 'diaper_title')}</span>
                                    <span className="text-xs font-medium text-slate-500">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }).toLowerCase()}</span>
                                </div>
                                <div className="text-sm text-slate-400 font-medium truncate">
                                    {getDetails(log)}
                                </div>
                                {log.notes && <div className="text-xs text-slate-500 mt-1 italic truncate">"{log.notes}"</div>}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      )}
    </div>
  );
};

export default History;