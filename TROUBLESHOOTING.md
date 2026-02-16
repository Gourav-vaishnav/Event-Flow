# 🔧 Troubleshooting Guide

## Backend Server Issues

### ❌ "Cannot find module 'express'"
**Solution:**
```bash
npm install
npm install express cors dotenv multer nodemailer twilio
```

### ❌ "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or use different port
# Update PORT in .env file to 5001
```

### ❌ "Error: ENOENT: no such file or directory, open '.env'"
**Solution:**
```bash
# Copy template
cp .env.example .env

# Then update with your credentials
```

### ❌ "Connection refused" when calling backend
**Solution:**
- Check backend is running: `npm run server`
- Check port in .env matches REACT_APP_API_URL
- Check firewall isn't blocking port 5000
- Verify `http://localhost:5000/api/health` returns 200

---

## Email Service Issues

### ❌ "Gmail SMTP connection refused"
**Solutions:**
1. **Enable Less Secure App Access** (if using regular password)
   - Go to https://myaccount.google.com/security
   - Enable "Less secure app access"

2. **Use App Password** (Recommended)
   - Enable 2FA on your Google account
   - Generate app-specific password: https://support.google.com/accounts/answer/185833
   - Use app password, not regular password

### ❌ "Invalid login credentials"
**Solution:**
- Use **app-specific password**, not Gmail password
- Copy-paste exactly (no extra spaces)
- Verify EMAIL_USER is correct

### ❌ "Email sends but not received"
**Solutions:**
- Check spam folder
- Verify `to:` email address is correct
- Check email HTML formatting

### ❌ "Error: require() of ES Module not allowed"
**Solution:**
- Update `server.ts` to use import/export
- Or rename to `.mjs`
- Or add `"type": "module"` in package.json

---

## SMS/WhatsApp Issues

### ❌ "Invalid Twilio credentials"
**Solution:**
1. Go to https://console.twilio.com
2. Copy Account SID (not Account Name)
3. Copy Auth Token
4. Verify both in .env file

### ❌ "WhatsApp messages not sending"
**Solutions:**
1. **Verify Twilio is funded**
   - Check account balance
   - Add credit card if needed

2. **Check phone number format**
   - Must use E.164 format: +1234567890
   - No spaces or dashes

3. **Verify WhatsApp sandbox is active**
   - Go to Twilio Console → Messaging → Try it out
   - Join WhatsApp sandbox
   - Send test message

4. **Check sender number**
   - TWILIO_WHATSAPP_NUMBER must be activated
   - Format: +1234567890

### ❌ "SMS invalid phone number"
**Solution:**
- Use E.164 format: +1234567890
- Start with country code (+1 for USA/Canada)
- Only numbers, no spaces or special chars

### ❌ "Message quota exceeded"
**Solution:**
- Check Twilio account balance
- Upgrade account or purchase more credit
- Check rate limiting settings

---

## Photo Upload Issues

### ❌ "ENOENT: no such file or directory 'public/uploads'"
**Solution:**
```bash
mkdir -p public/uploads
# Or run setup script: npm run setup.bat (Windows) or ./setup.sh (Mac/Linux)
```

### ❌ "File size exceeds 10MB"
**Solution:**
- Compress image before uploading
- Use online tool like: https://tinypng.com
- Or resize image to smaller dimensions

### ❌ "Invalid file type. Only images allowed"
**Solution:**
- Only upload: JPEG, PNG, GIF, WebP
- Check file extension
- Don't upload documents or videos

### ❌ "Image upload returns 500 error"
**Solutions:**
1. Check disk space: `df -h` (Mac/Linux) or `dir` (Windows)
2. Check file permissions: `chmod 755 public/uploads`
3. Check uploaded file: `ls -la public/uploads/`

### ❌ "Image URL shows 404"
**Solution:**
- Check image file exists in `public/uploads/`
- Verify REACT_APP_API_URL is correct
- Check filename in database matches actual file

---

## Frontend Issues

### ❌ "CORS error: Access-Control-Allow-Origin"
**Solution:**
1. Verify backend has CORS enabled
2. Check `cors()` middleware in server.ts
3. Ensure REACT_APP_API_URL matches backend URL
4. Check backend is running

### ❌ "Vite dev server won't start"
**Solution:**
```bash
npm install
npm run dev
# If still fails, check if port 5173 is in use
```

### ❌ "Module not found: '@google/genai'"
**Solution:**
```bash
npm install @google/genai
```

### ❌ "Blank page on localhost:5173"
**Solutions:**
1. Check browser console for errors
2. Clear browser cache: `Cmd+Shift+Delete` (Mac) or `Ctrl+Shift+Delete` (Windows)
3. Check vite.config.ts is correct
4. Rebuild: `npm run build` then `npm run preview`

