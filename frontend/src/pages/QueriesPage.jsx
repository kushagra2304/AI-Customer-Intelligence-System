import React, { useState } from 'react';
import { useQueries } from '../hooks/useQueries';
import QueryFeed from '../components/dashboard/QueryFeed';
import { SectionHeader } from '../components/ui';
import { CATEGORY_META, SOURCE_META, STATUS_META, PRIORITY_META } from '../data/mockData';

const FILTER_OPTIONS = {
  category: [{ value: '', label: 'All Categories' }, ...Object.entries(CATEGORY_META).map(([k, v]) => ({ value: k, label: v.label }))],
  source:   [{ value: '', label: 'All Sources' }, ...Object.entries(SOURCE_META).map(([k, v]) => ({ value: k, label: v.label }))],
  status:   [{ value: '', label: 'All Statuses' }, ...Object.entries(STATUS_META).map(([k, v]) => ({ value: k, label: v.label }))],
  priority: [{ value: '', label: 'All Priorities' }, ...Object.entries(PRIORITY_META).map(([k, v]) => ({ value: k, label: v.label }))],
};

function Select({ value, onChange, options, label }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="bg-beast-surface border border-beast-border rounded-lg px-3 py-1.5 text-xs text-beast-dim
        focus:outline-none focus:border-beast-accent transition-colors font-mono">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export default function QueriesPage() {
  const { queries, pagination, filters, loading, updateFilters, setPage } = useQueries({ limit: 20 });
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter') updateFilters({ search });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-beast-text tracking-tight">Query Management</h1>
        <p className="text-sm text-beast-muted mt-0.5">All incoming customer queries with AI classification</p>
      </div>
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search queries... (press Enter)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          className="bg-beast-surface border border-beast-border rounded-lg px-3 py-1.5 text-xs text-beast-text
            placeholder:text-beast-muted focus:outline-none focus:border-beast-accent transition-colors w-56"
        />
        <Select value={filters.category || ''} onChange={v => updateFilters({ category: v || undefined })} options={FILTER_OPTIONS.category} />
        <Select value={filters.source || ''} onChange={v => updateFilters({ source: v || undefined })} options={FILTER_OPTIONS.source} />
        <Select value={filters.status || ''} onChange={v => updateFilters({ status: v || undefined })} options={FILTER_OPTIONS.status} />
        <Select value={filters.priority || ''} onChange={v => updateFilters({ priority: v || undefined })} options={FILTER_OPTIONS.priority} />

        {(filters.category || filters.source || filters.status || filters.priority || filters.search) && (
          <button onClick={() => { setSearch(''); updateFilters({ category: undefined, source: undefined, status: undefined, priority: undefined, search: undefined }); }}
            className="btn-ghost text-xs text-beast-red">
            ✕ Clear
          </button>
        )}

        <span className="ml-auto text-xs text-beast-muted font-mono">{pagination.total} total queries</span>
      </div>
      <div className="card p-5">
        <QueryFeed queries={queries} loading={loading} pagination={pagination} onPageChange={setPage} />
      </div>
    </div>
  );
}
