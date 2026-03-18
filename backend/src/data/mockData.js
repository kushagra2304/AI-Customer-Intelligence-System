const { v4: uuidv4 } = require('uuid');
const { subDays, subHours, subMinutes } = require('date-fns');

const now = new Date();

const CATEGORIES = [
  'order_status',
  'delivery_delay',
  'refund_request',
  'product_complaint',
  'subscription_issue',
  'payment_failure',
  'general_inquiry',
];

const SOURCES = ['instagram', 'whatsapp', 'email', 'website', 'csv_upload'];

const mockMessages = {
  order_status: [
    { msg: 'Bhai mera order #BL7823 ka kya hua? 3 din ho gaye koi update nahi', handle: '@fitness_freak_raj', name: 'Raj Sharma' },
    { msg: 'Where is my order? I placed it last week and no tracking update', handle: '@gains_mukesh', name: 'Mukesh Verma' },
    { msg: 'Order #BL9921 still showing processing. Can you please check?', handle: 'priya.fit@gmail.com', name: 'Priya Nair' },
    { msg: 'My creatine monohydrate order hasnt shipped yet. Order placed 5 days ago', handle: '@beast_mode_ankit', name: 'Ankit Singh' },
    { msg: 'Tracking link not working for my whey protein order #BL4421', handle: '@delhi_gym_bro', name: 'Rohit Gupta' },
    { msg: 'When will my mass gainer be dispatched? Order ID BL8834', handle: 'deepak.sharma@yahoo.com', name: 'Deepak Sharma' },
    { msg: 'Order status shows shipped but no tracking update since 2 days', handle: '@iron_will_preet', name: 'Preet Kaur' },
    { msg: 'Did you receive my order? Getting no confirmation email', handle: 'arun.fitness@gmail.com', name: 'Arun Kumar' },
    { msg: 'Please tell me when my pre-workout will be delivered. Paid already', handle: '@pumped_pooja', name: 'Pooja Mehta' },
    { msg: 'Order BL3312 showing delivered but I havent received anything', handle: 'vikas.bodybuild@hotmail.com', name: 'Vikas Rao' },
  ],
  delivery_delay: [
    { msg: 'It\'s been 10 days and my protein powder still hasnt arrived. This is unacceptable', handle: '@angry_lifter_22', name: 'Sameer Ali' },
    { msg: 'Delivery promised in 3-5 days. It\'s day 8. Where is my order??', handle: 'neha.fitlife@gmail.com', name: 'Neha Joshi' },
    { msg: 'My bcaa capsules are late by a week. I need them for my competition', handle: '@comp_prep_arjun', name: 'Arjun Reddy' },
    { msg: 'Courier se baat ki unhone bola package nahi mila. Please re-dispatch', handle: '@mumbai_gymmer', name: 'Kartik Bose' },
    { msg: 'Delayed again! This is the second time my order got delayed. Extremely disappointed', handle: 'frustrated_buyer@gmail.com', name: 'Sunita Pillai' },
    { msg: 'Address was correct but delivery failed. Need immediate resolution', handle: '@fitnesswala_delhi', name: 'Rajeev Malhotra' },
    { msg: 'Order stuck in transit for 5 days according to tracking. Please help', handle: 'ashish.gym@gmail.com', name: 'Ashish Tiwari' },
    { msg: 'My order shows out for delivery since yesterday but never came. Shop closes at 8pm', handle: '@gym_life_forever', name: 'Manisha Desai' },
  ],
  refund_request: [
    { msg: 'I want a full refund. The product is completely different from what was shown', handle: 'consumer_rights@gmail.com', name: 'Kavita Singh' },
    { msg: 'Please process my refund for order #BL7741. I returned the item last week', handle: '@refund_now_please', name: 'Sanjay Tata' },
    { msg: 'Refund nahi aaya abhi tak. 15 din ho gaye return kiye hue', handle: 'irate_customer_9@gmail.com', name: 'Bablu Yadav' },
    { msg: 'I was charged twice for the same order. Need immediate refund', handle: 'double_charge_victim@gmail.com', name: 'Swetha Iyer' },
    { msg: 'The whey protein I received was expired. Demanding full refund + compensation', handle: '@expired_product_claim', name: 'Nikhil Bansal' },
    { msg: 'Order cancelled but refund not received after 10 days. My money?', handle: 'worried_buyer_hyd@gmail.com', name: 'Ravi Shankar' },
    { msg: 'Wrong item delivered. Sent mass gainer instead of isolate. Want refund or replacement', handle: '@wrong_item_sent', name: 'Tarun Mathur' },
    { msg: 'Refund status kya hai? Ticket #RT2291 filed 12 days ago', handle: 'patiently_waiting@gmail.com', name: 'Divya Kumar' },
  ],
  product_complaint: [
    { msg: 'The chocolate flavour whey tastes absolutely terrible. Nothing like the description says', handle: '@disappointed_gains', name: 'Mohit Goyal' },
    { msg: 'Protein powder is clumpy and doesn\'t mix well even with a blender', handle: 'protein_issues_raj@gmail.com', name: 'Rajesh Nair' },
    { msg: 'I found a foreign object inside the creatine tub. Attaching photo', handle: '@quality_issue_urgent', name: 'Sreelatha Menon' },
    { msg: 'Pre-workout gives me extreme palpitations. Is this normal? Very concerned', handle: '@scared_buyer_pune', name: 'Amit Kulkarni' },
    { msg: 'The seal was broken when I received the mass gainer. Safety concern', handle: 'tampered_product@gmail.com', name: 'Gaurav Singh' },
    { msg: 'BCAA tablets have a very strong chemical smell. Not taking them till you respond', handle: '@smell_complaint_blr', name: 'Prathima Rao' },
    { msg: 'Product packaging is misleading. Actual quantity much less than advertised', handle: 'mislead_consumer@gmail.com', name: 'Harsh Verma' },
    { msg: 'Received damaged packaging. The container is cracked and product may be contaminated', handle: '@damaged_delivery_kol', name: 'Subrata Mukherjee' },
    { msg: 'The BCAA powder color changed after opening. Is it expired? Expiry says 2026', handle: '@color_change_worry', name: 'Ritika Agarwal' },
  ],
  subscription_issue: [
    { msg: 'I signed up for monthly subscription but was charged for 3 months upfront without consent', handle: 'subscription_scam@gmail.com', name: 'Poornima Reddy' },
    { msg: 'Unable to cancel my subscription from the app. The cancel button does nothing', handle: '@cant_cancel_sub', name: 'Suresh Pillai' },
    { msg: 'My subscription was paused but I\'m still being charged. Fix this ASAP', handle: 'charged_wrongly@gmail.com', name: 'Meera Krishnan' },
    { msg: 'Subscription plan changed without notification. Now paying more than before', handle: '@plan_changed_no_notice', name: 'Hemant Dubey' },
    { msg: 'I cancelled 2 weeks ago but still got charged this month. Need refund', handle: 'still_charged_after_cancel@gmail.com', name: 'Ananya Chatterjee' },
    { msg: 'How do I upgrade my subscription plan? Website keeps throwing error', handle: '@upgrade_error_help', name: 'Kiran Bhat' },
  ],
  payment_failure: [
    { msg: 'Money deducted from account but order not placed. Very urgent!!', handle: 'money_gone_order_not@gmail.com', name: 'Vivek Tomar' },
    { msg: 'UPI payment failed but money got debited from my account. Transaction ID: TXN44821', handle: '@upi_failed_urgent', name: 'Sneha Patil' },
    { msg: 'Card declined multiple times but showing insufficient funds issue. Card is fine', handle: 'card_issue_help@gmail.com', name: 'Rohini Nair' },
    { msg: 'COD option not available in my city but online payment keeps failing. How to order?', handle: '@payment_help_needed', name: 'Pranav Shukla' },
    { msg: 'Paid via net banking, amount deducted, session expired before order confirmed', handle: 'netbanking_issue@gmail.com', name: 'Shilpa Agarwal' },
    { msg: 'EMI option failed at checkout. Can you help process this manually?', handle: '@emi_option_fail', name: 'Navneet Kaur' },
    { msg: 'Getting "payment gateway error" on every attempt. Tried 3 different cards', handle: 'payment_gateway_bug@gmail.com', name: 'Varun Mishra' },
  ],
  general_inquiry: [
    { msg: 'Which protein is best for a beginner who wants to lose fat and build muscle?', handle: '@newbie_fitness_help', name: 'Lakshmi Das' },
    { msg: 'Do you ship to Tier 3 cities? I\'m from Muzaffarpur Bihar', handle: 'bihar_buyer@gmail.com', name: 'Rajan Sinha' },
    { msg: 'Is your whey protein suitable for lactose intolerant people?', handle: '@lactose_query', name: 'Farhan Sheikh' },
    { msg: 'What\'s the difference between your isolate and concentrate whey?', handle: 'protein_newbie_22@gmail.com', name: 'Simran Kaur' },
    { msg: 'Can I stack your pre-workout with creatine? Any side effects?', handle: '@stacking_query', name: 'Devendra Patel' },
    { msg: 'Do you have any products for women? Specifically for weight loss', handle: '@women_fitness_seeker', name: 'Pallavi Sharma' },
    { msg: 'What are your bulk order discounts? I want to order for my gym', handle: 'gym_owner_bulk@gmail.com', name: 'Sachin Gaikwad' },
    { msg: 'Is this product FSSAI certified? Need to check before recommending to clients', handle: '@certified_trainer_ask', name: 'Deepa Menon' },
    { msg: 'How much protein per serving in the gold standard whey? Checking macro', handle: 'macro_counter@gmail.com', name: 'Akash Dubey' },
    { msg: 'Are there any ongoing offers or coupon codes for new users?', handle: '@first_purchase_discount', name: 'Tanya Gupta' },
  ],
};

