import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import TrendChart from '../components/charts/TrendChart';
import CategoryDistribution from '../components/charts/CategoryDistribution';
import { SourceBreakdown, SentimentBreakdown } from '../components/charts/BreakdownCharts';
import { LoadingCard } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STATUS_META } from '../data/mockData';

const PERIODS = ['7d', '30d', '90d'];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');
  const { analytics, trends, loading } = useAnalytics(period);

  const statusData = analytics?.statusBreakdown?.map(s => ({
    ...s,
    label: STATUS_META[s.status]?.label || s.status,
    color: STATUS_META[s.status]?.color || '#94a3b8',
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-beast-text tracking-tight">Deep Analytics</h1>
          <p className="text-sm text-beast-muted mt-0.5">Detailed breakdown of customer support patterns</p>
        </div>
        <div className="flex bg-beast-surface border border-beast-border rounded-lg overflow-hidden">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-mono transition-colors ${period === p ? 'bg-beast-accent text-white' : 'text-beast-dim hover:text-beast-text'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <TrendChart data={trends} loading={loading} period={period} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryDistribution data={analytics?.categoryDistribution} loading={loading} />
        <div className="card p-5">
          <h2 className="text-base font-semibold text-beast-text mb-4">Resolution Status</h2>
          {loading ? <LoadingCard height={220} /> : statusData && (
            <div className="space-y-3">
              {statusData.map(d => (
                <div key={d.status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-beast-text font-medium">{d.label}</span>
                    <span className="font-mono" style={{ color: d.color }}>{d.percentage}% · {d.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-beast-border overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${d.percentage}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SourceBreakdown data={analytics?.sourceBreakdown} loading={loading} />
        <SentimentBreakdown data={analytics?.sentimentBreakdown} loading={loading} />
      </div>
      {trends && (
        <div className="card p-5">
          <h2 className="text-base font-semibold text-beast-text mb-4">Daily Query Volume</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trends.slice(-14)} margin={{ left: -15, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip
                contentStyle={{ background: '#16161f', border: '1px solid #1e1e2e', borderRadius: 8, fontSize: 12, fontFamily: 'JetBrains Mono' }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#ff4d00' }}
              />
              <Bar dataKey="total" name="Queries" fill="#ff4d00" radius={[3, 3, 0, 0]} maxBarSize={28}>
                {trends.slice(-14).map((_, i) => (
                  <Cell key={i} fill={`rgba(255,77,0,${0.4 + (i / 14) * 0.6})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
