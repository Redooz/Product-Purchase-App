import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../../../app/store';
import Home from '../Home';
import { vi } from 'vitest';
import { useDispatch } from 'react-redux';
import { logout } from '../../../auth/authSlice';

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
  };
});

describe('Home Component', () => {
  it('displays welcome message', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
  });

  it('calls logout on button click', () => {
    const mockDispatch = vi.fn();
    (useDispatch as any).mockReturnValue(mockDispatch);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>,
    );

    screen.getByText('Logout').click();
    expect(mockDispatch).toHaveBeenCalledWith(logout());
  });

  it('renders ProductList component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});