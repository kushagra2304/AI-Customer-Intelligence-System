import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import KPIRow from '../components/dashboard/KPIRow';
import CategoryDistribution from '../components/charts/CategoryDistribution';
import TrendChart from '../components/charts/TrendChart';
import { SourceBreakdown, SentimentBreakdown } from '../components/charts/BreakdownCharts';
import { LiveDot, Spinner } from '../components/ui';

const PERIODS = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

export default function OverviewPage() {
  const [period, setPeriod] = useState('30d');
  const { analytics, trends, loading, refresh } = useAnalytics(period);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-beast-text tracking-tight">Intelligence Overview</h1>
          <p className="text-sm text-beast-muted mt-0.5">Customer support analytics powered by AI classification</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-beast-surface border border-beast-border rounded-lg overflow-hidden">
            {PERIODS.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                  period === p.value
                    ? 'bg-beast-accent text-white'
                    : 'text-beast-dim hover:text-beast-text'
                }`}>
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={refresh} className="btn-ghost flex items-center gap-2" disabled={loading}>
            {loading ? <Spinner size={14} /> : <span>↻</span>}
            Refresh
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-beast-muted">
        <LiveDot />
        <span className="font-mono">LIVE DASHBOARD · {analytics ? `${analytics.kpis.totalQueries} queries tracked` : 'Loading...'}</span>
      </div>
      <KPIRow kpis={analytics?.kpis} loading={loading} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <TrendChart data={trends} loading={loading} period={period} />
        </div>
        <div className="lg:col-span-2">
          <CategoryDistribution data={analytics?.categoryDistribution} loading={loading} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SourceBreakdown data={analytics?.sourceBreakdown} loading={loading} />
        <SentimentBreakdown data={analytics?.sentimentBreakdown} loading={loading} />
      </div>
      {analytics?.categoryDistribution && (
        <div className="card p-5">
          <h2 className="text-base font-semibold text-beast-text mb-4">Issue Summary Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-beast-muted font-mono uppercase tracking-wider border-b border-beast-border">
                  <th className="pb-3 pr-6 text-left">Issue Type</th>
                  <th className="pb-3 pr-6 text-right">Queries</th>
                  <th className="pb-3 pr-6 text-right">% of Total</th>
                  <th className="pb-3 pr-6 text-left">Distribution</th>
                  <th className="pb-3 text-left">AI Action</th>
                </tr>
              </thead>
              <tbody>
                {analytics.categoryDistribution.map(d => (
                  <tr key={d.category} className="border-b border-beast-border/40 hover:bg-beast-surface/40">
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="font-medium text-beast-text">{d.label}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-6 text-right font-mono text-beast-dim">{d.count}</td>
                    <td className="py-3 pr-6 text-right font-mono font-bold" style={{ color: d.color }}>
                      {d.percentage}%
                    </td>
                    <td className="py-3 pr-6" style={{ minWidth: 180 }}>
                      <div className="h-1.5 rounded-full bg-beast-border">
                        <div className="h-full rounded-full" style={{ width: `${d.percentage}%`, background: d.color }} />
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="badge text-[10px]" style={{
                        color: ['order_status','general_inquiry'].includes(d.category) ? '#10b981' : '#f59e0b',
                        background: ['order_status','general_inquiry'].includes(d.category) ? '#10b98115' : '#f59e0b15',
                      }}>
                        {['order_status','general_inquiry'].includes(d.category) ? '⚡ Auto-reply' : '🔀 Smart routing'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
