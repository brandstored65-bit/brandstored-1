// lib/sms.js - SMS notification service using Twilio
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient = null;

// Check if Twilio is configured
const isTwilioConfigured = () => {
    return !!(accountSid && authToken && twilioPhoneNumber);
};

// Initialize Twilio client only if configured
if (isTwilioConfigured()) {
    try {
        twilioClient = twilio(accountSid, authToken);
        console.log('✅ Twilio SMS initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Twilio:', error.message);
    }
} else {
    console.warn('⚠️  Twilio SMS not configured - SMS notifications disabled');
}

/**
 * Send SMS message
 * @param {string} to - Phone number with country code (e.g., +919876543210)
 * @param {string} message - SMS message content
 * @returns {Promise<object>} - Twilio response or error
 */
export async function sendSMS(to, message) {
    if (!isTwilioConfigured() || !twilioClient) {
        console.warn('SMS not sent - Twilio not configured');
        return { success: false, error: 'Twilio not configured' };
    }

    try {
        const response = await twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: to
        });

        console.log('✅ SMS sent successfully:', response.sid);
        return { success: true, messageId: response.sid };
    } catch (error) {
        console.error('❌ Failed to send SMS:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send order confirmation SMS
 * @param {object} orderData - Order details
 * @returns {Promise<object>}
 */
export async function sendOrderConfirmationSMS(orderData) {
    const { phoneNumber, orderId, totalAmount, customerName } = orderData;

    if (!phoneNumber) {
        console.warn('No phone number provided for order SMS');
        return { success: false, error: 'No phone number' };
    }

    const message = `Hi ${customerName}! Your order #${orderId} has been placed successfully. Total: ₹${totalAmount}. We'll notify you once it's shipped. Thank you for shopping with us! - QuickFynd`;

    return await sendSMS(phoneNumber, message);
}

/**
 * Send order shipped SMS with tracking
 * @param {object} orderData - Order and tracking details
 * @returns {Promise<object>}
 */
export async function sendOrderShippedSMS(orderData) {
    const { phoneNumber, orderId, courier, trackingId, trackingUrl, customerName } = orderData;

    if (!phoneNumber) {
        console.warn('No phone number provided for shipped SMS');
        return { success: false, error: 'No phone number' };
    }

    let message = `Hi ${customerName}! Your order #${orderId} has been shipped`;
    
    if (courier) {
        message += ` via ${courier}`;
    }
    
    if (trackingId) {
        message += `. Tracking ID: ${trackingId}`;
    }
    
    if (trackingUrl) {
        message += `. Track: ${trackingUrl}`;
    }
    
    message += '. - QuickFynd';

    return await sendSMS(phoneNumber, message);
}

/**
 * Send order delivered SMS
 * @param {object} orderData - Order details
 * @returns {Promise<object>}
 */
export async function sendOrderDeliveredSMS(orderData) {
    const { phoneNumber, orderId, customerName } = orderData;

    if (!phoneNumber) {
        console.warn('No phone number provided for delivered SMS');
        return { success: false, error: 'No phone number' };
    }

    const message = `Hi ${customerName}! Your order #${orderId} has been delivered. Thank you for shopping with QuickFynd! We hope you love your purchase. 🎉`;

    return await sendSMS(phoneNumber, message);
}

/**
 * Send order cancelled SMS
 * @param {object} orderData - Order details
 * @returns {Promise<object>}
 */
export async function sendOrderCancelledSMS(orderData) {
    const { phoneNumber, orderId, customerName } = orderData;

    if (!phoneNumber) {
        console.warn('No phone number provided for cancelled SMS');
        return { success: false, error: 'No phone number' };
    }

    const message = `Hi ${customerName}! Your order #${orderId} has been cancelled. If you have any questions, please contact our support team. - QuickFynd`;

    return await sendSMS(phoneNumber, message);
}

/**
 * Send OTP SMS for verification
 * @param {string} phoneNumber - Phone number
 * @param {string} otp - One-time password
 * @returns {Promise<object>}
 */
export async function sendOTPSMS(phoneNumber, otp) {
    const message = `Your QuickFynd verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;

    return await sendSMS(phoneNumber, message);
}

export { isTwilioConfigured };
