import React from 'react';
import { GetProductResponse } from '../dto/response/getProductResponse';
import { useGetProductsQuery } from '../productApiSlice';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeTransaction,
  selectPendingLocalTransactions
} from '../../transaction/pendingLocalTransactionsSlice';
import './styles/ProductList.scss';
import { useGetPendingTransactionsQuery, useDeleteTransactionMutation } from '../../transaction/transactionApiSlice';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pendingLocalTransactions = useSelector(selectPendingLocalTransactions);
  const { data: products, error, isLoading } = useGetProductsQuery();
  const { data: serverPendingTransactions, refetch } = useGetPendingTransactionsQuery();
  const [deleteTransaction] = useDeleteTransactionMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);

  const handleStartTransaction = (productId: number) => {
    navigate(`/start-transaction?productId=${productId}`);
  };

  const handleFinishTransaction = (transactionId: number) => {
    navigate(`/finish-transaction?transactionId=${transactionId}`);
  };

  const handleRemoveTransaction = (productId: number) => {
    dispatch(removeTransaction(productId));
  };

  const handleCancelServerTransaction = async (transactionId: number) => {
    try {
      await deleteTransaction(transactionId);
      refetch();
    } catch (error: any) {
      console.error('Error deleting transaction', error);
      switch (error.status) {
        case 401:
          alert('You need to be logged in to cancel a transaction');
          break;
        case 404:
          alert('Transaction not found');
          break;
        default:
          alert('An error occurred while trying to cancel the transaction');
      }
    }
  };

  const renderProductItem = (product: GetProductResponse) => {
    const pendingLocalTransaction = pendingLocalTransactions?.find(
      t => t.productId === product.id
    );
    const serverPendingTransaction = serverPendingTransactions?.find(
      t => t.product.id === product.id
    );

    return (
      <div key={product.id} className="product-item">
        <img src={product.image} alt={product.name} />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p className="price">{formatPrice(product.price)}</p>
        <p>Stock: {product.stock}</p>
        {pendingLocalTransaction || serverPendingTransaction ? (
          <>
            <button
              onClick={() => {
                if (serverPendingTransaction) {
                  handleFinishTransaction(serverPendingTransaction.id);
                } else {
                  handleStartTransaction(product.id);
                }
              }}
              className="pay-button"
            >
              {serverPendingTransaction
                ? 'Continue with card details'
                : 'Continue with delivery details'}
            </button>
            <button
              onClick={async () => {
                if (serverPendingTransaction) {
                  await handleCancelServerTransaction(serverPendingTransaction.id);
                } else {
                  handleRemoveTransaction(product.id);
                }
              }}
              className="remove-button"
            >
              Cancel Transaction
            </button>
          </>
        ) : (
          <button
            onClick={() => handleStartTransaction(product.id)}
            className="pay-button"
          >
            Pay with card
          </button>
        )}
      </div>
    );
  };

  return <div className="product-list">{products?.map(renderProductItem)}</div>;
};

export default ProductList;