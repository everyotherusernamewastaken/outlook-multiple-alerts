import { Reminder, ReminderConfiguration, ValidationError, Result } from '../types';

/**
 * Interface for reminder management operations
 */
export interface IReminderManager {
  /**
   * Create a new reminder for an item
   */
  createReminder(
    itemId: string,
    itemType: 'event' | 'task',
    config: ReminderConfiguration
  ): Promise<Result<Reminder, ValidationError>>;

  /**
   * Get all reminders for an item (sorted chronologically)
   */
  getReminders(itemId: string): Promise<Reminder[]>;

  /**
   * Update an existing reminder
   */
  updateReminder(
    reminderId: string,
    config: ReminderConfiguration
  ): Promise<Result<Reminder, ValidationError>>;

  /**
   * Delete a reminder
   */
  deleteReminder(reminderId: string): Promise<Result<void, Error>>;

  /**
   * Delete all reminders for an item
   */
  deleteRemindersForItem(itemId: string): Promise<Result<void, Error>>;

  /**
   * Validate reminder limit for an item
   */
  validateReminderLimit(itemId: string): Promise<Result<void, ValidationError>>;
}
