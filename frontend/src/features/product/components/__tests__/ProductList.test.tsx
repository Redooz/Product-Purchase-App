import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { productApiSlice } from '../../productApiSlice';
import ProductList from '../ProductList';
import { GetProductResponse } from '../../dto/response/getProductResponse';
import authReducer from '../../../auth/authSlice';
import pendingLocalTransactionsReducer, { removeTransaction } from '../../../transaction/pendingLocalTransactionsSlice';
import { GetTransactionResponse } from '../../../transaction/dto/response/getTransactionResponse';
import { useNavigate } from 'react-router';
import { StartTransactionRequest } from '../../../transaction/dto/request/startTransactionRequest';

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock useGetProductsQuery
const mockUseGetProductsQuery = vi.fn();
vi.mock('../../productApiSlice', async () => {
  const actual = await vi.importActual('../../productApiSlice');
  return {
    ...actual,
    useGetProductsQuery: () => mockUseGetProductsQuery(),
  };
});

// Mock useGetPendingTransactionsQuery
const mockUseGetPendingTransactionsQuery = vi.fn();
const mockUseDeleteTransactionMutation = vi.fn();
vi.mock('../../../transaction/transactionApiSlice', async () => {
  const actual = await vi.importActual('../../../transaction/transactionApiSlice');
  return {
    ...actual,
    useGetPendingTransactionsQuery: () => mockUseGetPendingTransactionsQuery(),
    useDeleteTransactionMutation: () => mockUseDeleteTransactionMutation(),
  };
});

// Setup store
const setupStore = () => {
  return configureStore({
    reducer: {
      [productApiSlice.reducerPath]: productApiSlice.reducer,
      auth: authReducer,
      pendingLocalTransactions: pendingLocalTransactionsReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(productApiSlice.middleware),
    preloadedState: {
      auth: {
        token: 'mock-token',
      },
    },
  });
};

// Wrapper component for tests
const renderWithProviders = (component: React.ReactElement) => {
  const store = setupStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>,
  );
};

