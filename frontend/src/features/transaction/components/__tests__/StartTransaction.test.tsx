import { beforeEach, describe, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { transactionApiSlice } from '../../transactionApiSlice';
import pendingLocalTransactionsReducer, { addTransaction } from '../../pendingLocalTransactionsSlice';
import { render } from '@testing-library/react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { ReactElement } from 'react';
import StartTransaction from '../StartTransaction';
import { useNavigate } from 'react-router';
import { StartTransactionRequest } from '../../dto/request/startTransactionRequest';

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const setupStore = () => {
  return configureStore({
    reducer: {
      [transactionApiSlice.reducerPath]: transactionApiSlice.reducer,
      pendingLocalTransactions: pendingLocalTransactionsReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(transactionApiSlice.middleware),
    preloadedState: {}
  })
}

const renderWithProviders = (component: ReactElement) => {
  const store = setupStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>,
  );
};

describe('StartTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('should render form with initial values', () => {
    // Arrange
    (useSearchParams as any).mockReturnValue([new URLSearchParams('productId=1')]);
    (useSelector as any).mockReturnValue([]);

    // Act
    const { getByLabelText } = renderWithProviders(<StartTransaction />);

    // Assert
    expect(getByLabelText('Person Name')).toHaveValue('');
    expect(getByLabelText('Address')).toHaveValue('');
    expect(getByLabelText('Region')).toHaveValue('');
    expect(getByLabelText('City')).toHaveValue('');
    expect(getByLabelText('Postal Code')).toHaveValue('');
    expect(getByLabelText('Phone Number')).toHaveValue('');
  });

  it('should navigate to / when product id is not present in search params, ', async () => {
    // Arrange
    const mockUseNavigate = vi.fn();
    (useNavigate as any).mockReturnValue(mockUseNavigate);
    (useSelector as any).mockReturnValue([]);
    (useSearchParams as any).mockReturnValue([new URLSearchParams()]);

    // Act
    renderWithProviders(<StartTransaction />);

    // Assert
    expect(mockUseNavigate).toHaveBeenCalledWith('/');
  });

  it('should navigate to / when product id is not a number, ', async () => {
    // Arrange
    const mockUseNavigate = vi.fn();
    (useNavigate as any).mockReturnValue(mockUseNavigate);
    (useSelector as any).mockReturnValue([]);
    (useSearchParams as any).mockReturnValue([new URLSearchParams('productId=abc')]);

    // Act
    renderWithProviders(<StartTransaction />);

    // Assert
    expect(mockUseNavigate).toHaveBeenCalledWith('/');
  });

  it('should navigate to / when product id is less or equal to 0', async () => {
    // Arrange
    const mockUseNavigate = vi.fn();
    (useNavigate as any).mockReturnValue(mockUseNavigate);
    (useSelector as any).mockReturnValue([]);
    (useSearchParams as any).mockReturnValue([new URLSearchParams('productId=-2')]);

    // Act
    renderWithProviders(<StartTransaction />);

    // Assert
    expect(mockUseNavigate).toHaveBeenCalledWith('/');
  });

  it('should render form when a pending transaction is present', () => {
    // Arrange
    const pendingTransactions: StartTransactionRequest[] = [
      {
        productId: 1,
        deliveryInfo: {
          personName: 'John Doe',
          address: '123 Main St',
          region: 'Region',
          city: 'City',
          postalCode: '12345',
          phoneNumber: '123-456-7890',
        }
      }
    ];

    (useSearchParams as any).mockReturnValue([new URLSearchParams('productId=1')]);
    (useSelector as any).mockReturnValue(pendingTransactions);

    // Act
    const { getByLabelText } = renderWithProviders(<StartTransaction />);

    // Assert
    expect(getByLabelText('Person Name')).toHaveValue('John Doe');
    expect(getByLabelText('Address')).toHaveValue('123 Main St');
    expect(getByLabelText('Region')).toHaveValue('Region');
    expect(getByLabelText('City')).toHaveValue('City');
    expect(getByLabelText('Postal Code')).toHaveValue('12345');
    expect(getByLabelText('Phone Number')).toHaveValue('123-456-7890');
  });

  it('should add a new pending transaction when popstate event is triggered', async () => {
    // Arrange
    const mockUseDispatch = vi.fn();
    const pendingTransactions: StartTransactionRequest[] = [
      {
        productId: 1,
        deliveryInfo: {
          personName: 'John Doe',
          address: '123 Main St',
          region: 'Region',
          city: 'City',
          postalCode: '12345',
          phoneNumber: '123-456-7890',
        }
      }
    ];

    (useSearchParams as any).mockReturnValue([new URLSearchParams('productId=1')]);
    (useSelector as any).mockReturnValue(pendingTransactions);
    (useDispatch as any).mockReturnValue(mockUseDispatch);

    renderWithProviders(<StartTransaction />);

    // Act
    window.dispatchEvent(new Event('popstate'));

    // Assert
    expect(mockUseDispatch).toHaveBeenCalledWith(addTransaction(pendingTransactions[0]));
  });

  it('should handle form change', () => {
    // Arrange
    (useSearchParams as any).mockReturnValue([new URLSearchParams('productId=1')]);
    (useSelector as any).mockReturnValue([]);

    const { getByLabelText } = renderWithProviders(<StartTransaction />);

    // Act
    ((getByLabelText('Person Name')) as HTMLInputElement).value = 'John Doe';
    getByLabelText('Person Name').dispatchEvent(new Event('change'));

  });
});