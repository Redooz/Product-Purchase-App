import { removeAcceptance, selectAcceptance, setAcceptance } from '../acceptanceSlice';
import { createListenerMiddleware } from '@reduxjs/toolkit';

const acceptanceListenerMiddleware = createListenerMiddleware();

const updateLocalStorage = (listenerApi: any) => {
  const state = listenerApi.getState();
  const acceptanceState = selectAcceptance(state);
  localStorage.setItem('acceptance', JSON.stringify(acceptanceState));
};

acceptanceListenerMiddleware.startListening({
  actionCreator: setAcceptance,
  effect: (action, listenerApi) => {
    updateLocalStorage(listenerApi);
  },
});

acceptanceListenerMiddleware.startListening({
  actionCreator: removeAcceptance,
  effect: (action, listenerApi) => {
    updateLocalStorage(listenerApi);
  },
});

export default acceptanceListenerMiddleware;
