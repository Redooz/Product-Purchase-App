import React from 'react';
import { GetProductResponse } from '../dto/response/getProductResponse';
import { useGetProductsQuery } from '../productApiSlice';
import './styles/ProductList.scss';

const ProductList: React.FC = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
  };

  return (
    <div className="product-list">
      {products?.map((product: GetProductResponse) => (
        <div key={product.id} className="product-item">
          <img src={product.image} alt={product.name} />
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p className="price">{formatPrice(product.price)}</p>
          <p>Stock: {product.stock}</p>
          <button className="pay-button">Pay with card</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;