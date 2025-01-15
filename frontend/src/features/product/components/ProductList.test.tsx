import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { productApiSlice } from '../productApiSlice';
import ProductList from './ProductList';
import { GetProductResponse } from '../dto/response/getProductResponse';
import authReducer from '../../auth/authSlice';
import pendingLocalTransactionsReducer from '../../transaction/pendingLocalTransactionsSlice';

// Mock useGetProductsQuery
const mockUseGetProductsQuery = vi.fn();
vi.mock('../productApiSlice', async () => {
  const actual = await vi.importActual('../productApiSlice');
  return {
    ...actual,
    useGetProductsQuery: () => mockUseGetProductsQuery(),
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
    middleware: (getDefaultMiddleware) =>
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
    </Provider>
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

    renderWithProviders(<ProductList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state when there is an error', () => {
    mockUseGetProductsQuery.mockReturnValue({
      data: undefined,
      error: true,
      isLoading: false,
    });

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
});