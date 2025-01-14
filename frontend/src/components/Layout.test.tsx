import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

describe('Layout Component', () => {
  it('renders child components passed to Outlet', () => {
    // Arrange
    const ChildComponent = () => <div>Child Component</div>;

    // Act
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
        <ChildComponent />
      </MemoryRouter>
    );

    // Assert
    expect(getByText('Child Component')).toBeInTheDocument();
  });
});