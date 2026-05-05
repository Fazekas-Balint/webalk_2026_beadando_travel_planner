import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../src/store/auth';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clear();
  });

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });

  it('stores user and access token after setAuth', () => {
    useAuthStore.getState().setAuth(
      { id: '1', email: 'alice@example.com', name: 'Alice' },
      'token-123'
    );

    const state = useAuthStore.getState();
    expect(state.user?.email).toBe('alice@example.com');
    expect(state.accessToken).toBe('token-123');
  });

  it('clears the user and token on clear()', () => {
    useAuthStore.getState().setAuth(
      { id: '1', email: 'a@b.c', name: 'A' },
      'tok'
    );

    useAuthStore.getState().clear();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });
});
