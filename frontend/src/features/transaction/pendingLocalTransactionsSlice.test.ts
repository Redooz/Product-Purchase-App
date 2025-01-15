import { beforeEach, describe } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import pendingLocalTransactionsReducer, {
  addTransaction, removeTransaction, selectPendingLocalTransactions
} from './pendingLocalTransactionsSlice';
import { PendingLocalTransactionsState } from './type/pendingLocalTransactionsState';

describe('pendingLocalTransactionsSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        pendingLocalTransactions: pendingLocalTransactionsReducer,
      },
    });
  });

  it('should add transaction', () => {
    // Act
    store.dispatch(addTransaction({ productId: 1 }));
    const state: PendingLocalTransactionsState = (store.getState() as any)
      .pendingLocalTransactions;

    // Assert
    expect(state.localTransactions).toEqual([{ productId: 1 }]);
  });

  it('should not add transaction if already exists', () => {
    // Act
    store.dispatch(addTransaction({ productId: 1 }));
    store.dispatch(addTransaction({ productId: 1 }));

    // Assert
    const state: PendingLocalTransactionsState = (store.getState() as any)
      .pendingLocalTransactions;
    expect(state.localTransactions).toEqual([{ productId: 1 }]);
  });

  it('should remove transaction', () => {
    // Arrange
    store.dispatch(addTransaction({ productId: 1 }));

    // Act
    store.dispatch(removeTransaction(1));
    const state: PendingLocalTransactionsState = (store.getState() as any)
      .pendingLocalTransactions;

    // Assert
    expect(state.localTransactions).toEqual([]);
  });

  it('should select pending local transactions', () => {
    store.dispatch(addTransaction({ productId: 1 }));
    const transactions = selectPendingLocalTransactions(store.getState() as any);

    expect(transactions).toEqual([{ productId: 1 }]);
  });
});
