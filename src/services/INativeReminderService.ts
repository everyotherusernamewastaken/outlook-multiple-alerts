import { Result } from '../types';
import { NativeReminder } from '../outlook/IOutlookAdapter';

/**
 * Error type for native reminder operations
 */
export interface ReminderError {
  type: 'creation_failed' | 'update_failed' | 'deletion_failed' | 'retrieval_failed';
  message: string;
  itemId: string;
  details?: unknown;
}

/**
 * Interface for native reminder service operations
 */
export interface INativeReminderService {
  /**
   * Create a native Outlook reminder
   */
  createNativeReminder(
    itemId: string,
    minutesBeforeStart: number
  ): Promise<Result<void, ReminderError>>;

  /**
   * Update a native Outlook reminder
   */
  updateNativeReminder(
    itemId: string,
    oldMinutes: number,
    newMinutes: number
  ): Promise<Result<void, ReminderError>>;

  /**
   * Delete a native Outlook reminder
   */
  deleteNativeReminder(
    itemId: string,
    minutesBeforeStart: number
  ): Promise<Result<void, ReminderError>>;

  /**
   * Get all native reminders for an item
   */
  getNativeReminders(itemId: string): Promise<Result<NativeReminder[], ReminderError>>;
}
