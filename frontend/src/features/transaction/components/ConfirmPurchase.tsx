import React, { useState } from 'react';
import { FinishTransactionResponse } from '../dto/response/finishTransactionResponse';
import './styles/ConfirmPurchase.scss';

interface ConfirmPurchaseProps {
  transactionDetails: FinishTransactionResponse;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmPurchase: React.FC<ConfirmPurchaseProps> = ({ transactionDetails, onConfirm, onCancel }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(onCancel, 300);
  };

  return (
    <div className={`confirm-purchase-backdrop ${isClosing ? 'closing' : ''}`}>
      <div className="confirm-purchase-container">
        <h2>Confirm Purchase</h2>
        <p>Product: {transactionDetails.product.name}</p>
        <p>Quantity: {transactionDetails.product.quantity}</p>
        <p>Total: ${transactionDetails.total}</p>
        <p>Delivery Fee: ${transactionDetails.deliveryFee}</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmPurchase;