const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getDB } = require('../config/database');
const { sendPasswordResetEmail, getEmailTransporter } = require('../utils/email');

const JWT_SECRET = process.env.JWT_SECRET;

// Generate secure reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Client Login
const loginUser = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Users');
    const { email, password } = req.body;
    
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Check password - handle both hashed and plain text passwords for migration
    let isPasswordValid = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      if (user.password === password) {
        isPasswordValid = true;
        const hashedPassword = await bcrypt.hash(password, 10);
        await collection.updateOne(
          { email },
          { $set: { password: hashedPassword } }
        );
      }
    }
    
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: 'client',
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      message: 'Login successful', 
      token,
      user: {
        title: user.title, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: 'client'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('AdUsers');
    const { email, password } = req.body;
    
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    let isPasswordValid = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      if (user.password === password) {
        isPasswordValid = true;
        const hashedPassword = await bcrypt.hash(password, 10);
        await collection.updateOne(
          { email },
          { $set: { password: hashedPassword } }
        );
      }
    }
    
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: 'admin',
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      message: 'Login successful', 
      token,
      user: {
        title: user.title, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Verify Token
const verifyToken = (req, res) => {
  res.json({ 
    success: true, 
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      title: req.user.title,
      firstName: req.user.firstName,
      lastName: req.user.lastName
    }
  });
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email, userType = 'client' } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const db = getDB();
    const collection = userType === 'admin' 
      ? db.collection('AdUsers') 
      : db.collection('Users');

    const user = await collection.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email address.' 
      });
    }

    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await collection.updateOne(
      { email },
      { 
        $set: { 
          resetToken,
          resetTokenExpiry 
        } 
      }
    );

    const emailTransporter = getEmailTransporter();
    if (emailTransporter) {
      const emailResult = await sendPasswordResetEmail(email, resetToken);
      
      if (emailResult.success) {
        res.json({ 
          success: true, 
          message: 'If an account with that email exists, a password reset link has been sent.' 
        });
      } else {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
        res.json({ 
          success: true, 
          message: 'Email service temporarily unavailable. Use this link to reset your password:',
          resetUrl: resetUrl,
          debugMode: true
        });
      }
    } else {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
      res.json({ 
        success: true, 
        message: 'Email service not configured. Use this link to reset your password:',
        resetUrl: resetUrl,
        debugMode: true
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Verify Reset Token
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { userType = 'client' } = req.query;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token is required' 
      });
    }

    const db = getDB();
    const collection = userType === 'admin' 
      ? db.collection('AdUsers') 
      : db.collection('Users');

    const user = await collection.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Reset token is valid',
      email: user.email 
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, userType = 'client' } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    const db = getDB();
    const collection = userType === 'admin' 
      ? db.collection('AdUsers') 
      : db.collection('Users');

    const user = await collection.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await collection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date(),
          resetToken: null,
          resetTokenExpiry: null 
        }
      }
    );

    res.json({ 
      success: true, 
      message: 'Password has been reset successfully. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Users');
    const { email, currentPassword, newPassword } = req.body;
    
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await collection.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );
    
    if (result.modifiedCount === 1) {
      res.json({ success: true, message: 'Password changed successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update password' });
    }
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  loginUser,
  loginAdmin,
  verifyToken,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword
};

