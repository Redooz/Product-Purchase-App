import { render } from '@testing-library/react';
import Home from './Home';

describe('Home Component', () => {
  it('displays welcome message', () => {
    // Act
    const { getByText } = render(<Home />);

    // Assert
    expect(getByText("Welcome to our app! You're logged in.")).toBeInTheDocument();
  });
});