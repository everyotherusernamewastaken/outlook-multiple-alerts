import { Reminder, IntegrityReport, IntegrityIssue } from '../types';
import { IReminderStorage } from './IReminderStorage';

/**
 * In-memory implementation of reminder storage
 * For production, this would be replaced with IndexedDB or similar
 */
export class InMemoryReminderStorage implements IReminderStorage {
  private reminders: Map<string, Reminder> = new Map();

  async save(reminder: Reminder): Promise<void> {
    this.reminders.set(reminder.id, { ...reminder });
  }

  async getByItem(itemId: string): Promise<Reminder[]> {
    const results: Reminder[] = [];
    for (const reminder of this.reminders.values()) {
      if (reminder.itemId === itemId) {
        results.push({ ...reminder });
      }
    }
    return results;
  }

  async deleteByReminderId(reminderId: string): Promise<void> {
    this.reminders.delete(reminderId);
  }

  async deleteByItem(itemId: string): Promise<void> {
    const toDelete: string[] = [];
    for (const [id, reminder] of this.reminders.entries()) {
      if (reminder.itemId === itemId) {
        toDelete.push(id);
      }
    }
    toDelete.forEach(id => this.reminders.delete(id));
  }

  async getAllReminders(): Promise<Reminder[]> {
    return Array.from(this.reminders.values()).map(r => ({ ...r }));
  }

  async verifyIntegrity(): Promise<IntegrityReport> {
    const allReminders = await this.getAllReminders();
    const issues: IntegrityIssue[] = [];

    for (const reminder of allReminders) {
      // Check for invalid configuration
      if (!reminder.configuration.triggerTime) {
        issues.push({
          type: 'invalid_configuration',
          alertId: reminder.id,
          severity: 'high',
          autoRepairable: false,
          suggestedAction: 'delete'
        });
      }

      // Check for invalid time offset
      if (typeof reminder.configuration.timeOffset !== 'number') {
        issues.push({
          type: 'invalid_configuration',
          alertId: reminder.id,
          severity: 'high',
          autoRepairable: false,
          suggestedAction: 'delete'
        });
      }
    }

    return {
      totalAlerts: allReminders.length,
      issues
    };
  }

  // Test helper methods
  clear(): void {
    this.reminders.clear();
  }

  size(): number {
    return this.reminders.size;
  }
}
