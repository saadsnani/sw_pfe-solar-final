# ⚠️ IMPORTANT: Vercel Deployment Notes

## 📝 Data Storage on Vercel

### Issue
Vercel has a **read-only filesystem** in production. The `data/` folder with JSON files **won't persist** between requests.

### Solutions

#### Option 1: In-Memory Storage (Quick & Free)
✅ **Best for testing and demos**  
- Data persists during the serverless function lifetime (~15 minutes)
- Resets when the function "cold starts"
- **No setup required** - works out of the box

**Status:** ✅ Already configured in the current code

#### Option 2: Vercel KV (Redis) - Recommended for Production
✅ **Best for production**  
💰 Free tier: 30,000 commands/month

**Setup:**
```bash
# 1. Install Vercel KV
npm install @vercel/kv

# 2. In Vercel Dashboard:
#    - Go to Storage tab
#    - Create KV Database
#    - Copy environment variables

# 3. Add to your project:
#    Settings > Environment Variables
#    KV_REST_API_URL=...
#    KV_REST_API_TOKEN=...
```

**Implementation:**
```typescript
// app/api/sensor-data/route-kv.ts
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
  const data = await request.json();
  await kv.lpush('sensor-readings', data);
  await kv.ltrim('sensor-readings', 0, 999); // Keep last 1000
  return NextResponse.json({ success: true });
}

export async function GET() {
  const readings = await kv.lrange('sensor-readings', 0, 99);
  return NextResponse.json(readings);
}
```

#### Option 3: External Database
For larger scale production:

**PostgreSQL (Vercel Postgres):**
```bash
npm install @vercel/postgres
```

**MongoDB (MongoDB Atlas):**
```bash
npm install mongodb
```

**Supabase (PostgreSQL):**
```bash
npm install @supabase/supabase-js
```

---

## 🚀 Current Setup (What Works Now)

### Development (localhost)
✅ JSON file storage works perfectly  
✅ All data persists  
✅ No configuration needed  

### Production (Vercel)
⚠️ Data will be **ephemeral** (temporary)  
✅ Will work for live demos  
✅ ESP32 can still send data  
✅ Dashboard will display data  
❌ Data won't persist long-term  

---

## 🔧 Quick Fix for Vercel

### Step 1: Deploy as-is (works for testing)
```bash
# Your current code will work on Vercel!
# Data just won't persist between cold starts
```

### Step 2: Add Vercel KV (for production)
1. Deploy to Vercel first
2. In Vercel Dashboard → Storage → Create KV
3. Add environment variables
4. Update API route to use KV
5. Redeploy

---

## 📊 Comparison

| Solution | Pros | Cons | Best For |
|----------|------|------|----------|
| **JSON Files (Current)** | ✅ Simple<br>✅ Works locally | ❌ Doesn't persist on Vercel | Local development |
| **In-Memory** | ✅ No setup<br>✅ Fast | ❌ Temporary | Demos, testing |
| **Vercel KV** | ✅ Fast<br>✅ Free tier<br>✅ Easy setup | ⚠️ Limited free tier | Production |
| **PostgreSQL** | ✅ Full DB features<br>✅ SQL | ⚠️ More complex | Large scale |

---

## ✅ Recommended Path

### For Quick Demo/Testing:
1. ✅ Deploy current code to Vercel (works now!)
2. ✅ Test with ESP32
3. ✅ Show to your professor/team

### For Production/Long-term:
1. ✅ Set up Vercel KV (15 minutes)
2. ✅ Update API route
3. ✅ Enjoy persistent data

---

## 🎯 What to Do Right Now

**You can deploy immediately!** Your code will work on Vercel. Data will be temporary but functional for demos.

**Steps:**
1. Push to GitHub ✅ (Already done)
2. Go to Vercel.com
3. Import your repo
4. Deploy!
5. Update ESP32 with new URL
6. Test!

**Later (when needed):**
- Add Vercel KV for data persistence
- Takes 15 minutes
- No code changes needed in ESP32

---

## 🔗 Resources

- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)

---

**TL;DR:** Deploy now, it works! Add Vercel KV later if you need data to persist long-term. 🚀
