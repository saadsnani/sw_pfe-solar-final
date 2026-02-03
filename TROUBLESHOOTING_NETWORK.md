# 🔧 Troubleshooting: Network Error Fix

## ❌ Error You're Seeing

```
npm error code ECONNRESET
npm error network request to https://registry.npmjs.org/cap failed
```

## 🎯 Root Causes

1. **Capacitor not installed yet** - You need to run setup first
2. **Network connectivity issue** - npm can't reach registry
3. **Possible proxy/firewall blocking npm**

---

## ✅ Solutions (Try in Order)

### Solution 1: Run Setup First (Most Likely Fix)

You tried to run `npm run mobile:open` but Capacitor isn't installed yet!

**Do this:**
```bash
# Option A: Use the automated script
setup-mobile.bat

# Option B: Manual installation
npm install @capacitor/core @capacitor/cli @capacitor/android
```

---

### Solution 2: Fix Network Issues

If setup script also fails with network errors, try these:

#### A. Change npm Registry (Use a Mirror)

```bash
# Try Cloudflare's registry (faster, more reliable)
npm config set registry https://registry.npmjs.cf/

# Or use npm's official HTTPS registry
npm config set registry https://registry.npmjs.org/

# Then try again
npm install @capacitor/core @capacitor/cli @capacitor/android
```

#### B. Clear npm Cache

```bash
# Clear cache and try again
npm cache clean --force
npm install @capacitor/core @capacitor/cli @capacitor/android
```

#### C. Increase Timeout

```bash
# Some networks are slow
npm config set fetch-timeout 60000
npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000

# Then try again
npm install
```

#### D. Check Proxy Settings

```bash
# If you're behind a proxy, set it:
npm config set proxy http://proxy-server:port
npm config set https-proxy http://proxy-server:port

# If you're NOT behind a proxy, clear these:
npm config delete proxy
npm config delete https-proxy
```

#### E. Use Your Phone's Hotspot

If your network/WiFi is blocking npm:
1. Turn on mobile hotspot on your phone
2. Connect your PC to the hotspot
3. Try the installation again

---

### Solution 3: Install Manually with Yarn (Alternative)

If npm keeps failing, try yarn:

```bash
# Install yarn globally (if not installed)
npm install -g yarn

# Use yarn instead
yarn add @capacitor/core @capacitor/cli @capacitor/android
```

---

## 🔄 Correct Order of Operations

Here's what you should do:

```bash
# STEP 1: Install Capacitor (DO THIS FIRST!)
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/status-bar @capacitor/splash-screen

# STEP 2: Build your web app
npm run build

# STEP 3: Add Android platform
npx cap add android

# STEP 4: Sync assets
npx cap sync android

# STEP 5: Now you can open Android Studio
npm run mobile:open
```

**Or just run:** `setup-mobile.bat` (does all of this automatically)

---

## 🚀 Quick Fix Commands (Copy-Paste)

```powershell
# Fix network settings
npm config set registry https://registry.npmjs.org/
npm config delete proxy
npm config delete https-proxy
npm cache clean --force

# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/status-bar @capacitor/splash-screen

# If successful, continue with:
npm run build
npx cap add android
npx cap sync android
npm run mobile:open
```

---

## 🔍 Diagnostic Commands

Run these to check your setup:

```bash
# Check npm configuration
npm config list

# Check if you can reach npm registry
ping registry.npmjs.org

# Check Node.js version
node --version

# Check npm version
npm --version

# Test network connectivity
curl https://registry.npmjs.org/
```

---

## 🆘 If Nothing Works

### Option 1: Download Dependencies Manually

1. Use another computer/network to download
2. Or ask a friend to send you `node_modules` folder
3. Copy to your project

### Option 2: Use Offline Setup

If you have another PC with internet:
1. Install Capacitor there
2. Copy the entire project folder
3. Transfer to your PC

### Option 3: Mobile Hotspot

1. Enable mobile data hotspot on phone
2. Connect PC to hotspot
3. Run installation

---

## 📝 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNRESET` | Network issue | Try different registry or hotspot |
| `ETIMEDOUT` | Slow network | Increase timeout settings |
| `ENOTFOUND` | Can't resolve DNS | Check internet connection |
| `Proxy error` | Wrong proxy settings | Clear proxy config |
| `401 Unauthorized` | npm auth issue | Run `npm logout` then retry |

---

## ✅ Success Indicators

You'll know it worked when you see:

```
✓ @capacitor/core installed
✓ @capacitor/cli installed  
✓ @capacitor/android installed
```

Then you can proceed with:
```bash
npm run mobile:open
```

---

## 🎯 TL;DR (Too Long, Didn't Read)

**Problem:** You skipped installation, tried to open Android Studio directly

**Solution:** Run this first:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

**If network fails:** Use phone hotspot or change registry

**Then:** Run `setup-mobile.bat` or continue manually

---

## 📞 Still Stuck?

1. Share your `npm config list` output
2. Try from a different network
3. Use yarn instead of npm
4. Wait a bit and try again (npm registry might be down)

**Network issues are usually temporary - try again in a few minutes!**
