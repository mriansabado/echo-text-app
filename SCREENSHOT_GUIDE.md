# Screenshot Guide for App Store Submission

## Quick Steps to Take Screenshots

### Using iOS Simulator (Recommended)

1. **Start your app in the simulator:**
   ```bash
   npx expo start
   # Press 'i' to open iOS simulator
   ```

2. **Open the simulator and select the right device:**
   - iPhone 15 Pro Max (for 6.7" screenshots)
   - iPhone 11 Pro Max (for 6.5" screenshots)
   - iPad Pro 12.9-inch (for iPad screenshots)

3. **Take screenshots:**
   - **Cmd + S** - Saves screenshot to Desktop
   - Or: Device → Screenshot in simulator menu

4. **Screenshot locations:**
   - Screenshots are saved to your Desktop automatically
   - They'll be named like: `Screen Shot 2024-01-15 at 10.30.45 AM.png`

### Using Physical Device

1. **Take screenshots on your iPhone/iPad:**
   - iPhone: Press Volume Up + Side Button simultaneously
   - iPad: Press Volume Up + Top Button simultaneously

2. **Transfer to Mac:**
   - AirDrop, iCloud Photos, or connect via USB

## Required Screenshots

### Minimum Required (at least one set):
You need screenshots for at least ONE device size. Apple recommends:
- **iPhone 6.7"** (most common) - 1290 x 2796 pixels

### Recommended (for better coverage):
- iPhone 6.7" Display: 1290 x 2796 pixels
- iPhone 6.5" Display: 1242 x 2688 pixels  
- iPad Pro 12.9" Portrait: 2048 x 2732 pixels
- iPad Pro 12.9" Landscape: 2732 x 2048 pixels

## What Screenshots to Take

### Suggested Screenshots (3-5 screenshots per device size):

1. **Home Screen** - Show the text input and theme selection
2. **Results Screen (Portrait)** - Show the large text display
3. **Results Screen (Landscape)** - Show landscape orientation
4. **Theme Selection** - Show the theme cards expanded
5. **Night Mode** - Show the app in night mode

### Tips for Great Screenshots:

- ✅ Use real text (not "Lorem ipsum")
- ✅ Show different themes/animations
- ✅ Include both light and dark mode
- ✅ Make sure text is readable
- ✅ Show the app's best features
- ✅ Keep UI clean and uncluttered

## Resizing Screenshots (if needed)

If your screenshots aren't the exact size, you can resize them:

### Using macOS Preview:
1. Open screenshot in Preview
2. Tools → Adjust Size
3. Enter exact dimensions (e.g., 1290 x 2796)
4. Uncheck "Scale proportionally" if needed
5. Save

### Using Command Line (ImageMagick):
```bash
# Install ImageMagick first: brew install imagemagick
convert input.png -resize 1290x2796! output.png
```

### Using Online Tools:
- https://www.iloveimg.com/resize-image
- https://www.resizepixel.com/

## Uploading to App Store Connect

1. Go to App Store Connect → Your App → App Store → iOS App
2. Scroll to "Screenshots"
3. Drag and drop your screenshots into the correct device size sections
4. Arrange them in the order you want them displayed
5. Save

## Notes

- Screenshots must be PNG or JPEG format
- No transparency allowed
- Maximum file size: 500MB per screenshot
- You can have 1-10 screenshots per device size
- First screenshot is used as the "thumbnail" in search results

