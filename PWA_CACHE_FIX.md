# PWA Cache Fix - Home Screen App Not Updating

## Problem
When you save Montate as a shortcut on your phone, it caches the JavaScript files. Changes won't appear until the cache is cleared.

## Solutions

### Solution 1: Update Version Number (Recommended)
Every time you update `footer-script.js`, change the version number in the CDN URL:

```html
<!-- Old version -->
<script src="https://cdn.jsdelivr.net/gh/Magnaem-a/Montate@main/footer-script.js?v=1.0.1"></script>

<!-- New version after changes -->
<script src="https://cdn.jsdelivr.net/gh/Magnaem-a/Montate@main/footer-script.js?v=1.0.2"></script>
```

This forces the PWA to download the new file.

### Solution 2: Clear PWA Cache on iOS
1. Open the Montate app from your home screen
2. Close the app completely (swipe up from bottom, swipe away the app)
3. Open Safari browser
4. Go to Settings → Safari → Clear History and Website Data
5. OR: Settings → Safari → Advanced → Website Data → Find "montate" → Delete
6. Re-open the home screen app

### Solution 3: Clear PWA Cache on Android
1. Open the Montate app from your home screen
2. Close the app completely
3. Open Chrome browser
4. Go to Settings → Privacy → Clear browsing data
5. Select "Cached images and files"
6. Clear data
7. Re-open the home screen app

### Solution 4: Re-add to Home Screen (Nuclear Option)
1. Delete the current home screen shortcut
2. Open the site in your browser
3. Add it to home screen again
4. This will download fresh files

### Solution 5: Use Timestamp for Development
For development/testing, use a timestamp:

```html
<script src="https://cdn.jsdelivr.net/gh/Magnaem-a/Montate@main/footer-script.js?v=<?php echo time(); ?>"></script>
```

Or in JavaScript:
```html
<script>
document.write('<script src="https://cdn.jsdelivr.net/gh/Magnaem-a/Montate@main/footer-script.js?v=' + Date.now() + '"><\/script>');
</script>
```

## Best Practice
**Always update the version number** (`?v=X.X.X`) in your Webflow footer code whenever you push changes to `footer-script.js`. This ensures users get the latest version immediately.

## Current Version
Update this file when you change the version:
- Current: `v=1.0.1`
- Next update: `v=1.0.2`

