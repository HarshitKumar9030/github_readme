'use client';

export type StorageKey = string;

export class LocalStorageService {
  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Save data to localStorage
   * @param key The key to store the data under
   * @param data The data to store
   * @returns true if successful, false otherwise
   */
  static save<T>(key: StorageKey, data: T): boolean {
    try {
      if (!this.isAvailable()) return false;
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  /**
   * Load data from localStorage
   * @param key The key to retrieve data from
   * @param defaultValue Default value if key doesn't exist
   * @returns The stored data, or defaultValue if not found
   */
  static load<T>(key: StorageKey, defaultValue: T): T {
    try {
      if (!this.isAvailable()) return defaultValue;
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Remove data from localStorage
   * @param key The key to remove
   * @returns true if successful, false otherwise
   */
  static remove(key: StorageKey): boolean {
    try {
      if (!this.isAvailable()) return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all data from localStorage
   * @returns true if successful, false otherwise
   */
  static clear(): boolean {
    try {
      if (!this.isAvailable()) return false;
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Check if a key exists in localStorage
   * @param key The key to check
   * @returns true if exists, false otherwise
   */
  static exists(key: StorageKey): boolean {
    try {
      if (!this.isAvailable()) return false;
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking localStorage:', error);
      return false;
    }
  }

  /**
   * Get the number of items in localStorage
   * @returns The number of items
   */
  static size(): number {
    try {
      if (!this.isAvailable()) return 0;
      return localStorage.length;
    } catch (error) {
      console.error('Error getting localStorage size:', error);
      return 0;
    }
  }

  /**
   * Get all keys in localStorage
   * @returns Array of keys
   */
  static getAllKeys(): string[] {
    try {
      if (!this.isAvailable()) return [];
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) keys.push(key);
      }
      return keys;
    } catch (error) {
      console.error('Error getting all localStorage keys:', error);
      return [];
    }
  }

  /**
   * Set up auto-save for a component state
   * @param key The key to store the data under 
   * @param data The data to monitor and store
   * @param debounceMs Debounce time in milliseconds (default 2000ms)
   */
  static setupAutoSave<T>(key: StorageKey, data: T, debounceMs: number = 2000): () => void {
    let timeoutId: NodeJS.Timeout;
    const save = () => {
      this.save(key, data);
    };

    // Clear any existing timeout and set a new one
    clearTimeout(timeoutId);
    timeoutId = setTimeout(save, debounceMs);

    // Return cleanup function to clear timeout
    return () => clearTimeout(timeoutId);
  }
}

export default LocalStorageService;
