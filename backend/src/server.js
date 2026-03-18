require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('../config/db');
const queryRoutes = require('./routes/queries');
const analyticsRoutes = require('./routes/analytics');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { setDBMode: setQueryDBMode } = require('./controllers/queryController');
const { setDBMode: setAnalyticsDBMode } = require('./controllers/analyticsController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: 'https://ai-customer-intelligence-system.vercel.app/', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: 'Too many requests, please try again later.' },
}));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Beastlife AI Customer Intelligence API',
    version: '1.0.0',
    mode: process.env.USE_MOCK_AI === 'true' ? 'mock' : 'production',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/queries', queryRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);
async function start() {
  console.log('\n Beastlife AI Customer Intelligence System');

  const conn = await connectDB();

  if (conn) {
    const Query = require('./models/Query');
    setQueryDBMode(Query);
    setAnalyticsDBMode(Query);
    console.log('🗄️  Using MongoDB for data storage');

    // Optional: seed DB on first run
    const count = await Query.countDocuments();
    if (count === 0) {
      console.log('Seeding initial mock data...');
      const { generateMockQueries } = require('./data/mockData');
      await Query.insertMany(generateMockQueries());
      console.log('✅ Seeded successfully');
    }
  } else {
    console.log('Using in-memory store (mock mode)');
  }

  console.log(`AI Mode: ${process.env.USE_MOCK_AI === 'true' ? 'Mock Keyword Classifier' : 'LangChain + OpenAI'}`);

  app.listen(PORT, () => {
    console.log(`\n Server running at http://localhost:${PORT}`);
    console.log(` Dashboard API: http://localhost:${PORT}/api/analytics/overview`);
    console.log(` Queries API:   http://localhost:${PORT}/api/queries`);
    console.log(`  Health check:  http://localhost:${PORT}/health\n`);
  });
}

start().catch(err => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

module.exports = app;
