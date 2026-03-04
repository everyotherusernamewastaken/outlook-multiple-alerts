# Outlook Multiple Alerts - Technical Specification

## System Architecture

### Overview
The Outlook Multiple Alerts add-in is a client-side Office.js application that extends Outlook Desktop to support multiple reminders per calendar event.

### Technology Stack
- **Frontend**: HTML, TypeScript
- **Office Integration**: Office.js API (Mailbox 1.3+)
- **Build Tool**: TypeScript Compiler
- **Testing**: Vitest
- **Hosting**: GitHub Pages (static hosting)
- **Version Control**: Git/GitHub

## Component Architecture

### 1. Core Components

#### AddIn (src/AddIn.ts)
- **Purpose**: Main initialization and dependency injection
- **Responsibilities**:
  - Initialize Office.js
  - Wire up all components
  - Handle add-in lifecycle
- **Dependencies**: All other components

#### ReminderManager (src/manager/ReminderManager.ts)
- **Purpose**: Business logic for reminder CRUD operations
- **Responsibilities**:
  - Create, read, update, delete reminders
  - Enforce 5-reminder limit
  - Coordinate between storage and Outlook adapter
- **Interface**: IReminderManager
- **Dependencies**: IReminderStorage, IOutlookAdapter, ReminderValidator

#### OutlookAdapter (src/outlook/OutlookAdapter.ts)
- **Purpose**: Abstraction layer for Office.js API
- **Responsibilities**:
  - Get current calendar item
  - Read/write Outlook reminders
  - Handle Office.js errors
- **Interface**: IOutlookAdapter
- **Dependencies**: Office.js

#### ReminderStorage (src/storage/InMemoryReminderStorage.ts)
- **Purpose**: In-memory cache of reminders
- **Responsibilities**:
  - Store reminder data temporarily
  - Provide fast lookup
  - Maintain data integrity
- **Interface**: IReminderStorage
- **Implementation**: In-memory Map

#### NativeReminderService (src/services/NativeReminderService.ts)
- **Purpose**: Wrapper for Outlook's native reminder API
- **Responsibilities**:
  - Create native Outlook reminders
  - Update reminder times
  - Delete reminders
- **Interface**: INativeReminderService


#### ReminderValidator (src/validation/ReminderValidator.ts)
- **Purpose**: Input validation and business rules
- **Responsibilities**:
  - Validate reminder data
  - Enforce business constraints
  - Provide validation error messages
- **Rules**:
  - Maximum 5 reminders per event
  - Valid time intervals only
  - No duplicate reminder times

#### IntegrityVerifier (src/integrity/IntegrityVerifier.ts)
- **Purpose**: Data consistency checks
- **Responsibilities**:
  - Detect data corruption
  - Verify storage integrity
  - Log integrity issues
- **Dependencies**: ErrorLog

#### ErrorLog (src/logging/ErrorLog.ts)
- **Purpose**: Centralized error logging
- **Responsibilities**:
  - Log errors with timestamps
  - Categorize error types
  - Provide error history

### 2. Data Models (src/types.ts)

#### Reminder
```typescript
interface Reminder {
  id: string;              // Unique identifier
  eventId: string;         // Calendar event ID
  minutesBefore: number;   // Time before event (in minutes)
  createdAt: Date;        // Creation timestamp
}
```

#### ReminderTime
```typescript
type ReminderTime = 
  | 5      // 5 minutes
  | 15     // 15 minutes
  | 30     // 30 minutes
  | 60     // 1 hour
  | 120    // 2 hours
  | 1440   // 1 day
  | 2880   // 2 days
  | 10080  // 1 week
  | 20160; // 2 weeks
```

## Data Flow

### Adding a Reminder

1. User clicks "Add Reminder" in UI
2. UI calls `ReminderManager.createReminder()`
3. ReminderManager validates with `ReminderValidator`
4. If valid:
   - Stores in `ReminderStorage`
   - Creates native reminder via `NativeReminderService`
   - Returns success
5. UI updates to show new reminder

### Editing a Reminder

1. User clicks "Edit" and selects new time
2. UI calls `ReminderManager.updateReminder()`
3. ReminderManager:
   - Validates new time
   - Updates storage
   - Updates native Outlook reminder
4. UI refreshes reminder list

### Deleting a Reminder

1. User clicks "Delete"
2. UI calls `ReminderManager.deleteReminder()`
3. ReminderManager:
   - Removes from storage
   - Deletes native Outlook reminder
4. UI removes reminder from list

### Loading Reminders

1. Task pane opens
2. UI calls `ReminderManager.getReminders()`
3. ReminderManager:
   - Gets current event from `OutlookAdapter`
   - Retrieves reminders from storage
   - Returns sorted list (chronological)
4. UI displays reminders

## Storage Strategy

### In-Memory Storage
- **Why**: Simple, fast, no persistence needed
- **Lifetime**: Per-session only
- **Sync**: Reminders stored in Outlook's native system
- **Recovery**: Reload from Outlook on each session

### Native Outlook Storage
- **Primary Storage**: Outlook's reminder system
- **Persistence**: Handled by Outlook
- **Sync**: Automatic across devices (via Exchange/Office 365)
- **Limitations**: Maximum 5 reminders per item

## API Integration

### Office.js APIs Used

#### Mailbox API
```typescript
Office.context.mailbox.item
```
- Get current calendar item
- Access item properties
- Read/write reminders

