// Core domain types for Outlook Multiple Alerts Add-in

/**
 * Result type for error handling
 */
export type Result<T, E> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

/**
 * Reminder entity representing a configured reminder
 */
export interface Reminder {
  id: string;
  itemId: string;
  itemType: 'event' | 'task';
  configuration: ReminderConfiguration;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Reminder configuration settings
 */
export interface ReminderConfiguration {
  // Time offset from event/task in minutes (negative = before)
  timeOffset: number;
  // Computed trigger time
  triggerTime: Date;
}

/**
 * Creator context
 */
export interface Creator {
  id: string;
  email: string;
}

/**
 * Calendar event
 */
export interface CalendarItem {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  creatorId: string;
}

/**
 * Task item
 */
export interface Task {
  id: string;
  title: string;
  dueDate?: Date;
  creatorId: string;
}

/**
 * Validation error types
 */
export type ValidationError =
  | { type: 'limit_exceeded'; message: string; currentCount: number }
  | { type: 'invalid_time'; message: string; providedTime: Date }
  | { type: 'invalid_offset'; message: string; providedOffset: number }
  | { type: 'item_not_found'; message: string; itemId: string }
  | { type: 'not_creator'; message: string; itemId: string };

/**
 * Integrity issue detected during verification
 */
export interface IntegrityIssue {
  type: 'orphaned_alert' | 'invalid_configuration';
  alertId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoRepairable: boolean;
  suggestedAction: 'delete' | 'enable_reminder' | 'quarantine';
}

/**
 * Integrity report
 */
export interface IntegrityReport {
  totalAlerts: number;
  issues: IntegrityIssue[];
}

/**
 * Repair result
 */
export interface RepairResult {
  repaired: string[];
  deleted: string[];
}

/**
 * Error log entry
 */
export interface ErrorLogEntry {
  timestamp: Date;
  type: 'validation' | 'storage' | 'integrity' | 'reminder';
  severity: 'low' | 'medium' | 'high' | 'critical';
  alertId?: string;
  itemId?: string;
  message: string;
  details: Record<string, unknown>;
  stackTrace?: string;
}
