import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Email Service
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use app-specific password
  }
});

// Twilio Service
const twilioClient = process.env.TWILIO_ACCOUNT_SID ? 
  twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : 
  null;

// Routes

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Image Upload
app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const imageUrl = `${process.env.SERVER_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
  res.json({ 
    success: true, 
    imageUrl,
    filename: req.file.filename 
  });
});

// Send Email Invitation
app.post('/api/send-email', async (req: Request, res: Response) => {
  const { email, subject, body, eventName } = req.body;
  
  if (!email || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>${eventName}</h2>
          <div style="white-space: pre-wrap; line-height: 1.6;">
            ${body.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </div>
          <p style="color: #666; margin-top: 20px; font-size: 12px;">
            Sent from EventFlow - Your Event Management Platform
          </p>
        </div>
      `
    };
    
    await emailTransporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Send WhatsApp Message
app.post('/api/send-whatsapp', async (req: Request, res: Response) => {
  const { phoneNumber, eventName, eventDate, eventLocation, rsvpLink } = req.body;
  
  if (!phoneNumber || !twilioClient) {
    return res.status(400).json({ error: 'WhatsApp service not configured or phone number missing' });
  }
  
  try {
    const message = await twilioClient.messages.create({
      body: `🎉 *${eventName}*\n\n📅 ${eventDate}\n📍 ${eventLocation}\n\n👉 RSVP Here: ${rsvpLink}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phoneNumber}`
    });
    
    res.json({ success: true, messageId: message.sid });
  } catch (error) {
    console.error('WhatsApp error:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp message', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Send SMS
app.post('/api/send-sms', async (req: Request, res: Response) => {
  const { phoneNumber, eventName, eventDate, rsvpLink } = req.body;
  
  if (!phoneNumber || !twilioClient) {
    return res.status(400).json({ error: 'SMS service not configured or phone number missing' });
  }
  
  try {
    const message = await twilioClient.messages.create({
      body: `${eventName} - ${eventDate}. RSVP: ${rsvpLink}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    res.json({ success: true, messageId: message.sid });
  } catch (error) {
    console.error('SMS error:', error);
    res.status(500).json({ error: 'Failed to send SMS', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Delete image
app.delete('/api/uploads/:filename', (req: Request, res: Response) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Image deleted' });
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
