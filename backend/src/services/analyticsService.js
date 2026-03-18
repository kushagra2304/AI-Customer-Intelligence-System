const { subDays, startOfDay, endOfDay, format, eachDayOfInterval, eachWeekOfInterval, startOfWeek } = require('date-fns');

const CATEGORY_COLORS = {
  order_status: '#6366f1',
  delivery_delay: '#f59e0b',
  refund_request: '#ef4444',
  product_complaint: '#ec4899',
  subscription_issue: '#8b5cf6',
  payment_failure: '#dc2626',
  general_inquiry: '#10b981',
};

const CATEGORY_LABELS = {
  order_status: 'Order Status',
  delivery_delay: 'Delivery Delay',
  refund_request: 'Refund Request',
  product_complaint: 'Product Complaint',
  subscription_issue: 'Subscription Issue',
  payment_failure: 'Payment Failure',
  general_inquiry: 'General Inquiry',
};
function computeAnalytics(queries, period = '30d') {
  const now = new Date();
  const daysBack = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const cutoff = subDays(now, daysBack);

  const filtered = queries.filter(q => new Date(q.createdAt) >= cutoff);
  const total = filtered.length;

  if (total === 0) return emptyAnalytics();
  const categoryCounts = {};
  const sourceCounts = {};
  const sentimentCounts = {};
  const statusCounts = {};
  const priorityCounts = {};

  for (const q of filtered) {
    categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    sourceCounts[q.source] = (sourceCounts[q.source] || 0) + 1;
    sentimentCounts[q.sentiment] = (sentimentCounts[q.sentiment] || 0) + 1;
    statusCounts[q.status] = (statusCounts[q.status] || 0) + 1;
    priorityCounts[q.priority] = (priorityCounts[q.priority] || 0) + 1;
  }

  const categoryDistribution = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      label: CATEGORY_LABELS[category] || category,
      count,
      percentage: parseFloat(((count / total) * 100).toFixed(1)),
      color: CATEGORY_COLORS[category] || '#94a3b8',
    }));
  const days = eachDayOfInterval({ start: cutoff, end: now });
  const dailyMap = {};

  for (const q of filtered) {
    const key = format(new Date(q.createdAt), 'yyyy-MM-dd');
    if (!dailyMap[key]) {
      dailyMap[key] = { date: key, total: 0 };
      for (const cat of Object.keys(CATEGORY_LABELS)) dailyMap[key][cat] = 0;
    }
    dailyMap[key].total++;
    dailyMap[key][q.category] = (dailyMap[key][q.category] || 0) + 1;
  }

  const trendData = days.map(d => {
    const key = format(d, 'yyyy-MM-dd');
    return dailyMap[key] || { date: key, total: 0, ...Object.fromEntries(Object.keys(CATEGORY_LABELS).map(c => [c, 0])) };
  });
  const sourceBreakdown = Object.entries(sourceCounts).map(([source, count]) => ({
    source,
    count,
    percentage: parseFloat(((count / total) * 100).toFixed(1)),
  }));
  const autoResolved = statusCounts['auto_resolved'] || 0;
  const escalated = statusCounts['escalated'] || 0;
  const pending = statusCounts['pending'] || 0;
  const resolved = statusCounts['resolved'] || 0;

  const automationRate = parseFloat(((autoResolved / total) * 100).toFixed(1));
  const escalationRate = parseFloat(((escalated / total) * 100).toFixed(1));
  const resolutionRate = parseFloat((((autoResolved + resolved) / total) * 100).toFixed(1));
  const avgResolutionHours = 2.4;
  const automationOpportunities = categoryDistribution.slice(0, 3).map(cat => ({
    ...cat,
    automationPotential: ['order_status', 'general_inquiry'].includes(cat.category) ? 'high' : 'medium',
    suggestedAction: getAutomationSuggestion(cat.category),
  }));
  const kpis = {
    totalQueries: total,
    autoResolved,
    escalated,
    pending,
    automationRate,
    escalationRate,
    resolutionRate,
    avgResolutionHours,
    topCategory: categoryDistribution[0],
    urgentCount: priorityCounts['urgent'] || 0,
    negativeCount: (sentimentCounts['negative'] || 0) + (sentimentCounts['angry'] || 0),
  };

  return {
    kpis,
    categoryDistribution,
    trendData,
    sourceBreakdown,
    sentimentBreakdown: Object.entries(sentimentCounts).map(([sentiment, count]) => ({
      sentiment, count, percentage: parseFloat(((count / total) * 100).toFixed(1)),
    })),
    statusBreakdown: Object.entries(statusCounts).map(([status, count]) => ({
      status, count, percentage: parseFloat(((count / total) * 100).toFixed(1)),
    })),
    automationOpportunities,
    period,
    generatedAt: new Date().toISOString(),
  };
}

function getAutomationSuggestion(category) {
  const suggestions = {
    order_status: 'Connect Shopify/WooCommerce webhook to auto-reply with live tracking link',
    delivery_delay: 'Auto-detect delayed shipments via courier API and proactively notify customers',
    refund_request: 'Build rule-based refund auto-approval for orders under ₹500 within 30-day window',
    product_complaint: 'Route to QA team immediately; auto-acknowledge with SLA promise',
    subscription_issue: 'Integrate billing portal for self-service subscription management',
    payment_failure: 'Auto-check payment gateway logs; send retry link within 5 minutes',
    general_inquiry: 'Deploy FAQ chatbot powered by product knowledge base (RAG)',
  };
  return suggestions[category] || 'Implement auto-classification and smart routing';
}

function emptyAnalytics() {
  return {
    kpis: { totalQueries: 0, autoResolved: 0, escalated: 0, pending: 0, automationRate: 0, escalationRate: 0, resolutionRate: 0, avgResolutionHours: 0, urgentCount: 0, negativeCount: 0 },
    categoryDistribution: [],
    trendData: [],
    sourceBreakdown: [],
    sentimentBreakdown: [],
    statusBreakdown: [],
    automationOpportunities: [],
    period: '30d',
    generatedAt: new Date().toISOString(),
  };
}

module.exports = { computeAnalytics, CATEGORY_COLORS, CATEGORY_LABELS };
