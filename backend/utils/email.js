const nodemailer = require('nodemailer');

let emailTransporter = null;

const initializeEmailTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    emailTransporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    emailTransporter.verify((error, success) => {
      if (error) {
        console.log('❌ Email configuration error:', error);
        console.log('⚠️  Password reset emails will not work. Please configure email settings in .env file.');
        emailTransporter = null;
      } else {
        console.log('✅ Email server is ready to send password reset emails');
      }
    });
  } else {
    console.log('⚠️  Email credentials not provided. Password reset emails will not work.');
    console.log('   To enable email functionality, set EMAIL_USER and EMAIL_PASS in backend/.env file');
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  if (!emailTransporter) {
    return { success: false, error: 'Email service not configured' };
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: '🔒 Password Reset Request - Flyhigh Airlines',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8b1c64; margin: 0;">Flyhigh Airlines</h1>
          <p style="color: #666; margin: 5px 0;">Password Reset Request</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #666; line-height: 1.6;">
            We received a request to reset your password for your Flyhigh Airlines account. 
            If you didn't make this request, you can safely ignore this email.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #8b1c64; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;
                      font-weight: bold;">
              Reset My Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            This link will expire in 30 minutes for security reasons. If the button doesn't work, 
            you can copy and paste this link into your browser:
          </p>
          <p style="word-break: break-all; color: #8b1c64; font-size: 14px;">
            ${resetUrl}
          </p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>If you didn't request this password reset, please contact our support team.</p>
          <p>&copy; 2024 Flyhigh Airlines. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Password Reset Request - Flyhigh Airlines
      
      We received a request to reset your password for your Flyhigh Airlines account.
      
      To reset your password, click the following link:
      ${resetUrl}
      
      This link will expire in 30 minutes for security reasons.
      
      If you didn't request this password reset, you can safely ignore this email.
      
      © 2024 Flyhigh Airlines. All rights reserved.
    `
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { 
  initializeEmailTransporter, 
  sendPasswordResetEmail,
  getEmailTransporter: () => emailTransporter
};

