import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Cards from 'react-credit-cards-2';
import { FinishTransactionRequest } from '../dto/request/finishTransactionRequest';
import { useDispatch, useSelector } from 'react-redux';
import { useFinishTransactionMutation, useGetTransactionDetailsQuery } from '../transactionApiSlice';
import {
  addTransaction,
  selectPendingLocalFinishTransactions,
} from '../pendingFinishLocalTransactionsSlice';
import { selectAcceptance } from '../acceptanceSlice';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import './styles/FinishTransaction.scss';
import ConfirmPurchase from './ConfirmPurchase';

const FinishTransaction: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionId = Number(searchParams.get('transactionId'));
  const [formData, setFormData] = useState<FinishTransactionRequest['card']>({
    number: '',
    cvc: '',
    expMonth: '',
    expYear: '',
    cardHolder: '',
  });
  const [focused, setFocused] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEndUserPolicyAccepted, setIsEndUserPolicyAccepted] = useState(false);
  const [isPersonalDataAuthAccepted, setIsPersonalDataAuthAccepted] = useState(false);
  const [showConfirmPurchase, setShowConfirmPurchase] = useState(false);
  const pendingTransactions = useSelector(selectPendingLocalFinishTransactions);
  const acceptance = useSelector(selectAcceptance);
  const [finishTransaction, { isLoading, isSuccess, isError }] = useFinishTransactionMutation();
  const { data: transactionDetails } = useGetTransactionDetailsQuery(transactionId);

  useEffect(() => {
    const pendingTransaction = pendingTransactions.find(
      t => t.transactionId === transactionId,
    );
    if (pendingTransaction) {
      setFormData(pendingTransaction.card);
    }
  }, [transactionId, pendingTransactions]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const pendingTransaction: FinishTransactionRequest = {
        transactionId,
        card: formData,
      };
      dispatch(addTransaction(pendingTransaction));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('offline', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    window.addEventListener('popstate', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('offline', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      window.removeEventListener('popstate', handleBeforeUnload);
    };
  }, [transactionId, dispatch, formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(e.target.name);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'endUserPolicy') {
      setIsEndUserPolicyAccepted(checked);
    } else if (name === 'personalDataAuth') {
      setIsPersonalDataAuthAccepted(checked);
    }
  };

  const handleSubmit =  (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      setShowConfirmPurchase(true);
    } catch (error) {
      setErrorMessage('Failed to finish transaction. Please try again.');
    }
  };

  const handleConfirm = async () => {
    try {
      setShowConfirmPurchase(false);

      const request: FinishTransactionRequest = {
        transactionId,
        card: formData,
      };
      const result = await finishTransaction(request).unwrap();

      if (result.status === 'APPROVED') {
        navigate('/transaction/success');
      } else {
        navigate('/transaction/failed');
      }
    } catch (error) {
      setErrorMessage('Failed to finish transaction. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowConfirmPurchase(false);
  };

  const isFormValid =
    formData.number &&
    formData.cvc &&
    formData.expMonth &&
    formData.expYear &&
    formData.cardHolder &&
    isEndUserPolicyAccepted &&
    isPersonalDataAuthAccepted;

  return (
    <div className="finish-transaction-backdrop">
      <div className="finish-transaction-container">
        <h2 className="title">Finish Transaction</h2>
        <div className="step-indicator">
          <span className="dot"></span>
          <span className="dot active"></span>
          <span className="dot"></span>
        </div>
        <Cards
          number={formData.number}
          name={formData.cardHolder}
          expiry={`${formData.expMonth}${formData.expYear}`}
          cvc={formData.cvc}
        />
        <form onSubmit={handleSubmit}>
          <h4>Card Details</h4>
          <input
            type="text"
            name="number"
            placeholder="Card Number"
            value={formData.number}
            onChange={handleChange}
            onFocus={handleFocus}
            aria-label="Card Number"
            maxLength={16}
            required
          />
          <input
            type="text"
            name="cardHolder"
            placeholder="Card Holder"
            value={formData.cardHolder}
            onChange={handleChange}
            onFocus={handleFocus}
            aria-label="Card Holder"
            required
          />
          <input
            type="text"
            name="expMonth"
            placeholder="Expiration Month (MM)"
            value={formData.expMonth}
            onChange={handleChange}
            onFocus={handleFocus}
            maxLength={2}
            aria-label="Expiration Month"
            required
          />
          <input
            type="text"
            name="expYear"
            placeholder="Expiration Year (YY)"
            value={formData.expYear}
            onChange={handleChange}
            onFocus={handleFocus}
            maxLength={2}
            aria-label="Expiration Year"
            required
          />
          <input
            type="text"
            name="cvc"
            placeholder="CVC"
            value={formData.cvc}
            onChange={handleChange}
            onFocus={handleFocus}
            aria-label="CVC"
            maxLength={4}
            required
          />
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                name="endUserPolicy"
                checked={isEndUserPolicyAccepted}
                onChange={handleCheckboxChange}
              />
              I accept the
              <a
                href={acceptance.endUserPolicy.permalink}
                target="_blank"
                rel="noopener noreferrer"
              >
                end user policy
              </a>
            </label>
            <label>
              <input
                type="checkbox"
                name="personalDataAuth"
                checked={isPersonalDataAuthAccepted}
                onChange={handleCheckboxChange}
              />
              I accept the
              <a
                href={acceptance.personalDataAuthorization.permalink}
                target="_blank"
                rel="noopener noreferrer"
              >
                personal data authorization
              </a>
            </label>
          </div>
          <button type="submit" disabled={!isFormValid || isLoading}>
            {isLoading ? 'Processing...' : 'Finish Transaction'}
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {isSuccess && (
          <p className="success-message">Transaction completed successfully!</p>
        )}
        {isError && (
          <p className="error-message">
            Failed to complete transaction. Please try again.
          </p>
        )}
      </div>
      {showConfirmPurchase && transactionDetails && (
        <ConfirmPurchase
          transactionDetails={transactionDetails}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default FinishTransaction;