### ❌ "Tailwind CSS not loading"
**Solution:**
- Vite uses CDN via index.html
- Check internet connection
- CDN might be blocked, load locally:
  ```bash
  npm install -D tailwindcss
  ```

---

## Environment Variable Issues

### ❌ "GEMINI_API_KEY undefined"
**Solution:**
1. Create `.env.local` in project root
2. Add: `GEMINI_API_KEY=your_key_here`
3. Restart dev server
4. Verify key is from: https://ai.google.dev

### ❌ "process.env is undefined in server"
**Solution:**
- Install dotenv: `npm install dotenv`
- Import in server.ts: `import dotenv from 'dotenv'; dotenv.config();`

### ❌ "Environment variable not loading"
**Solution:**
1. Ensure file is named `.env` (not `.env.local` or `.env.example`)
2. No quotes around values: `KEY=value` (not `KEY="value"`)
3. Restart dev server after changes
4. Check .gitignore includes `.env`

---

## Deployment Issues

### ❌ "Vercel build fails"
**Solutions:**
1. Check build log for specific error
2. Ensure Node.js version is 16+
3. Verify all environment variables are set
4. Run `npm run build` locally to test

### ❌ "Backend deploys but frontend can't reach it"
**Solution:**
1. Set REACT_APP_API_URL to backend URL
2. Check CORS is enabled on backend
3. Verify backend is running
4. Test backend directly: `curl https://your-backend.com/api/health`

### ❌ "Images disappear after redeployment"
**Solution:**
- Use persistent storage: Cloudinary, AWS S3, or Render Disk
- Local `public/uploads/` gets reset on deploy
- Update DEPLOYMENT.md for production setup

### ❌ "Vercel Function timeout"
**Solution:**
- Keep functions under 30 seconds
- For long operations, use background jobs
- Consider moving backend to separate service

---

## Performance Issues

### ❌ "Website loads slowly"
**Solutions:**
1. Check images are lazy-loaded
2. Verify code splitting is working: DevTools → Network
3. Check bundle size: `npm run build` then check `dist/`
4. Enable caching headers

### ❌ "Images take forever to load"
**Solution:**
- Images should use LazyImage component
- Check IntersectionObserver is supported (modern browsers)
- Verify images are optimized (< 1MB each)

### ❌ "Build is huge (> 500KB)"
**Solution:**
1. Check for unused dependencies
2. Enable code splitting
3. Use dynamic imports: `lazy(() => import('./Component'))`
4. Remove development dependencies from production

---

## Database/Storage Issues

### ❌ "Data persists in one tab but not another"
**Explanation:**
- EventFlow uses localStorage (tab-specific)
- Each browser tab has its own storage
- **This is by design** for local-only storage
- **For multi-user support**, implement backend database (MongoDB, PostgreSQL, etc.)

### ❌ "Data lost after browser clear"
**Explanation:**
- localStorage is cleared when you clear browser data
- **This is by design** - no persistent database yet
- **To persist**: Implement actual database

---

## Getting Help

### Check Logs
```bash
# Frontend
npm run dev  # Check terminal output
# Browser DevTools → Console tab

# Backend
npm run server  # Check terminal output
# Use curl to test: curl http://localhost:5000/api/health
```

### Debug API Calls
```javascript
// Open browser console and test:
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

### Common Debugging Commands
```bash
# Check Node version
node --version

# Check npm version
npm --version

# List all processes
ps aux | grep node  # Mac/Linux
tasklist | findstr node  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Check port usage
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows
```

### Test Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Upload image
curl -F "image=@path/to/image.jpg" http://localhost:5000/api/upload

# Send email
curl -X POST http://localhost:5000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","subject":"Test","body":"Test email","eventName":"Test Event"}'
```

---

## Still Stuck?

1. **Check IMPLEMENTATION_SUMMARY.md** - Overview of all changes
2. **Check DEPLOYMENT.md** - Detailed deployment guide
3. **Check QUICK_REFERENCE.md** - Quick lookup
4. **Review error message carefully** - Copy exact error to search
5. **Check GitHub Issues** - If using version control
6. **Review server/backend logs** - Most errors are logged there

## 📝 Common Patterns

### Reset Everything
```bash
rm -rf node_modules dist
npm install
npm run setup.bat  # or ./setup.sh
npm run dev:all
```

### Test Just Backend
```bash
npm run server
# In another terminal:
curl http://localhost:5000/api/health
```

### Test Just Frontend
```bash
npm run dev
# Visit http://localhost:5173
```

### Production Test
```bash
npm run build
npm run preview
# Visit http://localhost:4173
```

Good luck! 🚀
