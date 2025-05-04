const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = "8157858553:AAHuDXSVigW42sA2Q1ClYNWxIVgCJdorTlE";
const TELEGRAM_CHAT_ID = "1283137908";

app.post("/", async (req, res) => {
  try {
    const order = req.body;

    const orderId = order.id;
    const customerName = order.customer?.first_name + " " + order.customer?.last_name;
    const phone = order.shipping_address?.phone || "N/A";
    const address = `${order.shipping_address?.address1 || ""}, ${order.shipping_address?.city || ""}, ${order.shipping_address?.province || ""}, ${order.shipping_address?.zip || ""}`;
    const total = order.total_price;
    const status = order.financial_status;

    const message = `
🛒 *New Order Received!*
🆔 *Order ID:* ${orderId}
👤 *Customer:* ${customerName}
📞 *Phone:* ${phone}
🏠 *Address:* ${address}
💰 *Total:* ₹${total}
✅ *Status:* ${status}
    `;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error:", error?.response?.data || error.message);
    res.status(500).send("Error processing webhook");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
