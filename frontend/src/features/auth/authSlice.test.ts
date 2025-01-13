import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  setCredentials,
  logout,
  selecteCurrentToken,
} from './authSlice';
import { AuthState } from './type/authState';

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it('should set token on setCredentials', () => {
    store.dispatch(setCredentials({ token: 'test-token' }));
    const state: AuthState = (store.getState() as any).auth;
    expect(state.token).toBe('test-token');
  });

  it('should clear token on logout', () => {
    store.dispatch(setCredentials({ token: 'test-token' }));
    store.dispatch(logout());
    const state: AuthState = (store.getState() as any).auth;
    expect(state.token).toBeNull();
  });

  it('should select the current token', () => {
    store.dispatch(setCredentials({ token: 'test-token' }));
    const token = selecteCurrentToken((store.getState() as any));
    expect(token).toBe('test-token');
  });

  it('should return null token if not set', () => {
    const token = selecteCurrentToken((store.getState() as any));
    expect(token).toBeNull();
  });
});
