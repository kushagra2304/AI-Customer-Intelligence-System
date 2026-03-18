const { computeAnalytics } = require('../services/analyticsService');
const { getStore } = require('../utils/memoryStore');

let Query = null;
let useDB = false;

function setDBMode(QueryModel) {
  Query = QueryModel;
  useDB = true;
}

async function getOverview(req, res) {
  try {
    const { period = '30d' } = req.query;
    if (!['7d', '30d', '90d'].includes(period)) {
      return res.status(400).json({ success: false, error: 'Period must be 7d, 30d, or 90d' });
    }

    let queries;
    if (useDB && Query) {
      queries = await Query.find({}).lean();
    } else {
      queries = getStore();
    }

    const analytics = computeAnalytics(queries, period);
    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getCategoryBreakdown(req, res) {
  try {
    let queries;
    if (useDB && Query) {
      queries = await Query.find({}).lean();
    } else {
      queries = getStore();
    }

    const analytics = computeAnalytics(queries, '30d');
    res.json({ success: true, data: analytics.categoryDistribution });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getTrends(req, res) {
  try {
    const { period = '30d' } = req.query;
    let queries;
    if (useDB && Query) {
      queries = await Query.find({}).lean();
    } else {
      queries = getStore();
    }

    const analytics = computeAnalytics(queries, period);
    res.json({ success: true, data: analytics.trendData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getAutomationInsights(req, res) {
  try {
    let queries;
    if (useDB && Query) {
      queries = await Query.find({}).lean();
    } else {
      queries = getStore();
    }

    const analytics = computeAnalytics(queries, '30d');
    res.json({
      success: true,
      data: {
        automationRate: analytics.kpis.automationRate,
        escalationRate: analytics.kpis.escalationRate,
        resolutionRate: analytics.kpis.resolutionRate,
        avgResolutionHours: analytics.kpis.avgResolutionHours,
        opportunities: analytics.automationOpportunities,
        statusBreakdown: analytics.statusBreakdown,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { getOverview, getCategoryBreakdown, getTrends, getAutomationInsights, setDBMode };
