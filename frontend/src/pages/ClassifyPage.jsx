import React, { useState } from 'react';
import { classifyQuery } from '../utils/api';
import { CategoryBadge, SentimentBadge, PriorityBadge, StatusBadge, ConfidenceBar, Spinner } from '../components/ui';
import { CATEGORY_META } from '../data/mockData';

const SAMPLE_QUERIES = [
  { label: 'Order tracking', text: 'Bhai mera order #BL7823 ka kya hua? 3 din ho gaye koi update nahi' },
  { label: 'Payment failure', text: 'Money deducted from my account but order not placed. Very urgent!!' },
  { label: 'Refund request', text: 'I want a full refund. The product is completely different from what was shown on the website' },
  { label: 'Product quality', text: 'I found a foreign object inside the creatine tub. This is completely unacceptable' },
  { label: 'Delivery delay', text: "It's been 10 days and my protein powder still hasn't arrived. This is absolutely ridiculous" },
  { label: 'General inquiry', text: 'Is your whey protein suitable for lactose intolerant people? What about your isolate?' },
  { label: 'Subscription issue', text: 'I cancelled my subscription 2 weeks ago but still got charged this month. Need refund ASAP' },
];

const SOURCES = ['instagram', 'whatsapp', 'email', 'website'];

export default function ClassifyPage() {
  const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [source, setSource] = useState('website');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleClassify = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await classifyQuery({ message: message.trim(), customerName: customerName || 'Anonymous', source });
      setResult(res);
      setHistory(prev => [{ message, customerName, source, result: res, ts: new Date() }, ...prev.slice(0, 9)]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (q) => {
    setMessage(q.text);
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-beast-text tracking-tight">Live Query Classifier</h1>
        <p className="text-sm text-beast-muted mt-0.5">
          Test the AI classification pipeline with any customer message
        </p>
      </div>

      <div className="card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-beast-text">Classify a Query</h2>
        <div>
          <p className="text-xs text-beast-muted mb-2 font-mono">QUICK SAMPLES</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUERIES.map(q => (
              <button key={q.label} onClick={() => loadSample(q)}
                className="badge cursor-pointer hover:opacity-80 transition-opacity text-beast-dim border-beast-border border bg-beast-surface text-xs">
                {q.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-beast-muted font-mono uppercase tracking-wider mb-1">Customer Name</label>
            <input type="text" placeholder="e.g. Raj Sharma" value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full bg-beast-surface border border-beast-border rounded-lg px-3 py-2 text-sm text-beast-text
                placeholder:text-beast-muted focus:outline-none focus:border-beast-accent transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] text-beast-muted font-mono uppercase tracking-wider mb-1">Source Platform</label>
            <select value={source} onChange={e => setSource(e.target.value)}
              className="w-full bg-beast-surface border border-beast-border rounded-lg px-3 py-2 text-sm text-beast-dim
                focus:outline-none focus:border-beast-accent transition-colors">
              {SOURCES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-beast-muted font-mono uppercase tracking-wider mb-1">Customer Message</label>
          <textarea rows={4} placeholder="Paste or type a customer query here..."
            value={message} onChange={e => setMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleClassify(); }}
            className="w-full bg-beast-surface border border-beast-border rounded-lg px-3 py-2 text-sm text-beast-text
              placeholder:text-beast-muted focus:outline-none focus:border-beast-accent transition-colors resize-none" />
          <p className="text-[10px] text-beast-muted mt-1">⌘+Enter to classify</p>
        </div>

        <button onClick={handleClassify} disabled={loading || !message.trim()}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? <Spinner size={14} /> : '⚡'}
          {loading ? 'Classifying...' : 'Classify Query'}
        </button>
      </div>
      {result && (
        <div className="card p-5 border-beast-accent/30 animate-slide-up">
          <h2 className="text-sm font-semibold text-beast-text mb-4">Classification Result</h2>

          {result.classification && (
            <div className="space-y-4">
              <div className="bg-beast-surface rounded-xl p-4 border border-beast-border">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-beast-muted font-mono uppercase tracking-wider">Detected Category</p>
                  <span className="badge text-[10px] text-beast-muted border-beast-border border font-mono">
                    via {result.classification.method}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <CategoryBadge category={result.classification.category} />
                  <SentimentBadge sentiment={result.classification.sentiment} />
                  <PriorityBadge priority={result.classification.priority} />
                  <StatusBadge status={result.classification.escalated ? 'escalated' : 'auto_resolved'} />
                </div>

                <div className="mt-3">
                  <p className="text-[10px] text-beast-muted font-mono mb-1">CONFIDENCE SCORE</p>
                  <ConfidenceBar value={result.classification.confidence} />
                </div>
              </div>
              <div className="bg-beast-surface rounded-xl p-4 border border-beast-border">
                <p className="text-xs text-beast-muted font-mono uppercase tracking-wider mb-2">
                  ⚡ Generated Auto-Reply
                </p>
                <p className="text-sm text-beast-text leading-relaxed">{result.classification.autoReply}</p>
              </div>
              {result.classification.escalated && (
                <div className="rounded-xl p-4 border" style={{ background: '#ef444410', borderColor: '#ef444430' }}>
                  <p className="text-sm font-semibold text-red-400">🚨 Escalation Triggered</p>
                  <p className="text-xs text-beast-dim mt-1">
                    This query has been flagged for human agent review due to high priority classification or low confidence score.
                  </p>
                </div>
              )}

              {result.data?.queryId && (
                <div className="flex items-center gap-2 text-xs text-beast-muted font-mono">
                  <span>Query ID:</span>
                  <span className="text-beast-accent">{result.data.queryId}</span>
                  <span>·</span>
                  <span>Stored in {result.data.queryId ? 'memory store' : 'MongoDB'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {history.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-beast-text mb-4">
            Classification History
            <span className="text-beast-muted font-normal ml-2 font-mono text-xs">({history.length} queries this session)</span>
          </h2>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} onClick={() => { setMessage(h.message); setResult(h.result); }}
                className="flex items-center gap-3 p-3 rounded-lg bg-beast-surface hover:bg-beast-border/30 cursor-pointer transition-colors">
                <CategoryBadge category={h.result.classification?.category} />
                <p className="flex-1 text-xs text-beast-dim truncate">{h.message}</p>
                <span className="text-[10px] font-mono text-beast-muted flex-shrink-0">
                  {h.ts.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
