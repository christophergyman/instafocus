# Hello World Chrome Extension

A simple Chrome extension that displays a "Hello World" popup when clicked.

## Files Included

- `manifest.json` - Extension configuration
- `popup.html` - Popup HTML structure
- `popup.css` - Popup styling
- `popup.js` - Popup functionality
- `icons/` - Directory for extension icons

## Installation Instructions

1. **Create Icons**: You need to create PNG icon files in the `icons/` directory:
   - `icon16.png` (16x16 pixels)
   - `icon32.png` (32x32 pixels) 
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

   You can create these using any image editor or online icon generator. Simple colored squares with "HW" text work perfectly.

2. **Load Extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select this folder (`/Users/chezu/Documents/github/instafocus`)
   - The extension should now appear in your extensions list

3. **Test the Extension**:
   - Click the extension icon in the Chrome toolbar
   - You should see a beautiful "Hello World" popup!

## Features

- Beautiful gradient background
- Responsive design
- Close button functionality
- Clean, modern UI

## Customization

You can easily customize the extension by modifying:
- `popup.html` - Change the content and structure
- `popup.css` - Modify colors, fonts, and styling
- `popup.js` - Add new functionality
- `manifest.json` - Update extension details and permissions
