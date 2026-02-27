import { describe, it, expect, beforeEach } from 'vitest';
import { setStorageAdapter } from '../storageAdapter';
import { createMockStorageAdapter } from './storageAdapter.mock';
import * as authService from '../authService';

describe('authService', () => {
  beforeEach(() => {
    const { adapter } = createMockStorageAdapter();
    setStorageAdapter(adapter);
  });

  it('getCurrentUser returns null when no session', () => {
    expect(authService.getCurrentUser()).toBeNull();
  });

  it('login with valid credentials returns user and sets session', () => {
    const user = authService.login('admin', '123');
    expect(user).not.toBeNull();
    expect(user?.username).toBe('admin');
    expect(authService.getCurrentUser()?.username).toBe('admin');
  });

  it('login with invalid credentials returns null', () => {
    const user = authService.login('admin', 'wrong');
    expect(user).toBeNull();
    expect(authService.getCurrentUser()).toBeNull();
  });

  it('logout clears session', () => {
    authService.login('admin', '123');
    authService.logout();
    expect(authService.getCurrentUser()).toBeNull();
  });
});
