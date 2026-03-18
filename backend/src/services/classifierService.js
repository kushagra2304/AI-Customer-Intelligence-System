/**
 * Uses LangChain + OpenAI for real classification
 * Falls back to keyword-based mock classifier when USE_MOCK_AI=true
 */

const CATEGORIES = [
  'order_status',
  'delivery_delay',
  'refund_request',
  'product_complaint',
  'subscription_issue',
  'payment_failure',
  'general_inquiry',
];

const CATEGORY_META = {
  order_status: {
    label: 'Order Status',
    description: 'Queries about order tracking, confirmation, and status updates',
    autoResolve: true,
    color: '#6366f1',
  },
  delivery_delay: {
    label: 'Delivery Delay',
    description: 'Complaints about late or delayed deliveries',
    autoResolve: false,
    color: '#f59e0b',
  },
  refund_request: {
    label: 'Refund Request',
    description: 'Requests for refunds, returns, or money back',
    autoResolve: false,
    color: '#ef4444',
  },
  product_complaint: {
    label: 'Product Complaint',
    description: 'Issues with product quality, taste, or safety',
    autoResolve: false,
    color: '#ec4899',
  },
  subscription_issue: {
    label: 'Subscription Issue',
    description: 'Problems with subscription plans, billing cycles, or cancellations',
    autoResolve: false,
    color: '#8b5cf6',
  },
  payment_failure: {
    label: 'Payment Failure',
    description: 'Failed transactions, double charges, or payment gateway errors',
    autoResolve: false,
    color: '#dc2626',
  },
  general_inquiry: {
    label: 'General Inquiry',
    description: 'Product questions, certifications, usage queries',
    autoResolve: true,
    color: '#10b981',
  },
};

const KEYWORD_RULES = [
  {
    category: 'payment_failure',
    keywords: ['payment failed', 'money deducted', 'charged twice', 'upi failed', 'transaction', 'net banking', 'payment gateway', 'emi failed', 'amount debited', 'double charge'],
    weight: 10,
  },
  {
    category: 'refund_request',
    keywords: ['refund', 'money back', 'return', 'cancel order', 'wrong item', 'want refund', 'reimbursement', 'compensation'],
    weight: 10,
  },
  {
    category: 'product_complaint',
    keywords: ['taste terrible', 'bad quality', 'expired', 'foreign object', 'damaged', 'broken seal', 'contaminated', 'side effect', 'palpitation', 'smell', 'color changed', 'misleading', 'clumpy'],
    weight: 9,
  },
  {
    category: 'subscription_issue',
    keywords: ['subscription', 'cancel plan', 'charged monthly', 'recurring', 'plan changed', 'pause subscription', 'upgrade plan'],
    weight: 9,
  },
  {
    category: 'delivery_delay',
    keywords: ['delay', 'late', 'not arrived', 'still waiting', 'not received', 'stuck in transit', 'out for delivery', 'courier', 're-dispatch', 'delivery failed'],
    weight: 8,
  },
  {
    category: 'order_status',
    keywords: ['order status', 'where is my order', 'tracking', 'order #', 'order id', 'shipped', 'dispatched', 'processing', 'confirm', 'not shipped yet'],
    weight: 7,
  },
  {
    category: 'general_inquiry',
    keywords: ['which protein', 'best for', 'suitable for', 'difference between', 'can i take', 'side effects', 'fssai', 'certified', 'bulk order', 'discount', 'coupon', 'ship to', 'lactose', 'women'],
    weight: 6,
  },
];

function mockClassify(message) {
  const lower = message.toLowerCase();
  const scores = {};

  for (const rule of KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) {
        scores[rule.category] = (scores[rule.category] || 0) + rule.weight;
      }
    }
  }

  if (Object.keys(scores).length === 0) {
    return { category: 'general_inquiry', confidence: 0.55, method: 'mock_fallback' };
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = sorted[0][1];
  const totalScore = sorted.reduce((s, [, v]) => s + v, 0);
  const confidence = Math.min(0.97, 0.6 + (topScore / totalScore) * 0.4);

  return {
    category: sorted[0][0],
    confidence: parseFloat(confidence.toFixed(2)),
    method: 'keyword_classifier',
  };
}

//Langachain Code
async function langchainClassify(message) {
  try {
    const { ChatOpenAI } = require('@langchain/openai');
    const { PromptTemplate } = require('langchain/prompts');
    const { StringOutputParser } = require('langchain/schema/output_parser');

    const prompt = PromptTemplate.fromTemplate(`
You are an expert customer support classifier for Beastlife, a premium fitness supplement brand in India.
Your job is to classify customer queries into EXACTLY ONE category.

Available categories:
- order_status: Tracking, order confirmation, dispatch status
- delivery_delay: Late delivery, courier issues, not received
- refund_request: Refund, return, money back, wrong item
- product_complaint: Quality issue, taste, safety, damaged product
- subscription_issue: Subscription billing, cancel, plan changes
- payment_failure: Payment failed, double charge, gateway error
- general_inquiry: Product questions, certifications, shipping zones

Customer query: "{message}"

Respond with ONLY the category name (snake_case). Nothing else.`);

    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0,
      maxTokens: 20,
    });

    const chain = prompt.pipe(model).pipe(new StringOutputParser());
    const result = await chain.invoke({ message });
    const category = result.trim().toLowerCase().replace(/\s+/g, '_');

    if (!CATEGORIES.includes(category)) {
      return mockClassify(message);
    }

    return { category, confidence: 0.94, method: 'langchain_gpt4o' };
  } catch (err) {
    console.warn('LangChain classify error, falling back to mock:', err.message);
    return mockClassify(message);
  }
}

