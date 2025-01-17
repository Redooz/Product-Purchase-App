import { beforeEach, describe, vi } from 'vitest';
import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { transactionApiSlice } from '../../transactionApiSlice';
import pendingFinishLocalTransactionsReducer, {
  selectPendingLocalFinishTransactions,
} from '../../pendingFinishLocalTransactionsSlice';
import FinishTransaction from '../FinishTransaction';

import { AcceptanceState } from '../../type/acceptanceState';
import { selectAcceptance } from '../../acceptanceSlice';
import { FinishTransactionRequest } from '../../dto/request/finishTransactionRequest';

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
    useNavigate: vi.fn(),
  };
});

const setupStore = () => {
  return configureStore({
    reducer: {
      [transactionApiSlice.reducerPath]: transactionApiSlice.reducer,
      pendingFinishLocalTransactions: pendingFinishLocalTransactionsReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(transactionApiSlice.middleware),
    preloadedState: {}
  })
}


describe('FinishTransaction', () => {
  const acceptanceState: AcceptanceState = {
    endUserPolicy: {
      acceptanceToken: 'token',
      type: 'END_USER_POLICY',
      permalink: 'https://example.com/end-user-policy',
    },
    personalDataAuthorization: {
      acceptanceToken: 'token',
      type: 'PERSONAL_DATA_AUTH',
      permalink: 'https://example.com/personal-data-authorization',
    }
  }
  
  let store: EnhancedStore;
  const renderWithProviders = (component: ReactElement) => {
    store = setupStore();
    return render(
      <Provider store={store}>
        <MemoryRouter>{component}</MemoryRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form', () => {
    // Arrange
    (useSearchParams as any).mockReturnValue([new URLSearchParams('transactionId=1')]);
    (useSelector as any).mockImplementation((selector: any) => {
      if (selector === selectPendingLocalFinishTransactions) {
        return [];
      } else if (selector === selectAcceptance) {
        return acceptanceState;
      }
      return undefined;
    });

    // Act
    const { getByLabelText } = renderWithProviders(<FinishTransaction />);

    // Assert
    expect(getByLabelText('Card Number')).toHaveValue('');
    expect(getByLabelText('Card Holder')).toHaveValue('');
    expect(getByLabelText('Expiration Month')).toHaveValue('');
    expect(getByLabelText('Expiration Year')).toHaveValue('');
    expect(getByLabelText('CVC')).toHaveValue('');
  });

  it('should render checkboxes with acceptance links', () => {
    // Arrange
    (useSearchParams as any).mockReturnValue([new URLSearchParams('transactionId=1')]);
    (useSelector as any).mockImplementation((selector: any) => {
      if (selector === selectPendingLocalFinishTransactions) {
        return [];
      } else if (selector === selectAcceptance) {
        return acceptanceState;
      }
      return undefined;
    });

    // Act
    const { getByText } = renderWithProviders(<FinishTransaction />);

    // Assert
    expect(getByText('end user policy')).toHaveAttribute('href', 'https://example.com/end-user-policy');
    expect(getByText('personal data authorization')).toHaveAttribute('href', 'https://example.com/personal-data-authorization');
  });

  it('should render form with local transaction data', () => {
    const localTransaction: FinishTransactionRequest = {
      transactionId: 1,
      card: {
        cardHolder: 'John Doe',
        cvc: '123',
        expMonth: '12',
        expYear: '23',
        number: '1234567890123456',
      }
    };

    (useSearchParams as any).mockReturnValue([new URLSearchParams('transactionId=1')]);
    (useSelector as any).mockImplementation((selector: any) => {
      if (selector === selectPendingLocalFinishTransactions) {
        return [localTransaction];
      } else if (selector === selectAcceptance) {
        return acceptanceState;
      }
      return undefined;
    });

    // Act
    const { getByLabelText } = renderWithProviders(<FinishTransaction />);

    // Assert
    expect(getByLabelText('Card Number')).toHaveValue('1234567890123456');
    expect(getByLabelText('Card Holder')).toHaveValue('John Doe');
    expect(getByLabelText('Expiration Month')).toHaveValue('12');
    expect(getByLabelText('Expiration Year')).toHaveValue('23');
    expect(getByLabelText('CVC')).toHaveValue('123');
  });

});