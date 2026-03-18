import React from 'react';
import { CATEGORY_META, SENTIMENT_META, SOURCE_META, STATUS_META, PRIORITY_META } from '../../data/mockData';

export function CategoryBadge({ category }) {
  const meta = CATEGORY_META[category] || { label: category, color: '#94a3b8', bg: '#94a3b815' };
  return (
    <span className="badge" style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.color}25` }}>
      {meta.label}
    </span>
  );
}

export function SentimentBadge({ sentiment }) {
  const meta = SENTIMENT_META[sentiment] || { label: sentiment, color: '#94a3b8' };
  return (
    <span className="badge" style={{ color: meta.color, background: `${meta.color}15`, border: `1px solid ${meta.color}25` }}>
      {meta.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, color: '#94a3b8' };
  return (
    <span className="badge" style={{ color: meta.color, background: `${meta.color}15`, border: `1px solid ${meta.color}25` }}>
      {meta.label.replace('_', ' ')}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority] || { label: priority, color: '#94a3b8' };
  return (
    <span className="badge font-mono" style={{ color: meta.color, background: `${meta.color}15`, border: `1px solid ${meta.color}25` }}>
      ● {meta.label}
    </span>
  );
}

export function SourceBadge({ source }) {
  const meta = SOURCE_META[source] || { label: source, color: '#94a3b8', icon: '?' };
  return (
    <span className="badge" style={{ color: meta.color, background: `${meta.color}15` }}>
      {meta.icon} {meta.label}
    </span>
  );
}

export function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin text-beast-accent">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
    </svg>
  );
}

export function LoadingCard({ height = 120 }) {
  return (
    <div className="card animate-pulse" style={{ height }}>
      <div className="h-full rounded-xl bg-beast-border/30" />
    </div>
  );
}

export function EmptyState({ message = 'No data available' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-beast-muted gap-3">
      <div className="text-4xl opacity-40">📭</div>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function StatCard({ label, value, sub, color = '#6366f1', icon }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <p className="text-xs text-beast-muted uppercase tracking-widest font-mono">{label}</p>
        {icon && <span className="text-lg opacity-60">{icon}</span>}
      </div>
      <p className="text-3xl font-bold tracking-tight" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-beast-dim">{sub}</p>}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-base font-semibold text-beast-text">{title}</h2>
        {subtitle && <p className="text-xs text-beast-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  const color = pct >= 90 ? '#10b981' : pct >= 75 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-beast-border rounded-full h-1.5">
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-mono" style={{ color }}>{pct}%</span>
    </div>
  );
}

export function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-beast-green opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-beast-green" />
    </span>
  );
}
