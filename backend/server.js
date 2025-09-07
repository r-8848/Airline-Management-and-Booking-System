const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv').config();
const bodyparser = require('body-parser');
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// MongoDB connection URI
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Connect to MongoDB with error handling
client.connect()
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('\nPlease check:');
    console.log('1. Your MongoDB URI in .env file');
    console.log('2. Database user credentials');
    console.log('3. IP whitelist in MongoDB Atlas');
    process.exit(1);
  });

app.use(bodyparser.json());
const JWT_SECRET = process.env.JWT_SECRET;
let emailTransporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  emailTransporter.verify((error, success) => {
    if (error) {
      console.log('❌ Email configuration error:', error);
      console.log('⚠️  Password reset emails will not work. Please configure email settings in .env file.');
      emailTransporter = null; // Disable email if verification fails
    } else {
      console.log('✅ Email server is ready to send password reset emails');
    }
  });
} else {
  console.log('⚠️  Email credentials not provided. Password reset emails will not work.');
  console.log('   To enable email functionality, set EMAIL_USER and EMAIL_PASS in backend/.env file');
}

// Generate secure reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  if (!emailTransporter) {
    return { success: false, error: 'Email service not configured' };
  }

  // Use IP address for network access
  const frontendUrl = process.env.FRONTEND_URL || 'http://10.41.1.33:5173';
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

// Forgot Password endpoint
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email, userType = 'client' } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Determine which collection to use
    const db = client.db('Airline');
    const collection = userType === 'admin' 
      ? db.collection('AdUsers') 
      : db.collection('Users');

    // Find user by email
    const user = await collection.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email address.' 
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save reset token to database
    await collection.updateOne(
      { email },
      { 
        $set: { 
          resetToken,
          resetTokenExpiry 
        } 
      }
    );

    // Try to send email
    if (emailTransporter) {
      const emailResult = await sendPasswordResetEmail(email, resetToken);
      
      if (emailResult.success) {
        res.json({ 
          success: true, 
          message: 'If an account with that email exists, a password reset link has been sent.' 
        });
      } else {
        // If email fails, return the reset URL for development
        const resetUrl = `http://10.41.1.33:5173/reset-password/${resetToken}`;
        res.json({ 
          success: true, 
          message: 'Email service temporarily unavailable. Use this link to reset your password:',
          resetUrl: resetUrl,
          debugMode: true
        });
      }
    } else {
      // If email is not configured, return the reset URL for development
      const resetUrl = `http://10.41.1.33:5173/reset-password/${resetToken}`;
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
});

// Verify Reset Token endpoint
app.get('/api/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { userType = 'client' } = req.query;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token is required' 
      });
    }

    // Determine which collection to use
    const db = client.db('Airline');
    const collection = userType === 'admin' 
      ? db.collection('AdUsers') 
      : db.collection('Users');

    // Find user with valid reset token
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
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Token verification endpoint
app.post('/api/verify-token', authenticateToken, (req, res) => {
  // If we reach here, the token is valid
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
});

// Reset Password endpoint
app.post('/api/reset-password', async (req, res) => {
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

    // Determine which collection to use
    const db = client.db('Airline');
    const collection = userType === 'admin' 
      ? db.collection('AdUsers') 
      : db.collection('Users');

    // Find user with valid reset token
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

    // Update password directly (no hashing since you removed bcrypt)
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
});

