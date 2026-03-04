import { ReminderManager } from '../manager/ReminderManager';
import { InMemoryReminderStorage } from '../storage/InMemoryReminderStorage';
import { ReminderValidator } from '../validation/ReminderValidator';
import { ReminderConfiguration } from '../types';

// Initialize components
const storage = new InMemoryReminderStorage();
const validator = new ReminderValidator(storage);
const manager = new ReminderManager(storage, validator);

let currentItemId: string | null = null;

/**
 * Initialize the task pane
 */
Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById('add-reminder-btn')?.addEventListener('click', addReminder);
    loadReminders();
  }
});

/**
 * Load and display reminders for the current item
 */
async function loadReminders(): Promise<void> {
  try {
    // Get current item
    const item = Office.context.mailbox.item;
    if (!item) {
      showError('No item selected');
      return;
    }

    currentItemId = item.itemId || 'current-item';
    
    // Get reminders
    const reminders = await manager.getReminders(currentItemId);
    
    // Update UI
    const listContainer = document.getElementById('reminder-list');
    if (!listContainer) return;

    if (reminders.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <p>No reminders configured yet.</p>
          <p>Add your first reminder below.</p>
        </div>
      `;
    } else {
      listContainer.innerHTML = reminders.map(reminder => `
        <div class="reminder-item">
          <div class="reminder-info">
            <div class="reminder-time">${formatReminderTime(reminder.configuration.timeOffset)}</div>
            <div style="font-size: 12px; color: #666;">
              ${reminder.configuration.triggerTime.toLocaleString()}
            </div>
          </div>
          <div class="reminder-actions">
            <button class="btn-danger" onclick="deleteReminder('${reminder.id}')">Delete</button>
          </div>
        </div>
      `).join('');
    }

    // Show/hide limit warning
    const limitWarning = document.getElementById('limit-warning');
    if (limitWarning) {
      limitWarning.style.display = reminders.length >= 5 ? 'block' : 'none';
    }

    // Disable add button if at limit
    const addButton = document.getElementById('add-reminder-btn') as HTMLButtonElement;
    if (addButton) {
      addButton.disabled = reminders.length >= 5;
    }
  } catch (error) {
    showError(`Failed to load reminders: ${(error as Error).message}`);
  }
}

/**
 * Add a new reminder
 */
async function addReminder(): Promise<void> {
  try {
    if (!currentItemId) {
      showError('No item selected');
      return;
    }

    const select = document.getElementById('reminder-time') as HTMLSelectElement;
    const minutes = parseInt(select.value);

    // Get item start time
    const item = Office.context.mailbox.item;
    if (!item) {
      showError('No item selected');
      return;
    }

    let startTime: Date;
    if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
      startTime = item.start;
    } else {
      // For tasks, use current time + 1 day as default
      startTime = new Date(Date.now() + 86400000);
    }

    // Calculate trigger time
    const triggerTime = new Date(startTime.getTime() - (minutes * 60 * 1000));

    const config: ReminderConfiguration = {
      timeOffset: -minutes,
      triggerTime
    };

    const result = await manager.createReminder(
      currentItemId,
      item.itemType === Office.MailboxEnums.ItemType.Appointment ? 'event' : 'task',
      config
    );

    if (result.ok) {
      // Reload reminders
      await loadReminders();
      clearError();
    } else {
      showError(result.error.message);
    }
  } catch (error) {
    showError(`Failed to add reminder: ${(error as Error).message}`);
  }
}

/**
 * Delete a reminder
 */
async function deleteReminder(reminderId: string): Promise<void> {
  try {
    const result = await manager.deleteReminder(reminderId);
    
    if (result.ok) {
      await loadReminders();
      clearError();
    } else {
      showError('Failed to delete reminder');
    }
  } catch (error) {
    showError(`Failed to delete reminder: ${(error as Error).message}`);
  }
}

/**
 * Format reminder time for display
 */
function formatReminderTime(timeOffset: number): string {
  const minutes = Math.abs(timeOffset);
  
  if (minutes === 0) return 'At time of event';
  if (minutes < 60) return `${minutes} minutes before`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hour${minutes >= 120 ? 's' : ''} before`;
  if (minutes < 10080) return `${Math.floor(minutes / 1440)} day${minutes >= 2880 ? 's' : ''} before`;
  return `${Math.floor(minutes / 10080)} week${minutes >= 20160 ? 's' : ''} before`;
}

/**
 * Show error message
 */
function showError(message: string): void {
  const container = document.getElementById('error-container');
  if (container) {
    container.innerHTML = `<div class="error-message">${message}</div>`;
  }
}

/**
 * Clear error message
 */
function clearError(): void {
  const container = document.getElementById('error-container');
  if (container) {
    container.innerHTML = '';
  }
}

// Make deleteReminder available globally for onclick handlers
(window as any).deleteReminder = deleteReminder;
