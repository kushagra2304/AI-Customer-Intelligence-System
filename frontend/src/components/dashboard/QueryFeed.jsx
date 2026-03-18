import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CategoryBadge, SentimentBadge, StatusBadge, PriorityBadge, SourceBadge, ConfidenceBar, LoadingCard, EmptyState } from '../ui';

export default function QueryFeed({ queries, loading, pagination, onPageChange }) {
  if (loading) return <LoadingCard height={400} />;
  if (!queries?.length) return <EmptyState message="No queries found" />;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-beast-border text-xs text-beast-muted font-mono uppercase tracking-wider">
              <th className="pb-3 pr-4 text-left font-medium">Customer</th>
              <th className="pb-3 pr-4 text-left font-medium">Message</th>
              <th className="pb-3 pr-4 text-left font-medium">Category</th>
              <th className="pb-3 pr-4 text-left font-medium">Source</th>
              <th className="pb-3 pr-4 text-left font-medium">Priority</th>
              <th className="pb-3 pr-4 text-left font-medium">Status</th>
              <th className="pb-3 pr-4 text-left font-medium">Confidence</th>
              <th className="pb-3 text-left font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q, i) => (
              <tr key={q.queryId} className="border-b border-beast-border/50 hover:bg-beast-surface/50 transition-colors"
                style={{ animationDelay: `${i * 30}ms` }}>
                <td className="py-3 pr-4">
                  <div>
                    <p className="text-beast-text font-medium text-xs">{q.customerName}</p>
                    <p className="text-beast-muted text-[10px] font-mono truncate max-w-[100px]">{q.customerHandle}</p>
                  </div>
                </td>
                <td className="py-3 pr-4 max-w-xs">
                  <p className="text-beast-dim text-xs line-clamp-2 leading-relaxed">{q.message}</p>
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <CategoryBadge category={q.category} />
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <SourceBadge source={q.source} />
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <PriorityBadge priority={q.priority} />
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <StatusBadge status={q.status} />
                </td>
                <td className="py-3 pr-4" style={{ minWidth: 100 }}>
                  <ConfidenceBar value={q.confidence} />
                </td>
                <td className="py-3 text-[10px] text-beast-muted font-mono whitespace-nowrap">
                  {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-beast-border">
          <p className="text-xs text-beast-muted font-mono">
            Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-1">
            {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
              const page = i + 1;
              return (
                <button key={page} onClick={() => onPageChange?.(page)}
                  className={`w-7 h-7 rounded text-xs font-mono transition-colors ${
                    page === pagination.page
                      ? 'bg-beast-accent text-white'
                      : 'text-beast-dim hover:bg-beast-border'
                  }`}>
                  {page}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
