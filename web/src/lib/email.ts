import nodemailer from 'nodemailer';

// Create reusable transporter using Gmail SMTP
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (NOT your regular password)
    },
});

// Verify transporter configuration
export async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log('✅ Email server is ready to send messages');
        return true;
    } catch (error) {
        console.error('❌ Email server verification failed:', error);
        return false;
    }
}

// Send contact form email
export async function sendContactEmail({
    name,
    email,
    message,
}: {
    name: string;
    email: string;
    message: string;
}) {
    const mailOptions = {
        from: `"${name}" <${process.env.GMAIL_USER}>`, // Sender name and your Gmail
        to: process.env.GMAIL_USER, // Your company Gmail (where you receive messages)
        replyTo: email, // Customer's email for easy reply
        subject: `New Contact Form Submission from ${name}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #000; color: #fff; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
                    .field { margin-bottom: 20px; }
                    .label { font-weight: bold; color: #555; }
                    .value { margin-top: 5px; padding: 10px; background: #fff; border-left: 3px solid #10b981; }
                    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🍽️ Liberty Meal Prep</h1>
                        <p>New Contact Form Submission</p>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="label">From:</div>
                            <div class="value">${name}</div>
                        </div>
                        <div class="field">
                            <div class="label">Email:</div>
                            <div class="value"><a href="mailto:${email}">${email}</a></div>
                        </div>
                        <div class="field">
                            <div class="label">Message:</div>
                            <div class="value">${message.replace(/\n/g, '<br>')}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This message was sent from the Liberty Meal Prep contact form.</p>
                        <p>Reply directly to this email to respond to ${name}.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
New Contact Form Submission

From: ${name}
Email: ${email}

Message:
${message}

---
This message was sent from the Liberty Meal Prep contact form.
        `.trim(),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
}

// Send order confirmation email to customer
export async function sendOrderConfirmationEmail({
    customerEmail,
    customerName,
    orderNumber,
    orderDetails,
    total,
    transactionsId,
    paymentMethod,
}: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    orderDetails: string;
    total: string;
    transactionsId?: string;
    paymentMethod?: string;
}) {
    const mailOptions = {
        from: `"Liberty Meal Prep" <${process.env.GMAIL_USER}>`,
        to: customerEmail,
        subject: `Order Confirmation #${orderNumber} - Liberty Meal Prep`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #000; color: #fff; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
                    .order-number { font-size: 24px; font-weight: bold; color: #10b981; margin: 20px 0; }
                    .details { background: #fff; padding: 20px; margin: 20px 0; }
                    .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🍽️ Liberty Meal Prep</h1>
                        <p>Thank you for your order!</p>
                    </div>
                    <div class="content">
                        <p>Hi ${customerName},</p>
                        <p>We've received your order and we're excited to prepare your fresh, healthy meals!</p>
                        <div style="margin-bottom: 20px;">
                            <strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
                            <strong>Order #:</strong> ${orderNumber}<br>
                            ${transactionsId ? `<strong>Transaction ID:</strong> ${transactionsId}<br>` : ''}
                        </div>
                        
                        <div class="details">
                            ${orderDetails}
                        </div>
                        
                        <div style="margin-top: 20px; border-top: 2px solid #eee; padding-top: 10px;">
                            ${paymentMethod ? `<div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Payment Method:</span> <span>${paymentMethod}</span></div>` : ''}
                            
                            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem; margin-top: 10px;">
                                <span>Total:</span> <span>${total}</span>
                            </div>
                        </div>

                        <p style="margin-top: 30px;">
                            <strong>📦 Delivery Information:</strong><br>
                            Your meals will be delivered on Sunday between 8AM - 12PM.
                        </p>
                        <p>
                            <strong>❓ Questions?</strong><br>
                            Reply to this email or contact us at ${process.env.GMAIL_USER}
                        </p>
                    </div>
                    <div class="footer">
                        <p>Liberty Meal Prep - Veteran Owned Since 2023</p>
                        <p>Scottsdale, Arizona</p>
                        <p style="margin-top: 20px; font-size: 11px; color: #999; line-height: 1.4;">
                            Payment is processed by: Intuit Payments Inc., 2700 Coast View, CA 94043, Phon number 1-888-536-4801, NMLS #1098819
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Order confirmation email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending order confirmation:', error);
        throw error;
    }
}

// Send password reset email
export async function sendPasswordResetEmail({
    email,
    resetUrl,
}: {
    email: string;
    resetUrl: string;
}) {
    const mailOptions = {
        from: `"Liberty Meal Prep" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request - Liberty Meal Prep',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #000; color: #fff; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
                    .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
                    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Liberty Meal Prep</h1>
                        <p>Password Reset Request</p>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>We received a request to reset your password for your Liberty Meal Prep account.</p>
                        <p>Click the button below to reset your password:</p>
                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="button">RESET PASSWORD</a>
                        </div>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; background: #fff; padding: 10px; border: 1px solid #ddd;">${resetUrl}</p>
                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong><br>
                            This link will expire in 1 hour. If you didn't request this password reset, please ignore this email or contact us if you have concerns.
                        </div>
                    </div>
                    <div class="footer">
                        <p>Liberty Meal Prep - Veteran Owned Since 2023</p>
                        <p>Scottsdale, Arizona</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Password Reset Request

Hello,

We received a request to reset your password for your Liberty Meal Prep account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

---
Liberty Meal Prep - Veteran Owned Since 2023
Scottsdale, Arizona
        `.trim(),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw error;
    }
}

// Send welcome email to new users
export async function sendWelcomeEmail({
    name,
    email,
}: {
    name: string;
    email: string;
}) {
    const mailOptions = {
        from: `"Liberty Meal Prep" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Welcome to the Family! 🥗 - Liberty Meal Prep`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                    .header { background: #000; color: #fff; padding: 40px 20px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; background: linear-gradient(to right, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                    .content { padding: 40px 30px; }
                    .step { margin-bottom: 25px; padding-left: 20px; border-left: 4px solid #fbbf24; }
                    .step-title { font-weight: 800; font-size: 18px; color: #000; margin-bottom: 5px; }
                    .button { display: inline-block; padding: 16px 32px; background: #000; color: #fff; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; transition: transform 0.2s; }
                    .button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
                    .footer { text-align: center; padding: 20px; background: #f9fafb; color: #6b7280; font-size: 13px; }
                    .emoji { font-size: 24px; vertical-align: middle; margin-right: 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div style="font-size: 40px; margin-bottom: 10px;">🥗</div>
                        <h1>Welcome to Liberty Meal Prep!</h1>
                        <p style="color: #9ca3af; margin-top: 10px;">Healthy meals, delivered to your door.</p>
                    </div>
                    <div class="content">
                        <p style="font-size: 18px; font-weight: 500;">Hi ${name}!</p>
                        <p>We're thrilled to have you join our community! You've taken the first step towards convenient, healthy, and delicious eating.</p>
                        
                        <h3 style="margin-top: 30px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">How It Works:</h3>
                        
                        <div class="step">
                            <div class="step-title">1. Browse the Menu 📜</div>
                            Check out our rotating weekly menu. We offer a variety of balanced meals to keep your taste buds happy.
                        </div>

                        <div class="step">
                            <div class="step-title">2. Place Your Order 🛒</div>
                            Select your favorite meals and checkout by <strong>Wednesday at 9PM</strong> to secure your delivery for the upcoming week.
                        </div>

                        <div class="step">
                            <div class="step-title">3. We Cook Fresh 👨‍🍳</div>
                            Our chefs prepare your meals using high-quality ingredients, ensuring everything is fresh and ready to eat.
                        </div>

                        <div class="step">
                            <div class="step-title">4. Sunday Delivery 🚚</div>
                            Sit back and relax! We deliver straight to your doorstep on Sundays between <strong>8AM - 12PM</strong>.
                        </div>

                        <div style="text-align: center; margin-top: 40px;">
                            <a href="https://libertymealprep.com/menu" class="button">See This Week's Menu</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Liberty Meal Prep. All rights reserved.</p>
                        <p>Veteran Owned & Operated 🇺🇸</p>
                        <p>Scottsdale, Arizona</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Welcome to Liberty Meal Prep! 🥗

Hi ${name}! We're thrilled to have you join us.

Here's how it works:
1. Browse the Menu: Check out our rotating weekly selections.
2. Place Your Order: Order by Wednesday at 9PM.
3. We Cook Fresh: Our chefs prepare your meals with care.
4. Sunday Delivery: We deliver to your door between 8AM - 12PM on Sundays.

Ready to get started? Visit our menu: https://libertymealprep.com/menu

Liberty Meal Prep - Veteran Owned 🇺🇸
Scottsdale, Arizona
        `.trim(),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        return { success: false, error };
    }
}


// Send new order notification to admins
export async function sendAdminOrderNotification({
    adminEmails,
    customerName,
    orderNumber,
    total,
    itemsCount,
}: {
    adminEmails: string[];
    customerName: string;
    orderNumber: string;
    total: string;
    itemsCount: number;
}) {
    if (adminEmails.length === 0) return;

    const mailOptions = {
        from: `"Liberty Meal Prep System" <${process.env.GMAIL_USER}>`,
        to: adminEmails.join(','), // Send to all admins
        subject: `🔔 New Order Received! #${orderNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #000; color: #fff; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
                    .button { display: inline-block; padding: 12px 24px; background: #10b981; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Order Alert 🚨</h1>
                    </div>
                    <div class="content">
                        <h2>Order #${orderNumber}</h2>
                        <p><strong>Customer:</strong> ${customerName}</p>
                        <p><strong>Items:</strong> ${itemsCount} meals</p>
                        <p><strong>Total:</strong> ${total}</p>
                        
                        <div style="margin-top: 30px; text-align: center;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders" class="button">View Order in Admin Panel</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Liberty Meal Prep Admin System</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Admin notification emails sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending admin notification:', error);
        // Don't throw, just log
        return { success: false, error };
    }
}

// Send order status update email
export async function sendOrderStatusUpdateEmail({
    customerEmail,
    customerName,
    orderNumber,
    newStatus,
}: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    newStatus: string;
}) {
    const statusMessages: Record<string, { subject: string; message: string }> = {
        'COMPLETED': {
            subject: `Order #${orderNumber} is Ready! 👨‍🍳`,
            message: `Great news! Your order #${orderNumber} has been prepared and is ready for delivery.`
        },
        'DELIVERED': {
            subject: `Order #${orderNumber} has been Delivered! 📦`,
            message: `Your meals have been delivered successfully! Please check your doorstep.`
        },
        'CANCELLED': {
            subject: `Order #${orderNumber} Cancelled 🛑`,
            message: `Your order #${orderNumber} has been cancelled. If you have any questions, please reply to this email.`
        }
    };

    const statusInfo = statusMessages[newStatus];
    if (!statusInfo) return; // Don't send emails for other statuses like PENDING/PAID (covered by other flows)

    const mailOptions = {
        from: `"Liberty Meal Prep" <${process.env.GMAIL_USER}>`,
        to: customerEmail,
        subject: `${statusInfo.subject} - Liberty Meal Prep`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #000; color: #fff; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
                    .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin-top: 20px; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
                    .status-badge { display: inline-block; padding: 6px 12px; background: #fbbf24; color: #000; font-weight: bold; border-radius: 4px; text-transform: uppercase; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🍽️ Liberty Meal Prep</h1>
                        <p>Order Update</p>
                    </div>
                    <div class="content">
                        <h2>Hi ${customerName},</h2>
                        <p>${statusInfo.message}</p>
                        
                        <div style="margin: 20px 0; padding: 15px; background: #fff; border-left: 4px solid #fbbf24;">
                            <strong>Order #:</strong> ${orderNumber}<br>
                            <strong>New Status:</strong> <span class="status-badge">${newStatus}</span>
                        </div>

                        ${newStatus === 'DELIVERED' ? `
                        <p><strong>Did you love your meals?</strong><br>
                        We'd love to hear your feedback! Reply to this email and let us know.</p>
                        ` : ''}

                        <p>Thank you for choosing Liberty Meal Prep!</p>
                        <div style="text-align: center;">
                             <a href="https://libertymealprep.com" class="button">Visit Store</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Liberty Meal Prep - Veteran Owned 🇺🇸</p>
                        <p>Scottsdale, Arizona</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Status update email (${newStatus}) sent:`, info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending status update email:', error);
        return { success: false, error };
    }
}
