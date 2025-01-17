import { render, fireEvent, screen } from '@testing-library/react';
import FailedTransaction from '../FailedTransaction';
import { useNavigate } from 'react-router';
import { Mock, vi } from 'vitest';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('FailedTransaction', () => {
  it('renders correctly with transaction failed message', () => {
    render(<FailedTransaction />);

    expect(screen.getByText('Transaction Failed')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Unfortunately, your transaction could not be completed.',
      ),
    ).toBeInTheDocument();
  });

  it('navigates to home when return home button is clicked', () => {
    const navigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigate);

    render(
      <FailedTransaction />
    );

    fireEvent.click(screen.getByText('Return Home'));
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
