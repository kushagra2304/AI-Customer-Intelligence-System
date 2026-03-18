import React from 'react';
import { StatCard, LoadingCard } from '../ui';

export default function KPIRow({ kpis, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <LoadingCard key={i} height={100} />)}
      </div>
    );
  }

  if (!kpis) return null;

  const cards = [
    { label: 'Total Queries',      value: kpis.totalQueries.toLocaleString(),   sub: 'Last 30 days',                   color: '#6366f1',  icon: '📬' },
    { label: 'Auto Resolved',      value: `${kpis.automationRate}%`,             sub: `${kpis.autoResolved} queries`,   color: '#10b981',  icon: '⚡' },
    { label: 'Escalated',          value: `${kpis.escalationRate}%`,             sub: `${kpis.escalated} to humans`,    color: '#ef4444',  icon: '🔺' },
    { label: 'Resolution Rate',    value: `${kpis.resolutionRate}%`,             sub: 'Resolved or auto-handled',       color: '#0ea5e9',  icon: '✅' },
    { label: 'Avg Resolution',     value: `${kpis.avgResolutionHours}h`,         sub: 'Average response time',          color: '#f59e0b',  icon: '⏱' },
    { label: 'Urgent Queries',     value: kpis.urgentCount,                      sub: 'Need immediate attention',       color: '#dc2626',  icon: '🚨' },
    { label: 'Negative Sentiment', value: kpis.negativeCount,                    sub: 'Angry + Negative combined',      color: '#ec4899',  icon: '😤' },
    { label: 'Pending',            value: kpis.pending,                          sub: 'Awaiting response',              color: '#8b5cf6',  icon: '⏳' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(c => <StatCard key={c.label} {...c} />)}
    </div>
  );
}
