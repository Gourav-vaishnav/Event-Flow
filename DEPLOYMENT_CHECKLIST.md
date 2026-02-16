# ✅ EventFlow - Setup & Deployment Checklist

## 📋 Pre-Deployment Checklist

### Phase 1: Local Setup
- [ ] Clone/download repository
- [ ] Run `npm install`
- [ ] Run setup script (Windows: `npm run setup.bat`, Mac/Linux: `./setup.sh`)
- [ ] Create `.env.local` with Gemini API key
- [ ] Create `.env` with credentials (optional)
- [ ] Verify `public/uploads/` directory exists

### Phase 2: Local Testing
- [ ] Run `npm run dev:all`
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend runs at http://localhost:5000
- [ ] Backend health check: curl http://localhost:5000/api/health
- [ ] Can create event
- [ ] Can upload photo
- [ ] Can add email invitees
- [ ] Can add phone invitees
- [ ] Dark mode toggle works
- [ ] Responsive design works on mobile

### Phase 3: Feature Testing
- [ ] Email invitation generation (requires Gemini API key)
- [ ] Email sending (requires Gmail credentials)
- [ ] SMS sending (requires Twilio setup)
- [ ] WhatsApp sending (requires Twilio WhatsApp setup)
- [ ] Photo lazy loading works
- [ ] Dashboard displays correctly
- [ ] RSVP page works
- [ ] RSVP submission works

### Phase 4: Production Build
- [ ] Run `npm run build`
- [ ] Check `dist/` folder created
- [ ] Run `npm run preview`
- [ ] Production build works at http://localhost:4173
- [ ] All features work in production build

---

## 🚀 Deployment Checklist

### Phase 5: Frontend Deployment (Vercel)
- [ ] Push code to GitHub
- [ ] Log in to Vercel (vercel.com)
- [ ] Import GitHub repository
- [ ] Auto-detect Vite framework
- [ ] Set environment variables:
  - [ ] `GEMINI_API_KEY` = your_api_key
  - [ ] `REACT_APP_API_URL` = https://your-backend.com
- [ ] Deploy
- [ ] Verify deployment succeeds
- [ ] Test frontend URL works
- [ ] Verify SEO meta tags (DevTools)

### Phase 6: Backend Deployment (Render/Railway)

#### Option A: Render.com
- [ ] Go to render.com
- [ ] New Web Service
- [ ] Connect GitHub repo
- [ ] Configure:
  - [ ] Name: eventflow-api
  - [ ] Build: `npm install`
  - [ ] Start: `npm run server`
  - [ ] Environment: Node
- [ ] Set environment variables:
  - [ ] PORT = 5000
  - [ ] NODE_ENV = production
  - [ ] SERVER_URL = https://your-render-url.com
  - [ ] EMAIL_USER = your_email
  - [ ] EMAIL_PASSWORD = app_password
  - [ ] TWILIO_ACCOUNT_SID = your_sid
  - [ ] TWILIO_AUTH_TOKEN = your_token
  - [ ] TWILIO_PHONE_NUMBER = +1234567890
  - [ ] TWILIO_WHATSAPP_NUMBER = +1234567890
  - [ ] GEMINI_API_KEY = your_key
- [ ] Deploy
- [ ] Test health endpoint: https://your-render-url/api/health

#### Option B: Railway.app
- [ ] Go to railway.app
- [ ] Create new project
- [ ] Deploy from GitHub
- [ ] Select repository
- [ ] Configure environment variables (same as above)
- [ ] Deploy
- [ ] Note the deployment URL

### Phase 7: Connect Frontend to Backend
- [ ] Go to Vercel dashboard
- [ ] Find your project
- [ ] Settings → Environment Variables
- [ ] Update `REACT_APP_API_URL` to your backend URL
- [ ] Redeploy
- [ ] Test email/SMS/WhatsApp sending

### Phase 8: Post-Deployment Testing
- [ ] Visit frontend URL
- [ ] Create test event
- [ ] Upload test photo
- [ ] Verify photo displays
- [ ] Test email sending
- [ ] Test SMS sending (if configured)
- [ ] Test WhatsApp sending (if configured)
- [ ] Test RSVP page
- [ ] Check response tracking

---

## 🔧 Configuration Checklist

### Google Gemini API Setup
- [ ] Go to https://ai.google.dev
- [ ] Create API key
- [ ] Copy key to `.env.local`
- [ ] Test with sample prompt
- [ ] Copy key to Vercel environment variables

### Gmail Setup (for Email Sending)
- [ ] Go to https://myaccount.google.com/security
- [ ] Enable 2-Step Verification
- [ ] Generate App Password
- [ ] Copy app password to `.env` EMAIL_PASSWORD
- [ ] Test email sending locally
- [ ] Copy to backend environment variables

### Twilio Setup (for SMS/WhatsApp)
- [ ] Go to https://www.twilio.com/console
- [ ] Copy Account SID
- [ ] Copy Auth Token
- [ ] Verify phone number
- [ ] Get Twilio phone number (+1234567890)
- [ ] For WhatsApp: Set up WhatsApp sandbox
- [ ] Test SMS sending
- [ ] Test WhatsApp sending
- [ ] Copy credentials to environment variables

