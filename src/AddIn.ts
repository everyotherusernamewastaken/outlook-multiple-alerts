import { ReminderManager } from './manager/ReminderManager';
import { InMemoryReminderStorage } from './storage/InMemoryReminderStorage';
import { ReminderValidator } from './validation/ReminderValidator';
import { NativeReminderService } from './services/NativeReminderService';
import { OutlookAdapter } from './outlook/OutlookAdapter';
import { IntegrityVerifier } from './integrity/IntegrityVerifier';
import { ErrorLog } from './logging/ErrorLog';

/**
 * Main add-in class that initializes and coordinates all components
 */
export class AddIn {
  private storage: InMemoryReminderStorage;
  private validator: ReminderValidator;
  private manager: ReminderManager;
  private outlookAdapter: OutlookAdapter;
  private nativeReminderService: NativeReminderService;
  private integrityVerifier: IntegrityVerifier;
  private errorLog: ErrorLog;
  private initialized = false;

  constructor() {
    // Initialize components
    this.errorLog = new ErrorLog();
    this.storage = new InMemoryReminderStorage();
    this.validator = new ReminderValidator(this.storage);
    this.manager = new ReminderManager(this.storage, this.validator);
    this.outlookAdapter = new OutlookAdapter();
    this.nativeReminderService = new NativeReminderService(this.outlookAdapter, this.errorLog);
    this.integrityVerifier = new IntegrityVerifier(this.storage, this.outlookAdapter, this.errorLog);
  }

  /**
   * Initialize the add-in
   */
  async initialize(): Promise<void> {
    const startTime = Date.now();

    try {
      // Run integrity verification
      const report = await this.integrityVerifier.verify();
      
      if (report.issues.length > 0) {
        console.log(`Found ${report.issues.length} integrity issues`);
        
        // Auto-repair issues
        const repairResult = await this.integrityVerifier.repair(report);
        console.log(`Repaired: ${repairResult.repaired.length}, Deleted: ${repairResult.deleted.length}`);
      }

      // Register event listeners
      this.outlookAdapter.onItemChanged(async (itemId) => {
        console.log(`Item changed: ${itemId}`);
        // Could trigger reminder recalculation here
      });

      this.outlookAdapter.onItemDeleted(async (itemId) => {
        console.log(`Item deleted: ${itemId}`);
        // Delete all reminders for this item
        await this.manager.deleteRemindersForItem(itemId);
      });

      this.initialized = true;

      const duration = Date.now() - startTime;
      console.log(`Add-in initialized in ${duration}ms`);

      // Verify initialization time requirement (< 2 seconds)
      if (duration > 2000) {
        this.errorLog.log({
          type: 'validation',
          severity: 'medium',
          message: `Initialization took ${duration}ms (exceeds 2000ms requirement)`,
          details: { duration }
        });
      }
    } catch (error) {
      this.errorLog.log({
        type: 'validation',
        severity: 'critical',
        message: `Failed to initialize add-in: ${(error as Error).message}`,
        details: { error }
      });
      throw error;
    }
  }

  /**
   * Get the reminder manager
   */
  getReminderManager(): ReminderManager {
    if (!this.initialized) {
      throw new Error('Add-in not initialized');
    }
    return this.manager;
  }

  /**
   * Get the native reminder service
   */
  getNativeReminderService(): NativeReminderService {
    if (!this.initialized) {
      throw new Error('Add-in not initialized');
    }
    return this.nativeReminderService;
  }

  /**
   * Get the error log
   */
  getErrorLog(): ErrorLog {
    return this.errorLog;
  }

  /**
   * Check if add-in is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Create global instance
export const addIn = new AddIn();
