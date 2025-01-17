import { Mock, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SuccessTransaction from '../SuccessTransaction';
import { useNavigate } from 'react-router';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('SuccessTransaction', () => {
  it('renders correctly with transaction successful message', () => {
    render(<SuccessTransaction />);

    expect(screen.getByText('Transaction Successful')).toBeInTheDocument();
    expect(
      screen.getByText('Your transaction has been completed successfully.'),
    ).toBeInTheDocument();
  });

  it('navigates to home when Go to Home button is clicked', () => {
    const navigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigate);

    render(<SuccessTransaction />);

    fireEvent.click(screen.getByText('Go to Home'));
    expect(navigate).toHaveBeenCalledWith('/home');
  });
});
