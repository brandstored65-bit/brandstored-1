# SMS Notification Setup Guide

This guide explains how to set up SMS notifications for order updates using Twilio.

## 📱 Features

- ✅ Order confirmation SMS when order is placed
- ✅ Order shipped SMS with tracking details
- ✅ Order delivered SMS
- ✅ Order cancelled SMS
- ✅ Automatic SMS on order status change

---

## 🚀 Setup Instructions

### 1. Create Twilio Account

1. Go to [Twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your email and phone number
4. Get $15 free trial credit

### 2. Get Twilio Credentials

1. Go to [Twilio Console](https://console.twilio.com/)
2. Copy your **Account SID**
3. Copy your **Auth Token**
4. Go to **Phone Numbers** → **Manage** → **Buy a number**
5. Purchase a phone number (or use trial number)

### 3. Configure Environment Variables

Add these to your `.env` file:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number with country code
```

### 4. Install Twilio Package

```bash
npm install twilio
```

### 5. Test SMS Notifications

Restart your development server:

```bash
npm run dev
```

Place a test order and check if you receive an SMS!

---

## 📋 SMS Message Templates

### Order Confirmation
```
Hi John! Your order #AB12CD34 has been placed successfully. Total: ₹1299.00. We'll notify you once it's shipped. Thank you for shopping with us! - QuickFynd
```

### Order Shipped
```
Hi John! Your order #AB12CD34 has been shipped via BlueDart. Tracking ID: BD123456789. Track: https://bluedart.com/track/BD123456789. - QuickFynd
```

### Order Delivered
```
Hi John! Your order #AB12CD34 has been delivered. Thank you for shopping with QuickFynd! We hope you love your purchase. 🎉
```

### Order Cancelled
```
Hi John! Your order #AB12CD34 has been cancelled. If you have any questions, please contact our support team. - QuickFynd
```

---

## 🔧 How It Works

### Order Creation Flow
```
1. Customer places order
2. Order saved to database
3. Email confirmation sent
4. SMS confirmation sent to shipping address phone number
```

### Order Status Update Flow
```
1. Admin updates order status/tracking
2. Order updated in database
3. Email notification sent
4. SMS notification sent (if phone number exists)
```

### API Endpoints

**SMS Notification API:** `POST /api/notifications/order-sms`

Request body:
```json
{
  "phoneNumber": "+919876543210",
  "orderId": "AB12CD34",
  "customerName": "John Doe",
  "status": "SHIPPED",
  "totalAmount": 1299.00,
  "trackingId": "BD123456789",
  "trackingUrl": "https://bluedart.com/track/BD123456789",
  "courier": "BlueDart"
}
```

Response:
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "messageId": "SM123456789"
}
```

---

## 🌍 Phone Number Format

**IMPORTANT:** Phone numbers must include country code!

✅ Correct format:
- India: `+919876543210`
- USA: `+11234567890`
- UK: `+447123456789`

❌ Wrong format:
- `9876543210` (missing country code)
- `+91 9876 543 210` (spaces)
- `+91-9876543210` (dashes)

---

## 💰 Pricing (Twilio)

### Trial Account
- $15 free credit
- Can only send to verified numbers
- SMS messages show "Sent from your Twilio trial account"

### Paid Account
- ~$1/month per phone number
- ~$0.0075 per SMS (India)
- ~$0.0079 per SMS (USA)
- Can send to any number
- Professional messages (no trial text)

**Example Cost for 1000 orders/month:**
- Phone number: $1/month
- SMS cost: 1000 × $0.0075 = $7.50/month
- **Total: ~$8.50/month**

---

## 🔒 Security Best Practices

1. **Never commit credentials** - Keep `.env` file in `.gitignore`
2. **Rotate tokens** - Change Auth Token periodically
3. **Rate limiting** - Implement rate limits to prevent abuse
4. **Validate phone numbers** - Check format before sending
5. **Monitor usage** - Set up billing alerts in Twilio

---

## 📊 Testing

### Test in Development

```javascript
// Test SMS sending
const { sendOrderConfirmationSMS } = require('./lib/sms');

await sendOrderConfirmationSMS({
  phoneNumber: '+919876543210',
  orderId: 'TEST123',
  totalAmount: '999.00',
  customerName: 'Test User'
});
```

### Verify SMS Logs

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Monitor** → **Logs** → **Messaging**
3. Check delivery status of each SMS

---

## 🐛 Troubleshooting

### SMS not sending?

1. **Check credentials** - Verify `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` in `.env`
2. **Check phone format** - Must include country code (e.g., `+919876543210`)
3. **Trial account limits** - Can only send to verified numbers
4. **Check balance** - Ensure you have sufficient Twilio credits
5. **Check console logs** - Look for error messages in terminal

### SMS showing "Sent from trial account"?

- Upgrade to a paid Twilio account to remove this message

### International SMS not working?

- Some countries require sender registration or have restrictions
- Check [Twilio's country guide](https://www.twilio.com/docs/sms/pricing)

### Phone number validation failing?

- Use international format with country code
- Remove spaces, dashes, and special characters
- Use a phone validation library like `libphonenumber-js`

---

## 🚀 Next Steps (Optional Enhancements)

1. **WhatsApp Integration** - Use Twilio WhatsApp API for richer messages
2. **OTP Verification** - Add phone verification during signup
3. **SMS Templates** - Create custom templates for different events
4. **Delivery Reports** - Track SMS delivery status
5. **Multi-language** - Send SMS in customer's preferred language
6. **Opt-out Management** - Let customers unsubscribe from SMS
7. **Click Tracking** - Use short URLs to track link clicks

---

## 📚 Additional Resources

- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [Twilio Node.js SDK](https://www.twilio.com/docs/libraries/node)
- [SMS Best Practices](https://www.twilio.com/docs/sms/best-practices)
- [Country-specific Requirements](https://www.twilio.com/docs/sms/pricing)

---

## ✅ Implementation Checklist

- [ ] Created Twilio account
- [ ] Purchased/verified phone number
- [ ] Added credentials to `.env` file
- [ ] Installed `twilio` package
- [ ] Tested order confirmation SMS
- [ ] Tested order shipped SMS
- [ ] Tested order delivered SMS
- [ ] Verified SMS delivery in Twilio console
- [ ] Updated phone number validation in forms
- [ ] Added country code selector to address form (optional)
- [ ] Set up billing alerts in Twilio
- [ ] Documented SMS costs for stakeholders

---

**Need Help?** Contact Twilio Support or check their extensive documentation.
