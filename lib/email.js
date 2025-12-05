// lib/email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail({ to, subject, html }) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Email sending error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Send welcome email when customer creates account
export async function sendWelcomeEmail(email, name) {
  const subject = 'Welcome to Brandstored! 🎉';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 14px; }
        .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .benefit-item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .benefit-item:last-child { border-bottom: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Brandstored!</h1>
          <p>Your journey to amazing products starts here</p>
        </div>
        <div class="content">
          <h2>Hi ${name || 'there'}! 👋</h2>
          <p>Thank you for creating an account with Brandstored. We're excited to have you as part of our community!</p>
          
          <div class="benefits">
            <h3>Here's what you can enjoy:</h3>
            <div class="benefit-item">✅ Fast & secure checkout</div>
            <div class="benefit-item">✅ Order tracking & history</div>
            <div class="benefit-item">✅ Exclusive deals & offers</div>
            <div class="benefit-item">✅ Wishlist & saved items</div>
            <div class="benefit-item">✅ Easy returns within 7 days</div>
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" class="button">Start Shopping</a>

          <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}">${process.env.NEXT_PUBLIC_ADMIN_EMAIL}</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Brandstored. All rights reserved.</p>
          <p>You're receiving this email because you created an account on our website.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendMail({ to: email, subject, html });
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(orderData) {
  const { email, name, orderId, total, orderItems, shippingAddress, createdAt } = orderData;
  
  const itemsHtml = orderItems.map(item => {
    const product = item.productId || item.product || {};
    return `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; gap: 15px;">
            ${product.images?.[0] ? `<img src="${product.images[0]}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` : ''}
            <div>
              <strong>${product.name || 'Product'}</strong><br>
              <span style="color: #6b7280; font-size: 14px;">Qty: ${item.quantity}</span>
            </div>
          </div>
        </td>
        <td style="padding: 15px; text-align: right; border-bottom: 1px solid #e5e7eb;">
          <strong>AED${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</strong>
        </td>
      </tr>
    `;
  }).join('');

  const subject = `Order Confirmation - #${orderId.toString().slice(-8).toUpperCase()}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; }
        .order-id { background: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; font-size: 18px; }
        .items-table { width: 100%; background: white; border-radius: 8px; overflow: hidden; margin: 20px 0; }
        .address-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .total-box { background: #1e293b; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: right; }
        .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>
        <div class="content">
          <h2>Hi ${name || 'there'}! 👋</h2>
          <p>Your order has been successfully placed and is being processed.</p>
          
          <div class="order-id">
            <strong>Order ID:</strong> #${orderId.toString().slice(-8).toUpperCase()}<br>
            <span style="color: #6b7280; font-size: 14px;">Placed on ${new Date(createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
          </div>

          <h3>Order Items</h3>
          <table class="items-table" cellpadding="0" cellspacing="0">
            ${itemsHtml}
          </table>

          <div class="total-box">
            <h3 style="margin: 0;">Total Amount: AED${(total || 0).toFixed(2)}</h3>
          </div>

          ${shippingAddress ? `
          <div class="address-box">
            <h3>Shipping Address</h3>
            <p>
              <strong>${shippingAddress.name || name}</strong><br>
              ${shippingAddress.street || ''}<br>
              ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zip || ''}<br>
              ${shippingAddress.country || ''}<br>
              ${shippingAddress.phone ? `Phone: ${shippingAddress.phone}` : ''}
            </p>
          </div>
          ` : ''}

          <center>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders" class="button">Track Your Order</a>
          </center>

          <p style="margin-top: 30px;">We'll send you another email when your order ships. If you have any questions, contact us at <a href="mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}">${process.env.NEXT_PUBLIC_ADMIN_EMAIL}</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Brandstored. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendMail({ to: email, subject, html });
}

// Send order shipped email
export async function sendOrderShippedEmail(orderData) {
  const { email, name, orderId, trackingId, trackingUrl, courier } = orderData;
  
  const subject = `Order Shipped - #${orderId.toString().slice(-8).toUpperCase()}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .tracking-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚚 Your Order is On the Way!</h1>
          <p>Order #${orderId.toString().slice(-8).toUpperCase()}</p>
        </div>
        <div class="content">
          <h2>Hi ${name || 'there'}! 👋</h2>
          <p>Great news! Your order has been shipped and is on its way to you.</p>
          
          ${trackingId || trackingUrl || courier ? `
          <div class="tracking-box">
            <h3 style="margin-top: 0;">Tracking Information</h3>
            ${courier ? `<p><strong>Courier:</strong> ${courier}</p>` : ''}
            ${trackingId ? `<p><strong>Tracking ID:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${trackingId}</code></p>` : ''}
            ${trackingUrl ? `
              <center>
                <a href="${trackingUrl}" class="button">Track Your Shipment</a>
              </center>
            ` : ''}
          </div>
          ` : ''}

          <p>You can also track your order from your dashboard:</p>
          <center>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders" class="button">View Order Details</a>
          </center>

          <p style="margin-top: 30px;">If you have any questions, contact us at <a href="mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}">${process.env.NEXT_PUBLIC_ADMIN_EMAIL}</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Brandstored. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendMail({ to: email, subject, html });
}

// Sends a password setup email to the user (basic implementation)
export async function sendPasswordSetupEmail(email, name) {
  const subject = 'Set up your password';
  const html = `<p>Hi ${name || ''},</p><p>Please click the link below to set your password for your new account.</p>`;
  return sendMail({ to: email, subject, html });
}

