import { render, fireEvent, screen } from '@testing-library/react';
import ConfirmPurchase from '../ConfirmPurchase';
import { FinishTransactionResponse } from '../../dto/response/finishTransactionResponse';

describe('ConfirmPurchase', () => {
  const transactionDetails: FinishTransactionResponse = {
    id: 1,
    total: 100,
    status: 'CONFIRMED',
    product: { name: 'Product 1', quantity: 2 },
    deliveryFee: 10,
  };

  it('renders correctly with transaction details', () => {
    // Act
    render(
      <ConfirmPurchase
        transactionDetails={transactionDetails}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByText('Confirm Purchase')).toBeInTheDocument();
    expect(screen.getByText('Product: Product 1')).toBeInTheDocument();
    expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
    expect(screen.getByText('Total: $100')).toBeInTheDocument();
    expect(screen.getByText('Delivery Fee: $10')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    // Arrange
    const onConfirm = vi.fn();

    // Act
    render(
      <ConfirmPurchase
        transactionDetails={transactionDetails}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText('Confirm'));

    // Assert
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel with animation when cancel button is clicked', () => {
    // Arrange
    const onCancel = vi.fn();

    // Act
    render(
      <ConfirmPurchase
        transactionDetails={transactionDetails}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByText('Cancel'));

    // Assert
    expect(screen.getByText('Confirm Purchase').parentElement?.parentElement).toHaveClass(
      'closing',
    );
    setTimeout(() => {
      expect(onCancel).toHaveBeenCalled();
    }, 300);
  });

  it('does not call onCancel immediately when cancel button is clicked', () => {
    // Arrange
    const onCancel = vi.fn();

    // Act
    render(
      <ConfirmPurchase
        transactionDetails={transactionDetails}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByText('Cancel'));

    // Assert
    expect(onCancel).not.toHaveBeenCalled();
  });
});