const autoReplies = {
  order_status: 'Hi! Your order status has been checked. Our team will send you the updated tracking link within 2 hours. You can also track your order at beastlife.in/track using your Order ID.',
  delivery_delay: 'We sincerely apologize for the delay! Our logistics team has been flagged about your order. You will receive an update within 24 hours. If the delay exceeds 3 more days, we\'ll offer a 10% credit on your next order.',
  refund_request: 'Your refund request has been received and logged. Standard processing time is 5-7 business days. Our finance team will process this and you\'ll receive a confirmation email shortly.',
  product_complaint: 'We take product quality very seriously. Your complaint has been escalated to our Quality Assurance team. Please share photos if possible. We\'ll get back to you within 48 hours with a resolution.',
  subscription_issue: 'Your subscription issue has been flagged to our billing team. We\'ll review your account and resolve this within 24 hours. No additional charges will be made in the meantime.',
  payment_failure: 'We see your payment concern. If money was debited but order not placed, it will be auto-refunded within 3-5 business days. If not received, please share transaction ID and we\'ll escalate immediately.',
  general_inquiry: 'Thanks for reaching out! Our product expert will respond to your query within 12 hours. You can also check our FAQ at beastlife.in/faq for instant answers.',
};

const sentimentMap = {
  order_status: 'neutral',
  delivery_delay: 'negative',
  refund_request: 'angry',
  product_complaint: 'negative',
  subscription_issue: 'angry',
  payment_failure: 'angry',
  general_inquiry: 'positive',
};

