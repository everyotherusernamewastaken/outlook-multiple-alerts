import { IntegrityReport, IntegrityIssue, RepairResult } from '../types';
import { IReminderStorage } from '../storage/IReminderStorage';
import { IOutlookAdapter } from '../outlook/IOutlookAdapter';
import { ErrorLog } from '../logging/ErrorLog';

/**
 * Verifies data integrity and repairs issues
 */
export class IntegrityVerifier {
  constructor(
    private storage: IReminderStorage,
    private outlookAdapter: IOutlookAdapter,
    private errorLog: ErrorLog
  ) {}

  /**
   * Verify integrity of all reminders
   */
  async verify(): Promise<IntegrityReport> {
    const allReminders = await this.storage.getAllReminders();
    const issues: IntegrityIssue[] = [];

    for (const reminder of allReminders) {
      // Check if item still exists
      const item = await this.outlookAdapter.getItem(reminder.itemId);
      if (!item) {
        issues.push({
          type: 'orphaned_alert',
          alertId: reminder.id,
          severity: 'high',
          autoRepairable: false,
          suggestedAction: 'delete'
        });
        continue;
      }

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

      if (typeof reminder.configuration.timeOffset !== 'number' || isNaN(reminder.configuration.timeOffset)) {
        issues.push({
          type: 'invalid_configuration',
          alertId: reminder.id,
          severity: 'high',
          autoRepairable: false,
          suggestedAction: 'delete'
        });
      }

      // Check if native reminder exists
      const nativeReminders = await this.outlookAdapter.getNativeReminders(reminder.itemId);
      const expectedMinutes = Math.abs(reminder.configuration.timeOffset);
      const hasNativeReminder = nativeReminders.some(nr => nr.minutesBeforeStart === expectedMinutes);
      
      if (!hasNativeReminder) {
        issues.push({
          type: 'invalid_configuration',
          alertId: reminder.id,
          severity: 'medium',
          autoRepairable: true,
          suggestedAction: 'enable_reminder'
        });
      }
    }

    return {
      totalAlerts: allReminders.length,
      issues
    };
  }

  /**
   * Repair issues found during verification
   */
  async repair(report: IntegrityReport): Promise<RepairResult> {
    const repaired: string[] = [];
    const deleted: string[] = [];

    for (const issue of report.issues) {
      if (issue.autoRepairable && issue.suggestedAction === 'enable_reminder') {
        // Try to recreate the native reminder
        try {
          const allReminders = await this.storage.getAllReminders();
          const reminder = allReminders.find(r => r.id === issue.alertId);
          
          if (reminder) {
            const minutes = Math.abs(reminder.configuration.timeOffset);
            await this.outlookAdapter.createReminder(reminder.itemId, minutes);
            repaired.push(issue.alertId);
            
            this.errorLog.log({
              type: 'integrity',
              severity: 'low',
              alertId: issue.alertId,
              message: 'Auto-repaired missing native reminder',
              details: { minutes }
            });
          }
        } catch (error) {
          this.errorLog.log({
            type: 'integrity',
            severity: 'medium',
            alertId: issue.alertId,
            message: 'Failed to auto-repair reminder',
            details: { error }
          });
        }
      } else if (issue.suggestedAction === 'delete') {
        // Delete corrupted or orphaned reminders
        try {
          await this.storage.deleteByReminderId(issue.alertId);
          deleted.push(issue.alertId);
          
          this.errorLog.log({
            type: 'integrity',
            severity: 'low',
            alertId: issue.alertId,
            message: 'Deleted corrupted/orphaned reminder',
            details: { issueType: issue.type }
          });
        } catch (error) {
          this.errorLog.log({
            type: 'integrity',
            severity: 'high',
            alertId: issue.alertId,
            message: 'Failed to delete corrupted reminder',
            details: { error }
          });
        }
      }
    }

    return { repaired, deleted };
  }
}
