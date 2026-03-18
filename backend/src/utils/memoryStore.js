const { generateMockQueries } = require('../data/mockData');

let _store = null;

function getStore() {
  if (!_store) {
    _store = generateMockQueries();
    console.log(`In-memory store initialized with ${_store.length} mock queries`);
  }
  return _store;
}

function addToStore(query) {
  getStore().unshift(query);
  return query;
}

function findById(queryId) {
  return getStore().find(q => q.queryId === queryId) || null;
}

function updateInStore(queryId, updates) {
  const idx = getStore().findIndex(q => q.queryId === queryId);
  if (idx === -1) return null;
  _store[idx] = { ..._store[idx], ...updates, updatedAt: new Date() };
  return _store[idx];
}

module.exports = { getStore, addToStore, findById, updateInStore };
