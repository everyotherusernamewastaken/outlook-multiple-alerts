/**
 * Main entry point for the Outlook Multiple Alerts Add-in
 */

export { AddIn, addIn } from './AddIn';
export { ReminderManager } from './manager/ReminderManager';
export { InMemoryReminderStorage } from './storage/InMemoryReminderStorage';
export { ReminderValidator } from './validation/ReminderValidator';
export { NativeReminderService } from './services/NativeReminderService';
export { OutlookAdapter } from './outlook/OutlookAdapter';
export { IntegrityVerifier } from './integrity/IntegrityVerifier';
export { ErrorLog } from './logging/ErrorLog';

export * from './types';
export * from './storage/IReminderStorage';
export * from './manager/IReminderManager';
export * from './services/INativeReminderService';
export * from './outlook/IOutlookAdapter';
