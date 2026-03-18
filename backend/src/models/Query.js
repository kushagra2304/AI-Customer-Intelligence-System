const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    queryId: { type: String, required: true, unique: true },
    source: {
      type: String,
      enum: ['instagram', 'whatsapp', 'email', 'website', 'csv_upload'],
      required: true,
    },
    message: { type: String, required: true },
    customerName: { type: String, default: 'Anonymous' },
    customerHandle: { type: String, default: '' },
    category: {
      type: String,
      enum: [
        'order_status',
        'delivery_delay',
        'refund_request',
        'product_complaint',
        'subscription_issue',
        'payment_failure',
        'general_inquiry',
      ],
      required: true,
    },
    confidence: { type: Number, min: 0, max: 1, default: 0.9 },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'angry'],
      default: 'neutral',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'auto_resolved', 'escalated', 'resolved'],
      default: 'pending',
    },
    autoReply: { type: String, default: '' },
    escalatedToHuman: { type: Boolean, default: false },
    resolvedAt: { type: Date, default: null },
    tags: [{ type: String }],
    metadata: {
      region: String,
      language: { type: String, default: 'en' },
      orderNumber: String,
    },
  },
  { timestamps: true }
);

querySchema.index({ category: 1, createdAt: -1 });
querySchema.index({ status: 1 });
querySchema.index({ source: 1 });
querySchema.index({ sentiment: 1 });

module.exports = mongoose.model('Query', querySchema);
