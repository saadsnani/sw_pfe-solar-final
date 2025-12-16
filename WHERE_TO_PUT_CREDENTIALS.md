# 🎯 Exact Location Reference - Where to Put Credentials

## Step-by-Step Visual Guide

### 1. Get Credentials from EmailJS

#### Find Your Public Key
```
https://dashboard.emailjs.com/
     ↓
[Account Icon in Top Right] → Account Settings
     ↓
Copy: "Public Key"
```

#### Get Your Service ID
```
https://dashboard.emailjs.com/
     ↓
Left Sidebar → "Email Services"
     ↓
[Your Connected Service]
     ↓
Copy: "Service ID"
```

#### Create Template 1: Login Logs
```
https://dashboard.emailjs.com/
     ↓
Left Sidebar → "Email Templates"
     ↓
[+ Create New Template]
     ↓
Name: Login Log Template
Template ID: template_abc123... (COPY THIS)
```

#### Create Template 2: Feedback
```
https://dashboard.emailjs.com/
     ↓
Left Sidebar → "Email Templates"
     ↓
[+ Create New Template]
     ↓
Name: Feedback Template  
Template ID: template_def456... (COPY THIS)
```

---

### 2. Create .env.local File

**Location:** Project root directory
```
c:\Users\SAAD\Desktop\solar-dashboard-pfe\.env.local
```

**Content:**
```env
# Paste your EmailJS credentials here
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xyz123abc
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_LOGIN=template_abc123xyz
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_FEEDBACK=template_def456uvw
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xyz123abc456def789
```

---

### 3. Update Code Files

#### File 1: [lib/email-service.ts](lib/email-service.ts)

```typescript
// ⬇️ LINES 1-50
import emailjs from "@emailjs/browser"

// ⚠️ CONFIGURATION: Add your EmailJS credentials here
// Get these from: https://dashboard.emailjs.com/
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID"
        ↑
        Environment variable automatically picks up from .env.local

const TEMPLATE_ID_LOGIN = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_LOGIN || "YOUR_LOGIN_TEMPLATE_ID"
        ↑
        Environment variable automatically picks up from .env.local

const TEMPLATE_ID_FEEDBACK = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_FEEDBACK || "YOUR_FEEDBACK_TEMPLATE_ID"
        ↑
        Environment variable automatically picks up from .env.local

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY"
        ↑
        Environment variable automatically picks up from .env.local

// ... rest of code ...

// ⬇️ LINE 25 - CHANGE THIS:
export async function sendLogToEmail(...) {
  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID_LOGIN, {
      to_email: "YOUR_ADMIN_EMAIL@example.com",  // ← CHANGE TO YOUR EMAIL
      user_email: email,
      login_status: status,
      login_timestamp: new Date(timestamp).toLocaleString("en-US"),
      // ... rest of variables ...
    })

// ⬇️ LINE 44 - CHANGE THIS:
export async function sendFeedbackToEmail(...) {
  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID_FEEDBACK, {
      to_email: "YOUR_ADMIN_EMAIL@example.com",  // ← CHANGE TO YOUR EMAIL
      user_name: name,
      user_email: email,
      feedback_rating: `${rating} / 5`,
      // ... rest of variables ...
    })
```

**What to Change:**
- Line 25: `to_email: "YOUR_ADMIN_EMAIL@example.com"` → Put your real email
- Line 44: `to_email: "YOUR_ADMIN_EMAIL@example.com"` → Put your real email

#### File 2: [components/login-page.tsx](components/login-page.tsx)
✅ Already updated - imports EmailJS utilities

#### File 3: [components/feedback-form.tsx](components/feedback-form.tsx)
✅ Already updated - imports EmailJS utilities

---

## 🔄 How It Works (Data Flow)

```
┌──────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Login Page]              [Feedback Form]                  │
│      ↓                            ↓                          │
│  User enters email         User enters feedback             │
│      ↓                            ↓                          │
│  sendLogToEmail()          sendFeedbackToEmail()            │
│      ↓                            ↓                          │
│      └────────────────┬───────────┘                          │
│                       ↓                                      │
│            [email-service.ts]                               │
│            - Gets credentials from .env.local               │
│            - Prepares email variables                       │
│            - Calls EmailJS API                              │
│                       ↓                                      │
└──────────────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────────────────────────┐
        │    EMAILJS CLOUD (emailjs.com)    │
        ├───────────────────────────────────┤
        │  - Receives email request         │
        │  - Verifies credentials           │
        │  - Formats email with template    │
        │  - Sends via SMTP                 │
        └───────────────────────────────────┘
                        ↓
        ┌───────────────────────────────────┐
        │   YOUR EMAIL INBOX                │
        ├───────────────────────────────────┤
        │  📧 Login Log Email               │
        │  📧 Feedback Email                │
        └───────────────────────────────────┘
```

---

## 📋 Checklist Before Deployment

- [ ] Created EmailJS account at https://dashboard.emailjs.com/
- [ ] Copied Public Key from Account Settings
- [ ] Created/Connected Email Service
- [ ] Copied Service ID
- [ ] Created "Login Log Template" - copied Template ID
- [ ] Created "Feedback Template" - copied Template ID
- [ ] Created `.env.local` file in project root with all 4 variables
- [ ] Updated `lib/email-service.ts` lines 25 & 44 with your email
- [ ] Tested locally: `npm run dev`
- [ ] Tested login → received email ✅
- [ ] Tested feedback → received email ✅
- [ ] Added environment variables to Vercel dashboard
- [ ] Deployed to Vercel

---

## 🚨 Common Mistakes & Fixes

### ❌ "Not receiving emails"
**Solution:** Check .env.local exists and has correct values (no typos!)

### ❌ "Environment variables showing 'YOUR_SERVICE_ID'"
**Solution:** You forgot to create .env.local or restart dev server

### ❌ "Template not found"
**Solution:** Make sure Template ID in .env.local exactly matches EmailJS dashboard

### ❌ "Invalid credentials"
**Solution:** Copy-paste from EmailJS dashboard - don't type manually!

### ❌ "Working locally but not on Vercel"
**Solution:** Add environment variables to Vercel dashboard (not just .env.local)

---

## 💡 Pro Tips

1. **Test Email Templates**: In EmailJS dashboard, click "Test" on each template before using
2. **Check Spam Folder**: First emails sometimes go to spam
3. **Monitor Usage**: Free tier is 200 emails/month (usually enough)
4. **Save This Reference**: Bookmark this file for future reference

---

## 📞 Support Resources

- **EmailJS Documentation:** https://www.emailjs.com/docs/
- **Setup Guide:** See [EMAILJS_SETUP.md](EMAILJS_SETUP.md)
- **Quick Reference:** See [EMAILJS_QUICK_START.md](EMAILJS_QUICK_START.md)
- **Complete Summary:** See [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)
