# Complete GitHub Repository Setup Guide

## Step 1: Install Git (If Not Already Installed)

### Check if Git is Installed
Open PowerShell and run:
```powershell
git --version
```

If you see a version number, Git is installed. Skip to Step 2.

If you see "command not found", install Git:

### Install Git on Windows

1. **Download Git**:
   - Go to: https://git-scm.com/download/win
   - Download the installer (64-bit recommended)

2. **Run the Installer**:
   - Accept all default options
   - Important: Check "Git from the command line and also from 3rd-party software"

3. **Restart Your Terminal**:
   - Close PowerShell/Kiro completely
   - Reopen it
   - Test: `git --version`

### Configure Git (First Time Only)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 2: Create GitHub Account (If Needed)

1. Go to https://github.com
2. Click "Sign up"
3. Follow the registration process
4. Verify your email address

---

## Step 3: Create GitHub Repository

### Option A: Via GitHub Website (Recommended)

1. **Go to GitHub** and log in

2. **Create New Repository**:
   - Click the **+** icon (top right) → **New repository**
   
3. **Repository Settings**:
   - **Repository name**: `outlook-multiple-alerts`
   - **Description**: "Outlook add-in for managing multiple reminders per calendar event"
   - **Visibility**: **Public** (required for free GitHub Pages)
   - **DO NOT** check "Initialize with README" (we already have files)
   - **DO NOT** add .gitignore or license yet
   
4. **Click "Create repository"**

5. **Copy the Repository URL**:
   - You'll see: `https://github.com/YOUR-USERNAME/outlook-multiple-alerts.git`
   - Keep this page open - we'll need these commands

---

## Step 4: Initialize Git in Your Project

Open PowerShell in your project folder and run these commands:

```powershell
# Navigate to your project folder (if not already there)
cd "C:\Users\Christopher.Scott\Documents\Kiro Projects\Outlook Alerts"

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Outlook Multiple Alerts add-in"
```

---

## Step 5: Connect to GitHub and Push

Replace `YOUR-USERNAME` with your actual GitHub username:

```powershell
# Add GitHub as remote
git remote add origin https://github.com/YOUR-USERNAME/outlook-multiple-alerts.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)

### Creating a Personal Access Token (If Needed)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: "Outlook Add-in Deployment"
4. Expiration: 90 days (or longer)
5. Scopes: Check **repo** (all sub-options)
6. Click "Generate token"
7. **Copy the token** (you won't see it again!)
8. Use this token as your password when pushing

---

## Step 6: Verify Upload

1. Go to your GitHub repository page:
   ```
   https://github.com/YOUR-USERNAME/outlook-multiple-alerts
   ```

2. You should see all your files:
   - src/
   - dist/
   - taskpane.html
   - manifest.xml
   - package.json
   - etc.

---

## Step 7: Enable GitHub Pages

1. **Go to Repository Settings**:
   - Click **Settings** tab (top of your repo page)

2. **Navigate to Pages**:
   - Click **Pages** in the left sidebar

3. **Configure Source**:
   - Under "Build and deployment"
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
   - Click **Save**

4. **Wait for Deployment**:
   - GitHub will show: "Your site is ready to be published"
   - After 1-2 minutes, it will change to: "Your site is live at..."
   - Copy this URL: `https://YOUR-USERNAME.github.io/outlook-multiple-alerts/`

---

## Step 8: Update Manifest URLs

Now update your manifest.xml to use the GitHub Pages URL:

```powershell
# Run the update script (replace YOUR-USERNAME)
npm run deploy:setup YOUR-USERNAME

# This updates all localhost URLs to your GitHub Pages URL
```

**Or manually edit manifest.xml:**
- Find all instances of `https://localhost:3000`
- Replace with `https://YOUR-USERNAME.github.io/outlook-multiple-alerts`

---

## Step 9: Push Updated Manifest

```powershell
# Add the updated manifest
git add manifest.xml

# Commit the change
git commit -m "Update manifest URLs for GitHub Pages deployment"

# Push to GitHub
git push
```

Wait 1-2 minutes for GitHub Pages to rebuild.

---

## Step 10: Test Your Deployment

### Test 1: Verify Files Are Accessible

Open in your browser:
```
https://YOUR-USERNAME.github.io/outlook-multiple-alerts/taskpane.html
```

You should see your task pane HTML.

### Test 2: Install in Outlook Desktop

1. Open Outlook Desktop
2. Go to **File** → **Manage Add-ins**
3. Click **My Add-ins** (left sidebar)
4. Under "Custom Add-ins", click **+ Add a custom add-in**
5. Select **Add from file...**
6. Browse to your `manifest.xml` file
7. Click **Install**

### Test 3: Use the Add-in

1. Open a calendar event in Outlook
2. Look for **"Multiple Alerts"** button in the ribbon
3. Click it to open the task pane
4. Add a reminder and verify it works

---

## Troubleshooting

### "Git is not recognized"
- Install Git from https://git-scm.com/download/win
- Restart your terminal after installation
- Run `git --version` to verify

### "Permission denied" when pushing
- You need a Personal Access Token (see Step 5)
- Don't use your GitHub password - it won't work
- Generate a token at: GitHub → Settings → Developer settings → Personal access tokens

### "GitHub Pages not working"
- Make sure repository is **Public** (not Private)
- Wait 5-10 minutes after enabling Pages
- Check Settings → Pages shows "Your site is live"

### "Add-in won't load in Outlook"
- Verify the GitHub Pages URL works in a browser first
- Check manifest.xml has correct URLs (no localhost)
- Try removing and re-adding the add-in

### "Changes don't appear"
- GitHub Pages takes 1-2 minutes to update after pushing
- Close and reopen Outlook
- Clear browser cache if testing in Outlook Web

---

## Quick Reference: Common Git Commands

```powershell
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline
```

---

## Next Steps After Setup

1. **Test on multiple devices**:
   - Install on Outlook Desktop
   - Install on Outlook Web (outlook.office.com)
   - Verify it works everywhere

2. **Make updates**:
   ```powershell
   # Make code changes
   npm run build
   git add .
   git commit -m "Update: description"
   git push
   # Wait 1-2 minutes for GitHub Pages to update
   ```

3. **Share with others** (optional):
   - Share your `manifest.xml` file
   - Others can install using the same file
   - Everyone loads from your GitHub Pages URL

4. **Consider Microsoft AppSource** (optional):
   - Submit your add-in for official distribution
   - Appears in Outlook's "Get Add-ins" store
   - Requires Microsoft review process

---

## Summary

✅ Git installed and configured
✅ GitHub repository created
✅ Code pushed to GitHub
✅ GitHub Pages enabled
✅ Manifest updated with GitHub URLs
✅ Add-in accessible from anywhere
✅ Works on all your devices

**Your add-in is now live at:**
```
https://YOUR-USERNAME.github.io/outlook-multiple-alerts/
```

**Cost: $0/month** - Completely free with GitHub Pages!
