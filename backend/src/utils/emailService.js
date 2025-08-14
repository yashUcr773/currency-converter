import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
class EmailService {
  constructor() {
    // Check if email credentials are available
    const hasCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    
    if (!hasCredentials) {
      console.log('⚠️  Email credentials not configured - email features will be disabled');
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    this.verifyConnection();
  }

  async verifyConnection() {
    if (!this.transporter) {
      return; // Skip verification if no transporter
    }
    
    try {
      await this.transporter.verify();
      if (process.env.NODE_ENV !== 'test') {
        console.log('✅ Email service ready');
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('❌ Email service error:', error.message);
      }
    }
  }

  // Simple email template
  createTemplate(title, content, actionUrl = null, actionText = null) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">${title}</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${content}
        </div>
        ${actionUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" style="background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              ${actionText || 'Click Here'}
            </a>
          </div>
        ` : ''}
        <p style="color: #666; font-size: 14px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `;
  }

  async sendEmail(to, subject, content, actionUrl = null, actionText = null) {
    if (!this.transporter) {
      console.log('⚠️  Email not sent - email service not configured');
      return { success: false, reason: 'Email service not configured' };
    }

    const html = this.createTemplate(subject, content, actionUrl, actionText);
    
    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Trip Tools'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`📧 Email sent: ${subject}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Email failed:', error.message);
      throw error;
    }
  }

  // Simplified email methods
  async sendWelcomeEmail(user, verificationUrl = null) {
    const content = verificationUrl 
      ? `<p>Hi ${user.name},</p><p>Thanks for joining Trip Tools! Please verify your email to get started.</p>`
      : `<p>Hi ${user.name},</p><p>Welcome to Trip Tools! Your account has been created and is ready to use.</p>`;
    
    await this.sendEmail(
      user.email,
      'Welcome to Trip Tools!',
      content,
      verificationUrl,
      verificationUrl ? 'Verify Email' : null
    );
  }

  async sendPasswordResetEmail(user, resetUrl) {
    await this.sendEmail(
      user.email,
      'Reset Your Password',
      `<p>Hi ${user.name},</p><p>Click the button below to reset your password. This link expires in 1 hour.</p>`,
      resetUrl,
      'Reset Password'
    );
  }

  async sendOTPEmail(user, otp) {
    await this.sendEmail(
      user.email,
      'Your Login Code',
      `<p>Hi ${user.name},</p><p>Your login code is:</p><h3 style="font-size: 32px; color: #007cba; text-align: center; margin: 20px 0;">${otp}</h3><p>This code expires in 10 minutes.</p>`
    );
  }

  async sendMagicLinkEmail(user, magicLinkUrl) {
    await this.sendEmail(
      user.email,
      'Sign In to Trip Tools',
      `<p>Hi ${user.name},</p><p>Click the button below to sign in to your account:</p>`,
      magicLinkUrl,
      'Sign In'
    );
  }

  async sendAccountNotFoundEmail(email, signupMagicLinkUrl) {
    await this.sendEmail(
      email,
      'Account Not Found - Trip Tools',
      `<p>Hi there,</p><p>We received a request for a magic link for ${email}, but we don't have an account associated with this email address.</p><p>If you'd like to create an account using magic link signup, click the button below:</p>`,
      signupMagicLinkUrl,
      'Create Account with Magic Link'
    );
  }

  async sendSignupMagicLinkEmail(email, signupMagicLinkUrl) {
    await this.sendEmail(
      email,
      'Complete Your Registration - Trip Tools',
      `<p>Hi there,</p><p>Click the button below to complete your account registration:</p><p><small>This link will expire in 15 minutes for security.</small></p>`,
      signupMagicLinkUrl,
      'Complete Registration'
    );
  }

  async sendLoginNotificationEmail(user, loginInfo) {
    const content = `
      <p>Hi ${user.name},</p>
      <p>We noticed a recent login to your Trip Tools account.</p>
      <div style="background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;">
        <p><strong>Login Details:</strong></p>
        <p>Time: ${loginInfo.timestamp.toLocaleString()}</p>
        <p>Method: ${loginInfo.method}</p>
        <p>IP Address: ${loginInfo.ipAddress}</p>
        <p>Device: ${loginInfo.userAgent}</p>
      </div>
      <p>If this wasn't you, please secure your account immediately by changing your password.</p>
    `;
    
    await this.sendEmail(
      user.email,
      'Login Notification - Trip Tools',
      content
    );
  }
}

export default new EmailService();
