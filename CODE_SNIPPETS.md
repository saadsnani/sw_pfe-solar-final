# 💻 Copy-Paste Ready Code Snippets

This file contains exact code snippets you can copy and paste. **Don't type manually - copy from here!**

---

## 1️⃣ .env.local File

**Location:** `c:\Users\SAAD\Desktop\solar-dashboard-pfe\.env.local`

**Create this exact file with your credentials:**

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_YOUR_SERVICE_ID_HERE
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_LOGIN=template_YOUR_LOGIN_TEMPLATE_ID_HERE
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_FEEDBACK=template_YOUR_FEEDBACK_TEMPLATE_ID_HERE
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
```

**Instructions:**
1. Create a new file named `.env.local` in the project root
2. Copy the above content
3. Replace the placeholder values with your actual EmailJS credentials
4. Save the file
5. Restart dev server (`npm run dev`)

---

## 2️⃣ EmailJS Template 1: Login Logs

**In EmailJS Dashboard:**
- Name: `Login Log Template`
- Recipient: `{{to_email}}`
- Subject: `New Login Attempt - Smart EMS`

**Body Content (Copy This):**

```
Hello,

A new login attempt was recorded in Smart EMS.

User Email: {{user_email}}
Status: {{login_status}}
Timestamp: {{login_timestamp}}
Date: {{login_date}}
Time: {{login_time}}

Best regards,
Smart EMS System
```

After creating, copy the **Template ID** and put it in `.env.local` as `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_LOGIN`

---

## 3️⃣ EmailJS Template 2: Feedback

**In EmailJS Dashboard:**
- Name: `Feedback Template`
- Recipient: `{{to_email}}`
- Subject: `New Feedback Received - Smart EMS`

**Body Content (Copy This):**

```
Hello,

New feedback has been submitted to Smart EMS.

User Name: {{user_name}}
User Email: {{user_email}}
Rating: {{feedback_rating}}
Comment: {{feedback_comment}}
Date: {{feedback_date}}
Time: {{feedback_time}}

Best regards,
Smart EMS System
```

After creating, copy the **Template ID** and put it in `.env.local` as `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_FEEDBACK`

---

## 4️⃣ lib/email-service.ts - COMPLETE FILE

**File Already Created:** [lib/email-service.ts](lib/email-service.ts)

**Only Change These Lines:**

**Line 25 - Change This:**
```typescript
// BEFORE:
to_email: "YOUR_ADMIN_EMAIL@example.com",

// AFTER (your actual email):
to_email: "your.email@gmail.com",
```

**Line 44 - Change This:**
```typescript
// BEFORE:
to_email: "YOUR_ADMIN_EMAIL@example.com",

// AFTER (your actual email):
to_email: "your.email@gmail.com",
```

Complete file reference: See [lib/email-service.ts](lib/email-service.ts)

---

## 5️⃣ components/login-page.tsx - UPDATED SECTIONS

**File Already Updated:** [components/login-page.tsx](components/login-page.tsx)

The file already has these changes:

**Imports (Lines 1-12):**
```tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Sun, Loader2, Zap, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser, registerUser, setCurrentUser } from "@/lib/auth"
import { useAlert } from "@/lib/alert-provider"
import { sendLogToEmail, initializeEmailJS } from "@/lib/email-service"
```

**Initialize EmailJS (Lines 25-27):**
```tsx
useEffect(() => {
  initializeEmailJS()
}, [])
```

**Handle Login Success (Lines 56-61):**
```tsx
if (result.success) {
  setCurrentUser(email)
  await sendLogToEmail(email, "success")
  addAlert({ type: "success", title: "Connexion Réussie", message: `Bienvenue ${email}` })
  onLogin(email)
}
```

**Handle Login Failure (Lines 63-67):**
```tsx
} else {
  await sendLogToEmail(email, "failed")
  addAlert({ type: "error", title: "Erreur de Connexion", message: result.message })
}
```

---

## 6️⃣ components/feedback-form.tsx - UPDATED SECTIONS

**File Already Updated:** [components/feedback-form.tsx](components/feedback-form.tsx)

The file already has these changes:

**Imports (Lines 1-11):**
```tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Send, MessageSquare } from "lucide-react"
import { useAlert } from "@/lib/alert-provider"
import { sendFeedbackToEmail, initializeEmailJS } from "@/lib/email-service"
```

**Initialize EmailJS (Lines 20-23):**
```tsx
useEffect(() => {
  initializeEmailJS()
}, [])
```

**Handle Form Submission (Lines 24-49):**
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!name || !email || !rating || !comment) {
    addAlert({ type: "error", title: "Erreur", message: "Veuillez remplir tous les champs" })
    return
  }

  setIsSubmitting(true)

  try {
    const result = await sendFeedbackToEmail(name, email, rating, comment)

    if (result.success) {
      addAlert({ type: "success", title: "Merci !", message: "Votre avis a été envoyé avec succès" })
      // Reset form
      setName("")
      setEmail("")
      setRating(0)
      setComment("")
    } else {
      addAlert({ type: "error", title: "Erreur", message: result.message })
    }
  } catch (error) {
    addAlert({ type: "error", title: "Erreur", message: "Impossible d'envoyer votre avis" })
  } finally {
    setIsSubmitting(false)
  }
}
```

