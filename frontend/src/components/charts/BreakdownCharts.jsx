import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { SectionHeader, LoadingCard } from '../ui';
import { SOURCE_META, SENTIMENT_META } from '../../data/mockData';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="card px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-beast-text">{d.label || d.source || d.sentiment}</p>
      <p className="font-mono text-beast-accent">{d.percentage}% · {d.count}</p>
    </div>
  );
};

export function SourceBreakdown({ data, loading }) {
  if (loading) return <LoadingCard height={220} />;
  if (!data?.length) return null;

  const enriched = data.map(d => ({
    ...d,
    label: SOURCE_META[d.source]?.label || d.source,
    color: SOURCE_META[d.source]?.color || '#94a3b8',
    icon: SOURCE_META[d.source]?.icon || '?',
  }));

  return (
    <div className="card p-5">
      <SectionHeader title="Query Sources" subtitle="Channel breakdown" />
      <div className="space-y-3">
        {enriched.map(d => (
          <div key={d.source} className="flex items-center gap-3">
            <span className="text-base w-6 text-center">{d.icon}</span>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-beast-text">{d.label}</span>
                <span className="font-mono" style={{ color: d.color }}>{d.percentage}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-beast-border">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${d.percentage}%`, background: d.color }} />
              </div>
            </div>
            <span className="text-xs font-mono text-beast-muted w-8 text-right">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SentimentBreakdown({ data, loading }) {
  if (loading) return <LoadingCard height={220} />;
  if (!data?.length) return null;

  const enriched = data.map(d => ({
    ...d,
    label: SENTIMENT_META[d.sentiment]?.label || d.sentiment,
    color: SENTIMENT_META[d.sentiment]?.color || '#94a3b8',
  }));

  const icons = { positive: '😊', neutral: '😐', negative: '😟', angry: '😡' };

  return (
    <div className="card p-5">
      <SectionHeader title="Sentiment Analysis" subtitle="Customer mood distribution" />
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0" style={{ width: 120, height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={enriched} cx="50%" cy="50%" innerRadius={32} outerRadius={52}
                dataKey="count" paddingAngle={3} strokeWidth={0}>
                {enriched.map((entry) => (
                  <Cell key={entry.sentiment} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2.5">
          {enriched.map(d => (
            <div key={d.sentiment} className="flex items-center gap-2">
              <span className="text-sm">{icons[d.sentiment] || '•'}</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-beast-text">{d.label}</span>
                  <span className="font-mono" style={{ color: d.color }}>{d.percentage}%</span>
                </div>
                <div className="h-1 rounded-full bg-beast-border">
                  <div className="h-full rounded-full" style={{ width: `${d.percentage}%`, background: d.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
