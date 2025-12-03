// app/api/notifications/order-sms/route.js
import { NextResponse } from 'next/server';
import {
    sendOrderConfirmationSMS,
    sendOrderShippedSMS,
    sendOrderDeliveredSMS,
    sendOrderCancelledSMS,
    isTwilioConfigured
} from '@/lib/sms';

export async function POST(request) {
    try {
        // Check if Twilio is configured
        if (!isTwilioConfigured()) {
            return NextResponse.json({
                success: false,
                message: 'SMS service not configured'
            }, { status: 503 });
        }

        const data = await request.json();
        const { 
            phoneNumber, 
            orderId, 
            customerName, 
            status, 
            totalAmount,
            trackingId,
            trackingUrl,
            courier
        } = data;

        // Validate required fields
        if (!phoneNumber || !orderId || !customerName) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields: phoneNumber, orderId, or customerName'
            }, { status: 400 });
        }

        let result;

        // Send appropriate SMS based on order status
        switch (status) {
            case 'PENDING':
            case 'CONFIRMED':
                result = await sendOrderConfirmationSMS({
                    phoneNumber,
                    orderId,
                    totalAmount,
                    customerName
                });
                break;

            case 'SHIPPED':
                result = await sendOrderShippedSMS({
                    phoneNumber,
                    orderId,
                    courier,
                    trackingId,
                    trackingUrl,
                    customerName
                });
                break;

            case 'DELIVERED':
                result = await sendOrderDeliveredSMS({
                    phoneNumber,
                    orderId,
                    customerName
                });
                break;

            case 'CANCELLED':
            case 'REFUNDED':
                result = await sendOrderCancelledSMS({
                    phoneNumber,
                    orderId,
                    customerName
                });
                break;

            default:
                return NextResponse.json({
                    success: false,
                    message: `Unsupported order status: ${status}`
                }, { status: 400 });
        }

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'SMS sent successfully',
                messageId: result.messageId
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Failed to send SMS',
                error: result.error
            }, { status: 500 });
        }

    } catch (error) {
        console.error('SMS notification error:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error: error.message
        }, { status: 500 });
    }
}