---

## 7️⃣ .gitignore - Add This Line

If you have a `.gitignore` file, add this line to prevent committing your credentials:

```
# Environment variables
.env.local
.env.*.local
```

---

## 8️⃣ Vercel Environment Variables

**In Vercel Dashboard** → Your Project → Settings → Environment Variables

**Add these exactly:**

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | `service_xyz123...` |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_LOGIN` | `template_abc123...` |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_FEEDBACK` | `template_def456...` |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | `xyz123abc456...` |

Copy from your `.env.local` file (same values).

---

## 🧪 Test Commands

**Build the project:**
```bash
npm run build
```

**Run in development:**
```bash
npm run dev
```

**Test locally:**
1. Open http://localhost:3000
2. Try login → Check email
3. Go to feedback page
4. Submit feedback → Check email

---

## ✅ Quick Checklist

Use this to verify everything is set up:

```
[ ] Created EmailJS account (https://dashboard.emailjs.com/)
[ ] Got Public Key from Account Settings
[ ] Created Email Service (connected to Gmail/Outlook/etc)
[ ] Got Service ID from Email Services
[ ] Created "Login Log Template" email template
[ ] Got Template ID for Login template
[ ] Created "Feedback Template" email template
[ ] Got Template ID for Feedback template
[ ] Created .env.local file in project root
[ ] Added all 4 credentials to .env.local
[ ] Updated admin email on line 25 of lib/email-service.ts
[ ] Updated admin email on line 44 of lib/email-service.ts
[ ] Ran: npm install @emailjs/browser (already done)
[ ] Ran: npm run build (check for errors)
[ ] Ran: npm run dev (local testing)
[ ] Logged in locally → Received email ✅
[ ] Submitted feedback locally → Received email ✅
[ ] Added variables to Vercel dashboard
[ ] Deployed to Vercel
[ ] Tested on Vercel live app
[ ] All working! 🎉
```

---

## 🚨 Common Copy-Paste Mistakes

### ❌ Wrong - Don't Do This:
```env
# WRONG - Has quotes and comments
NEXT_PUBLIC_EMAILJS_SERVICE_ID="service_xyz"  # This is wrong
```

### ✅ Right - Do This:
```env
# Correct - No quotes, just the value
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xyz
```

### ❌ Wrong - Don't Do This:
```env
# WRONG - Mixed types
SERVICE_ID=service_xyz  # Missing "NEXT_PUBLIC_" prefix
```

### ✅ Right - Do This:
```env
# Correct - Full variable names
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xyz
```

---

## 📁 Final File Structure

After all changes, your project should look like:

```
c:\Users\SAAD\Desktop\solar-dashboard-pfe\
├── .env.local ⭐ (NEW FILE - DO NOT COMMIT)
├── lib/
│   └── email-service.ts ✨ (NEW FILE)
├── components/
│   ├── login-page.tsx ✏️ (UPDATED)
│   └── feedback-form.tsx ✏️ (UPDATED)
├── package.json ✏️ (UPDATED)
└── [Documentation files you created]
    ├── SETUP_INSTRUCTIONS.md
    ├── EMAILJS_QUICK_START.md
    ├── EMAILJS_SETUP.md
    ├── WHERE_TO_PUT_CREDENTIALS.md
    ├── REFACTORING_SUMMARY.md
    └── VISUAL_REFERENCE.md
```

---

## 💡 Pro Tips

1. **Copy from here, not manually** - Prevents typos
2. **Use unique passwords** - Change `YOUR_ADMIN_EMAIL@example.com` to your real email
3. **Save credentials** - Keep your `.env.local` in a safe place
4. **Don't commit .env.local** - Add to .gitignore
5. **Test locally first** - Before Vercel deployment

---

## 🎯 You're Ready!

Copy the snippets above and follow the checklist. You'll have a fully functional email system in minutes.

**Need help?** Check:
- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Main setup guide
- [EMAILJS_SETUP.md](EMAILJS_SETUP.md) - Detailed steps
- [WHERE_TO_PUT_CREDENTIALS.md](WHERE_TO_PUT_CREDENTIALS.md) - Visual guide
