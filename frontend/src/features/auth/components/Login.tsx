import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selecteCurrentToken, setCredentials } from '../authSlice';
import { useLoginMutation } from '../authApiSlice';
import { LoginRequest } from '../dto/request/loginRequest';
import './styles/FormContainer.scss';

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const navigate = useNavigate();
  const token = useSelector(selecteCurrentToken);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrorMessage('');
  }, []);

  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loginRequest: LoginRequest = { email, password };
      const response = await login(loginRequest).unwrap();

      dispatch(setCredentials({ token: response.accessToken }));

      setEmail('');
      setPassword('');

      navigate('/home');
    } catch (error: any) {
      const errorMessages: { [key: number]: string } = {
        400: 'Missing user or password',
        401: 'Unauthorized, please check your credentials',
      };

      console.log('error', error);

      const message = error
        ? errorMessages[error.status] || 'Login failed'
        : 'No server response';

      setErrorMessage(message);
      errRef.current?.focus();
    }
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <section className="form-container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          ref={emailRef}
          value={email}
          onChange={handleEmailInput}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={handlePasswordInput}
          value={password}
          required
        />
        <button>Sign In</button>
      </form>

      <Link className="link" to={'/signup'}>Don't have an account?</Link>

      <p
        ref={errRef}
        className={errorMessage ? 'error-message' : 'offscreen'}
        aria-live="assertive"
      >
        {errorMessage}
      </p>
    </section>
  );
};

export default Login;
