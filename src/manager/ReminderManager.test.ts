import { describe, it, expect, beforeEach } from 'vitest';
import { ReminderManager } from './ReminderManager';
import { InMemoryReminderStorage } from '../storage/InMemoryReminderStorage';
import { ReminderValidator } from '../validation/ReminderValidator';
import { ReminderConfiguration } from '../types';

describe('ReminderManager', () => {
  let storage: InMemoryReminderStorage;
  let validator: ReminderValidator;
  let manager: ReminderManager;

  beforeEach(() => {
    storage = new InMemoryReminderStorage();
    validator = new ReminderValidator(storage);
    manager = new ReminderManager(storage, validator);
  });

  it('should create a reminder', async () => {
    const config: ReminderConfiguration = {
      timeOffset: -15,
      triggerTime: new Date(Date.now() + 3600000)
    };

    const result = await manager.createReminder('item-1', 'event', config);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.itemId).toBe('item-1');
      expect(result.value.itemType).toBe('event');
      expect(result.value.configuration.timeOffset).toBe(-15);
    }
  });

  it('should get reminders sorted chronologically', async () => {
    const config1: ReminderConfiguration = {
      timeOffset: -30,
      triggerTime: new Date(Date.now() + 7200000) // 2 hours
    };

    const config2: ReminderConfiguration = {
      timeOffset: -15,
      triggerTime: new Date(Date.now() + 3600000) // 1 hour
    };

    await manager.createReminder('item-1', 'event', config1);
    await manager.createReminder('item-1', 'event', config2);

    const reminders = await manager.getReminders('item-1');
    
    expect(reminders).toHaveLength(2);
    // Should be sorted by trigger time (earliest first)
    expect(reminders[0].configuration.timeOffset).toBe(-15);
    expect(reminders[1].configuration.timeOffset).toBe(-30);
  });

  it('should update a reminder', async () => {
    const config: ReminderConfiguration = {
      timeOffset: -15,
      triggerTime: new Date(Date.now() + 3600000)
    };

    const createResult = await manager.createReminder('item-1', 'event', config);
    expect(createResult.ok).toBe(true);
    
    if (createResult.ok) {
      const newConfig: ReminderConfiguration = {
        timeOffset: -30,
        triggerTime: new Date(Date.now() + 7200000)
      };

      const updateResult = await manager.updateReminder(createResult.value.id, newConfig);
      expect(updateResult.ok).toBe(true);
      
      if (updateResult.ok) {
        expect(updateResult.value.configuration.timeOffset).toBe(-30);
      }
    }
  });

  it('should delete a reminder', async () => {
    const config: ReminderConfiguration = {
      timeOffset: -15,
      triggerTime: new Date(Date.now() + 3600000)
    };

    const createResult = await manager.createReminder('item-1', 'event', config);
    expect(createResult.ok).toBe(true);
    
    if (createResult.ok) {
      const deleteResult = await manager.deleteReminder(createResult.value.id);
      expect(deleteResult.ok).toBe(true);

      const reminders = await manager.getReminders('item-1');
      expect(reminders).toHaveLength(0);
    }
  });

  it('should delete all reminders for an item', async () => {
    const config1: ReminderConfiguration = {
      timeOffset: -15,
      triggerTime: new Date(Date.now() + 3600000)
    };

    const config2: ReminderConfiguration = {
      timeOffset: -30,
      triggerTime: new Date(Date.now() + 7200000)
    };

    await manager.createReminder('item-1', 'event', config1);
    await manager.createReminder('item-1', 'event', config2);

    const deleteResult = await manager.deleteRemindersForItem('item-1');
    expect(deleteResult.ok).toBe(true);

    const reminders = await manager.getReminders('item-1');
    expect(reminders).toHaveLength(0);
  });

  it('should reject creating 6th reminder', async () => {
    // Create 5 reminders
    for (let i = 0; i < 5; i++) {
      const config: ReminderConfiguration = {
        timeOffset: -15 * (i + 1),
        triggerTime: new Date(Date.now() + 3600000 * (i + 1))
      };
      await manager.createReminder('item-1', 'event', config);
    }

    // Try to create 6th
    const config: ReminderConfiguration = {
      timeOffset: -90,
      triggerTime: new Date(Date.now() + 3600000)
    };

    const result = await manager.createReminder('item-1', 'event', config);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('limit_exceeded');
    }
  });
});
