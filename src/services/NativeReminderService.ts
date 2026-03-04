import { Result, Ok, Err } from '../types';
import { INativeReminderService, ReminderError } from './INativeReminderService';
import { IOutlookAdapter, NativeReminder } from '../outlook/IOutlookAdapter';
import { ErrorLog } from '../logging/ErrorLog';

/**
 * Service for managing native Outlook reminders
 */
export class NativeReminderService implements INativeReminderService {
  constructor(
    private outlookAdapter: IOutlookAdapter,
    private errorLog: ErrorLog
  ) {}

  async createNativeReminder(
    itemId: string,
    minutesBeforeStart: number
  ): Promise<Result<void, ReminderError>> {
    try {
      await this.outlookAdapter.createReminder(itemId, minutesBeforeStart);
      return Ok(undefined);
    } catch (error) {
      const reminderError: ReminderError = {
        type: 'creation_failed',
        message: `Failed to create native reminder: ${(error as Error).message}`,
        itemId,
        details: error
      };

      this.errorLog.log({
        type: 'reminder',
        severity: 'high',
        itemId,
        message: reminderError.message,
        details: { minutesBeforeStart, error }
      });

      return Err(reminderError);
    }
  }

  async updateNativeReminder(
    itemId: string,
    oldMinutes: number,
    newMinutes: number
  ): Promise<Result<void, ReminderError>> {
    try {
      await this.outlookAdapter.updateReminder(itemId, oldMinutes, newMinutes);
      return Ok(undefined);
    } catch (error) {
      const reminderError: ReminderError = {
        type: 'update_failed',
        message: `Failed to update native reminder: ${(error as Error).message}`,
        itemId,
        details: error
      };

      this.errorLog.log({
        type: 'reminder',
        severity: 'high',
        itemId,
        message: reminderError.message,
        details: { oldMinutes, newMinutes, error }
      });

      return Err(reminderError);
    }
  }

  async deleteNativeReminder(
    itemId: string,
    minutesBeforeStart: number
  ): Promise<Result<void, ReminderError>> {
    try {
      await this.outlookAdapter.deleteReminder(itemId, minutesBeforeStart);
      return Ok(undefined);
    } catch (error) {
      const reminderError: ReminderError = {
        type: 'deletion_failed',
        message: `Failed to delete native reminder: ${(error as Error).message}`,
        itemId,
        details: error
      };

      this.errorLog.log({
        type: 'reminder',
        severity: 'medium',
        itemId,
        message: reminderError.message,
        details: { minutesBeforeStart, error }
      });

      return Err(reminderError);
    }
  }

  async getNativeReminders(itemId: string): Promise<Result<NativeReminder[], ReminderError>> {
    try {
      const reminders = await this.outlookAdapter.getNativeReminders(itemId);
      return Ok(reminders);
    } catch (error) {
      const reminderError: ReminderError = {
        type: 'retrieval_failed',
        message: `Failed to get native reminders: ${(error as Error).message}`,
        itemId,
        details: error
      };

      this.errorLog.log({
        type: 'reminder',
        severity: 'medium',
        itemId,
        message: reminderError.message,
        details: { error }
      });

      return Err(reminderError);
    }
  }
}