describe('ProductList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockUseGetProductsQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });
    mockUseGetPendingTransactionsQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });
    mockUseDeleteTransactionMutation.mockReturnValue([vi.fn(), { isLoading: false }]);

    renderWithProviders(<ProductList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state when there is an error', () => {
    mockUseGetProductsQuery.mockReturnValue({
      data: undefined,
      error: true,
      isLoading: false,
    });
    mockUseGetPendingTransactionsQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });
    mockUseDeleteTransactionMutation.mockReturnValue([vi.fn(), { isLoading: false }]);

    renderWithProviders(<ProductList />);

    expect(screen.getByText('Error loading products')).toBeInTheDocument();
  });

  it('renders products when data is available', async () => {
    const mockProducts: GetProductResponse[] = [
      {
        id: 1,
        name: 'Product 1',
        price: 1000,
        stock: 10,
        image: 'https://via.placeholder.com/150',
        description: 'Description 1',
      },
      {
        id: 2,
        name: 'Product 2',
        price: 2000,
        stock: 20,
        image: 'https://via.placeholder.com/150',
        description: 'Description 2',
      },
    ];

    mockUseGetProductsQuery.mockReturnValue({
      data: mockProducts,
      error: undefined,
      isLoading: false,
    });
    mockUseGetPendingTransactionsQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });
    mockUseDeleteTransactionMutation.mockReturnValue([vi.fn(), { isLoading: false }]);

    renderWithProviders(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
      expect(screen.getByText('Stock: 10')).toBeInTheDocument();
      expect(screen.getByText('Stock: 20')).toBeInTheDocument();
      const payButtons = screen.getAllByText('Pay with card');
      expect(payButtons).toHaveLength(mockProducts.length);
    });
  });

  it('calls handleStartTransaction when pay button is clicked', async () => {
    const mockUseNavigate = vi.fn();

    const mockProducts: GetProductResponse[] = [
      {
        id: 1,
        name: 'Product 1',
        price: 1000,
        stock: 10,
        image: 'https://via.placeholder.com/150',
        description: 'Description 1',
      },
    ];

    mockUseGetProductsQuery.mockReturnValue({
      data: mockProducts,
      error: undefined,
      isLoading: false,
    });

    mockUseGetPendingTransactionsQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
    });

    mockUseDeleteTransactionMutation.mockReturnValue([vi.fn(), { isLoading: false }]);

    (useNavigate as any).mockReturnValue(mockUseNavigate);

    renderWithProviders(<ProductList />);

    await waitFor(() => {
      const payButton = screen.getByText('Pay with card');
      payButton.click();

      expect(mockUseNavigate).toHaveBeenCalledWith('/start-transaction?productId=1');
    });
  });

  it('calls handleStartTransaction when continue with delivery details button is clicked', async () => {
    const mockUseNavigate = vi.fn();
    (useNavigate as any).mockReturnValue(mockUseNavigate);

    const mockProducts: GetProductResponse[] = [
      {
        id: 1,
        name: 'Product 1',
        price: 1000,
        stock: 10,
        image: 'https://via.placeholder.com/150',
        description: 'Description 1',
      },
    ];

    const pendingLocalTransactions: StartTransactionRequest[] = [{
        productId: 1,
        quantity: 1,
        deliveryInfo: {
          personName: 'John Doe',
          address: '123 Main St',
          country: 'US',
          city: 'New York',
          postalCode: '10001',
        },
      },
    ];

    mockUseGetProductsQuery.mockReturnValue({
      data: mockProducts,
      error: undefined,
      isLoading: false,
    });

    mockUseGetPendingTransactionsQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
    });

    mockUseDeleteTransactionMutation.mockReturnValue([vi.fn(), { isLoading: false }]);

    (useSelector as any).mockReturnValue(pendingLocalTransactions);

    (useNavigate as any).mockReturnValue(mockUseNavigate);

    renderWithProviders(<ProductList />);

    await waitFor(() => {
      const continueButton = screen.getByText('Continue with delivery details');
      continueButton.click();

      expect(mockUseNavigate).toHaveBeenCalledWith('/start-transaction?productId=1');
    });
  });

  it('calls handleFinishTransaction when continue with card details button is clicked', async () => {
    const mockUseNavigate = vi.fn();
    (useNavigate as any).mockReturnValue(mockUseNavigate);

    const mockProducts: GetProductResponse[] = [
      {
        id: 1,
        name: 'Product 1',
        price: 1000,
        stock: 10,
        image: 'https://via.placeholder.com/150',
        description: 'Description 1',
      },
    ];

    const pendingServerTransactions = [
      {
        id: 1,
        product: {
          id: 1,
          name: 'Product 1',
          price: '1000',
        },
        delivery: {
          id: 1,
          personName: 'John Doe',
          address: '123 Main St',
          country: 'US',
          city: 'New York',
          postalCode: '10001',
        },
        quantity: 1,
        status: {
          id: 1,
          name: 'Pending',
        },
        total: '1000',
      },
    ];

    mockUseGetProductsQuery.mockReturnValue({
      data: mockProducts,
      error: undefined,
      isLoading: false,
    });

    mockUseGetPendingTransactionsQuery.mockReturnValue({
      data: pendingServerTransactions,
      error: undefined,
      isLoading: false,
    });

    mockUseDeleteTransactionMutation.mockReturnValue([vi.fn(), { isLoading: false }]);

    (useNavigate as any).mockReturnValue(mockUseNavigate);

    renderWithProviders(<ProductList />);

    await waitFor(() => {
      const continueButton = screen.getByText('Continue with card details');
      continueButton.click();

      expect(mockUseNavigate).toHaveBeenCalledWith('/checkout?transactionId=1');
    });
  });

  it('calls handleRemoveTransaction when cancel transaction button is clicked', async () => {
    const mockDispatch = vi.fn();
    (useDispatch as any).mockReturnValue(mockDispatch);

    const pendingLocalTransactions = [
      {
        productId: 1,
        quantity: 1,
        total: '1000',
        delivery: {
          personName: 'John Doe',
          address: '123 Main St',
          country: 'US',
          city: 'New York',
          postalCode: '10001',
        },
      },
    ];
    const mockProducts: GetProductResponse[] = [
      {
        id: 1,
        name: 'Product 1',
        price: 1000,
        stock: 10,
        image: 'https://via.placeholder.com/150',
        description: 'Description 1',
      },
    ];

    mockUseGetProductsQuery.mockReturnValue({
      data: mockProducts,
      error: undefined,
      isLoading: false,
    });

    mockUseGetPendingTransactionsQuery.mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
    });

    mockUseDeleteTransactionMutation.mockReturnValue([vi.fn(), { isLoading: false }]);

    (useSelector as any).mockReturnValue(pendingLocalTransactions);

    renderWithProviders(<ProductList />);

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel Transaction');
      cancelButton.click();

      expect(mockDispatch).toHaveBeenCalledWith(removeTransaction(1));
    });
  });

  it('calls handleCancelServerTransaction when cancel transaction button is clicked and there is a server transaction', async () => {
    const mockDeleteTransaction = vi.fn();
    mockUseDeleteTransactionMutation.mockReturnValue([mockDeleteTransaction, { isLoading: false }]);

    const pendingServerTransactions: GetTransactionResponse[] = [
      {
        id: 1,
        product: {
          id: 1,
          name: 'Product 1',
          price: '1000',
        },
        delivery: {
          id: 1,
          personName: 'John Doe',
          address: '123 Main St',
          country: 'US',
          city: 'New York',
          postalCode: '10001',
        },
        quantity: 1,
        status: {
          id: 1,
          name: 'Pending',
        },
        total: '1000',
      },
    ];
    const mockProducts: GetProductResponse[] = [
      {
        id: 1,
        name: 'Product 1',
        price: 1000,
        stock: 10,
        image: 'https://via.placeholder.com/150',
        description: 'Description 1',
      },
    ];

    mockUseGetProductsQuery.mockReturnValue({
      data: mockProducts,
      error: undefined,
      isLoading: false,
    });

    mockUseGetPendingTransactionsQuery.mockReturnValue({
      data: pendingServerTransactions,
      error: undefined,
      isLoading: false,
    });

    renderWithProviders(<ProductList />);

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel Transaction');
      cancelButton.click();

      expect(mockDeleteTransaction).toHaveBeenCalledWith(1);
    });
  });

});