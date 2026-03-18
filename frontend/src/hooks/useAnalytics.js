import { useState, useEffect, useCallback } from 'react';
import { fetchAnalyticsOverview, fetchTrends, fetchAutomationInsights } from '../utils/api';

export function useAnalytics(period = '30d') {
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [automation, setAutomation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [a, t, au] = await Promise.all([
        fetchAnalyticsOverview(period),
        fetchTrends(period),
        fetchAutomationInsights(),
      ]);
      setAnalytics(a);
      setTrends(t);
      setAutomation(au);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  return { analytics, trends, automation, loading, error, refresh: load };
}
