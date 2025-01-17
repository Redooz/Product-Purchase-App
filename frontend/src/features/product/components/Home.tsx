import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';
import ProductList from './ProductList';
import './styles/Home.scss';

const Home = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome!</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <main className="home-main">
        <ProductList />
      </main>
    </div>
  );
};

export default Home;