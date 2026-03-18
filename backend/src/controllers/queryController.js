const { v4: uuidv4 } = require('uuid');
const { classifyQuery } = require('../services/classifierService');
const { getStore, addToStore, findById, updateInStore } = require('../utils/memoryStore');

let Query = null;
let useDB = false;

function setDBMode(QueryModel) {
  Query = QueryModel;
  useDB = true;
}

async function getQueries(req, res) {
  try {
    const { page = 1, limit = 20, category, source, status, sentiment, priority, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let queries, total;

    if (useDB && Query) {
      const filter = {};
      if (category) filter.category = category;
      if (source) filter.source = source;
      if (status) filter.status = status;
      if (sentiment) filter.sentiment = sentiment;
      if (priority) filter.priority = priority;
      if (search) filter.message = { $regex: search, $options: 'i' };

      total = await Query.countDocuments(filter);
      queries = await Query.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
    } else {
      let store = getStore();
      if (category) store = store.filter(q => q.category === category);
      if (source) store = store.filter(q => q.source === source);
      if (status) store = store.filter(q => q.status === status);
      if (sentiment) store = store.filter(q => q.sentiment === sentiment);
      if (priority) store = store.filter(q => q.priority === priority);
      if (search) store = store.filter(q => q.message.toLowerCase().includes(search.toLowerCase()));

      total = store.length;
      queries = store.slice(skip, skip + parseInt(limit));
    }

    res.json({
      success: true,
      data: queries,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function classifyAndStore(req, res) {
  try {
    const { message, source = 'website', customerName = 'Anonymous', customerHandle = '' } = req.body;

    if (!message || message.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Message is required (min 3 characters)' });
    }

    const classification = await classifyQuery(message, customerName);

    const queryData = {
      queryId: `BL-Q-${uuidv4().slice(0, 8).toUpperCase()}`,
      source,
      message: message.trim(),
      customerName,
      customerHandle,
      category: classification.category,
      confidence: classification.confidence,
      sentiment: classification.sentiment,
      priority: classification.priority,
      status: classification.shouldEscalate ? 'escalated' : 'auto_resolved',
      autoReply: classification.autoReply,
      escalatedToHuman: classification.shouldEscalate,
      resolvedAt: classification.shouldEscalate ? null : new Date(),
      tags: [classification.category, source],
      metadata: { language: 'en' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let saved;
    if (useDB && Query) {
      saved = await new Query(queryData).save();
    } else {
      saved = addToStore(queryData);
    }

    res.status(201).json({
      success: true,
      data: saved,
      classification: {
        category: classification.category,
        label: classification.categoryMeta?.label,
        confidence: classification.confidence,
        method: classification.method,
        sentiment: classification.sentiment,
        priority: classification.priority,
        autoReply: classification.autoReply,
        escalated: classification.shouldEscalate,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getQuery(req, res) {
  try {
    let query;
    if (useDB && Query) {
      query = await Query.findOne({ queryId: req.params.id }).lean();
    } else {
      query = findById(req.params.id);
    }

    if (!query) return res.status(404).json({ success: false, error: 'Query not found' });
    res.json({ success: true, data: query });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function updateStatus(req, res) {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'auto_resolved', 'escalated', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    let updated;
    const updates = { status, updatedAt: new Date(), ...(status === 'resolved' ? { resolvedAt: new Date() } : {}) };

    if (useDB && Query) {
      updated = await Query.findOneAndUpdate({ queryId: req.params.id }, updates, { new: true }).lean();
    } else {
      updated = updateInStore(req.params.id, updates);
    }

    if (!updated) return res.status(404).json({ success: false, error: 'Query not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { getQueries, classifyAndStore, getQuery, updateStatus, setDBMode };
