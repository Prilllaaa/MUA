const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 10000;

// ======================
// MIDDLEWARE
// ======================
app.use(cors());  // Enable CORS for all origins
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// ======================
// RATE LIMITING
// ======================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// ======================
// EMAIL CONFIGURATION
// ======================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email connection error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// ======================
// ROUTES
// ======================

// 1. ROOT ENDPOINT - Basic info
app.get('/', (req, res) => {
  res.json({
    service: "Reggie's Makeover Backend API",
    status: "running",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      test: "/api/test", 
      contact: "/api/contact (POST)"
    }
  });
});

// 2. HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Contact form API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 3. TEST ENDPOINT
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working perfectly!',
    serverTime: new Date().toISOString(),
    nodeVersion: process.version
  });
});

// 4. CONTACT FORM ENDPOINT
app.post('/api/contact', limiter, async (req, res) => {
  console.log('📩 Contact form submission received:', req.body);
  
  try {
    const { name, email, phone, weddingDate, service, message } = req.body;
    
    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required'
      });
    }
    
    // Prepare email content
    const mailOptions = {
      from: `"Reggie\'s Makeover" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
      subject: `New Bridal Inquiry: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37;">🎀 New Bridal Makeup Inquiry</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #d4af37;">
            <p><strong>👰 Bride's Name:</strong> ${name}</p>
            <p><strong>📞 Phone:</strong> ${phone}</p>
            <p><strong>📧 Email:</strong> ${email || 'Not provided'}</p>
            <p><strong>📅 Wedding Date:</strong> ${weddingDate || 'Not specified'}</p>
            <p><strong>💄 Service:</strong> ${service || 'Not specified'}</p>
            <hr>
            <p><strong>💌 Message:</strong></p>
            <p>${message || 'No additional details provided'}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This inquiry was received on ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
    
    res.status(200).json({
      success: true,
      message: 'Your inquiry has been sent successfully! Regina will contact you within 24 hours.'
    });
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send your inquiry. Please try again or contact us directly via Instagram.'
    });
  }
});

// 5. CATCH-ALL FOR 404 ERRORS
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
    availableEndpoints: ['GET /', 'GET /api/health', 'GET /api/test', 'POST /api/contact']
  });
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`\n✨ ====================================`);
  console.log(`   Reggie's Makeover Backend Started`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`✨ ====================================\n`);
});