#### Item API
```typescript
item.subject
item.start
item.end
item.reminders
```

## UI Architecture

### Task Pane (taskpane.html)
- **Layout**: Single-page application
- **Sections**:
  - Header with title
  - "Add Reminder" button
  - Reminder list (scrollable)
  - Status messages
- **Styling**: Minimal CSS, Outlook-compatible

### UI Logic (src/ui/taskpane.ts)
- **Event Handlers**: Button clicks, dropdown changes
- **DOM Manipulation**: Update reminder list dynamically
- **Error Display**: Show user-friendly error messages

## Build and Deployment

### Build Process
1. TypeScript compilation (`tsc`)
2. Output to `dist/` folder
3. Bundle with dependencies

### Deployment
1. Push to GitHub repository
2. GitHub Pages serves static files
3. Manifest points to GitHub Pages URLs

### Manifest Configuration
- **ID**: Unique GUID
- **Version**: Semantic versioning
- **Hosts**: Mailbox (Outlook)
- **Permissions**: ReadWriteItem
- **URLs**: GitHub Pages base URL

## Testing Strategy

### Unit Tests
- **Framework**: Vitest
- **Coverage**: 
  - ReminderManager (CRUD operations)
  - ReminderValidator (validation rules)
  - InMemoryReminderStorage (storage operations)
- **Test Files**:
  - `ReminderManager.test.ts`
  - `ReminderValidator.test.ts`
  - `InMemoryReminderStorage.test.ts`

### Test Scenarios
1. Create reminder within limit (success)
2. Create reminder exceeding limit (failure)
3. Update reminder with valid time (success)
4. Delete existing reminder (success)
5. Validate reminder data (various cases)

## Error Handling

### Error Types
1. **Validation Errors**: Invalid input data
2. **Limit Errors**: Exceeding 5-reminder limit
3. **Office.js Errors**: API failures
4. **Storage Errors**: Data inconsistency

### Error Recovery
- Log all errors to ErrorLog
- Display user-friendly messages
- Graceful degradation
- No data loss on errors

## Security Considerations

### Data Privacy
- No external API calls
- No data sent to third parties
- All data stored in user's Outlook

### Permissions
- ReadWriteItem: Minimum required permission
- No access to other mailbox items
- No network requests (except Office.js CDN)

## Performance

### Optimization Strategies
- In-memory caching for fast access
- Minimal DOM manipulation
- Lazy loading of components
- Efficient event handlers

### Constraints
- Maximum 5 reminders (Outlook limit)
- Client-side only (no server processing)
- Dependent on Outlook performance

## Limitations

### Technical Limitations
1. Desktop-only (no mobile support)
2. Maximum 5 reminders per event
3. No custom notification types
4. Requires Outlook to be running for reminders

### Design Decisions
- No server-side component (simplicity)
- No custom email/push notifications (complexity)
- Creator-only reminders (privacy)
- Standard reminder intervals only (usability)

## Future Enhancements (Not Implemented)

- Mobile platform support (Android, iOS)
- Custom notification channels (email, SMS)
- Recurring event support
- Reminder templates
- Multi-user reminder sharing
- Custom reminder intervals
- Reminder history/analytics

## Maintenance

### Updating the Add-in
1. Make code changes locally
2. Run tests: `npm test`
3. Build: `npm run build`
4. Commit and push to GitHub
5. GitHub Pages auto-deploys
6. Users get updates on next Outlook restart

### Monitoring
- Check GitHub Pages deployment status
- Review error logs (if implemented)
- Monitor user feedback

## Dependencies

### Production Dependencies
- `@types/office-js`: Office.js TypeScript definitions

### Development Dependencies
- `typescript`: TypeScript compiler
- `vitest`: Testing framework
- `@types/node`: Node.js type definitions

## File Structure

```
outlook-multiple-alerts/
├── src/
│   ├── AddIn.ts                    # Main initialization
│   ├── index.ts                    # Entry point
│   ├── types.ts                    # Type definitions
│   ├── manager/
│   │   ├── ReminderManager.ts      # Business logic
│   │   ├── IReminderManager.ts     # Interface
│   │   └── ReminderManager.test.ts # Tests
│   ├── outlook/
│   │   ├── OutlookAdapter.ts       # Office.js wrapper
│   │   └── IOutlookAdapter.ts      # Interface
│   ├── storage/
│   │   ├── InMemoryReminderStorage.ts
│   │   ├── IReminderStorage.ts
│   │   └── InMemoryReminderStorage.test.ts
│   ├── validation/
│   │   ├── ReminderValidator.ts
│   │   └── ReminderValidator.test.ts
│   ├── services/
│   │   ├── NativeReminderService.ts
│   │   └── INativeReminderService.ts
│   ├── integrity/
│   │   └── IntegrityVerifier.ts
│   ├── logging/
│   │   └── ErrorLog.ts
│   └── ui/
│       └── taskpane.ts             # UI logic
├── dist/                           # Compiled output
├── assets/                         # Icons
├── taskpane.html                   # UI markup
├── commands.html                   # Function commands
├── manifest.xml                    # Add-in manifest
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
└── vitest.config.ts               # Test config
```

## References

- [Office.js Documentation](https://docs.microsoft.com/en-us/office/dev/add-ins/)
- [Outlook Add-ins Overview](https://docs.microsoft.com/en-us/outlook/add-ins/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
