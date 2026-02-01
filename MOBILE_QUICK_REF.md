# 📱 Mobile App - Quick Reference Card

## 🚀 Setup (One-Time)

```bash
# Option 1: Run automated script (Windows)
setup-mobile.bat

# Option 2: Manual setup
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npx cap add android
npm run build
npx cap sync android
```

---

## 🔧 Daily Development Commands

| Task | Command | Description |
|------|---------|-------------|
| **Build & Sync** | `npm run mobile:sync` | Build web + sync to Android |
| **Open Android Studio** | `npm run mobile:open` | Open project in Android Studio |
| **Full Workflow** | `npm run mobile:run` | Build + sync + open |
| **Build Web Only** | `npm run build` | Just build Next.js app |
| **Sync Only** | `npx cap sync android` | Copy web files to Android |

---

## 📱 Using Quick Script (Windows)

```bash
# Run the interactive menu
mobile-dev.bat

# Choose:
# [1] Build and sync
# [2] Open Android Studio  
# [3] Build, sync, and open
# [4] Build APK
# [5] Just build web
```

---

## 🏗️ Building APK

### Debug APK (Testing)
```bash
# Method 1: Using script
mobile-dev.bat → Choose option 4

# Method 2: Manual
npm run build
npx cap sync android
cd android
gradlew.bat assembleDebug

# APK location:
# android\app\build\outputs\apk\debug\app-debug.apk
```

### Release APK (Production)
```bash
cd android
gradlew.bat assembleRelease

# APK location:
# android\app\build\outputs\apk\release\app-release.apk
```

---

## 🔄 Typical Workflow

```
1. Make changes to React code
   ↓
2. Test in browser: npm run dev
   ↓
3. Ready for mobile testing?
   ↓
4. Build & sync: npm run mobile:sync
   ↓
5. Open Android Studio: npm run mobile:open
   ↓
6. Click "Run" button in Android Studio
   ↓
7. Test on emulator/device
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| White screen | Run `npm run build` first, then `npx cap sync android` |
| Build errors | Check Next.js build: `npm run build` |
| Gradle errors | Update Android Studio, clean build |
| API not working | Check `capacitor.config.ts` has `cleartext: true` |
| Changes not showing | Run `npm run mobile:sync` again |

---

## 📋 Checklist Before Building APK

- [ ] `npm run build` works
- [ ] Tested in browser
- [ ] `capacitor.config.ts` configured
- [ ] App name/icon customized
- [ ] Tested on emulator
- [ ] API calls work in mobile app
- [ ] No errors in Logcat

---

## 🔌 Configuration Files

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | Capacitor settings |
| `next.config.mjs` | Next.js config (has `output: 'export'`) |
| `package.json` | Mobile scripts added |
| `android/` | Native Android project |

---

## 📱 Testing

### Emulator
```
1. Open Android Studio
2. Tools → Device Manager
3. Create/Start emulator
4. Click "Run" button
```

### Physical Device
```
1. Enable Developer Mode on phone
2. Enable USB Debugging
3. Connect via USB
4. Select device in Android Studio
5. Click "Run"
```

---

## 🎨 Customization

### Change App Name
Edit: `android/app/src/main/res/values/strings.xml`
```xml
<string name="app_name">Your App Name</string>
```

### Change App Icon
Replace files in: `android/app/src/main/res/mipmap-*/ic_launcher.png`

Or use: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html

### Change Package ID
Edit: `capacitor.config.ts`
```typescript
appId: 'com.yourcompany.appname'
```

---

## 📊 File Sizes

| Build Type | Typical Size |
|------------|--------------|
| Debug APK | 15-30 MB |
| Release APK | 10-20 MB |
| App Bundle (AAB) | 8-15 MB |

---

## 🚨 Common Errors

### "out directory not found"
```bash
# Solution:
npm run build
```

### "Android SDK not found"
```bash
# Solution: Install Android Studio
# Set ANDROID_HOME environment variable
```

### "Gradle build failed"
```bash
# Solution:
cd android
gradlew.bat clean
gradlew.bat assembleDebug
```

---

## 🔗 Quick Links

- 📚 Full Guide: `MOBILE_APP_GUIDE.md`
- 🏗️ Setup Script: `setup-mobile.bat`
- ⚡ Dev Script: `mobile-dev.bat`
- 📦 Capacitor Docs: https://capacitorjs.com/docs
- 🤖 Android Studio: https://developer.android.com/studio

---

## 💡 Pro Tips

1. **Always build before syncing**: `npm run build && npx cap sync android`
2. **Use live reload**: Configure in `capacitor.config.ts` server section
3. **Check Logcat**: View → Tool Windows → Logcat in Android Studio
4. **Clean build**: Delete `android/build` folder if issues
5. **Use scripts**: Easier than typing full commands

---

## 📞 Need Help?

1. Read `MOBILE_APP_GUIDE.md` for detailed instructions
2. Check Logcat for errors in Android Studio
3. Ensure `npm run build` succeeds first
4. Verify Android Studio and JDK installed

---

**Quick Start: Run `setup-mobile.bat` → Open Android Studio → Click Run! 🚀**
