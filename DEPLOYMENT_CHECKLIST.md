# Deployment Checklist

Use this checklist to track your progress deploying to GitHub Pages.

## Pre-Deployment

- [ ] Node.js installed (`node --version`)
- [ ] Dependencies installed (`npm install`)
- [ ] Tests passing (`npm test`)
- [ ] Build successful (`npm run build`)

## Git Setup

- [ ] Git installed (`git --version`)
- [ ] Git configured:
  ```powershell
  git config --global user.name "Your Name"
  git config --global user.email "your@email.com"
  ```

## GitHub Account

- [ ] GitHub account created (https://github.com)
- [ ] Email verified
- [ ] Personal Access Token created (if needed for authentication)

## Repository Creation

- [ ] Repository created on GitHub
  - Name: `outlook-multiple-alerts`
  - Visibility: Public
  - No README, .gitignore, or license (we have these)

- [ ] Repository URL copied:
  ```
  https://github.com/YOUR-USERNAME/outlook-multiple-alerts.git
  ```

## Initial Push

- [ ] Git initialized in project folder:
  ```powershell
  git init
  ```

- [ ] Files added:
  ```powershell
  git add .
  ```

- [ ] First commit created:
  ```powershell
  git commit -m "Initial commit: Outlook Multiple Alerts add-in"
  ```

- [ ] Remote added (replace YOUR-USERNAME):
  ```powershell
  git remote add origin https://github.com/YOUR-USERNAME/outlook-multiple-alerts.git
  ```

- [ ] Branch renamed:
  ```powershell
  git branch -M main
  ```

- [ ] Pushed to GitHub:
  ```powershell
  git push -u origin main
  ```

- [ ] Verified files appear on GitHub website

## GitHub Pages Setup

- [ ] Navigated to repository Settings → Pages

- [ ] Configured deployment:
  - Source: Deploy from a branch
  - Branch: main
  - Folder: / (root)
  - Clicked Save

- [ ] Waited 2-5 minutes for deployment

- [ ] Verified "Your site is live" message appears

- [ ] Copied GitHub Pages URL:
  ```
  https://YOUR-USERNAME.github.io/outlook-multiple-alerts/
  ```

## Manifest Update

- [ ] Updated manifest URLs (replace YOUR-USERNAME):
  ```powershell
  npm run deploy:setup YOUR-USERNAME
  ```

- [ ] Verified manifest.xml has GitHub URLs (no localhost)

- [ ] Committed updated manifest:
  ```powershell
  git add manifest.xml
  git commit -m "Update manifest URLs for GitHub Pages"
  git push
  ```

- [ ] Waited 1-2 minutes for GitHub Pages to rebuild

## Testing

- [ ] Tested GitHub Pages URL in browser:
  ```
  https://YOUR-USERNAME.github.io/outlook-multiple-alerts/taskpane.html
  ```
  Should display the task pane HTML

- [ ] Tested assets load:
  ```
  https://YOUR-USERNAME.github.io/outlook-multiple-alerts/dist/taskpane.js
  ```
  Should show JavaScript code (or 404 if not built)

## Outlook Desktop Installation

- [ ] Opened Outlook Desktop

- [ ] Navigated to File → Manage Add-ins → My Add-ins

- [ ] Clicked "+ Add a custom add-in" → "Add from file..."

- [ ] Selected manifest.xml from project folder

- [ ] Clicked Install

- [ ] Accepted security warning

- [ ] Verified "Multiple Alerts" appears in add-ins list

## Outlook Desktop Testing

- [ ] Opened a calendar event

- [ ] Found "Multiple Alerts" button in ribbon

- [ ] Clicked button to open task pane

- [ ] Task pane loaded successfully

- [ ] Added a reminder (e.g., "15 minutes before")

- [ ] Verified reminder appears in list

- [ ] Verified reminder count shows correctly

- [ ] Deleted a reminder

- [ ] Verified deletion worked

- [ ] Tested limit (tried adding 6th reminder)

- [ ] Verified limit warning appears

## Outlook Web Testing (Optional)

- [ ] Opened outlook.office.com

- [ ] Navigated to Settings → View all settings → General → Manage Add-ins

- [ ] Clicked "+ Add from file"

- [ ] Uploaded manifest.xml

- [ ] Opened a calendar event

- [ ] Verified "Multiple Alerts" appears

- [ ] Tested add/delete reminders

## Multi-Device Testing

- [ ] Tested on Windows Desktop

- [ ] Tested on Mac Desktop (if available)

- [ ] Tested on Outlook Web

- [ ] Tested on mobile (if mobile support added)

## Documentation

- [ ] README.md updated with deployment info

- [ ] GitHub repository description added

- [ ] Repository topics added (outlook, add-in, reminders, etc.)

## Optional: Icons

- [ ] Created icon-16.png (16x16)

- [ ] Created icon-32.png (32x32)

- [ ] Created icon-80.png (80x80)

- [ ] Added icons to assets/ folder

- [ ] Committed and pushed icons:
  ```powershell
  git add assets/
  git commit -m "Add add-in icons"
  git push
  ```

## Post-Deployment

- [ ] Bookmarked GitHub repository URL

- [ ] Bookmarked GitHub Pages URL

- [ ] Saved Personal Access Token securely (if created)

- [ ] Documented any issues encountered

- [ ] Shared manifest.xml with team (if applicable)

## Future Updates

When making changes:

- [ ] Make code changes
- [ ] Run tests: `npm test`
- [ ] Build: `npm run build`
- [ ] Commit: `git add . && git commit -m "Description"`
- [ ] Push: `git push`
- [ ] Wait 1-2 minutes for GitHub Pages to update
- [ ] Test in Outlook

---

## Troubleshooting Reference

If something doesn't work, check:

1. **Git not found**: Install from https://git-scm.com/download/win
2. **Push fails**: Create Personal Access Token on GitHub
3. **Pages not working**: Ensure repo is Public, wait 5-10 minutes
4. **Add-in won't load**: Verify GitHub Pages URL works in browser
5. **Changes don't appear**: Wait 1-2 minutes, close/reopen Outlook

---

## Success Criteria

✅ All checkboxes above are checked
✅ Add-in loads in Outlook Desktop
✅ Can add/delete reminders
✅ Works on multiple devices
✅ No localhost dependencies
✅ Costs $0/month

**Congratulations! Your add-in is deployed and working across all devices!** 🎉
