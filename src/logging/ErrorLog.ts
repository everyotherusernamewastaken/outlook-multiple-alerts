import { ErrorLogEntry } from '../types';

/**
 * Manages error logging for the add-in
 */
export class ErrorLog {
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs

  /**
   * Log an error
   */
  log(entry: Omit<ErrorLogEntry, 'timestamp'>): void {
    const logEntry: ErrorLogEntry = {
      ...entry,
      timestamp: new Date()
    };

    this.logs.push(logEntry);

    // Trim old logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console for development
    console.error(`[${logEntry.severity.toUpperCase()}] ${logEntry.type}:`, logEntry.message, logEntry.details);
  }

  /**
   * Get all logs
   */
  getAllLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by type
   */
  getLogsByType(type: ErrorLogEntry['type']): ErrorLogEntry[] {
    return this.logs.filter(log => log.type === type);
  }

  /**
   * Get logs filtered by severity
   */
  getLogsBySeverity(severity: ErrorLogEntry['severity']): ErrorLogEntry[] {
    return this.logs.filter(log => log.severity === severity);
  }

  /**
   * Get logs for a specific item
   */
  getLogsForItem(itemId: string): ErrorLogEntry[] {
    return this.logs.filter(log => log.itemId === itemId);
  }

  /**
   * Get logs for a specific reminder
   */
  getLogsForReminder(reminderId: string): ErrorLogEntry[] {
    return this.logs.filter(log => log.alertId === reminderId);
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Get log count
   */
  count(): number {
    return this.logs.length;
  }
}