const priorityMap = {
  order_status: 'medium',
  delivery_delay: 'high',
  refund_request: 'high',
  product_complaint: 'urgent',
  subscription_issue: 'high',
  payment_failure: 'urgent',
  general_inquiry: 'low',
};

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(daysBack) {
  const day = Math.floor(Math.random() * daysBack);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return subMinutes(subHours(subDays(now, day), hours), minutes);
}

function generateMockQueries() {
  const queries = [];
  
  const distribution = {
    order_status: 35,
    delivery_delay: 22,
    refund_request: 18,
    product_complaint: 12,
    subscription_issue: 6,
    payment_failure: 5,
    general_inquiry: 2,
  };

  const totalQueries = 200;

  for (const [category, percentage] of Object.entries(distribution)) {
    const count = Math.round((percentage / 100) * totalQueries);
    const messages = mockMessages[category];

    for (let i = 0; i < count; i++) {
      const msgData = messages[i % messages.length];
      const source = getRandomElement(SOURCES);
      const createdAt = getRandomDate(90); // last 90 days
      const isEscalated = ['product_complaint', 'payment_failure', 'refund_request'].includes(category) && Math.random() < 0.3;
      const isAutoResolved = !isEscalated && Math.random() < 0.6;

      queries.push({
        queryId: `BL-Q-${uuidv4().slice(0, 8).toUpperCase()}`,
        source,
        message: msgData.msg,
        customerName: msgData.name,
        customerHandle: msgData.handle,
        category,
        confidence: parseFloat((0.75 + Math.random() * 0.24).toFixed(2)),
        sentiment: sentimentMap[category],
        priority: priorityMap[category],
        status: isEscalated ? 'escalated' : isAutoResolved ? 'auto_resolved' : 'pending',
        autoReply: autoReplies[category],
        escalatedToHuman: isEscalated,
        resolvedAt: isAutoResolved ? new Date(createdAt.getTime() + 3600000) : null,
        tags: [category.replace('_', '-'), source],
        metadata: {
          region: getRandomElement(['North India', 'South India', 'West India', 'East India', 'Central India']),
          language: Math.random() < 0.3 ? 'hi' : 'en',
          orderNumber: Math.random() < 0.6 ? `BL${Math.floor(1000 + Math.random() * 9000)}` : undefined,
        },
        createdAt,
        updatedAt: createdAt,
      });
    }
  }
  queries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return queries;
}

module.exports = { generateMockQueries, autoReplies, CATEGORIES };
