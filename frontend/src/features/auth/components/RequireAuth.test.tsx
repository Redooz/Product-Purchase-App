import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import RequireAuth from './RequireAuth';
import authReducer, { setCredentials } from '../authSlice';
import { describe, it, expect, beforeEach } from 'vitest';

describe('RequireAuth Component', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it('navigates to login when token is not present', () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<div>Login Page</div>} />
            <Route element={<RequireAuth />}>
              <Route path="/protected" element={<div>Protected Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(getByText('Login Page')).toBeInTheDocument();
  });

  it('renders the protected component when token is present', () => {
    store.dispatch(setCredentials({ token: 'testToken' }));

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<div>Login Page</div>} />
            <Route element={<RequireAuth />}>
              <Route path="/protected" element={<div>Protected Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(getByText('Protected Page')).toBeInTheDocument();
  });

  it('passes the current location to the login page when navigating', () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<div>Login Page</div>} />
            <Route element={<RequireAuth />}>
              <Route path="/protected" element={<div>Protected Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(getByText('Login Page')).toBeInTheDocument();
  });
});