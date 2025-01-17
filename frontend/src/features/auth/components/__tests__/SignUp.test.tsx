import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import SignUp from '../SignUp';
import { authApiSlice } from '../../authApiSlice';
import authReducer from '../../authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApiSlice.middleware),
});

describe('SignUp Component', () => {
  it('renders sign up form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/password/i)).toHaveLength(2);
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('shows error message when passwords do not match', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
      target: { value: 'password' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'different' },
    });
    fireEvent.click(screen.getByText(/register/i));

    expect(
      await screen.findByText(/passwords do not match/i),
    ).toBeInTheDocument();
  });

  it('shows error message on server error', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
      target: { value: 'password' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByText(/register/i));

    expect(await screen.findByText(/user already exists/i)).toBeInTheDocument();
  });
});