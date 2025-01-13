import { createListenerMiddleware } from '@reduxjs/toolkit';
import { logout, setCredentials } from '../authSlice';

const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  actionCreator: setCredentials,
  effect: (action, listenerApi) => {
    localStorage.setItem('token', action.payload.token);
  },
});

authListenerMiddleware.startListening({
  actionCreator: logout,
  effect: (action, listenerApi) => {
    localStorage.removeItem('token');
  },
});

export default authListenerMiddleware;