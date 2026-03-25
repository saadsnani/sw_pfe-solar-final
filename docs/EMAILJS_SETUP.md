# EmailJS Setup Guide for Smart EMS

This guide shows you how to configure EmailJS for your Vercel deployment and get login logs and feedback sent directly to your email.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your Credentials

### Find Your Public Key:
- In the EmailJS dashboard, go to **Account Settings** (top right icon)
- Copy your **Public Key** (looks like `xyz123...`)

### Create a Service (Email Provider):
- Go to **Email Services** in the left sidebar
- Click **Add Service**
- Choose your email provider (Gmail, Outlook, Yahoo, etc.)
- Follow the setup instructions for your provider
- Copy your **Service ID** (looks like `service_xyz...`)

### Create Email Templates:

#### Template 1: Login Logs Template
1. Go to **Email Templates** in the left sidebar
2. Click **Create New Template**
3. Name it: `Login Log Template`
4. Set **Recipient Email**: `{{to_email}}`
5. Set **Subject**: `New Login Attempt - Smart EMS`
6. Set **Template Content**:

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

7. Click **Save**
8. Copy the **Template ID** (looks like `template_xyz...`)

#### Template 2: Feedback Template
1. Click **Create New Template** again
2. Name it: `Feedback Template`
3. Set **Recipient Email**: `{{to_email}}`
4. Set **Subject**: `New Feedback Received - Smart EMS`
5. Set **Template Content**:

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

6. Click **Save**
7. Copy the **Template ID** (looks like `template_abc...`)

## Step 3: Add Credentials to Your Environment

Create a `.env.local` file in your project root with your credentials:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xyz123...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_LOGIN=template_abc123...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_FEEDBACK=template_def456...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xyz123abc456...
```

**Replace the placeholder values with your actual credentials from EmailJS.**

## Step 4: Update Your Code

### In `lib/email-service.ts` (ALREADY UPDATED):

Look for these lines and update the admin email:

```typescript
// Line 25: Change this to YOUR admin email
to_email: "YOUR_ADMIN_EMAIL@example.com",

// Line 44: Change this to YOUR admin email  
to_email: "YOUR_ADMIN_EMAIL@example.com",
```

Replace `YOUR_ADMIN_EMAIL@example.com` with your actual email address where you want to receive logs and feedback.

### Files Already Updated:
- ✅ `components/login-page.tsx` - Now sends login logs via EmailJS
- ✅ `components/feedback-form.tsx` - Now sends feedback via EmailJS
- ✅ `lib/email-service.ts` - EmailJS configuration and utility functions

## Step 5: Deploy to Vercel

Add your environment variables to Vercel:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add all four variables from your `.env.local` file:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_LOGIN`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_FEEDBACK`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
4. Deploy your project

## Step 6: Test It Out

1. Go to your app login page
2. Try logging in - you should receive an email with login details
3. Go to the feedback form
4. Submit feedback - you should receive another email with feedback details

## Troubleshooting

### Not receiving emails?

1. **Check your credentials**: Make sure all values in `.env.local` are correct
2. **Check email template variables**: Make sure template variables match exactly:
   - For login: `{{to_email}}`, `{{user_email}}`, `{{login_status}}`, `{{login_timestamp}}`, `{{login_date}}`, `{{login_time}}`
   - For feedback: `{{to_email}}`, `{{user_name}}`, `{{user_email}}`, `{{feedback_rating}}`, `{{feedback_comment}}`, `{{feedback_date}}`, `{{feedback_time}}`
3. **Test in EmailJS dashboard**: Go to your template and click "Test it" to send a test email
4. **Check browser console**: Open DevTools (F12) and look for any errors

### What's Different from Before?

❌ **Removed:**
- File system (fs) module usage in `pages/api/logs.ts`
- File system (fs) module usage in `pages/api/feedback.ts`
- Local JSON file storage in `data/login-logs.json` and `data/feedback.json`
- API endpoints that wrote to files

✅ **Added:**
- EmailJS client-side integration
- Email notifications sent directly to your inbox
- Vercel-compatible (no filesystem access required)
- Better security (credentials stored in environment variables)

## Cost

EmailJS offers a generous free tier:
- **200 emails per month** on the free plan
- Paid plans available if you need more

Perfect for a dashboard application!

## Support

For more details, visit:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Dashboard](https://dashboard.emailjs.com/)
