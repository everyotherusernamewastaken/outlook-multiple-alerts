import { Reminder, IntegrityReport } from '../types';

/**
 * Interface for reminder storage operations
 */
export interface IReminderStorage {
  /**
   * Save a reminder to storage
   */
  save(reminder: Reminder): Promise<void>;

  /**
   * Retrieve all reminders for a specific item
   */
  getByItem(itemId: string): Promise<Reminder[]>;

  /**
   * Delete a reminder by its ID
   */
  deleteByReminderId(reminderId: string): Promise<void>;

  /**
   * Delete all reminders for a specific item
   */
  deleteByItem(itemId: string): Promise<void>;

  /**
   * Verify data integrity and detect corruption
   */
  verifyIntegrity(): Promise<IntegrityReport>;

  /**
   * Get all reminders (for integrity verification)
   */
  getAllReminders(): Promise<Reminder[]>;
}
