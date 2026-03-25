# 📱 Mobile App Guide - Convert to Android APK

## 🎯 Overview

This guide will help you convert your Solar Monitoring web app into a native Android application using **Capacitor**.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Node.js installed (v18+)
- ✅ Android Studio installed ([Download here](https://developer.android.com/studio))
- ✅ Java Development Kit (JDK 17+)
- ✅ Your web app builds successfully (`npm run build`)

---

## 🚀 Step-by-Step Setup

### Step 1: Install Capacitor

Run these commands in your project root:

```bash
# Install Capacitor CLI and core
npm install @capacitor/core @capacitor/cli

# Install Android platform
npm install @capacitor/android

# Optional: Install useful plugins
npm install @capacitor/status-bar @capacitor/splash-screen
```

---

### Step 2: Initialize Capacitor

```bash
# Initialize Capacitor in your project
npx cap init

# When prompted, enter:
# - App name: "Solar Dashboard" (or your preferred name)
# - App package ID: com.solardashboard.app (use your domain, e.g., com.yourcompany.appname)
# - Web asset directory: out (for Next.js static export)
```

---

### Step 3: Configure Next.js for Static Export

Since Capacitor needs static files, we need to configure Next.js for static export.

**Update `next.config.mjs`:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static export
  images: {
    unoptimized: true,  // Required for static export
  },
  // Optional: If you have a base path
  // basePath: '',
  // assetPrefix: '',
};

export default nextConfig;
```

---

### Step 4: Create Capacitor Configuration

**Create/Edit `capacitor.config.ts`:**

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.solardashboard.app',
  appName: 'Solar Dashboard',
  webDir: 'out',  // Next.js static export directory
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true,  // Allow HTTP for local API
  },
  android: {
    allowMixedContent: true,  // If you need HTTP requests
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      spinnerColor: '#999999',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
    },
  },
};

export default config;
```

---

### Step 5: Build Your Web App

```bash
# Build the static export
npm run build
```

This will create the `out/` directory with your static files.

---

### Step 6: Add Android Platform

```bash
# Add Android platform
npx cap add android

# This creates the 'android/' directory with native Android project
```

---

### Step 7: Sync Web Assets to Android

Every time you make changes to your web app, run:

```bash
# Build your web app
npm run build

# Sync changes to Android
npx cap sync android

# Or do both in one command
npm run build && npx cap sync android
```

---

### Step 8: Open Android Studio

```bash
# Open the Android project in Android Studio
npx cap open android
```

This will launch Android Studio with your project.

---

### Step 9: Configure Android Studio

**In Android Studio:**

1. **Wait for Gradle sync** to complete (first time takes 5-10 minutes)

2. **Set up an emulator** (if you don't have one):
   - Tools → Device Manager → Create Device
   - Select a phone (e.g., Pixel 5)
   - Download a system image (e.g., Android 13)
   - Finish setup

3. **Update `AndroidManifest.xml`** for permissions:

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Add permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        
        <!-- Your activity -->
        <activity ... />
    </application>
</manifest>
```

---

### Step 10: Build APK

**Option A: Debug APK (for testing)**

```bash
# In Android Studio:
# Build → Build Bundle(s) / APK(s) → Build APK(s)

# Or via command line:
cd android
./gradlew assembleDebug

# APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

**Option B: Release APK (for distribution)**

```bash
# Generate a signing key (first time only)
keytool -genkey -v -keystore solar-dashboard.keystore -alias solar-app -keyalg RSA -keysize 2048 -validity 10000

# Build release APK
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔧 Package.json Scripts

Add these helpful scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    
    "mobile:init": "npx cap init",
    "mobile:add:android": "npx cap add android",
    "mobile:sync": "npm run build && npx cap sync android",
    "mobile:open": "npx cap open android",
    "mobile:build": "npm run build && npx cap sync android && cd android && ./gradlew assembleDebug",
    "mobile:run": "npm run mobile:sync && npm run mobile:open"
  }
}
```

**Usage:**
```bash
npm run mobile:sync      # Build and sync to Android
npm run mobile:open      # Open in Android Studio
npm run mobile:run       # Build, sync, and open
npm run mobile:build     # Build debug APK
```

---

## 📱 Testing Your App

### Test on Emulator

1. Open Android Studio
2. Start an emulator (Device Manager → Play button)
3. Click "Run" (green play button) in Android Studio

### Test on Physical Device

1. Enable Developer Options on your Android phone:
   - Settings → About Phone → Tap "Build Number" 7 times
   
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging

3. Connect phone via USB

4. In Android Studio, select your device and click "Run"

---

## 🎨 Customizing Your App

### 1. App Icon

Replace these files in `android/app/src/main/res/`:
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

**Quick way:** Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)

### 2. Splash Screen

Edit `android/app/src/main/res/drawable/splash.png`

Or use `@capacitor/splash-screen`:
```typescript
import { SplashScreen } from '@capacitor/splash-screen';

// Hide splash after app loads
SplashScreen.hide();
```

### 3. App Name

Edit `android/app/src/main/res/values/strings.xml`:
```xml
<resources>
    <string name="app_name">Solar Dashboard</string>
    <string name="title_activity_main">Solar Dashboard</string>
</resources>
```

---

## 🔌 Useful Capacitor Plugins

### Network Status
```bash
npm install @capacitor/network
```

```typescript
import { Network } from '@capacitor/network';

const status = await Network.getStatus();
console.log('Connected:', status.connected);
```

### Geolocation
```bash
npm install @capacitor/geolocation
```

```typescript
import { Geolocation } from '@capacitor/geolocation';

const position = await Geolocation.getCurrentPosition();
console.log(position.coords.latitude, position.coords.longitude);
```

### Camera
```bash
npm install @capacitor/camera
```

### Push Notifications
```bash
npm install @capacitor/push-notifications
```

---

## 🐛 Common Issues & Solutions

### Issue 1: `out` directory not found
**Solution:** Make sure you run `npm run build` first

### Issue 2: API calls fail in mobile app
**Solution:** 
- Use absolute URLs (not relative)
- Enable cleartext traffic in `capacitor.config.ts`
- Check CORS settings on your backend

### Issue 3: White screen on app start
**Solution:**
- Check browser console in Android Studio (View → Tool Windows → Logcat)
- Ensure `webDir: 'out'` in `capacitor.config.ts`
- Verify `npm run build` succeeded

### Issue 4: Gradle build fails
**Solution:**
- Update Android Studio to latest version
- Update Gradle: `cd android && ./gradlew wrapper --gradle-version=8.0`
- Clean build: `./gradlew clean`

### Issue 5: App name shows as "App"
**Solution:** Update `android/app/src/main/res/values/strings.xml`

---

## 📊 Build Types Explained

### Debug APK
- For testing
- Larger file size
- Easier to debug
- Can install without signing

```bash
cd android
./gradlew assembleDebug
```

### Release APK
- For distribution (Google Play, etc.)
- Optimized and smaller
- Requires signing key
- Production-ready

```bash
cd android
./gradlew assembleRelease
```

### App Bundle (AAB) - Recommended for Play Store
```bash
cd android
./gradlew bundleRelease
```

---

## 🚀 Publishing to Google Play Store

### 1. Create Signing Key

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing

**Edit `android/app/build.gradle`:**

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('path/to/my-release-key.keystore')
            storePassword 'your-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Build Release Bundle

```bash
cd android
./gradlew bundleRelease
```

### 4. Upload to Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Upload your `.aab` file
4. Fill in store listing details
5. Submit for review

---

## 🔄 Development Workflow

### Daily Development

```bash
# 1. Make changes to your React code
# 2. Test in browser
npm run dev

# 3. When ready to test on mobile
npm run mobile:sync

# 4. Run on device/emulator
npm run mobile:open
# Then click "Run" in Android Studio
```

### Before Building APK

```bash
# 1. Build optimized web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open Android Studio
npx cap open android

# 4. Build APK
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

---

## ✅ Checklist

Before building your APK:

- [ ] `npm run build` works without errors
- [ ] `capacitor.config.ts` has correct `appId` and `appName`
- [ ] `next.config.mjs` has `output: 'export'`
- [ ] Android permissions added to `AndroidManifest.xml`
- [ ] App icon replaced
- [ ] App name updated in `strings.xml`
- [ ] Tested on emulator/device
- [ ] API calls work in mobile app
- [ ] No console errors in Logcat

---

## 📚 Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Studio Download](https://developer.android.com/studio)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)

---

## 🎉 Success!

Your APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

Install it on your phone by:
1. Transferring the file to your phone
2. Opening it (allow "Install from unknown sources" if prompted)
3. Installing the app

**Congratulations! Your web app is now a mobile app! 📱**