---

## 📊 Verification Checklist

### Frontend Verification
- [ ] Page loads in < 2 seconds
- [ ] Dark mode toggle works
- [ ] Mobile responsive (test on device)
- [ ] SEO meta tags present (DevTools)
- [ ] No console errors
- [ ] Images lazy load (Network tab)
- [ ] Forms validate input
- [ ] Error messages display

### Backend Verification
- [ ] Health check returns 200
- [ ] Can upload images
- [ ] Can send emails
- [ ] Can send SMS (if configured)
- [ ] Can send WhatsApp (if configured)
- [ ] Error handling works
- [ ] No memory leaks
- [ ] Response times < 2 seconds

### Data Verification
- [ ] Events saved to localStorage
- [ ] Photos saved to server
- [ ] RSVP responses recorded
- [ ] Dashboard shows correct stats
- [ ] Charts render correctly

### Security Verification
- [ ] API keys not in code
- [ ] Environment variables set
- [ ] CORS configured
- [ ] File uploads validated
- [ ] No sensitive data in logs
- [ ] HTTPS used (production)

---

## 📱 Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🎨 UI/UX Verification

- [ ] All buttons clickable
- [ ] Forms keyboard accessible
- [ ] Touch targets 44px+
- [ ] Color contrast sufficient
- [ ] No layout shifts
- [ ] Animations smooth
- [ ] Loading states visible
- [ ] Error messages clear

---

## 📈 Performance Checklist

Run `npm run build` and check:
- [ ] Bundle size < 200KB (gzipped)
- [ ] CSS < 50KB
- [ ] JavaScript < 150KB
- [ ] Images optimized
- [ ] No unused dependencies
- [ ] Code splitting active

Test with DevTools Lighthouse:
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

---

## 🐛 Known Limitations & Future Enhancements

### Current Limitations
- [ ] Note: No database (uses localStorage)
- [ ] Photos stored on server disk (use Cloudinary for production)
- [ ] No user authentication
- [ ] Single-server deployment
- [ ] No backup system

### Future Enhancements
- [ ] [ ] Implement MongoDB/PostgreSQL
- [ ] [ ] User authentication (Auth0, Firebase)
- [ ] [ ] Cloud storage (Cloudinary, AWS S3)
- [ ] [ ] Real-time updates (WebSocket)
- [ ] [ ] Payment integration (Stripe)
- [ ] [ ] Calendar integration (Google Calendar)
- [ ] [ ] Video conferencing (Zoom)
- [ ] [ ] Analytics dashboard
- [ ] [ ] API rate limiting
- [ ] [ ] Cron jobs for reminders

---

## 🚨 Emergency Procedures

### Backend Server Down
1. [ ] Check Render/Railway dashboard
2. [ ] Check logs for errors
3. [ ] Redeploy if needed
4. [ ] Test health endpoint

### Email Not Sending
1. [ ] Check Gmail credentials
2. [ ] Verify app password (not Gmail password)
3. [ ] Check SMTP settings
4. [ ] Check logs for errors

### Images Not Uploading
1. [ ] Check disk space on server
2. [ ] Check file permissions
3. [ ] Verify file < 10MB
4. [ ] Check file is image type

### CORS Errors
1. [ ] Verify backend running
2. [ ] Check REACT_APP_API_URL correct
3. [ ] Verify cors() middleware active
4. [ ] Check browser console for specific error

---

## 📞 Support Resources

### Documentation
- [ ] IMPLEMENTATION_SUMMARY.md - What was added
- [ ] DEPLOYMENT.md - How to deploy
- [ ] QUICK_REFERENCE.md - Quick lookup
- [ ] TROUBLESHOOTING.md - Common issues
- [ ] FEATURES_OVERVIEW.md - Feature matrix

### External Resources
- [ ] [Vercel Docs](https://vercel.com/docs)
- [ ] [Render Docs](https://render.com/docs)
- [ ] [Railway Docs](https://railway.app)
- [ ] [Express Docs](https://expressjs.com)
- [ ] [Twilio Docs](https://www.twilio.com/docs)
- [ ] [Nodemailer Docs](https://nodemailer.com)

---

## ✨ Final Steps

### Before Going Live
- [ ] Test all features
- [ ] Review security settings
- [ ] Set up monitoring/alerts
- [ ] Create backup strategy
- [ ] Document deployment process
- [ ] Train support team (if applicable)

### Launch Day
- [ ] Do final smoke test
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Be ready to respond to issues
- [ ] Have rollback plan

### Post-Launch
- [ ] Monitor performance
- [ ] Collect user feedback
- [ ] Plan improvements
- [ ] Schedule regular backups
- [ ] Update dependencies

---

## 📋 Sign-Off

- [ ] Developer: _________________ Date: _______
- [ ] QA Tester: ________________ Date: _______
- [ ] Product Manager: __________ Date: _______

---

## 📝 Notes

```
Add any deployment notes, issues, or special instructions here:




```

---

**Congratulations! EventFlow is ready for deployment! 🚀**
