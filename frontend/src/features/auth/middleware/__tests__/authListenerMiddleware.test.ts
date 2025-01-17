import { setCredentials, logout } from '../../authSlice';
import authListenerMiddleware from '../authListenerMiddleware';
import { configureStore, createAction, EnhancedStore } from '@reduxjs/toolkit';

describe('authListenerMiddleware', () => {
  const token = 'test-token';
  const setCredentialsAction = setCredentials({ token });
  const logoutAction = logout();

  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: (state = {}, action) => state,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(authListenerMiddleware.middleware),
    });
    localStorage.clear();
  });

  it('should store token in localStorage on setCredentials', () => {
    store.dispatch(setCredentialsAction);
    expect(localStorage.getItem('token')).toBe(token);
  });

  it('should remove token from localStorage on logout', () => {
    localStorage.setItem('token', token);
    store.dispatch(logoutAction);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should not store token in localStorage if action payload is missing', () => {
    const invalidAction = createAction('auth/setCredentials')();
    store.dispatch(invalidAction);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should not remove token from localStorage if logout action is not dispatched', () => {
    localStorage.setItem('token', token);
    const anotherAction = createAction('another/action')();
    store.dispatch(anotherAction);
    expect(localStorage.getItem('token')).toBe(token);
  });
});