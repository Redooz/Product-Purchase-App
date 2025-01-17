import { beforeEach, describe } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import acceptanceReducer, { removeAcceptance, setAcceptance } from '../acceptanceSlice';
import { AcceptanceState } from '../type/acceptanceState';

describe('acceptanceSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        // @ts-ignore
        acceptance: acceptanceReducer,
      },
      preloadedState: {
        endUserPolicy: {
          acceptanceToken: '',
          permalink: '',
          type: 'END_USER_POLICY',
        },
        personalDataAuthorization: {
          acceptanceToken: '',
          permalink: '',
          type: 'PERSONAL_DATA_AUTH',
        },
      },
    });

  })

  it('should add transaction', () => {
    // Arrange
    const acceptance: AcceptanceState = {
      endUserPolicy: {
        acceptanceToken: 'token',
        permalink: 'link',
        type: 'END_USER_POLICY',
      },
      personalDataAuthorization: {
        acceptanceToken: 'token',
        permalink: 'link',
        type: 'PERSONAL_DATA_AUTH',
      }
    };

    // Act
    store.dispatch(setAcceptance(acceptance));

    // Assert
    const state: AcceptanceState = (store.getState() as any).acceptance;
    expect(state).toEqual(acceptance);
  });

  it('should remove transaction', () => {
    // Act
    store.dispatch(removeAcceptance());
    const state: AcceptanceState = (store.getState() as any).acceptance;

    // Assert
    expect(state).toEqual({});
  });

  it('should select pending local transactions', () => {
    // Arrange
    const acceptance: AcceptanceState = {
      endUserPolicy: {
        acceptanceToken: 'token',
        permalink: 'link',
        type: 'END_USER_POLICY',
      },
      personalDataAuthorization: {
        acceptanceToken: 'token',
        permalink: 'link',
        type: 'PERSONAL_DATA_AUTH',
      }
    }

    // Act
    store.dispatch(setAcceptance(acceptance));

    const result = (store.getState() as any).acceptance;

    expect(result).toEqual(acceptance);
  });
});