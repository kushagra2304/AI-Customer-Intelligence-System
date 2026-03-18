import React from 'react';
import { SectionHeader, LoadingCard } from '../ui';
import { CATEGORY_META } from '../../data/mockData';

const potentialColors = { high: '#10b981', medium: '#f59e0b', low: '#6b7280' };

const automationStrategies = [
  {
    icon: '🤖',
    title: 'Order Status Auto-Reply',
    description: 'Connect Shopify/WooCommerce webhook. When a query contains order ID, auto-fetch tracking status and reply instantly.',
    impact: '35% reduction',
    effort: 'Low',
    color: '#6366f1',
  },
  {
    icon: '🧠',
    title: 'RAG-powered FAQ Bot',
    description: 'Build a knowledge base from product docs + FAQs. Use ChromaDB + LangChain to answer general inquiries with semantic search.',
    impact: '22% reduction',
    effort: 'Medium',
    color: '#10b981',
  },
  {
    icon: '⚡',
    title: 'Refund Auto-Approval Rules',
    description: 'Auto-approve refunds < ₹500 within 30 days, no dispute. Reduces manual review for low-risk cases significantly.',
    impact: '18% reduction',
    effort: 'Medium',
    color: '#ef4444',
  },
  {
    icon: '🔔',
    title: 'Proactive Delay Alerts',
    description: 'Monitor courier APIs for shipment delays. Auto-notify customers before they complain with apology + ETA update.',
    impact: '40% prevention',
    effort: 'High',
    color: '#f59e0b',
  },
  {
    icon: '💳',
    title: 'Payment Failure Recovery',
    description: 'Detect failed transactions via payment gateway webhook. Auto-send retry link within 5 minutes with session preserved.',
    impact: '60% recovery',
    effort: 'Low',
    color: '#dc2626',
  },
  {
    icon: '🔄',
    title: 'Smart Escalation Routing',
    description: 'AI classifies urgency and sentiment. Urgent/angry queries skip queue and go directly to senior support agent.',
    impact: 'SLA < 1 hour',
    effort: 'Low',
    color: '#8b5cf6',
  },
];

export default function AutomationPanel({ automation, loading }) {
  if (loading) return <LoadingCard height={400} />;

  return (
    <div className="space-y-6">
      {automation && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Automation Rate',  value: `${automation.automationRate}%`,    color: '#10b981', desc: 'Queries handled by AI' },
            { label: 'Escalation Rate',  value: `${automation.escalationRate}%`,    color: '#ef4444', desc: 'Sent to human agents' },
            { label: 'Resolution Rate',  value: `${automation.resolutionRate}%`,    color: '#6366f1', desc: 'Fully resolved' },
            { label: 'Avg Response',     value: `${automation.avgResolutionHours}h`,color: '#f59e0b', desc: 'Average time to resolve' },
          ].map(k => (
            <div key={k.label} className="card p-4">
              <p className="text-[10px] text-beast-muted font-mono uppercase tracking-wider">{k.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: k.color }}>{k.value}</p>
              <p className="text-[10px] text-beast-dim mt-1">{k.desc}</p>
            </div>
          ))}
        </div>
      )}
      <div>
        <SectionHeader title="Automation Strategies" subtitle="Recommended AI workflows to reduce manual support load" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {automationStrategies.map((s) => (
            <div key={s.title} className="card p-4 hover:border-beast-accent/30 transition-colors duration-200 group">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-beast-text group-hover:text-white transition-colors">{s.title}</p>
                  <p className="text-xs text-beast-dim mt-1.5 leading-relaxed">{s.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="badge text-[10px]" style={{ color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                      📈 {s.impact}
                    </span>
                    <span className="badge text-[10px]" style={{
                      color: s.effort === 'Low' ? '#10b981' : s.effort === 'Medium' ? '#f59e0b' : '#ef4444',
                      background: s.effort === 'Low' ? '#10b98115' : s.effort === 'Medium' ? '#f59e0b15' : '#ef444415',
                    }}>
                      Effort: {s.effort}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {automation?.opportunities?.length > 0 && (
        <div>
          <SectionHeader title="Data-Driven Priorities" subtitle="Based on your actual query distribution" />
          <div className="space-y-3">
            {automation.opportunities.map((opp, i) => {
              const meta = CATEGORY_META[opp.category] || {};
              return (
                <div key={opp.category} className="card p-4 flex items-center gap-4">
                  <div className="text-xl font-black text-beast-border w-7 font-mono">#{i + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge text-xs" style={{ color: meta.color, background: meta.bg }}>
                        {opp.label || opp.category}
                      </span>
                      <span className="badge text-[10px]" style={{
                        color: potentialColors[opp.automationPotential],
                        background: `${potentialColors[opp.automationPotential]}15`,
                      }}>
                        {opp.automationPotential?.toUpperCase()} potential
                      </span>
                    </div>
                    <p className="text-xs text-beast-dim leading-relaxed">{opp.suggestedAction}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold" style={{ color: meta.color }}>{opp.percentage}%</p>
                    <p className="text-[10px] text-beast-muted font-mono">{opp.count} queries</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
