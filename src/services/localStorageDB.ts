import { Feedback, ChangelogEntry } from '../types/feedback';
import { User } from '../types/user';
import { emailService } from './emailService';

const STORAGE_KEYS = {
  FEEDBACK: 'feedback_items',
  CHANGELOG: 'changelog_entries',
  USERS: 'users'
};

export const localStorageDB = {
  // Feedback Methods
  getFeedbackItems: (): Feedback[] => {
    const items = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    if (!items) return [];
    return JSON.parse(items).map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt)
    }));
  },

  saveFeedbackItems: (items: Feedback[]): void => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(items));
  },

  addFeedbackItem: (item: Feedback): void => {
    const items = localStorageDB.getFeedbackItems();
    items.unshift(item);
    localStorageDB.saveFeedbackItems(items);
  },

  updateFeedbackItem: (updatedItem: Feedback): void => {
    const items = localStorageDB.getFeedbackItems();
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      localStorageDB.saveFeedbackItems(items);
    }
  },

  deleteFeedbackItem: (id: string): void => {
    const items = localStorageDB.getFeedbackItems();
    const filteredItems = items.filter(item => item.id !== id);
    localStorageDB.saveFeedbackItems(filteredItems);
  },

  // Changelog Methods
  getChangelogEntries: (): ChangelogEntry[] => {
    const entries = localStorage.getItem(STORAGE_KEYS.CHANGELOG);
    if (!entries) return [];
    return JSON.parse(entries).map((entry: any) => ({
      ...entry,
      date: new Date(entry.date),
      publishedAt: entry.publishedAt ? new Date(entry.publishedAt) : undefined,
      scheduledFor: entry.scheduledFor ? new Date(entry.scheduledFor) : undefined
    }));
  },

  saveChangelogEntries: (entries: ChangelogEntry[]): void => {
    localStorage.setItem(STORAGE_KEYS.CHANGELOG, JSON.stringify(entries));
  },

  addChangelogEntry: (entry: ChangelogEntry): void => {
    const entries = localStorageDB.getChangelogEntries();
    entries.unshift(entry);
    localStorageDB.saveChangelogEntries(entries);
  },

  updateChangelogEntry: (updatedEntry: ChangelogEntry): void => {
    const entries = localStorageDB.getChangelogEntries();
    const index = entries.findIndex(entry => entry.id === updatedEntry.id);
    if (index !== -1) {
      entries[index] = updatedEntry;
      localStorageDB.saveChangelogEntries(entries);
    }
  },

  deleteChangelogEntry: (id: string): void => {
    const entries = localStorageDB.getChangelogEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    localStorageDB.saveChangelogEntries(filteredEntries);
  },

  // User Methods
  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!users) return [];
    return JSON.parse(users).map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt)
    }));
  },

  saveUsers: (users: User[]): void => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  addUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<void> => {
    const users = localStorageDB.getUsers();
    const newUser: User = {
      ...user,
      id: String(Date.now()),
      createdAt: new Date()
    };
    
    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(newUser);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    users.unshift(newUser);
    localStorageDB.saveUsers(users);
  },

  updateUser: (id: string, userData: Partial<User>): void => {
    const users = localStorageDB.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      localStorageDB.saveUsers(users);
    }
  },

  deleteUser: (id: string): void => {
    const users = localStorageDB.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    localStorageDB.saveUsers(filteredUsers);
  },

  // Initialize with mock data if empty
  initializeIfEmpty: (mockFeedback: Feedback[], mockChangelog: ChangelogEntry[]): void => {
    if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
      localStorageDB.saveFeedbackItems(mockFeedback);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHANGELOG)) {
      localStorageDB.saveChangelogEntries(mockChangelog);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorageDB.saveUsers([{
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin',
        password: 'admin123',
        isAdmin: true,
        createdAt: new Date()
      }]);
    }
  }
};