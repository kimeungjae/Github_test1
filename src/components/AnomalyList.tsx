import React from 'react';
import { AlertTriangle, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Anomaly } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface AnomalyListProps {
  anomalies: Anomaly[];
  onSelect: (anomaly: Anomaly) => void;
  selectedId?: string;
}

export const AnomalyList: React.FC<AnomalyListProps> = ({ anomalies, onSelect, selectedId }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detected Events</h3>
        <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">
          {anomalies.length} Critical
        </span>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {anomalies.map((anomaly) => (
          <button
            key={anomaly.id}
            onClick={() => onSelect(anomaly)}
            className={cn(
              "w-full text-left p-3 rounded-lg border transition-all duration-200 group",
              selectedId === anomaly.id
                ? "bg-slate-50 border-hanwha-orange shadow-sm"
                : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {anomaly.type === 'AI' ? (
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-xs font-bold text-slate-700">{anomaly.parameter} Error</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                T+{anomaly.timestamp.toFixed(3)}s
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-2 line-clamp-2">
              {anomaly.description}
            </p>
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
                anomaly.severity === 'HIGH' ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
              )}>
                {anomaly.severity} Priority
              </span>
              <div className="flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse" />
                 <span className="text-[9px] text-slate-500">Monitoring</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
