# Deployment Guide: GitHub Pages

## Overview

This guide shows you how to deploy your Outlook Multiple Alerts add-in to GitHub Pages so it works across all your devices without running a local server.

## Prerequisites

- GitHub account (free)
- Git installed on your computer
- Your add-in code (already complete)

## Step-by-Step Deployment

### 1. Prepare Your Project

First, let's make sure your project is ready for deployment:

```bash
# Build the project
npm run build

# This creates the dist/ folder with compiled JavaScript
```

### 2. Create .nojekyll File

GitHub Pages uses Jekyll by default, which can interfere with your files. Create a `.nojekyll` file to disable it:

```bash
# Windows PowerShell
New-Item -Path ".nojekyll" -ItemType File

# Or create an empty file named .nojekyll in your project root
```

### 3. Create GitHub Repository

1. Go to https://github.com
2. Click the **+** icon → **New repository**
3. Name it: `outlook-multiple-alerts`
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (you already have files)
6. Click **Create repository**

### 4. Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Outlook Multiple Alerts add-in"

# Add GitHub as remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/outlook-multiple-alerts.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

GitHub will build your site. After a few minutes, you'll see:
```
Your site is live at https://YOUR-USERNAME.github.io/outlook-multiple-alerts/
```

### 6. Update manifest.xml

Now update your manifest to use the GitHub Pages URL:

**Find and replace all instances of `https://localhost:3000` with your GitHub Pages URL:**

```xml
<!-- OLD -->
<SourceLocation DefaultValue="https://localhost:3000/taskpane.html"/>

<!-- NEW -->
<SourceLocation DefaultValue="https://YOUR-USERNAME.github.io/outlook-multiple-alerts/taskpane.html"/>
```

Do this for all URLs in manifest.xml:
- `<SourceLocation>` tags
- `<bt:Url>` tags  
- `<IconUrl>` tags

### 7. Commit and Push the Updated Manifest

```bash
git add manifest.xml
git commit -m "Update manifest URLs for GitHub Pages"
git push
```

Wait a few minutes for GitHub Pages to rebuild.

### 8. Test Your Add-in

1. **Verify files are accessible**:
   - Open: `https://YOUR-USERNAME.github.io/outlook-multiple-alerts/taskpane.html`
   - You should see your task pane HTML

2. **Sideload the updated manifest**:
   - In Outlook: File → Manage Add-ins → My Add-ins
   - Remove the old localhost version (if present)
   - Add from file → Select your updated `manifest.xml`

3. **Test on multiple devices**:
   - Desktop: Open Outlook Desktop, open a calendar event, click "Multiple Alerts"
   - Web: Go to outlook.office.com, open a calendar event, click "Multiple Alerts"
   - Mobile: Install Outlook app, the add-in should appear (if mobile is supported)

## How It Works Now

```
┌─────────────────────────────────────────┐
│ GitHub Pages (Cloud)                    │
│ https://YOUR-USERNAME.github.io/...    │
│ ├── taskpane.html                       │
│ ├── dist/taskpane.js                    │
│ └── assets/icons/                       │
└─────────────────────────────────────────┘
           ↓ HTTPS (from anywhere)
┌─────────────────────────────────────────┐
│ Your Devices                            │
│ ├── Outlook Desktop (Windows)           │
│ ├── Outlook Desktop (Mac)               │
│ ├── Outlook Web                         │
│ └── Outlook Mobile (iOS/Android)        │
└─────────────────────────────────────────┘
```

## Updating Your Add-in

When you make changes:

```bash
# 1. Make your code changes
# 2. Build
npm run build

# 3. Commit and push
git add .
git commit -m "Update: description of changes"
git push

# 4. GitHub Pages auto-updates in ~1 minute
# 5. Users see changes next time they open Outlook
```

## Data Storage

**Important**: Your add-in stores reminder data in Outlook itself, not on GitHub Pages.

- ✅ Each user's reminders are stored locally in their Outlook
- ✅ No backend database needed
- ✅ No user data on GitHub
- ✅ Works offline (once loaded)

## Troubleshooting

### "404 Not Found" when accessing GitHub Pages URL

- Wait 5-10 minutes after enabling GitHub Pages
- Check Settings → Pages shows "Your site is live"
- Verify the URL matches exactly

### Add-in doesn't load in Outlook

- Verify `https://YOUR-USERNAME.github.io/outlook-multiple-alerts/taskpane.html` loads in browser
- Check manifest.xml has correct URLs (no localhost)
- Try removing and re-adding the add-in in Outlook

### Changes don't appear

- GitHub Pages can take 1-2 minutes to update
- Clear Outlook cache: Close Outlook completely and reopen
- Hard refresh in browser: Ctrl+Shift+R

## Alternative: Private Repository

If you want to keep your code private:

1. **Use Azure Static Web Apps** (free tier) instead of GitHub Pages
2. **Or** pay for GitHub Pro ($4/month) to use private repos with Pages
3. **Or** use Netlify (supports private repos on free tier)

## Security Notes

- ✅ HTTPS is automatic with GitHub Pages
- ✅ No sensitive data is stored on GitHub (only code)
- ✅ User data stays in Outlook
- ✅ No API keys or secrets needed

## Next Steps

After deployment:
1. Test on all your devices
2. Share the manifest.xml with others (if desired)
3. Consider submitting to Microsoft AppSource for wider distribution
4. Set up automatic deployment (GitHub Actions) for easier updates

## Cost

**Total cost: $0/month**

- GitHub Pages: Free
- HTTPS: Included
- Bandwidth: 100 GB/month (more than enough)
- Storage: 1 GB (your add-in is ~5 MB)
