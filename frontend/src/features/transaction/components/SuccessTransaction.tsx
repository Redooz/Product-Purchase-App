import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/TransactionResult.scss';

const SuccessTransaction: React.FC = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/home');
  };

  return (
    <div className="transaction-result-container">
      <h2>Transaction Successful</h2>
      <p>Your transaction has been completed successfully.</p>
      <button onClick={handleHome}>Go to Home</button>
    </div>
  );
};

export default SuccessTransaction;