import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('should render the Login component on the root path', () => {
    // Arrange
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Act
    const loginElement = screen.getByText(/login/i);

    // Assert
    expect(loginElement).toBeInTheDocument();
  });

  it('should render the Home component when authenticated', () => {
    // Arrange
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Act
    const homeElement = screen.queryByText(/home/i);

    // Assert
    expect(homeElement).toBeNull(); // Home should not be rendered initially
  });

  it('should render signup component when navigating to /signup', () => {
    // Arrange
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Act
    const signupElement = screen.queryByText(/signup/i);

    // Assert
    expect(signupElement).toBeNull(); // Signup should not be rendered initially
  });
});