import { ReminderConfiguration, ValidationError, Result, Ok, Err } from '../types';
import { IReminderStorage } from '../storage/IReminderStorage';

/**
 * Validates reminder configurations
 */
export class ReminderValidator {
  constructor(private storage: IReminderStorage) {}

  /**
   * Validate a reminder configuration
   */
  async validate(
    itemId: string,
    config: ReminderConfiguration
  ): Promise<Result<void, ValidationError>> {
    // Check reminder limit (max 5 per item)
    const existingReminders = await this.storage.getByItem(itemId);
    if (existingReminders.length >= 5) {
      return Err({
        type: 'limit_exceeded',
        message: 'Maximum 5 reminders per item',
        currentCount: existingReminders.length
      });
    }

    // Check trigger time is in future
    if (config.triggerTime < new Date()) {
      return Err({
        type: 'invalid_time',
        message: 'Reminder time must be in the future',
        providedTime: config.triggerTime
      });
    }

    // Check time offset is valid
    if (typeof config.timeOffset !== 'number' || isNaN(config.timeOffset)) {
      return Err({
        type: 'invalid_offset',
        message: 'Time offset must be a valid number',
        providedOffset: config.timeOffset
      });
    }

    return Ok(undefined);
  }

  /**
   * Validate reminder limit for an item
   */
  async validateLimit(itemId: string): Promise<Result<void, ValidationError>> {
    const existingReminders = await this.storage.getByItem(itemId);
    if (existingReminders.length >= 5) {
      return Err({
        type: 'limit_exceeded',
        message: 'Maximum 5 reminders per item',
        currentCount: existingReminders.length
      });
    }
    return Ok(undefined);
  }
}
