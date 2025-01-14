import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { authApiSlice } from '../authApiSlice';
import authReducer from '../authSlice';
import { ReactElement } from 'react';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// Setup store
const setupStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApiSlice.reducerPath]: authApiSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(authApiSlice.middleware),
  });
};

// Wrapper component for tests
const renderWithProviders = (component: ReactElement) => {
  const store = setupStore();
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>{component}</MemoryRouter>
      </Provider>,
    ),
    store,
  };
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('focuses email input on mount', () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveFocus();
  });

  it('updates email and password fields on user input', async () => {
    renderWithProviders(<Login />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('handles 401 error response', async () => {
    const mockLoginError = {
      status: 401,
      data: { message: 'Unauthorized' },
    };
    const mockLogin = vi.fn().mockRejectedValue(mockLoginError);
    vi.spyOn(authApiSlice, 'useLoginMutation').mockReturnValue([
      mockLogin,
      { isLoading: false },
    ] as any);

    renderWithProviders(<Login />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Unauthorized, please check your credentials'),
      ).toBeInTheDocument();
    });
  });
});
