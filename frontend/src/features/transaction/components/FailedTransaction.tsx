import React from 'react';
import { useNavigate } from 'react-router';
import './styles/TransactionResult.scss';

const FailedTransaction: React.FC = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="transaction-result-container">
      <h2>Transaction Failed</h2>
      <p>Unfortunately, your transaction could not be completed.</p>
      <button onClick={handleHome}>Return Home</button>
    </div>
  );
};

export default FailedTransaction;