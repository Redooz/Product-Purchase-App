import { baseQueryWithLogout } from './apiSlice';
import authReducer from '../../features/auth/authSlice';
import { BaseQueryApi } from '@reduxjs/toolkit/query/react';
import { configureStore } from '@reduxjs/toolkit';

describe('baseQueryWithLogout', () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  it('should not dispatch logout if response status is not 401', async () => {
    // Arrange
    vi.fn().mockResolvedValue({ data: {} });
    const api = {
      dispatch: vi.fn(),
      getState: store.getState,
    } as unknown as BaseQueryApi;

    // Act
    await baseQueryWithLogout({}, api, {});

    // Assert
    expect(api.dispatch).not.toHaveBeenCalled();
  });
});
