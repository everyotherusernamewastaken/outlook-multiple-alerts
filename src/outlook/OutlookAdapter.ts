import { CalendarItem, Task, Creator } from '../types';
import { IOutlookAdapter, NativeReminder } from './IOutlookAdapter';

/**
 * Desktop implementation of Outlook API adapter
 * Uses Office.js to interact with Outlook
 */
export class OutlookAdapter implements IOutlookAdapter {
  private itemChangedCallbacks: Array<(itemId: string) => void> = [];
  private itemDeletedCallbacks: Array<(itemId: string) => void> = [];

  async getItem(itemId: string): Promise<CalendarItem | Task | null> {
    try {
      // In a real implementation, this would use Office.context.mailbox.item
      // For now, return mock data for testing
      return new Promise((resolve) => {
        if (typeof Office !== 'undefined' && Office.context?.mailbox?.item) {
          const item = Office.context.mailbox.item;
          
          // Check if it's an appointment (calendar event)
          if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
            resolve({
              id: item.itemId || itemId,
              title: item.subject || 'Untitled Event',
              startTime: item.start || new Date(),
              endTime: item.end || new Date(),
              creatorId: item.organizer?.emailAddress || 'unknown'
            });
          }
          // Check if it's a task
          else if (item.itemType === Office.MailboxEnums.ItemType.Message) {
            // Tasks are handled differently in Outlook
            resolve({
              id: item.itemId || itemId,
              title: item.subject || 'Untitled Task',
              dueDate: undefined,
              creatorId: item.from?.emailAddress || 'unknown'
            });
          }
        }
        
        // Fallback for testing without Office.js
        resolve(null);
      });
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  }

  async getCreator(itemId: string): Promise<Creator | null> {
    try {
      return new Promise((resolve) => {
        if (typeof Office !== 'undefined' && Office.context?.mailbox?.item) {
          const item = Office.context.mailbox.item;
          const email = item.organizer?.emailAddress || item.from?.emailAddress || 'unknown';
          
          resolve({
            id: email,
            email: email
          });
        } else {
          resolve(null);
        }
      });
    } catch (error) {
      console.error('Error getting creator:', error);
      return null;
    }
  }

  async getNativeReminders(itemId: string): Promise<NativeReminder[]> {
    try {
      return new Promise((resolve) => {
        if (typeof Office !== 'undefined' && Office.context?.mailbox?.item) {
          const item = Office.context.mailbox.item;
          
          // Get reminder minutes before start
          if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
            // Appointments have a reminderMinutesBeforeStart property
            const minutes = (item as any).reminderMinutesBeforeStart;
            if (minutes !== undefined && minutes >= 0) {
              resolve([{ minutesBeforeStart: minutes }]);
            } else {
              resolve([]);
            }
          }
        }
        resolve([]);
      });
    } catch (error) {
      console.error('Error getting native reminders:', error);
      return [];
    }
  }

  async createReminder(itemId: string, minutesBeforeStart: number): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        if (typeof Office !== 'undefined' && Office.context?.mailbox?.item) {
          const item = Office.context.mailbox.item;
          
          if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
            // Set reminder on appointment
            (item as any).reminderMinutesBeforeStart = minutesBeforeStart;
            resolve();
          } else {
            reject(new Error('Cannot set reminder on this item type'));
          }
        } else {
          // Mock implementation for testing
          console.log(`Mock: Creating reminder ${minutesBeforeStart} minutes before start for item ${itemId}`);
          resolve();
        }
      });
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  async updateReminder(itemId: string, oldMinutes: number, newMinutes: number): Promise<void> {
    // For Outlook, updating is the same as creating (it overwrites)
    return this.createReminder(itemId, newMinutes);
  }

  async deleteReminder(itemId: string, minutesBeforeStart: number): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        if (typeof Office !== 'undefined' && Office.context?.mailbox?.item) {
          const item = Office.context.mailbox.item;
          
          if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
            // Remove reminder by setting to -1 or 0
            (item as any).reminderMinutesBeforeStart = -1;
            resolve();
          } else {
            reject(new Error('Cannot remove reminder from this item type'));
          }
        } else {
          // Mock implementation for testing
          console.log(`Mock: Deleting reminder ${minutesBeforeStart} minutes before start for item ${itemId}`);
          resolve();
        }
      });
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  }

  onItemChanged(callback: (itemId: string) => void): void {
    this.itemChangedCallbacks.push(callback);
    
    // In a real implementation, register with Office.js events
    if (typeof Office !== 'undefined' && Office.context?.mailbox) {
      // Office.context.mailbox.addHandlerAsync for item changed events
      console.log('Registered item changed handler');
    }
  }

  onItemDeleted(callback: (itemId: string) => void): void {
    this.itemDeletedCallbacks.push(callback);
    
    // In a real implementation, register with Office.js events
    if (typeof Office !== 'undefined' && Office.context?.mailbox) {
      // Office.context.mailbox.addHandlerAsync for item deleted events
      console.log('Registered item deleted handler');
    }
  }

  // Helper method to trigger callbacks (for testing)
  triggerItemChanged(itemId: string): void {
    this.itemChangedCallbacks.forEach(cb => cb(itemId));
  }

  // Helper method to trigger callbacks (for testing)
  triggerItemDeleted(itemId: string): void {
    this.itemDeletedCallbacks.forEach(cb => cb(itemId));
  }
}
