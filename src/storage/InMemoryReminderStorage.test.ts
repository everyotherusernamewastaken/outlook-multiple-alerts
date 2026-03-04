import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryReminderStorage } from './InMemoryReminderStorage';
import { Reminder } from '../types';

describe('InMemoryReminderStorage', () => {
  let storage: InMemoryReminderStorage;

  beforeEach(() => {
    storage = new InMemoryReminderStorage();
  });

  it('should save and retrieve a reminder', async () => {
    const reminder: Reminder = {
      id: 'test-1',
      itemId: 'item-1',
      itemType: 'event',
      configuration: {
        timeOffset: -15,
        triggerTime: new Date(Date.now() + 3600000)
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await storage.save(reminder);
    const retrieved = await storage.getByItem('item-1');

    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].id).toBe('test-1');
  });

  it('should retrieve multiple reminders for same item', async () => {
    const reminder1: Reminder = {
      id: 'test-1',
      itemId: 'item-1',
      itemType: 'event',
      configuration: {
        timeOffset: -15,
        triggerTime: new Date(Date.now() + 3600000)
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const reminder2: Reminder = {
      id: 'test-2',
      itemId: 'item-1',
      itemType: 'event',
      configuration: {
        timeOffset: -30,
        triggerTime: new Date(Date.now() + 7200000)
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await storage.save(reminder1);
    await storage.save(reminder2);
    
    const retrieved = await storage.getByItem('item-1');
    expect(retrieved).toHaveLength(2);
  });

  it('should delete reminder by ID', async () => {
    const reminder: Reminder = {
      id: 'test-1',
      itemId: 'item-1',
      itemType: 'event',
      configuration: {
        timeOffset: -15,
        triggerTime: new Date(Date.now() + 3600000)
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await storage.save(reminder);
    await storage.deleteByReminderId('test-1');
    
    const retrieved = await storage.getByItem('item-1');
    expect(retrieved).toHaveLength(0);
  });

  it('should delete all reminders for an item', async () => {
    const reminder1: Reminder = {
      id: 'test-1',
      itemId: 'item-1',
      itemType: 'event',
      configuration: {
        timeOffset: -15,
        triggerTime: new Date(Date.now() + 3600000)
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const reminder2: Reminder = {
      id: 'test-2',
      itemId: 'item-1',
      itemType: 'event',
      configuration: {
        timeOffset: -30,
        triggerTime: new Date(Date.now() + 7200000)
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await storage.save(reminder1);
    await storage.save(reminder2);
    await storage.deleteByItem('item-1');
    
    const retrieved = await storage.getByItem('item-1');
    expect(retrieved).toHaveLength(0);
  });

  it('should verify integrity and detect invalid configuration', async () => {
    const invalidReminder: Reminder = {
      id: 'test-1',
      itemId: 'item-1',
      itemType: 'event',
      configuration: {
        timeOffset: -15,
        triggerTime: null as any // Invalid
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await storage.save(invalidReminder);
    const report = await storage.verifyIntegrity();

    expect(report.totalAlerts).toBe(1);
    expect(report.issues).toHaveLength(1);
    expect(report.issues[0].type).toBe('invalid_configuration');
  });
});
