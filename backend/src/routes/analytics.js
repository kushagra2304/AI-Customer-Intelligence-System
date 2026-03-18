const express = require('express');
const router = express.Router();
const { getOverview, getCategoryBreakdown, getTrends, getAutomationInsights } = require('../controllers/analyticsController');

router.get('/overview', getOverview);
router.get('/categories', getCategoryBreakdown);
router.get('/trends', getTrends);
router.get('/automation', getAutomationInsights);

module.exports = router;
