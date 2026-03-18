import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { SectionHeader, LoadingCard } from '../ui';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="card px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-beast-text">{d.label}</p>
      <p className="font-mono" style={{ color: d.color }}>{d.percentage}% · {d.count} queries</p>
    </div>
  );
};

export default function CategoryDistribution({ data, loading }) {
  const [view, setView] = useState('pie');

  if (loading) return <LoadingCard height={320} />;
  if (!data?.length) return null;

  return (
    <div className="card p-5">
      <SectionHeader
        title="Issue Distribution"
        subtitle="% of total queries by category"
        action={
          <div className="flex gap-1">
            {['pie', 'bar'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`btn-ghost text-xs px-2 py-1 ${view === v ? 'bg-beast-border text-beast-text' : ''}`}>
                {v === 'pie' ? '◉' : '▬'} {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        }
      />

      {view === 'pie' ? (
        <div className="flex gap-6 items-center">
          <div className="flex-shrink-0" style={{ width: 200, height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="count" paddingAngle={2} strokeWidth={0}>
                  {data.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2.5">
            {data.map(d => (
              <div key={d.category}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-beast-text font-medium">{d.label}</span>
                  <span className="font-mono" style={{ color: d.color }}>{d.percentage}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-beast-border overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.percentage}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickFormatter={v => `${v}%`} domain={[0, 40]} />
            <YAxis type="category" dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Syne' }}
              width={130} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e1e2e' }} />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]} maxBarSize={22}>
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
