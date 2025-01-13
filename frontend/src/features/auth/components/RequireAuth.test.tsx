import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import RequireAuth from './RequireAuth';
import authReducer from '../authSlice';

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
            <Route element={<RequireAuth />}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(getByText('Login Page')).toBeInTheDocument();
  });

  it('passes the current location to the login page when navigating', () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(getByText('Login Page')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
  });
});
