import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SectionHeader, LoadingCard } from '../ui';
import { format, parseISO } from 'date-fns';

const CATS = [
  { key: 'order_status',       color: '#6366f1', label: 'Order Status'       },
  { key: 'delivery_delay',     color: '#f59e0b', label: 'Delivery Delay'     },
  { key: 'refund_request',     color: '#ef4444', label: 'Refund Request'     },
  { key: 'product_complaint',  color: '#ec4899', label: 'Product Complaint'  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs shadow-xl min-w-32">
      <p className="font-mono text-beast-dim mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TrendChart({ data, loading, period }) {
  const [activeCats, setActiveCats] = useState(new Set(['order_status', 'delivery_delay', 'refund_request']));

  const toggle = (key) => {
    setActiveCats(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  if (loading) return <LoadingCard height={300} />;
  if (!data?.length) return null;

  const formatted = data.map(d => ({
    ...d,
    date: format(parseISO(d.date), 'd MMM'),
  }));
  const sampled = period === '90d' ? formatted.filter((_, i) => i % 3 === 0) : period === '30d' ? formatted.filter((_, i) => i % 1 === 0) : formatted;

  return (
    <div className="card p-5">
      <SectionHeader
        title="Query Trends"
        subtitle={`Daily volume over ${period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}`}
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {CATS.map(c => (
          <button key={c.key} onClick={() => toggle(c.key)}
            className="badge cursor-pointer transition-opacity"
            style={{
              color: c.color,
              background: activeCats.has(c.key) ? `${c.color}20` : 'transparent',
              border: `1px solid ${c.color}${activeCats.has(c.key) ? '60' : '25'}`,
              opacity: activeCats.has(c.key) ? 1 : 0.4,
            }}>
            {c.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={sampled} margin={{ left: -10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <Tooltip content={<CustomTooltip />} />
          {CATS.filter(c => activeCats.has(c.key)).map(c => (
            <Line key={c.key} type="monotone" dataKey={c.key} name={c.label}
              stroke={c.color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
