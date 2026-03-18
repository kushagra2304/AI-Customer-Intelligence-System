# 🦁 Beastlife AI Customer Intelligence System

> AI-driven customer care automation for Beastlife — classifies queries, visualizes insights, and suggests automation strategies.

---

## 🗂 Project Structure

```
beastlife-ai/
├── package.json                    # Root — concurrently runs both servers
│
├── backend/
│   ├── .env.example                # Environment template
│   ├── config/
│   │   └── db.js                   # MongoDB connection (graceful fallback)
│   └── src/
│       ├── server.js               # Express app entry point
│       ├── models/
│       │   └── Query.js            # Mongoose schema (7 categories, sentiment, priority)
│       ├── controllers/
│       │   ├── queryController.js  # CRUD + classify endpoint
│       │   └── analyticsController.js # Aggregation endpoints
│       ├── services/
│       │   ├── classifierService.js  # LangChain + keyword classifier + auto-reply
│       │   └── analyticsService.js   # Distribution, trends, automation metrics
│       ├── routes/
│       │   ├── queries.js          # GET /api/queries, POST /api/queries/classify
│       │   └── analytics.js        # GET /api/analytics/overview|trends|automation
│       ├── middleware/
│       │   └── errorHandler.js     # Global error handler
│       ├── utils/
│       │   └── memoryStore.js      # In-memory store when MongoDB unavailable
│       └── data/
│           └── mockData.js         # 200 realistic Beastlife customer queries
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx           
        ├── main.jsx
        ├── index.css              
        ├── data/
        │   └── mockData.js         # Frontend mock data (mirrors backend)
        ├── utils/
        │   └── api.js           
        ├── hooks/
        │   ├── useAnalytics.js     # Analytics data fetching hook
        │   └── useQueries.js       # Queries with filter/pagination hook
        ├── components/
        │   ├── ui/index.jsx        # Reusable: badges, cards, spinners
        │   ├── charts/
        │   │   ├── CategoryDistribution.jsx  # Pie + bar chart (toggleable)
        │   │   ├── TrendChart.jsx            # Line chart with category toggles
        │   │   └── BreakdownCharts.jsx       # Source + sentiment charts
        │   └── dashboard/
        │       ├── Sidebar.jsx       # Navigation sidebar
        │       ├── KPIRow.jsx        # 8 KPI stat cards
        │       ├── QueryFeed.jsx     # Paginated query table
        │       └── AutomationPanel.jsx # Automation strategies + opportunities
        └── pages/
            ├── OverviewPage.jsx      # Main dashboard
            ├── QueriesPage.jsx       # Query list with filters
            ├── AnalyticsPage.jsx     # Deep analytics
            ├── AutomationPage.jsx    # Automation playbook + architecture
            └── ClassifyPage.jsx      # Live classifier tester
```

---

## 🚀 Quick Start

### Option A — Frontend Only (mock data, no backend needed)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

### Option B — Full Stack

```bash
# 1. Install all dependencies
npm run install:all

# 2. Copy and configure environment
cp backend/.env.example backend/.env
# Edit backend/.env — set MONGODB_URI and OPENAI_API_KEY (optional)

# 3. Run both servers concurrently
npm run dev
# Backend: http://localhost:5000
# Frontend: http://localhost:5173
```

### Option C — With Real MongoDB

```bash
# Start MongoDB locally
mongod --dbpath ./data

# In backend/.env, set:
MONGODB_URI=mongodb://localhost:27017/beastlife_ai
USE_MOCK_AI=true   # keep true until you add OpenAI key
```

---

## 🤖 AI Classifier

The system has **two classifier modes**:

### Mock Mode (default, `USE_MOCK_AI=true`)
- Keyword-based rule engine across 7 category rules
- Zero cost, works offline
- ~85-95% accuracy on typical queries

### Production Mode (`USE_MOCK_AI=false` + valid OpenAI key)
- LangChain.js pipeline → `gpt-4o-mini` → category label
- Confidence score, sentiment analysis, priority calculation
- Falls back to keyword classifier on API error

### ChromaDB Integration (optional)
- Start ChromaDB: `docker run -p 8000:8000 chromadb/chroma`
- Set `CHROMA_HOST=http://localhost:8000` in `.env`
- Embeddings are stored for future semantic similarity search

---

## 📡 API Endpoints

```
GET  /health                              System health check
GET  /api/queries                         List queries (filters: category, source, status, priority, search, page)
POST /api/queries/classify               Classify + store a new query
GET  /api/queries/:id                    Get single query
PATCH /api/queries/:id/status            Update query status

GET  /api/analytics/overview?period=30d  Full analytics (KPIs, distribution, trends)
GET  /api/analytics/categories           Category breakdown only
GET  /api/analytics/trends?period=30d    Daily trend data
GET  /api/analytics/automation           Automation metrics + opportunities
```

---

## 📊 Dashboard Pages

| Page | Route | Description |
|------|-------|-------------|
| Overview | `/` | KPIs, trend chart, category pie, source/sentiment breakdown |
| Queries | `/queries` | Full query feed with filters, pagination, badges |
| Analytics | `/analytics` | Deep charts, daily volume, status breakdown |
| Automation | `/automation` | Strategies, architecture diagram, scalability design |
| Classify | `/classify` | Live AI classifier with sample queries |

---

## 🏷 Query Categories

| Category | % (mock) | Auto-Resolvable |
|----------|----------|-----------------|
| Order Status | 35% | Yes — Shopify webhook |
| Delivery Delay | 22% | Partial — proactive alerts |
| Refund Request | 18% | Partial — rule-based approval |
| Product Complaint | 12% | No — human QA required |
| Subscription Issue | 6% | Partial — billing portal |
| Payment Failure | 5% | No — transaction review |
| General Inquiry | 2% | Yes — RAG FAQ bot |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Charts | Recharts |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| AI Orchestration | LangChain.js |
| LLM | OpenAI GPT-4o-mini |
| Vector DB | ChromaDB |
| Validation | Zod |
| Security | Helmet + express-rate-limit |

---

## 📈 Scalability Notes

- **Stateless API** — horizontally scalable behind any load balancer
- **BullMQ queues** — absorb traffic spikes, async LLM classification
- **MongoDB indexes** — compound indexes on `category + createdAt` for O(log n) aggregations
- **Keyword-first** — 80% of queries classified at zero LLM cost
- **ChromaDB** — scales to millions of embeddings, upgradeable to Pinecone

---

*Built for the Beastlife AI Automation & Customer Intelligence Challenge*
