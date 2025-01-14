import { render } from '@testing-library/react';
import Home from './Home';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';

describe('Home Component', () => {
  it('displays welcome message', () => {
    // Act
    const { getByText } = render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    // Assert
    expect(
      getByText("Welcome to our app! You're logged in."),
    ).toBeInTheDocument();
  });
});
