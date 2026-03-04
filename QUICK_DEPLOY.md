# Quick Deploy to GitHub Pages

## TL;DR - 5 Minute Setup

```bash
# 1. Create GitHub repo and push code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/outlook-multiple-alerts.git
git push -u origin main

# 2. Update manifest URLs
npm run deploy:setup YOUR-GITHUB-USERNAME

# 3. Push updated manifest
git add manifest.xml
git commit -m "Update URLs for GitHub Pages"
git push

# 4. Enable GitHub Pages
# Go to: https://github.com/YOUR-USERNAME/outlook-multiple-alerts/settings/pages
# Set Source: main branch, / (root)
# Click Save

# 5. Wait 2 minutes, then test
# Open: https://YOUR-USERNAME.github.io/outlook-multiple-alerts/taskpane.html
```

## What This Does

- ✅ Hosts your add-in on GitHub (free, HTTPS included)
- ✅ Works on ALL devices (Desktop, Web, Mobile)
- ✅ No local server needed
- ✅ Updates automatically when you push code

## After Deployment

### Install on Outlook Desktop
1. File → Manage Add-ins → My Add-ins
2. Add from file → Select `manifest.xml`
3. Open a calendar event
4. Click "Multiple Alerts" button

### Install on Outlook Web
1. Go to outlook.office.com
2. Settings → View all settings → General → Manage Add-ins
3. Add from file → Upload `manifest.xml`

### Install on Mobile
- The add-in will automatically appear if you've installed it on Desktop or Web
- Look for "Multiple Alerts" when viewing calendar events

## Updating Your Add-in

```bash
# Make changes to your code
# Build
npm run build

# Push to GitHub
git add .
git commit -m "Your update message"
git push

# GitHub Pages updates automatically in ~1 minute
# Users see changes next time they open Outlook
```

## Troubleshooting

**"Can't access GitHub Pages URL"**
- Wait 5-10 minutes after enabling Pages
- Check repo Settings → Pages shows "Your site is live"

**"Add-in won't load"**
- Verify manifest.xml has GitHub URLs (not localhost)
- Remove and re-add the add-in in Outlook
- Check browser console for errors

**"Changes don't appear"**
- Wait 1-2 minutes for GitHub Pages to rebuild
- Close and reopen Outlook
- Clear browser cache

## Cost

**$0/month** - Completely free with GitHub Pages

## Privacy

- Your code is public (GitHub Pages requires public repos)
- User data stays in Outlook (not stored on GitHub)
- No backend or database needed
