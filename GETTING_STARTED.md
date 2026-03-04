# Getting Started with Outlook Multiple Alerts

## Overview

This Outlook Desktop Add-in allows users to configure up to 5 reminders per calendar event or task, using Outlook's native reminder system.

## What's Been Built

✓ Complete working add-in with all components implemented
✓ All tests passing (16/16)
✓ Build system working
✓ Ready for testing in Outlook Desktop

## Quick Start

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```

### 3. Build the Project
```bash
npm run build
```

### 4. Test in Outlook Desktop

**Before you can test:**
1. Create an `assets` folder with icon files:
   - `assets/icon-16.png` (16x16 pixels)
   - `assets/icon-32.png` (32x32 pixels)
   - `assets/icon-80.png` (80x80 pixels)

2. Start a local web server (the add-in needs to be served over HTTPS):
   ```bash
   # Install a simple HTTPS server
   npm install -g http-server
   
   # Serve the files
   http-server -p 3000 --ssl
   ```

3. Sideload the add-in:
   - Open Outlook Desktop
   - Go to File → Manage Add-ins
   - Click "My Add-ins"
   - Under "Custom Add-ins", click "Add a custom add-in"
   - Select "Add from file"
   - Browse to `manifest.xml` in this project

### 5. Use the Add-in

1. Open a calendar event in Outlook
2. Look for the "Multiple Alerts" button in the ribbon
3. Click it to open the task pane
4. Add up to 5 reminders with different times
5. Each reminder will create a native Outlook reminder

## Project Structure

```
outlook-multiple-alerts/
├── src/
│   ├── types.ts                 # Core domain types
│   ├── storage/                 # Reminder storage
│   ├── validation/              # Validation logic
│   ├── manager/                 # Reminder manager
│   ├── services/                # Native reminder service
│   ├── outlook/                 # Outlook API adapter
│   ├── integrity/               # Integrity verifier
│   ├── logging/                 # Error logging
│   ├── ui/                      # Task pane UI logic
│   ├── AddIn.ts                 # Main add-in class
│   └── index.ts                 # Entry point
├── taskpane.html                # UI HTML
├── manifest.xml                 # Outlook add-in manifest
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vitest.config.ts             # Test config
└── README.md                    # Project documentation

```

## Features

- ✓ Create up to 5 reminders per calendar event or task
- ✓ Choose from standard Outlook reminder times (5 min, 15 min, 1 hour, etc.)
- ✓ Reminders displayed chronologically
- ✓ Automatic validation (no past times, max 5 reminders)
- ✓ Native Outlook reminder integration
- ✓ Error logging and integrity checking
- ✓ Auto-repair corrupted data on startup

## Development

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Lint Code
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

## Troubleshooting

### Add-in doesn't appear in Outlook
- Make sure you're running a local HTTPS server on port 3000
- Check that manifest.xml has the correct URLs
- Try restarting Outlook

### Tests fail
- Make sure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be v18+)

### Build errors
- Clear the dist folder and rebuild: `rm -rf dist && npm run build`
- Make sure TypeScript is installed: `npm install -g typescript`

## Next Steps

1. **Create Icons**: Add icon files to the `assets/` folder
2. **Test Locally**: Follow the "Test in Outlook Desktop" steps above
3. **Customize**: Modify the UI in `taskpane.html` and `src/ui/taskpane.ts`
4. **Deploy**: Host on a production HTTPS server and update manifest URLs
5. **Publish**: Submit to Microsoft AppSource (optional)

## Support

For issues or questions:
1. Check the IMPLEMENTATION_STATUS.md file
2. Review the test files for usage examples
3. Check the Office.js documentation: https://docs.microsoft.com/office/dev/add-ins/

## License

MIT
