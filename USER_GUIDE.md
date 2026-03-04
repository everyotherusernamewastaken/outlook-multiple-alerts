# Outlook Multiple Alerts - User Guide

## Overview

The Outlook Multiple Alerts add-in allows you to create up to 5 reminders for any calendar event or task. This is useful when you need multiple notifications at different times before an event.

## Features

- **Multiple Reminders**: Set up to 5 reminders per calendar event or task
- **Flexible Timing**: Use standard Outlook reminder intervals (5 minutes to 2 weeks before)
- **Native Integration**: Uses Outlook's built-in reminder system
- **Desktop Support**: Works with Outlook Desktop on Windows

## How to Use

### Opening the Add-in

1. Open or create a calendar event in Outlook
2. Look for the **"Multiple Alerts"** button in the ribbon
3. Click it to open the task pane on the right side

### Adding a Reminder

1. In the task pane, click **"Add Reminder"**
2. Select when you want to be reminded from the dropdown:
   - 5 minutes before
   - 15 minutes before
   - 30 minutes before
   - 1 hour before
   - 2 hours before
   - 1 day before
   - 2 days before
   - 1 week before
   - 2 weeks before
3. The reminder will appear in the list

### Editing a Reminder

1. Find the reminder in the list
2. Click the **"Edit"** button next to it
3. Select a new time from the dropdown
4. Click **"Save"** to confirm

### Deleting a Reminder

1. Find the reminder in the list
2. Click the **"Delete"** button next to it
3. The reminder will be removed immediately

### Viewing Your Reminders

All reminders for the current event are displayed in chronological order (earliest first) in the task pane.

## Limitations

- Maximum of 5 reminders per event (Outlook's native limit)
- Only works with calendar events and tasks you created
- Desktop-only (mobile support not included)
- Reminders are stored using Outlook's native reminder system

## Troubleshooting

### Add-in doesn't appear
- Make sure you've sideloaded the manifest.xml file
- Restart Outlook
- Check that you're viewing a calendar event (not an email)

### Reminders not firing
- Ensure Outlook is running when the reminder time arrives
- Check your Outlook reminder settings
- Verify the event hasn't been deleted

### Can't add more than 5 reminders
- This is an Outlook limitation
- Delete an existing reminder before adding a new one

## Technical Details

- **Platform**: Outlook Desktop (Windows)
- **Technology**: Office.js Add-in
- **Storage**: Outlook's native reminder system
- **Hosting**: GitHub Pages

## Support

For issues or questions, refer to the project documentation:
- `README.md` - Project overview
- `GETTING_STARTED.md` - Development setup
- `.kiro/specs/outlook-multiple-alerts/requirements.md` - Detailed requirements
- `.kiro/specs/outlook-multiple-alerts/design.md` - Technical architecture
