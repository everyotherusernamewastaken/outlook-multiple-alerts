import { Reminder, ReminderConfiguration, ValidationError, Result, Ok, Err } from '../types';
import { IReminderManager } from './IReminderManager';
import { IReminderStorage } from '../storage/IReminderStorage';
import { ReminderValidator } from '../validation/ReminderValidator';
import { v4 as uuidv4 } from 'uuid';

/**
 * Manages reminder CRUD operations with validation
 */
export class ReminderManager implements IReminderManager {
  constructor(
    private storage: IReminderStorage,
    private validator: ReminderValidator
  ) {}

  async createReminder(
    itemId: string,
    itemType: 'event' | 'task',
    config: ReminderConfiguration
  ): Promise<Result<Reminder, ValidationError>> {
    // Validate configuration
    const validationResult = await this.validator.validate(itemId, config);
    if (!validationResult.ok) {
      return validationResult;
    }

    // Create reminder
    const reminder: Reminder = {
      id: uuidv4(),
      itemId,
      itemType,
      configuration: config,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.storage.save(reminder);
    return Ok(reminder);
  }

  async getReminders(itemId: string): Promise<Reminder[]> {
    const reminders = await this.storage.getByItem(itemId);
    
    // Sort chronologically by trigger time
    return reminders.sort((a, b) => 
      a.configuration.triggerTime.getTime() - b.configuration.triggerTime.getTime()
    );
  }

  async updateReminder(
    reminderId: string,
    config: ReminderConfiguration
  ): Promise<Result<Reminder, ValidationError>> {
    // Get existing reminder
    const allReminders = await this.storage.getAllReminders();
    const existing = allReminders.find(r => r.id === reminderId);
    
    if (!existing) {
      return Err({
        type: 'item_not_found',
        message: 'Reminder not found',
        itemId: reminderId
      });
    }

    // Validate new configuration
    const validationResult = await this.validator.validate(existing.itemId, config);
    if (!validationResult.ok) {
      return validationResult;
    }

    // Update reminder
    const updated: Reminder = {
      ...existing,
      configuration: config,
      updatedAt: new Date()
    };

    await this.storage.save(updated);
    return Ok(updated);
  }

  async deleteReminder(reminderId: string): Promise<Result<void, Error>> {
    try {
      await this.storage.deleteByReminderId(reminderId);
      return Ok(undefined);
    } catch (error) {
      return Err(error as Error);
    }
  }

  async deleteRemindersForItem(itemId: string): Promise<Result<void, Error>> {
    try {
      await this.storage.deleteByItem(itemId);
      return Ok(undefined);
    } catch (error) {
      return Err(error as Error);
    }
  }

  async validateReminderLimit(itemId: string): Promise<Result<void, ValidationError>> {
    return this.validator.validateLimit(itemId);
  }
}
