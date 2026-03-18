import { useState, useEffect, useCallback } from 'react';
import { fetchQueries } from '../utils/api';

export function useQueries(initialFilters = {}) {
  const [queries, setQueries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (f = filters) => {
    setLoading(true);
    setError(null);
    try {
      const { queries: q, pagination: p } = await fetchQueries(f);
      setQueries(q);
      setPagination(p);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const updateFilters = useCallback((updates) => {
    const next = { ...filters, ...updates, page: 1 };
    setFilters(next);
    load(next);
  }, [filters, load]);

  const setPage = useCallback((page) => {
    const next = { ...filters, page };
    setFilters(next);
    load(next);
  }, [filters, load]);

  return { queries, pagination, filters, loading, error, updateFilters, setPage, refresh: load };
}
