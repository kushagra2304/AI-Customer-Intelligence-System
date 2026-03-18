const express = require('express');
const router = express.Router();
const { getQueries, classifyAndStore, getQuery, updateStatus } = require('../controllers/queryController');

router.get('/', getQueries);
router.post('/classify', classifyAndStore);
router.get('/:id', getQuery);
router.patch('/:id/status', updateStatus);

module.exports = router;
