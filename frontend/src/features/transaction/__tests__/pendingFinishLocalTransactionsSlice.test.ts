import { describe } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import pendingFinishLocalTransactionsReducer, {
  addTransaction, removeTransaction, selectPendingLocalFinishTransactions
} from '../pendingFinishLocalTransactionsSlice';
import { FinishTransactionRequest } from '../dto/request/finishTransactionRequest';

describe('pendingFinishLocalTransactionsSlice', () => {
  let store: ReturnType<typeof configureStore>;

  const transaction: FinishTransactionRequest = {
    card: {
      cardHolder: 'John Doe',
      cvc: '123',
      expMonth: '01',
      expYear: '28',
      number: '4242424242424242',
    },
    transactionId: 1,
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        pendingFinishLocalTransactions: pendingFinishLocalTransactionsReducer,
      },
    });
  });

  it('should add transaction', () => {
    // Act
    store.dispatch(
      addTransaction(transaction),
    );
    const state = (store.getState() as any).pendingFinishLocalTransactions;

    // Assert
    expect(state.localTransactions).toEqual([transaction]);
  });

  it('should not add transaction if already exists', () => {
    // Act
    store.dispatch(addTransaction(transaction));
    store.dispatch(addTransaction(transaction));

    // Assert
    const state = (store.getState() as any).pendingFinishLocalTransactions;
    expect(state.localTransactions).toEqual([transaction]);
  });

  it('should remove transaction', () => {
    // Arrange
    store.dispatch(addTransaction(transaction));

    // Act
    store.dispatch(removeTransaction(1));
    const state = (store.getState() as any).pendingFinishLocalTransactions;

    // Assert
    expect(state.localTransactions).toEqual([]);
  });

  it('should select pending local transactions', () => {
    store.dispatch(addTransaction(transaction));
    const transactions = selectPendingLocalFinishTransactions(store.getState() as any);

    expect(transactions).toEqual([transaction]);
  });
});