function analyzeSentiment(message) {
  const lower = message.toLowerCase();
  const angryWords = ['unacceptable', 'ridiculous', 'scam', 'fraud', 'angry', 'furious', 'terrible', 'worst', 'disgusting', 'demand', 'legal action', 'consumer court', 'pathetic'];
  const negativeWords = ['disappointed', 'bad', 'poor', 'issue', 'problem', 'complaint', 'failed', 'broken', 'delay', 'late', 'wrong'];
  const positiveWords = ['thank', 'great', 'love', 'amazing', 'best', 'perfect', 'excellent', 'happy', 'satisfied', 'good'];

  const angryScore = angryWords.filter(w => lower.includes(w)).length;
  const negScore = negativeWords.filter(w => lower.includes(w)).length;
  const posScore = positiveWords.filter(w => lower.includes(w)).length;

  if (angryScore >= 1) return 'angry';
  if (negScore > posScore) return 'negative';
  if (posScore > 0) return 'positive';
  return 'neutral';
}
function calculatePriority(category, sentiment) {
  if (category === 'payment_failure' || category === 'product_complaint') return 'urgent';
  if (sentiment === 'angry') return 'urgent';
  if (category === 'refund_request' || category === 'delivery_delay' || category === 'subscription_issue') return 'high';
  if (sentiment === 'negative') return 'high';
  if (category === 'order_status') return 'medium';
  return 'low';
}

const AUTO_REPLIES = {
  order_status: (name) => `Hi ${name}! 👋 We've received your query about your order. Our team is checking the status right now and will send you the updated tracking link within 2 hours. You can also track at beastlife.in/track using your Order ID. — Beastlife Support`,
  delivery_delay: (name) => `Hi ${name}, we sincerely apologize for the delay! 🙏 Your order has been escalated to our logistics team with high priority. You'll receive a detailed update within 24 hours. If the issue persists beyond 3 days, we'll arrange an express re-dispatch at no cost.`,
  refund_request: (name) => `Hi ${name}, your refund request has been received and logged. ✅ Our finance team will process it within 5-7 business days. You'll receive a confirmation email once initiated. If you don't hear back in 7 days, please reply to this message.`,
  product_complaint: (name) => `Hi ${name}, we're extremely sorry to hear about this! 😔 Your complaint has been escalated to our Quality Assurance team as HIGH PRIORITY. Please share photos/videos if possible. We'll respond within 48 hours with a resolution — replacement, refund, or both.`,
  subscription_issue: (name) => `Hi ${name}, we've flagged your subscription concern to our billing team. 🔧 No additional charges will be made to your account while this is being reviewed. Expect a resolution within 24 hours.`,
  payment_failure: (name) => `Hi ${name}, we're sorry for the payment inconvenience! 💳 If money was debited but order wasn't placed, it will be auto-refunded within 3-5 business days by your bank. Please share your transaction ID/UTR number so we can escalate this with our payment gateway.`,
  general_inquiry: (name) => `Hi ${name}! Thanks for reaching out to Beastlife. 💪 Our product specialist will answer your query within 12 hours. For instant help, check beastlife.in/faq — most common questions are answered there!`,
};

async function storeInChroma(queryId, message, category) {
  try {
    const { ChromaClient } = require('chromadb');
    const client = new ChromaClient({ path: process.env.CHROMA_HOST });
    const collection = await client.getOrCreateCollection({ name: process.env.CHROMA_COLLECTION || 'beastlife_queries' });

    await collection.add({
      ids: [queryId],
      documents: [message],
      metadatas: [{ category, timestamp: new Date().toISOString() }],
    });
  } catch {
   
  }
}

async function classifyQuery(message, customerName = 'Customer') {
  const useMock = process.env.USE_MOCK_AI === 'true' || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder';

  const result = useMock ? mockClassify(message) : await langchainClassify(message);
  const sentiment = analyzeSentiment(message);
  const priority = calculatePriority(result.category, sentiment);
  const autoReply = AUTO_REPLIES[result.category]?.(customerName) || AUTO_REPLIES.general_inquiry(customerName);
  const shouldEscalate = priority === 'urgent' || result.confidence < 0.65;

  return {
    ...result,
    sentiment,
    priority,
    autoReply,
    shouldEscalate,
    categoryMeta: CATEGORY_META[result.category],
  };
}

module.exports = { classifyQuery, CATEGORY_META, CATEGORIES, mockClassify, AUTO_REPLIES };
