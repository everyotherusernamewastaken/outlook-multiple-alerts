# Outlook Multiple Alerts Add-in

An Outlook Desktop add-in that allows users to configure up to 5 reminders per calendar event or task, using Outlook's native reminder system.

## Features

- ✅ Create up to 5 reminders per calendar event or task
- ✅ Choose from standard Outlook reminder times (5 min, 15 min, 1 hour, 1 day, etc.)
- ✅ Reminders displayed chronologically
- ✅ Automatic validation (no past times, max 5 reminders)
- ✅ Native Outlook reminder integration
- ✅ Works across all devices (Desktop, Web, Mobile)
- ✅ No backend server required
- ✅ Free to use

## Quick Start

### For Users

1. Download `manifest.xml` from this repository
2. In Outlook: File → Manage Add-ins → My Add-ins → Add from file
3. Select the downloaded `manifest.xml`
4. Open a calendar event and click "Multiple Alerts" in the ribbon

### For Developers

See [SETUP_GITHUB_REPOSITORY.md](SETUP_GITHUB_REPOSITORY.md) for complete deployment instructions.

**Quick deploy:**
```bash
npm install
npm test
npm run build
npm run deploy:setup YOUR-GITHUB-USERNAME
```

Then follow the [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).

## Documentation

- **[SETUP_GITHUB_REPOSITORY.md](SETUP_GITHUB_REPOSITORY.md)** - Complete setup guide
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - 5-minute quick start
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Detailed deployment guide
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Development guide
- **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** - Technical details

## Architecture

```
┌─────────────────────────────────────────┐
│     Desktop UI (Task Pane)              │
│  - Add/Edit/Delete reminders            │
│  - Display chronologically              │
│  - Limit warnings                       │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│        Reminder Manager                  │
│  - CRUD operations                       │
│  - Validation (5 max, future times)     │
│  - Chronological sorting                 │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼──────────┐
│ Reminder       │   │ Native Reminder   │
│ Storage        │   │ Service           │
│ (In-Memory)    │   │ (Office.js)       │
└────────────────┘   └───────────────────┘
```

## Technology Stack

- **TypeScript** - Type-safe development
- **Office.js** - Outlook API integration
- **Vitest** - Unit testing
- **GitHub Pages** - Free hosting with HTTPS

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Run tests in watch mode
npm run test:watch
```

## Deployment

This add-in is deployed to GitHub Pages for free hosting:

1. Push code to GitHub
2. Enable GitHub Pages
3. Update manifest URLs
4. Install in Outlook

See [SETUP_GITHUB_REPOSITORY.md](SETUP_GITHUB_REPOSITORY.md) for detailed instructions.

## Testing

All core functionality is tested:
- ✅ 16 unit tests passing
- ✅ Storage operations
- ✅ Validation logic
- ✅ Reminder management
- ✅ CRUD operations

Run tests:
```bash
npm test
```

## Browser Support

- ✅ Outlook Desktop (Windows)
- ✅ Outlook Desktop (Mac)
- ✅ Outlook Web (all modern browsers)
- ⚠️ Outlook Mobile (requires additional configuration)

## Requirements

- Outlook Desktop, Web, or Mobile
- Microsoft 365 account
- Modern web browser (for Outlook Web)

## Cost

**$0/month** - Completely free when hosted on GitHub Pages

## Privacy

- ✅ No user data collected
- ✅ Reminders stored in Outlook (not on external servers)
- ✅ No backend database
- ✅ No tracking or analytics

## License

MIT

## Support

For issues or questions:
1. Check the documentation files listed above
2. Review test files for usage examples
3. Check Office.js documentation: https://docs.microsoft.com/office/dev/add-ins/

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## Roadmap

- [x] Desktop support
- [x] Native reminder integration
- [x] GitHub Pages deployment
- [ ] Mobile UI optimization
- [ ] Android/iOS native support
- [ ] Microsoft AppSource submission
- [ ] Persistent storage (IndexedDB)
- [ ] Cloud sync across devices

## Acknowledgments

Built with:
- [Office.js](https://docs.microsoft.com/office/dev/add-ins/) - Microsoft Office Add-ins API
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vitest](https://vitest.dev/) - Fast unit testing
- [GitHub Pages](https://pages.github.com/) - Free hosting

---

**Made with ❤️ for Outlook users who need multiple reminders**
