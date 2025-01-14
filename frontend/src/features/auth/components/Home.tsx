import { useDispatch } from 'react-redux';
import { logout } from '../authSlice';

const Home = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <div>
        <h1>Welcome to our app! You're logged in.</h1>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Home;
