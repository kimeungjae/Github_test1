import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { cn } from '@/src/lib/utils';

interface ChartCardProps {
  title: string;
  data: any[];
  lines: { key: string; color: string; name: string }[];
  height?: number;
  className?: string;
  type?: 'line' | 'area';
}

export const SignalChart: React.FC<ChartCardProps> = ({ 
  title, 
  data, 
  lines, 
  height = 300, 
  className,
  type = 'line' 
}) => {
  return (
    <div className={cn("bg-white border border-slate-200 rounded-xl p-4 shadow-sm", className)}>
      <h3 className="text-xs font-bold text-slate-700 uppercase mb-4 flex items-center justify-between">
        {title}
        <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-400 uppercase tracking-widest">
          Live Stream
        </span>
      </h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickFormatter={(val) => val.toFixed(3) + 's'}
              />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px' }}
                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', marginTop: '-20px' }} />
              {lines.map(line => (
                <Line 
                  key={line.key}
                  type="monotone" 
                  dataKey={line.key} 
                  stroke={line.color} 
                  name={line.name}
                  dot={false}
                  strokeWidth={2}
                  animationDuration={300}
                />
              ))}
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                {lines.map(line => (
                  <linearGradient key={`grad-${line.key}`} id={`grad-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={line.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={line.color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              {lines.map(line => (
                <Area 
                  key={line.key}
                  type="monotone" 
                  dataKey={line.key} 
                  stroke={line.color} 
                  fill={`url(#grad-${line.key})`}
                  name={line.name}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
