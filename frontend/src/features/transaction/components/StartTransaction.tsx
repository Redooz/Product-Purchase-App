import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStartTransactionMutation } from '../transactionApiSlice';
import { StartTransactionRequest } from '../dto/request/startTransactionRequest';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTransaction,
  selectPendingLocalTransactions,
} from '../pendingLocalTransactionsSlice';
import { setAcceptance } from '../acceptanceSlice';
import { useNavigate } from 'react-router';
import './styles/StartTransaction.scss';
import { AcceptanceState } from '../type/acceptanceState';

const StartTransaction: React.FC = () => {
  const [searchParams] = useSearchParams();
  const productId = Number(searchParams.get('productId'));
  const [formData, setFormData] = useState<StartTransactionRequest>({
    productId,
    deliveryInfo: {
      personName: '',
      address: '',
      country: 'CO',
      region: '',
      city: '',
      postalCode: '',
      phoneNumber: '',
    },
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [startTransaction, { isLoading, isSuccess, isError }] =
    useStartTransactionMutation();
  const dispatch = useDispatch();
  const pendingTransactions = useSelector(selectPendingLocalTransactions);
  const navigate = useNavigate();

  if (!productId || isNaN(productId) || productId <= 0) {
    navigate('/');
  }

  useEffect(() => {
    const pendingTransaction = pendingTransactions.find(
      t => t.productId === productId,
    );
    if (pendingTransaction) {
      setFormData(pendingTransaction);
    }
  }, [productId, pendingTransactions]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      dispatch(addTransaction(formData));
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
  }, [dispatch, formData]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Number(e.target.value) || undefined;

    if (quantity && quantity <= 0) {
      setErrorMessage('Quantity must be greater than 0.');
      return;
    }

    setErrorMessage(null);
    setFormData(prevState => ({
      ...prevState,
      quantity,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      deliveryInfo: {
        ...prevState.deliveryInfo,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData.deliveryInfo || {}).some(value => !value)) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    try {
      const result = await startTransaction(formData).unwrap();

      const acceptanceState: AcceptanceState = {
        endUserPolicy: {
          acceptanceToken: result.endUserPolicy?.acceptanceToken || '',
          permalink: result.endUserPolicy?.permalink || '',
          type: 'END_USER_POLICY',
        },
        personalDataAuthorization: {
          acceptanceToken:
            result.personalDataAuthorization?.acceptanceToken || '',
          permalink: result.personalDataAuthorization?.permalink || '',
          type: 'PERSONAL_DATA_AUTH',
        },
      };

      dispatch(setAcceptance(acceptanceState));

      navigate(`/checkout?transactionId=${result.id}`);
    } catch (error: any) {
      let errorMsg = '';

      setErrorMessage('Failed to start transaction. Please try again.');
      switch (error.status) {
        case 404:
          setErrorMessage('Product not found.');
          break;
        case 400:
          error.data.message.forEach((err: string) => {
            errorMsg += `${err}\n`;
          })

          setErrorMessage(errorMsg);
          break;
      }
      console.error('Failed to start transaction:', error);
    }
  };

  const isFormValid =
    formData.quantity &&
    formData.deliveryInfo?.personName &&
    formData.deliveryInfo?.address &&
    formData.deliveryInfo?.region &&
    formData.deliveryInfo?.city &&
    formData.deliveryInfo?.postalCode &&
    formData.deliveryInfo?.phoneNumber

  return (
    <div className="start-transaction-backdrop">
      <div className="start-transaction-container">
        <h2 className="title">Start Transaction</h2>
        <div className="step-indicator">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <form onSubmit={handleSubmit}>
          <h4>Product Details</h4>
          <input
            type="number"
            name="quantity"
            placeholder="Product Quantity"
            value={formData.quantity}
            onChange={handleQuantityChange}
            aria-label="Product Quantity"
            required
          />
          <h4>Delivery Information</h4>
          <input
            type="text"
            name="personName"
            placeholder="Person Name"
            value={formData.deliveryInfo?.personName || ''}
            onChange={handleChange}
            aria-label="Person Name"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.deliveryInfo?.address || ''}
            onChange={handleChange}
            aria-label="Address"
            required
          />
          <input
            type="text"
            name="region"
            placeholder="Region"
            value={formData.deliveryInfo?.region || ''}
            onChange={handleChange}
            aria-label="Region"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.deliveryInfo?.city || ''}
            onChange={handleChange}
            aria-label="City"
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.deliveryInfo?.postalCode || ''}
            onChange={handleChange}
            aria-label="Postal Code"
            min={5}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.deliveryInfo?.phoneNumber || ''}
            onChange={handleChange}
            aria-label="Phone Number"
            required
          />
          <button type="submit" disabled={!isFormValid || isLoading}>
            {isLoading ? 'Starting Transaction...' : 'Continue'}
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {isSuccess && (
          <p className="success-message">Transaction started successfully!</p>
        )}
        {isError && (
          <p className="error-message">
            Failed to start transaction. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default StartTransaction;
