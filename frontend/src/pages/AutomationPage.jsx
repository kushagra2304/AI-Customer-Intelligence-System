import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import AutomationPanel from '../components/dashboard/AutomationPanel';

export default function AutomationPage() {
  const { automation, loading } = useAnalytics('30d');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-beast-text tracking-tight">
          Automation Playbook
        </h1>
        <p className="text-sm text-beast-muted mt-0.5">
          AI-powered strategies to reduce manual support workload
        </p>
      </div>
      <div className="card p-5">
        <h2 className="text-base font-semibold text-beast-text mb-4">
          System Workflow Architecture
        </h2>

        <div className="w-full overflow-x-auto">
          <img
            src="/architecture.svg"
            alt="System Architecture"
            className="w-full max-w-5xl mx-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: '⚛️', name: 'React', role: 'Dashboard UI' },
          { icon: '🟩', name: 'Node.js', role: 'API Server' },
          { icon: '🍃', name: 'MongoDB', role: 'Data Storage' },
          { icon: '🦜', name: 'LangChain', role: 'AI Orchestration' },
          { icon: '🎨', name: 'ChromaDB', role: 'Vector Search' },
          { icon: '🤖', name: 'GPT-4o-mini', role: 'LLM Classifier' },
        ].map(t => (
          <div key={t.name} className="card p-3 text-center hover:border-beast-accent/30 transition-colors">
            <div className="text-2xl mb-1.5">{t.icon}</div>
            <p className="text-xs font-bold text-beast-text">{t.name}</p>
            <p className="text-[10px] text-beast-muted mt-0.5">{t.role}</p>
          </div>
        ))}
      </div>

      <AutomationPanel automation={automation} loading={loading} />

      <div className="card p-5">
        <h2 className="text-base font-semibold text-beast-text mb-4">
          Scalability Design
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Horizontal API Scaling',
              icon: '📡',
              color: '#6366f1',
              points: [
                'Stateless Express API — spin up N instances behind load balancer',
                'Session state in Redis, not in-process memory',
                'BullMQ job queue absorbs traffic spikes without dropping requests',
                'Auto-scale on AWS ECS / GCP Cloud Run based on CPU/memory',
              ],
            },
            {
              title: 'Vector DB Growth',
              icon: '🧬',
              color: '#10b981',
              points: [
                'ChromaDB handles millions of embeddings natively',
                'Each stored query improves future semantic matching accuracy',
                'Persistent volume ensures embeddings survive restarts',
                'Can migrate to Pinecone / Weaviate for enterprise scale',
              ],
            },
            {
              title: 'MongoDB at Scale',
              icon: '🍃',
              color: '#f59e0b',
              points: [
                'Compound indexes on category + createdAt for fast aggregations',
                'Atlas time-series collections for trend data',
                'Shard by source platform as volume grows past 10M docs',
                'Atlas Search for full-text query search at millisecond speed',
              ],
            },
            {
              title: 'AI Cost Optimization',
              icon: '💰',
              color: '#ec4899',
              points: [
                'Keyword classifier handles 80% of queries at zero LLM cost',
                'LangChain only invoked for ambiguous / low-confidence queries',
                'Batch classification for CSV uploads — single API round-trip',
                'Cache common query embeddings in Redis to avoid re-computation',
              ],
            },
          ].map(s => (
            <div key={s.title} className="bg-beast-surface border border-beast-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{s.icon}</span>
                <h3 className="text-sm font-semibold" style={{ color: s.color }}>
                  {s.title}
                </h3>
              </div>

              <ul className="space-y-2">
                {s.points.map((p, i) => (
                  <li key={i} className="flex gap-2 text-xs text-beast-dim leading-relaxed">
                    <span style={{ color: s.color }} className="flex-shrink-0 mt-0.5">›</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}