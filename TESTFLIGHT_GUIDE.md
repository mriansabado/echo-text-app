# TestFlight Submission Guide

## ✅ Updates Completed

1. **Expo Dependencies Updated**
   - Updated all Expo packages to SDK 54 compatible versions
   - Updated react-native-svg to compatible version
   - Updated minor dependencies (gesture-handler, safe-area-context, etc.)

2. **Build Number Incremented**
   - iOS build number: `3` → `4` (in `app.json`)

## 🚀 Building for TestFlight

### Option 1: Build with EAS (Recommended)

1. **Make sure you're logged in to EAS:**
   ```bash
   npx eas login
   ```

2. **Build for iOS production:**
   ```bash
   npm run build:prod -- --platform ios
   ```
   Or use EAS directly:
   ```bash
   eas build --platform ios --profile production
   ```

3. **Submit to TestFlight:**
   ```bash
   npm run submit:ios
   ```
   Or:
   ```bash
   eas submit --platform ios
   ```

### Option 2: Build Locally (if you have Xcode)

1. **Generate iOS project:**
   ```bash
   npx expo prebuild --platform ios
   ```

2. **Open in Xcode:**
   ```bash
   open ios/*.xcworkspace
   ```

3. **Archive and upload:**
   - Select "Any iOS Device" as target
   - Product → Archive
   - Distribute App → App Store Connect → Upload

## 📋 Pre-Submission Checklist

- [ ] App version and build number are correct in `app.json`
- [ ] Bundle identifier matches App Store Connect: `com.iandev808.pocketsay`
- [ ] All features tested on device
- [ ] App Store Connect app is configured
- [ ] TestFlight testers are added (if needed)

## 🔍 Verify Configuration

Your current setup:
- **App Name:** PocketSay
- **Bundle ID:** com.iandev808.pocketsay
- **Version:** 1.0.0
- **Build Number:** 4
- **App Store Connect App ID:** 6756633082

## 📝 Notes

- The build will be processed by EAS servers (takes ~15-30 minutes)
- Once uploaded, it will appear in App Store Connect under TestFlight
- You can add internal/external testers from App Store Connect
- Each new build needs a new build number (currently at 4)

## 🆘 Troubleshooting

If you encounter issues:
1. Check EAS status: `eas build:list`
2. View build logs: `eas build:view [build-id]`
3. Ensure you're logged in: `eas whoami`
4. Check app.json configuration matches App Store Connect

