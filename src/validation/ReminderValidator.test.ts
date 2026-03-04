import { describe, it, expect, beforeEach } from 'vitest';
import { ReminderValidator } from './ReminderValidator';
import { InMemoryReminderStorage } from '../storage/InMemoryReminderStorage';
import { Reminder, ReminderConfiguration } from '../types';

describe('ReminderValidator', () => {
  let storage: InMemoryReminderStorage;
  let validator: ReminderValidator;

  beforeEach(() => {
    storage = new InMemoryReminderStorage();
    validator = new ReminderValidator(storage);
  });

  it('should validate a valid configuration', async () => {
    const config: ReminderConfiguration = {
      timeOffset: -15,
      triggerTime: new Date(Date.now() + 3600000) // 1 hour in future
    };

    const result = await validator.validate('item-1', config);
    expect(result.ok).toBe(true);
  });

  it('should reject configuration with past trigger time', async () => {
    const config: ReminderConfiguration = {
      timeOffset: -15,
      triggerTime: new Date(Date.now() - 3600000) // 1 hour in past
    };

    const result = await validator.validate('item-1', config);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('invalid_time');
    }
  });

  it('should reject when limit exceeded (5 reminders)', async () => {
    // Add 5 reminders
    for (let i = 0; i < 5; i++) {
      const reminder: Reminder = {
        id: `test-${i}`,
        itemId: 'item-1',
        itemType: 'event',
        configuration: {
          timeOffset: -15 * (i + 1),
          triggerTime: new Date(Date.now() + 3600000 * (i + 1))
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await storage.save(reminder);
    }

    const config: ReminderConfiguration = {
      timeOffset: -90,
      triggerTime: new Date(Date.now() + 3600000)
    };

    const result = await validator.validate('item-1', config);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('limit_exceeded');
      expect(result.error.currentCount).toBe(5);
    }
  });

  it('should reject invalid time offset', async () => {
    const config: ReminderConfiguration = {
      timeOffset: NaN,
      triggerTime: new Date(Date.now() + 3600000)
    };

    const result = await validator.validate('item-1', config);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('invalid_offset');
    }
  });

  it('should validate limit correctly', async () => {
    // Add 4 reminders
    for (let i = 0; i < 4; i++) {
      const reminder: Reminder = {
        id: `test-${i}`,
        itemId: 'item-1',
        itemType: 'event',
        configuration: {
          timeOffset: -15 * (i + 1),
          triggerTime: new Date(Date.now() + 3600000 * (i + 1))
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await storage.save(reminder);
    }

    const result = await validator.validateLimit('item-1');
    expect(result.ok).toBe(true);
  });
});
