import { CalendarItem, Task, Creator } from '../types';

/**
 * Native Outlook reminder representation
 */
export interface NativeReminder {
  minutesBeforeStart: number;
}

/**
 * Interface for Outlook API operations
 */
export interface IOutlookAdapter {
  /**
   * Get a calendar event or task by ID
   */
  getItem(itemId: string): Promise<CalendarItem | Task | null>;

  /**
   * Get the creator of an item
   */
  getCreator(itemId: string): Promise<Creator | null>;

  /**
   * Get native Outlook reminders for an item
   */
  getNativeReminders(itemId: string): Promise<NativeReminder[]>;

  /**
   * Create a native Outlook reminder
   */
  createReminder(itemId: string, minutesBeforeStart: number): Promise<void>;

  /**
   * Update a native Outlook reminder
   */
  updateReminder(itemId: string, oldMinutes: number, newMinutes: number): Promise<void>;

  /**
   * Delete a native Outlook reminder
   */
  deleteReminder(itemId: string, minutesBeforeStart: number): Promise<void>;

  /**
   * Register callback for item changes
   */
  onItemChanged(callback: (itemId: string) => void): void;

  /**
   * Register callback for item deletion
   */
  onItemDeleted(callback: (itemId: string) => void): void;
}
