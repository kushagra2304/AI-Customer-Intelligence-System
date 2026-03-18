import axios from 'axios';
import {
  mockAnalytics, mockTrendData, mockQueries, mockPagination,
} from '../data/mockData';

const api = axios.create({
  baseURL: '/api',
  timeout: 8000,
});

let _useMock = false;

async function safeFetch(fn, fallback) {
  if (_useMock) return fallback;
  try {
    return await fn();
  } catch {
    _useMock = true;
    console.info('Backend unavailable — using mock data');
    return fallback;
  }
}

export async function fetchAnalyticsOverview(period = '30d') {
  return safeFetch(async () => {
    const { data } = await api.get(`/analytics/overview?period=${period}`);
    return data.data;
  }, { ...mockAnalytics, period });
}

export async function fetchTrends(period = '30d') {
  return safeFetch(async () => {
    const { data } = await api.get(`/analytics/trends?period=${period}`);
    return data.data;
  }, mockTrendData);
}

export async function fetchAutomationInsights() {
  return safeFetch(async () => {
    const { data } = await api.get('/analytics/automation');
    return data.data;
  }, {
    automationRate: mockAnalytics.kpis.automationRate,
    escalationRate: mockAnalytics.kpis.escalationRate,
    resolutionRate: mockAnalytics.kpis.resolutionRate,
    avgResolutionHours: mockAnalytics.kpis.avgResolutionHours,
    opportunities: mockAnalytics.automationOpportunities,
    statusBreakdown: mockAnalytics.statusBreakdown,
  });
}

export async function fetchQueries(params = {}) {
  return safeFetch(async () => {
    const { data } = await api.get('/queries', { params });
    return { queries: data.data, pagination: data.pagination };
  }, (() => {
    let filtered = [...mockQueries];
    if (params.category) filtered = filtered.filter(q => q.category === params.category);
    if (params.source)   filtered = filtered.filter(q => q.source === params.source);
    if (params.status)   filtered = filtered.filter(q => q.status === params.status);
    if (params.search)   filtered = filtered.filter(q => q.message.toLowerCase().includes(params.search.toLowerCase()) || q.customerName.toLowerCase().includes(params.search.toLowerCase()));
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    return {
      queries: filtered.slice(start, start + limit),
      pagination: { page, limit, total: filtered.length, pages: Math.ceil(filtered.length / limit) },
    };
  })());
}

export async function classifyQuery(payload) {
  return safeFetch(async () => {
    const { data } = await api.post('/queries/classify', payload);
    return data;
  }, (() => {
    const msg = payload.message.toLowerCase();
    let category = 'general_inquiry';
    if (msg.includes('refund') || msg.includes('return')) category = 'refund_request';
    else if (msg.includes('payment') || msg.includes('deducted') || msg.includes('upi')) category = 'payment_failure';
    else if (msg.includes('delay') || msg.includes('late') || msg.includes('arrived')) category = 'delivery_delay';
    else if (msg.includes('order') || msg.includes('tracking') || msg.includes('shipped')) category = 'order_status';
    else if (msg.includes('quality') || msg.includes('taste') || msg.includes('expired') || msg.includes('damaged')) category = 'product_complaint';
    else if (msg.includes('subscription') || msg.includes('cancel') || msg.includes('plan')) category = 'subscription_issue';

    return {
      success: true,
      classification: {
        category,
        confidence: 0.91,
        method: 'mock_keyword_classifier',
        sentiment: msg.includes('urgent') || msg.includes('terrible') || msg.includes('unacceptable') ? 'angry' : 'neutral',
        priority: ['payment_failure','product_complaint'].includes(category) ? 'urgent' : 'medium',
        autoReply: `Hi ${payload.customerName || 'there'}! We've received your message and our AI has categorised it as "${category.replace('_',' ')}". Our team will respond within 2 hours.`,
        escalated: ['payment_failure','product_complaint'].includes(category),
      },
      data: {
        queryId: `BL-Q-DEMO${Math.random().toString(36).slice(2,6).toUpperCase()}`,
        ...payload,
        category,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    };
  })());
}
