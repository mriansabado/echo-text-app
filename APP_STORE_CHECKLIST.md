# App Store Submission Checklist

## ✅ Code Review - COMPLETE
- [x] Removed unused dependencies (react-native-tts)
- [x] Production console logs wrapped with __DEV__
- [x] iOS privacy configurations added
- [x] Encryption declaration added (ITSAppUsesNonExemptEncryption: false)
- [x] App description added to app.json
- [x] Custom loading/splash screen with logo animation added
- [x] **Dependencies updated and fixed** (expo-asset added, all packages updated to SDK 54 compatible versions)

## 📱 App Store Connect Requirements

### Basic Information
- **App Name:** PocketSay
- **Bundle ID:** com.iandev808.fontastic (consider updating to com.iandev808.pocketsay)
- **Version:** 1.0.0

### App Information (Required)
- [ ] **Subtitle** (30 characters max)
  - Suggestion: "Large text from your pocket"
  
- [ ] **Description** (4,000 characters max)
  - Suggestion: 
  ```
  PocketSay lets you display large text from your pocket to communicate from a distance. Perfect for getting someone's attention across a room, at events, or anywhere you need to send a clear message!
  
  Features:
  • Choose from multiple animated themes (Wave, Alert, Party, Happy, Sad, Thinking, Love)
  • Night mode for comfortable viewing in low light
  • Large, bold text display optimized for visibility
  • Smooth animations and transitions
  • Portrait and landscape orientations supported
  
  Simply type your message, select a theme, and hold up your phone to communicate from a distance!
  ```

- [ ] **Keywords** (100 characters max, comma-separated)
  - Suggestion: "text,display,sign,message,communication,distance,large,font,animation,theme"

- [ ] **Category**
  - Primary: [ ] Utilities (recommended) / [ ] Entertainment
  - Secondary: (Optional) [ ] Productivity

### Visual Assets (REQUIRED)

#### App Icon
- [ ] 1024 x 1024 PNG (no transparency)
- ✅ File exists: `assets/icon.png`
- ⚠️ **Verify:** Make sure `assets/icon.png` is exactly 1024x1024 pixels

#### Splash Screen & Loading
- [x] Custom loading screen component added (shows logo with fade/scale animation)
- ✅ Splash screen configured in `app.json` (`assets/splash.png`)
- ⚠️ **Verify:** Make sure `assets/splash.png` looks good and matches your brand

#### Screenshots (REQUIRED - At least one set)
- [ ] **iPhone 6.7" Display** (iPhone 14 Pro Max, 15 Pro Max)
  - Size: 1290 x 2796 pixels
  
- [ ] **iPhone 6.5" Display** (iPhone 11 Pro Max, XS Max)
  - Size: 1242 x 2688 pixels
  
- [ ] **iPad Pro 12.9"** (Portrait)
  - Size: 2048 x 2732 pixels
  
- [ ] **iPad Pro 12.9"** (Landscape)
  - Size: 2732 x 2048 pixels

#### App Preview Video (Optional but recommended)
- [ ] 15-30 second video showing app in action

### App Privacy (REQUIRED)
- [ ] Go to App Privacy section in App Store Connect
- [ ] Select: **"Data Not Collected"**
- [ ] Answer: Your app does not collect any user data
- [ ] No privacy policy URL needed (since no data collection)

### Age Rating
- [ ] Complete age rating questionnaire
- Expected: 4+ (no objectionable content)

### Pricing & Availability
- [ ] Set price (Free or Paid)
- [ ] Select countries/regions for availability

### App Review Information
- [ ] **Contact Information**
  - First name, last name, phone number, email
  
- [ ] **Demo Account** (if applicable)
  - Not needed for this app (no authentication)

- [ ] **Notes** (optional)
  - "PocketSay is a simple text display tool. No login required. Perfect for communicating from a distance."

## 🚀 Build & Submit

### Before Building
- [x] Run `npm install` to ensure dependencies are up to date ✅
- [x] All dependencies verified with `expo-doctor` ✅
- [ ] Verify all assets are in place
- [ ] Test app thoroughly on device/simulator

### Build Commands
```bash
# Production build for iOS
npm run build:prod

# After build completes, submit to App Store
npm run submit:ios
```

### After Submission
- [ ] Wait for App Review (typically 24-48 hours)
- [ ] Respond to any reviewer questions if needed
- [ ] Once approved, set release date or release immediately

## 📝 Notes
- Your app uses Expo Updates (OTA updates), so you can push updates without resubmitting
- Make sure to test the production build on a real device before submitting
- Keep your EAS account active for continuous updates

