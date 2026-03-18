// Frontend mock data — used when backend is unavailable
export const CATEGORY_META = {
  order_status:      { label: 'Order Status',       color: '#6366f1', bg: '#6366f115' },
  delivery_delay:    { label: 'Delivery Delay',      color: '#f59e0b', bg: '#f59e0b15' },
  refund_request:    { label: 'Refund Request',      color: '#ef4444', bg: '#ef444415' },
  product_complaint: { label: 'Product Complaint',   color: '#ec4899', bg: '#ec489915' },
  subscription_issue:{ label: 'Subscription Issue',  color: '#8b5cf6', bg: '#8b5cf615' },
  payment_failure:   { label: 'Payment Failure',     color: '#dc2626', bg: '#dc262615' },
  general_inquiry:   { label: 'General Inquiry',     color: '#10b981', bg: '#10b98115' },
};

export const SENTIMENT_META = {
  positive: { label: 'Positive', color: '#10b981' },
  neutral:  { label: 'Neutral',  color: '#6b7280' },
  negative: { label: 'Negative', color: '#f59e0b' },
  angry:    { label: 'Angry',    color: '#ef4444' },
};

export const SOURCE_META = {
  instagram:   { label: 'Instagram',  color: '#e1306c', icon: '📸' },
  whatsapp:    { label: 'WhatsApp',   color: '#25d366', icon: '💬' },
  email:       { label: 'Email',      color: '#6366f1', icon: '📧' },
  website:     { label: 'Website',    color: '#0ea5e9', icon: '🌐' },
  csv_upload:  { label: 'CSV Upload', color: '#94a3b8', icon: '📂' },
};

export const STATUS_META = {
  pending:       { label: 'Pending',       color: '#f59e0b' },
  auto_resolved: { label: 'Auto Resolved', color: '#10b981' },
  escalated:     { label: 'Escalated',     color: '#ef4444' },
  resolved:      { label: 'Resolved',      color: '#6366f1' },
};

export const PRIORITY_META = {
  low:    { label: 'Low',    color: '#6b7280' },
  medium: { label: 'Medium', color: '#6366f1' },
  high:   { label: 'High',   color: '#f59e0b' },
  urgent: { label: 'Urgent', color: '#ef4444' },
};
export const mockAnalytics = {
  kpis: {
    totalQueries: 200,
    autoResolved: 118,
    escalated: 34,
    pending: 31,
    automationRate: 59.0,
    escalationRate: 17.0,
    resolutionRate: 74.5,
    avgResolutionHours: 2.4,
    urgentCount: 41,
    negativeCount: 87,
    topCategory: { category: 'order_status', label: 'Order Status', count: 70, percentage: 35.0, color: '#6366f1' },
  },
  categoryDistribution: [
    { category: 'order_status',       label: 'Order Status',       count: 70, percentage: 35.0, color: '#6366f1' },
    { category: 'delivery_delay',     label: 'Delivery Delay',     count: 44, percentage: 22.0, color: '#f59e0b' },
    { category: 'refund_request',     label: 'Refund Request',     count: 36, percentage: 18.0, color: '#ef4444' },
    { category: 'product_complaint',  label: 'Product Complaint',  count: 24, percentage: 12.0, color: '#ec4899' },
    { category: 'subscription_issue', label: 'Subscription Issue', count: 12, percentage: 6.0,  color: '#8b5cf6' },
    { category: 'payment_failure',    label: 'Payment Failure',    count: 10, percentage: 5.0,  color: '#dc2626' },
    { category: 'general_inquiry',    label: 'General Inquiry',    count: 4,  percentage: 2.0,  color: '#10b981' },
  ],
  sentimentBreakdown: [
    { sentiment: 'neutral',  count: 74, percentage: 37.0 },
    { sentiment: 'negative', count: 62, percentage: 31.0 },
    { sentiment: 'angry',    count: 42, percentage: 21.0 },
    { sentiment: 'positive', count: 22, percentage: 11.0 },
  ],
  sourceBreakdown: [
    { source: 'instagram',  count: 58, percentage: 29.0 },
    { source: 'whatsapp',   count: 52, percentage: 26.0 },
    { source: 'email',      count: 44, percentage: 22.0 },
    { source: 'website',    count: 30, percentage: 15.0 },
    { source: 'csv_upload', count: 16, percentage: 8.0  },
  ],
  statusBreakdown: [
    { status: 'auto_resolved', count: 118, percentage: 59.0 },
    { status: 'pending',       count: 31,  percentage: 15.5 },
    { status: 'escalated',     count: 34,  percentage: 17.0 },
    { status: 'resolved',      count: 17,  percentage: 8.5  },
  ],
  automationOpportunities: [
    {
      category: 'order_status',
      label: 'Order Status',
      count: 70,
      percentage: 35.0,
      color: '#6366f1',
      automationPotential: 'high',
      suggestedAction: 'Connect Shopify/WooCommerce webhook to auto-reply with live tracking link',
    },
    {
      category: 'delivery_delay',
      label: 'Delivery Delay',
      count: 44,
      percentage: 22.0,
      color: '#f59e0b',
      automationPotential: 'medium',
      suggestedAction: 'Auto-detect delayed shipments via courier API and proactively notify customers',
    },
    {
      category: 'refund_request',
      label: 'Refund Request',
      count: 36,
      percentage: 18.0,
      color: '#ef4444',
      automationPotential: 'medium',
      suggestedAction: 'Build rule-based refund auto-approval for orders under ₹500 within 30-day window',
    },
  ],
  period: '30d',
};
function generateTrendData(days = 30) {
  const data = [];
  const now = new Date();
  const cats = ['order_status','delivery_delay','refund_request','product_complaint','subscription_issue','payment_failure','general_inquiry'];
  const weights = [35, 22, 18, 12, 6, 5, 2];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const total = Math.floor(4 + Math.random() * 10);
    const entry = { date: dateStr, total };
    let remaining = total;
    cats.forEach((cat, idx) => {
      const val = idx === cats.length - 1 ? remaining : Math.floor((weights[idx] / 100) * total + Math.random() * 2);
      entry[cat] = Math.max(0, Math.min(val, remaining));
      remaining -= entry[cat];
    });
    data.push(entry);
  }
  return data;
}