app.get('/api/airlines', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Airlines');
  collection.find().toArray()
    .then(airline => {
      res.json(airline);
    })
    .catch(err => {
      console.error('Error fetching airlines:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/airlines', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Airlines');
  const data = req.body;
  const result = await collection.insertOne(data);
  res.send(result);
});

app.get('/api/airlines-addflt', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Airlines');
  collection.find().toArray()
    .then(airline => {
      res.json(airline);
    })
    .catch(err => {
      console.error('Error fetching airlines:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/airlines-addflt', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Airlines');
  const data = req.body;
  const result = await collection.updateOne(
    { flightCode: data.flightCode },
    { $push: { flights: data.flightNumber } }
  );
  if (result.modifiedCount === 1) {
    res.status(200).send('Flight number added successfully');
  } else {
    res.status(404).send('No matching flight code found');
  }
});

app.get('/api/airports', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Airports');
  collection.find().toArray()
    .then(airports => {
      res.json(airports);
    })
    .catch(err => {
      console.error('Error fetching airports:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});


app.get('/api/bookings', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Bookings');
  collection.find().toArray()
    .then(bookings => {
      res.json(bookings);
    })
    .catch(err => {
      console.error('Error fetching bookings:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/bookings', async (req, res) => {
    const db = client.db('Airline');
    const collection = db.collection('Bookings');
    const { email, data, formData, time, status } = req.body;
    const result = await collection.insertOne({
      email, 
      status,
      data, 
      formData,
      time
    });
});

app.get('/api/booking', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Bookings');
  collection.find().toArray()
    .then(bookings => {
      res.json(bookings);
    })
    .catch(err => {
      console.error('Error fetching bookings:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/booking', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Bookings');
  const { email, flightNumber, departureTime, time, formData } = req.body;
  const result = await collection.updateOne(
    { email, 'data.flightNumber': flightNumber, time, 'data.departureTime': departureTime},
    { $set: { formData } },
  );
  res.send(result);
});

app.get('/api/cancelOne', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Bookings');
  collection.find().toArray()
    .then(bookings => {
      res.json(bookings);
    })
    .catch(err => {
      console.error('Error fetching bookings:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/cancelOne', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Bookings');
  const { email, flightNumber, departureTime, time, passengerIndex } = req.body;
  const result = await collection.updateOne(
    { email, 'data.flightNumber': flightNumber, time, 'data.departureTime': departureTime },
    { $set: { [`formData.${passengerIndex}.status`]: 0 } },
  );
  res.send(result);
});

app.get('/fltstatus', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Status');
  collection.find().toArray()
    .then(status => {
      res.json(status);
    })
    .catch(err => {
      console.error('Error fetching flight status:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

// app.post('/fltstatus', async (req, res) => {
//   const db = client.db('Airline');
//   const collection = db.collection('Flight Status');
//   const { originAirport_, destinationAirport_, selectedDate_ } = req.body;
//   const result = await collection.insertOne({
//     originAirport_,
//     destinationAirport_,
//     selectedDate_,
//   });
// });

app.get('/api/login', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Users');
  collection.find().toArray()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/login', async (req, res) => {
  try {
  const db = client.db('Airline');
  const collection = db.collection('Users');
  const { email, password } = req.body;
    
    // Find user by email
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Check password - handle both hashed and plain text passwords for migration
    let isPasswordValid = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // Password is already hashed
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Password is plain text (legacy), check directly and then hash it
      if (user.password === password) {
        isPasswordValid = true;
        // Hash the password for future use
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
    
    // Generate JWT token
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
});

app.get('/api/adlogin', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('AdUsers');
  collection.find().toArray()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/adlogin', async (req, res) => {
  try {
  const db = client.db('Airline');
  const collection = db.collection('AdUsers');
  const { email, password } = req.body;
    
    // Find admin user by email
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Check password - handle both hashed and plain text passwords for migration
    let isPasswordValid = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // Password is already hashed
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Password is plain text (legacy), check directly and then hash it
      if (user.password === password) {
        isPasswordValid = true;
        // Hash the password for future use
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
    
    // Generate JWT token for admin
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
});

app.get('/api/users', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Users');
  collection.find().toArray()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/users', async (req, res) => {
  try {
  const db = client.db('Airline');
  const collection = db.collection('Users');
    const { title, firstName, lastName, email, password, mobileNumber } = req.body;
    
    // Check if user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already Exists' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with hashed password
    const newUser = { 
      title, 
      firstName, 
      lastName, 
      email, 
      password: hashedPassword, 
      mobileNumber,
      createdAt: new Date(),
      status: 0
    };
    
    await collection.insertOne(newUser);
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/update-profile', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Users');
  collection.find().toArray()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/update-profile', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Users');
  const { email, updatedProfile } = req.body;
  const result = await collection.updateOne(
    { email: email },
    { $set: updatedProfile }
  );
  console.log('Update result:', result);
  if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Profile updated successfully' });
  } else {
      console.log('User not found for update');
      res.status(404).json({ message: 'User not found' });
  }
});

app.get('/api/update-profile-on', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Users');
  collection.find().toArray()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/update-profile-on', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Users');
  const { email, status } = req.body;
  console.log(req.body);
  const result = await collection.updateOne(
    { email: email },
    { $set: {status} }
  );
  console.log('Update status:', status);
  if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Status updated successfully' });
  } else {
      console.log('User not found for update');
      res.status(404).json({ message: 'User not found' });
  }
});

app.get('/api/flights', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flights');
  collection.find().toArray()
    .then(flights => {
      res.json(flights);
    })
    .catch(err => {
      console.error('Error fetching flights:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/flights', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flights');
  const data = req.body;

  try {
    const result = await collection.insertOne(data);
    res.status(201).send('Flight added successfully');
  } catch (error) {
    res.status(400).send('Error adding flight: ' + error.message);
  }
});

app.get('/api/flights/count', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flights');
  const counts = await collection.aggregate([
    { $group: { _id: '$flightName', count: { $sum: 1 } } },
    { $project: { flightName: '$_id', count: 1, _id: 0 } }
    ]).toArray();
    res.json(counts);
});

app.get('/api/feedback', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Feedback');
  collection.find().toArray()
    .then(feedback => {
      res.json(feedback);
    })
    .catch(err => {
      console.error('Error fetching feedback:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/feedback', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Feedback');
  const { email, firstImpression, hearAbout, missingAnything, rating } = req.body;
  const result = await collection.insertOne({
    email,
    firstImpression, 
    hearAbout, 
    missingAnything, 
    rating
  });
  res.json({ success: true});
});

// Change password endpoint
app.post('/api/change-password', authenticateToken, async (req, res) => {
  try {
    const db = client.db('Airline');
    const collection = db.collection('Users');
    const { email, currentPassword, newPassword } = req.body;
    
    // Find user by email
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
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
});

app.get('/api/flightinfo', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  const page = parseInt(req.query.page) || null;
  const lim = 10;
  const skip = (page - 1) * lim;
  if(!page)
  {
	  collection.find().toArray()
		.then(fltinfo => {
		  res.json(fltinfo);
		})
		.catch(err => {
		  console.error('Error fetching flight info:', err);
		  res.status(500).json({ error: 'Server Error' });
		});
  }
  else
  {
	  const total = await collection.countDocuments();
    const totalPages = Math.ceil(total / lim);
    collection.find().skip(skip).limit(lim).toArray()
		.then(fltinfo => {
			res.json({fltinfo, totalPages});
		})
		.catch(err => {
			console.error('Error fetching flight info:', err);
			res.status(500).json({ error: 'Server Error' });
		});
  }
});

app.post('/api/flightinfo', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  const { flightNumber, departureDate } = req.body;
  const fltinfo = await collection.findOne({ flightNumber, departureDate });
    if (!fltinfo) {
      return res.status(400).json({ success: false, message: 'Invalid' });
    }
    res.json(fltinfo);
});

app.get('/api/flightin', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  collection.find().toArray()
    .then(fltinfo => {
      res.json(fltinfo);
    })
    .catch(err => {
      console.error('Error fetching flight info:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/flightin', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  const data = req.body;
  const fltinfo = await collection.insertOne(data);
    res.json(fltinfo);
});

app.get('/api/edit-flightin', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  collection.find().toArray()
    .then(fltinfo => {
      res.json(fltinfo);
    })
    .catch(err => {
      console.error('Error fetching flight info:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/edit-flightin', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  try {
      const {flightNumber, departureTime, arrivalTime, seatsAvailable, prices, olddepTime} = req.body;
      const flight = await collection.updateOne(
        {flightNumber, departureTime: olddepTime},
        {$set: {departureTime, arrivalTime, newdepTime: departureTime, newarrTime: arrivalTime, seatsAvailable, prices}},
      );
      if (flight) {
        res.status(200).json({ message: 'Flight updated successfully' });
      } else {
        res.status(404).json({ message: 'Flight not found' });
      }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/re-edit-flightin', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  collection.find().toArray()
    .then(fltinfo => {
      res.json(fltinfo);
    })
    .catch(err => {
      console.error('Error fetching flight info:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/re-edit-flightin', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  try {
      const {flightNumber, departureTime, arrivalTime, newdepTime, newarrTime} = req.body;
      const flight = await collection.updateOne(
        {flightNumber, departureTime, arrivalTime},
        {$set: {newdepTime, newarrTime}},
      );
      if (flight) {
        res.status(200).json({ message: 'Flight rescheduled successfully' });
      } else {
        res.status(404).json({ message: 'Flight not found' });
      }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/flight', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  collection.find().toArray()
    .then(fltinfo => {
      res.json(fltinfo);
    })
    .catch(err => {
      console.error('Error fetching flight info:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/flight', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  const { flightNumber, departureTime, arrivalTime, passengers, seat } = req.body;
      const result = await collection.updateOne(
          { flightNumber, departureTime},
          { $inc: { [`seatsAvailable.${seat}`]: -passengers } },
      );

      res.send(result);
});

app.get('/api/cancelall', (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  collection.find().toArray()
    .then(fltinfo => {
      res.json(fltinfo);
    })
    .catch(err => {
      console.error('Error fetching flight info:', err);
      res.status(500).json({ error: 'Server Error' });
    });
});

app.post('/api/cancelall', async (req, res) => {
  const db = client.db('Airline');
  const collection = db.collection('Flight Info');
  const { flightNumber, departureTime, arrivalTime, passengers, seat } = req.body;
      const result = await collection.updateOne(
          { flightNumber, departureTime},
          { $inc: { [`seatsAvailable.${seat}`]: passengers } },
      );
      res.send(result);
});

app.post('/api/payments', async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        error: 'Payment service not configured',
        message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.'
      });
    }
    
  const data = req.body;
    
    // Create product
  const product = await stripe.products.create({
    name: `${data.data.seat} Class Ticket(s)`
  });

    if(!product){
      throw new Error('Failed to create product');
    }
    
    // Create price
    const price = await stripe.prices.create({
      product: `${product.id}`,
      unit_amount: data.data.price * 100,
      currency: 'INR',
    });
    
    if(!price.id){
      throw new Error('Failed to create price');
    }
    
    // Determine the base URL based on environment
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://flyhigh-gamma.vercel.app'
      : 'http://localhost:5173';
    
    const Data = encodeURIComponent(JSON.stringify(data));
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: `${price.id}`,
          quantity: data.data.passengers
        }
      ],
      mode: "payment",
      success_url: `${baseUrl}/eticket?info=${Data}`,
      cancel_url: `${baseUrl}/`,
      customer_email: data.user.email,
    });
    
    if(!session || !session.url){
      throw new Error('Failed to create checkout session');
  }
    
  res.json(session);

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ 
      error: 'Payment processing failed', 
      message: error.message 
    });
  }
});

// New improved booking endpoint with concurrency handling
app.post('/api/booking-with-validation', async (req, res) => {
  const session = client.startSession();
  
  try {
    const { email, data, formData, time, status } = req.body;
    const { flightNumber, departureTime, passengers, seat } = data;
    
    await session.withTransaction(async () => {
      const now = new Date();
      const flightDepartureDate = new Date(departureTime);
      const db = client.db('Airline');
      const flightCollection = db.collection('Flight Info');
      const bookingCollection = db.collection('Bookings');
      
      // Step 1: Find and lock the flight document
      const flight = await flightCollection.findOne(
        { flightNumber, departureTime },
        { session }
      );
      
      if (!flight) {
        throw new Error('Flight not found');
      }
      
      // Step 2: Check seat availability
      const seatType = seat.toLowerCase();
      const availableSeats = flight.seatsAvailable[seatType];
      
      console.log('Booking attempt:', {
        flightNumber,
        departureTime,
        seat,
        seatType,
        requestedPassengers: passengers,
        availableSeats,
        seatsAvailable: flight.seatsAvailable
      });
      
      if (!availableSeats || availableSeats < passengers) {
        throw new Error(`Only ${availableSeats || 0} ${seat} seats available, but ${passengers} requested`);
      }
      
      // Step 3: Update seats atomically
      const updateResult = await flightCollection.updateOne(
        { 
          flightNumber, 
          departureTime
        },
        { 
          $inc: { [`seatsAvailable.${seatType}`]: -passengers } 
        },
        { 
          session
        }
      );
      
      if (updateResult.modifiedCount !== 1) {
        throw new Error('Failed to update seat availability. Please try again.');
      }
      
      // Step 4: Create the booking
      const bookingResult = await bookingCollection.insertOne(
        {
          email,
          status,
          data,
          formData,
          time,
          bookingId: new Date().getTime().toString(),
          createdAt: new Date()
        },
        { session }
      );
      
      if (!bookingResult.insertedId) {
        throw new Error('Failed to create booking');
      }
    });
    
    // Get updated flight info after transaction
    const db = client.db('Airline');
    const flightCollection = db.collection('Flight Info');
    const updatedFlight = await flightCollection.findOne({ flightNumber, departureTime });
    
    res.json({ 
      success: true, 
      message: 'Booking confirmed successfully',
      remainingSeats: updatedFlight ? updatedFlight.seatsAvailable : null
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  } finally {
    await session.endSession();
  }
});

// Improved cancellation endpoint with transaction support
app.post('/api/cancel-booking-improved', async (req, res) => {
  const session = client.startSession();
  
  try {
    await session.withTransaction(async () => {
      const db = client.db('Airline');
      const flightCollection = db.collection('Flight Info');
      const bookingCollection = db.collection('Bookings');
      
      const { bookingId, email, flightNumber, departureTime, passengers, seat } = req.body;
      
      // Find the booking
      const booking = await bookingCollection.findOne(
        { _id: new ObjectId(bookingId), email },
        { session }
      );
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      if (booking.status === 0) {
        throw new Error('Booking is already cancelled');
      }
      
      // Update booking status
      const bookingUpdate = await bookingCollection.updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { status: 0, cancelledAt: new Date() } },
        { session }
      );
      
      // Restore seats
      const seatType = seat.toLowerCase();
      const flightUpdate = await flightCollection.updateOne(
        { flightNumber, departureTime },
        { $inc: { [`seatsAvailable.${seatType}`]: passengers } },
        { session }
      );
      
      if (flightUpdate.modifiedCount === 0) {
        throw new Error('Failed to restore seats');
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully' 
    });
    
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  } finally {
    await session.endSession();
  }
});

// Endpoint to check seat availability before showing payment page
app.post('/api/check-availability', async (req, res) => {
  try {
    const db = client.db('Airline');
    const collection = db.collection('Flight Info');
    const { flightNumber, departureTime, passengers, seat } = req.body;

    const flight = await collection.findOne({ flightNumber, departureTime });
    
    if (!flight) {
      return res.status(404).json({ 
        success: false, 
        message: 'Flight not found' 
      });
    }
    
    const seatType = seat.toLowerCase();
    const availableSeats = flight.seatsAvailable[seatType];
    
    if (availableSeats < passengers) {
      return res.json({ 
        success: false, 
        available: false,
        message: `Only ${availableSeats} ${seat} seats available`,
        availableSeats
      });
    }
    
    res.json({ 
      success: true, 
      available: true,
      availableSeats,
      message: 'Seats are available' 
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error checking availability' 
    });
  }
});

// Test endpoint to check server status
app.get('/api/test', (req, res) => {
  res.json({
    status: 'Server is running',
    mongoConnected: client.topology && client.topology.isConnected(),
    stripeConfigured: !!stripe,
    emailConfigured: !!emailTransporter,
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
