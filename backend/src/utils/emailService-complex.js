import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready to send messages');
    } catch (error) {
      console.error('❌ Email service configuration error:', error.message);
    }
  }

  async sendMail(to, subject, html, text = null) {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || this.extractTextFromHtml(html),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      throw new Error('Failed to send email');
    }
  }

  extractTextFromHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  async sendWelcomeEmail(user, verificationUrl) {
    const subject = 'Welcome to Trip Tools - Verify Your Email';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Trip Tools</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .button:hover { background: #5a67d8; }
          .highlight { background: #f0f8ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Trip Tools!</h1>
            <p>Your all-in-one travel companion</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>Thank you for joining Trip Tools, the ultimate travel utility app with everything you need for your trips:</p>
            
            <div class="highlight">
              <h3>🚀 What you can do with Trip Tools:</h3>
              <ul>
                <li>💱 Convert between 150+ currencies with real-time rates</li>
                <li>🌍 Manage multiple timezones and world clocks</li>
                <li>📅 Plan and track your travel itineraries</li>
                <li>🧮 Access powerful calculation tools</li>
                <li>🌐 Use everything offline with PWA technology</li>
                <li>🗣️ Available in 10+ languages</li>
              </ul>
            </div>

            <p>To get started and access all premium features, please verify your email address:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p><strong>This verification link will expire in 24 hours.</strong></p>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            
            <p>If you didn't create an account with Trip Tools, please ignore this email.</p>
            
            <p>Happy travels!<br>
            <strong>The Trip Tools Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Trip Tools. All rights reserved.</p>
            <p>Visit us at <a href="https://trip-tools.com" style="color: #667eea;">trip-tools.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail(user.email, subject, html);
  }

  async sendPasswordResetEmail(user, resetUrl) {
    const subject = 'Reset Your Trip Tools Password';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
          .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .button:hover { background: #e74c3c; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>We received a request to reset your Trip Tools password. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Important Security Information:</strong></p>
              <ul>
                <li>This reset link will expire in 30 minutes</li>
                <li>The link can only be used once</li>
                <li>If you didn't request this reset, please ignore this email</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
            
            <p>For security reasons, we recommend:</p>
            <ul>
              <li>Using a strong, unique password</li>
              <li>Not sharing your password with anyone</li>
              <li>Logging out from shared devices</li>
            </ul>
            
            <p>If you have any concerns about your account security, please contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>The Trip Tools Security Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Trip Tools. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail(user.email, subject, html);
  }

  async sendOTPEmail(user, otp) {
    const subject = 'Your Trip Tools Login Code';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Login Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
          .otp-code { font-size: 32px; font-weight: bold; text-align: center; padding: 20px; background: #f8f9fa; border: 2px dashed #4facfe; border-radius: 10px; margin: 20px 0; letter-spacing: 5px; }
          .expiry-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Your Login Code</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>Here's your one-time login code for Trip Tools:</p>
            
            <div class="otp-code">${otp}</div>
            
            <div class="expiry-notice">
              <p><strong>⏰ This code expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes</strong></p>
            </div>
            
            <p>Enter this code on the login page to access your account. For your security:</p>
            <ul>
              <li>Don't share this code with anyone</li>
              <li>Use it only on the official Trip Tools website</li>
              <li>If you didn't request this code, please ignore this email</li>
            </ul>
            
            <p>If you're having trouble logging in, you can also use your regular password or request a magic link.</p>
            
            <p>Safe travels!<br>
            <strong>The Trip Tools Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Trip Tools. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail(user.email, subject, html);
  }

  async sendMagicLinkEmail(user, magicLinkUrl) {
    const subject = 'Your Trip Tools Magic Login Link';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Magic Login Link</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
          .button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
          .magic-icon { font-size: 48px; margin: 20px 0; }
          .expiry-notice { background: #e8f4fd; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="magic-icon">✨</div>
            <h1>Magic Login Link</h1>
            <p>No password needed!</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>You requested a magic login link for your Trip Tools account. Click the button below to sign in instantly:</p>
            
            <div style="text-align: center;">
              <a href="${magicLinkUrl}" class="button">🚀 Sign Me In</a>
            </div>
            
            <div class="expiry-notice">
              <p><strong>⏰ This magic link expires in ${process.env.MAGIC_LINK_EXPIRY_MINUTES || 15} minutes</strong></p>
            </div>
            
            <p><strong>How it works:</strong></p>
            <ul>
              <li>Click the button above or the link below</li>
              <li>You'll be automatically signed into your account</li>
              <li>No password required!</li>
              <li>The link works only once for security</li>
            </ul>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${magicLinkUrl}</p>
            
            <p><strong>Security Note:</strong> If you didn't request this magic link, please ignore this email. The link will expire automatically.</p>
            
            <p>Happy travels!<br>
            <strong>The Trip Tools Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Trip Tools. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail(user.email, subject, html);
  }

  async sendLoginNotificationEmail(user, loginInfo) {
    const subject = 'New Login to Your Trip Tools Account';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Login Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
          .info-box { background: #f8f9fa; padding: 15px; border-left: 4px solid #fcb69f; margin: 20px 0; }
          .security-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Login Notification</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>We wanted to let you know that there was a new login to your Trip Tools account.</p>
            
            <div class="info-box">
              <h3>Login Details:</h3>
              <ul>
                <li><strong>Time:</strong> ${new Date(loginInfo.timestamp).toLocaleString()}</li>
                <li><strong>IP Address:</strong> ${loginInfo.ipAddress}</li>
                <li><strong>Device/Browser:</strong> ${loginInfo.userAgent}</li>
                <li><strong>Login Method:</strong> ${loginInfo.method}</li>
              </ul>
            </div>
            
            <div class="security-notice">
              <p><strong>🛡️ Was this you?</strong></p>
              <p>If you recognize this login, no action is needed. If you don't recognize this activity, please:</p>
              <ul>
                <li>Change your password immediately</li>
                <li>Review your account activity</li>
                <li>Contact our support team if needed</li>
              </ul>
            </div>
            
            <p>We take your account security seriously and notify you of all login activity to help keep your account safe.</p>
            
            <p>Best regards,<br>
            <strong>The Trip Tools Security Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Trip Tools. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail(user.email, subject, html);
  }
}

export default new EmailService();
