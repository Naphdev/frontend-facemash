import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SafeStorageService {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId) && typeof Storage !== 'undefined';
  }

  setItem(key: string, value: string): boolean {
    if (this.isBrowser()) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        console.warn(`Failed to set localStorage item ${key}:`, error);
      }
    }
    return false;
  }

  getItem(key: string): string | null {
    if (this.isBrowser()) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn(`Failed to get localStorage item ${key}:`, error);
      }
    }
    return null;
  }

  removeItem(key: string): boolean {
    if (this.isBrowser()) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn(`Failed to remove localStorage item ${key}:`, error);
      }
    }
    return false;
  }

  clear(): boolean {
    if (this.isBrowser()) {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.warn('Failed to clear localStorage:', error);
      }
    }
    return false;
  }

  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  // สำหรับ JSON objects
  setObject(key: string, value: any): boolean {
    try {
      return this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to stringify object for key ${key}:`, error);
      return false;
    }
  }

  getObject<T>(key: string): T | null {
    const item = this.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch (error) {
        console.warn(`Failed to parse JSON for key ${key}:`, error);
      }
    }
    return null;
  }
}