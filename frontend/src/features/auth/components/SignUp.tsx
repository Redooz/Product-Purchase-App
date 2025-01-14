import { useRef, useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { useRegisterMutation } from '../authApiSlice';
import { SignupRequest } from '../dto/request/signupRequest';
import './styles/FormContainer.scss';
import { selecteCurrentToken } from '../authSlice';
import { useSelector } from 'react-redux';

const SignUp = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const token = useSelector(selecteCurrentToken);
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const signupRequest: SignupRequest = { email, password };
      await register(signupRequest).unwrap();

      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setErrorMessage('');
      setSuccessMessage('User signed up successfully, redirecting to login...');
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/');
      }, 2000);
    } catch (error: any) {
      const errorMessages: { [key: number]: string } = {
        400: 'Missing user or password',
        409: 'User already exists',
      };

      const message = error
        ? errorMessages[error.status] || 'Registration failed'
        : 'No server response';

      setErrorMessage(message);
      errRef.current?.focus();
    }
  };

  const handleEmailInput = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordInput = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  return isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <section className="form-container">
      <h1>Sign Up</h1>

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

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          onChange={handleConfirmPasswordInput}
          value={confirmPassword}
          required
        />
        <button>Register</button>
      </form>

      <a className="link" href="/">
        <p>Already have an account?</p>
      </a>

      <p
        ref={errRef}
        className={errorMessage ? 'error-message' : 'offscreen'}
        aria-live="assertive"
      >
        {errorMessage}
      </p>

      {successMessage && (
        <p className="success-message" aria-live="assertive">
          {successMessage}
        </p>
      )}
    </section>
  );
};

export default SignUp;