export const mockTrendData = generateTrendData(30);
const rawQueries = [
  { id: 'BL-Q-A1B2C3D4', source: 'instagram', customerName: 'Raj Sharma',      customerHandle: '@fitness_freak_raj',     category: 'order_status',       message: 'Bhai mera order #BL7823 ka kya hua? 3 din ho gaye koi update nahi', sentiment: 'neutral',  priority: 'medium', status: 'auto_resolved', confidence: 0.96, minsAgo: 14   },
  { id: 'BL-Q-B2C3D4E5', source: 'whatsapp',  customerName: 'Sameer Ali',       customerHandle: '@angry_lifter_22',       category: 'delivery_delay',     message: "It's been 10 days and my protein powder still hasn't arrived. This is unacceptable", sentiment: 'angry',    priority: 'urgent', status: 'escalated',     confidence: 0.94, minsAgo: 32   },
  { id: 'BL-Q-C3D4E5F6', source: 'email',     customerName: 'Kavita Singh',     customerHandle: 'consumer_rights@gmail', category: 'refund_request',     message: 'I want a full refund. The product is completely different from what was shown', sentiment: 'angry',    priority: 'high',   status: 'escalated',     confidence: 0.97, minsAgo: 58   },
  { id: 'BL-Q-D4E5F6G7', source: 'website',   customerName: 'Mohit Goyal',      customerHandle: '@disappointed_gains',   category: 'product_complaint',  message: "The chocolate flavour whey tastes absolutely terrible. Nothing like the description", sentiment: 'negative', priority: 'urgent', status: 'escalated',     confidence: 0.93, minsAgo: 75   },
  { id: 'BL-Q-E5F6G7H8', source: 'instagram', customerName: 'Poornima Reddy',   customerHandle: 'subscription_scam@gm',  category: 'subscription_issue', message: 'I signed up for monthly subscription but was charged for 3 months upfront without consent', sentiment: 'angry',    priority: 'high',   status: 'pending',       confidence: 0.91, minsAgo: 102  },
  { id: 'BL-Q-F6G7H8I9', source: 'whatsapp',  customerName: 'Vivek Tomar',      customerHandle: 'money_gone@gmail',      category: 'payment_failure',    message: 'Money deducted from account but order not placed. Very urgent!!', sentiment: 'angry',    priority: 'urgent', status: 'escalated',     confidence: 0.98, minsAgo: 130  },
  { id: 'BL-Q-G7H8I9J0', source: 'email',     customerName: 'Lakshmi Das',      customerHandle: '@newbie_fitness_help',  category: 'general_inquiry',    message: "Which protein is best for a beginner who wants to lose fat and build muscle?", sentiment: 'positive', priority: 'low',    status: 'auto_resolved', confidence: 0.88, minsAgo: 155  },
  { id: 'BL-Q-H8I9J0K1', source: 'website',   customerName: 'Priya Nair',       customerHandle: 'priya.fit@gmail',       category: 'order_status',       message: 'Order #BL9921 still showing processing. Can you please check?', sentiment: 'neutral',  priority: 'medium', status: 'auto_resolved', confidence: 0.95, minsAgo: 180  },
  { id: 'BL-Q-I9J0K1L2', source: 'instagram', customerName: 'Sreelatha Menon',  customerHandle: '@quality_issue_urgent', category: 'product_complaint',  message: 'I found a foreign object inside the creatine tub. Attaching photo', sentiment: 'angry',    priority: 'urgent', status: 'escalated',     confidence: 0.99, minsAgo: 210  },
  { id: 'BL-Q-J0K1L2M3', source: 'whatsapp',  customerName: 'Neha Joshi',       customerHandle: 'neha.fitlife@gmail',    category: 'delivery_delay',     message: "Delivery promised in 3-5 days. It's day 8. Where is my order??", sentiment: 'angry',    priority: 'urgent', status: 'pending',       confidence: 0.92, minsAgo: 240  },
  { id: 'BL-Q-K1L2M3N4', source: 'email',     customerName: 'Sneha Patil',      customerHandle: '@upi_failed_urgent',    category: 'payment_failure',    message: 'UPI payment failed but money got debited from my account. Transaction ID: TXN44821', sentiment: 'angry',    priority: 'urgent', status: 'escalated',     confidence: 0.97, minsAgo: 290  },
  { id: 'BL-Q-L2M3N4O5', source: 'website',   customerName: 'Sanjay Tata',      customerHandle: '@refund_now_please',    category: 'refund_request',     message: 'Please process my refund for order #BL7741. I returned the item last week', sentiment: 'negative', priority: 'high',   status: 'pending',       confidence: 0.93, minsAgo: 320  },
  { id: 'BL-Q-M3N4O5P6', source: 'instagram', customerName: 'Ankit Singh',      customerHandle: '@beast_mode_ankit',     category: 'order_status',       message: "My creatine monohydrate order hasn't shipped yet. Order placed 5 days ago", sentiment: 'neutral',  priority: 'medium', status: 'auto_resolved', confidence: 0.94, minsAgo: 380  },
  { id: 'BL-Q-N4O5P6Q7', source: 'whatsapp',  customerName: 'Amit Kulkarni',    customerHandle: '@scared_buyer_pune',    category: 'product_complaint',  message: 'Pre-workout gives me extreme palpitations. Is this normal? Very concerned', sentiment: 'negative', priority: 'urgent', status: 'escalated',     confidence: 0.96, minsAgo: 420  },
  { id: 'BL-Q-O5P6Q7R8', source: 'email',     customerName: 'Meera Krishnan',   customerHandle: 'charged_wrongly@gm',   category: 'subscription_issue', message: "My subscription was paused but I'm still being charged. Fix this ASAP", sentiment: 'angry',    priority: 'high',   status: 'pending',       confidence: 0.91, minsAgo: 460  },
  { id: 'BL-Q-P6Q7R8S9', source: 'website',   customerName: 'Arjun Reddy',      customerHandle: '@comp_prep_arjun',      category: 'delivery_delay',     message: 'My bcaa capsules are late by a week. I need them for my competition', sentiment: 'negative', priority: 'high',   status: 'auto_resolved', confidence: 0.89, minsAgo: 510  },
  { id: 'BL-Q-Q7R8S9T0', source: 'instagram', customerName: 'Bablu Yadav',      customerHandle: 'irate_customer_9@gm',  category: 'refund_request',     message: 'Refund nahi aaya abhi tak. 15 din ho gaye return kiye hue', sentiment: 'angry',    priority: 'high',   status: 'pending',       confidence: 0.90, minsAgo: 560  },
  { id: 'BL-Q-R8S9T0U1', source: 'whatsapp',  customerName: 'Rohit Gupta',      customerHandle: '@delhi_gym_bro',        category: 'order_status',       message: 'Tracking link not working for my whey protein order #BL4421', sentiment: 'neutral',  priority: 'medium', status: 'auto_resolved', confidence: 0.93, minsAgo: 620  },
  { id: 'BL-Q-S9T0U1V2', source: 'email',     customerName: 'Farhan Sheikh',    customerHandle: '@lactose_query',        category: 'general_inquiry',    message: "Is your whey protein suitable for lactose intolerant people?", sentiment: 'neutral',  priority: 'low',    status: 'auto_resolved', confidence: 0.85, minsAgo: 680  },
  { id: 'BL-Q-T0U1V2W3', source: 'website',   customerName: 'Varun Mishra',     customerHandle: 'payment_gateway@gm',   category: 'payment_failure',    message: 'Getting "payment gateway error" on every attempt. Tried 3 different cards', sentiment: 'negative', priority: 'urgent', status: 'escalated',     confidence: 0.96, minsAgo: 740  },
];

function minsToDate(minsAgo) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minsAgo);
  return d.toISOString();
}

export const mockQueries = rawQueries.map(q => ({
  queryId: q.id,
  source: q.source,
  customerName: q.customerName,
  customerHandle: q.customerHandle,
  category: q.category,
  message: q.message,
  sentiment: q.sentiment,
  priority: q.priority,
  status: q.status,
  confidence: q.confidence,
  createdAt: minsToDate(q.minsAgo),
  autoReply: `Hi ${q.customerName.split(' ')[0]}! We've received your message and our team is on it. You'll hear back within 2 hours.`,
  escalatedToHuman: q.status === 'escalated',
  tags: [q.category, q.source],
}));

export const mockPagination = {
  page: 1, limit: 20, total: 200, pages: 10,
};
