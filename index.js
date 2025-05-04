
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = '8157858553:AAHuDXSVigW42sA2Q1ClYNWxIVgCJdorTlE';
const CHAT_ID = '1283137908';

app.post('/', (req, res) => {
  const order = req.body;

  // ✅ Debug log to see incoming order payload
  console.log('📦 Webhook received:', JSON.stringify(order, null, 2));

  // ✅ Trigger only if payment is completed
  if (order.financial_status === 'paid') {
    const message = `🛒 New Paid Order!\nOrder ID: ${order.id}\nCustomer: ${order.customer.first_name} ${order.customer.last_name}\nTotal: ${order.total_price} ${order.currency}`;

    axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message
    })
    .then(() => console.log('✅ Message sent to Telegram'))
    .catch(err => console.error('❌ Telegram error:', err));
  }

  res.status(200).send('Webhook received');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
