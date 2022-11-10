import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../api/api';
import { selectIsLoggedIn, userActions } from '../../../redux/slices/userSlice';
import styles from './RegisterForm.module.scss';

export const RegisterForm = () => {
  const router = useRouter();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, email, password, repeatPassword } = document.forms[0];
    if (!username || !email) {
      setErrorMessage('Need to fill both username & email');
      return;
    }

    if (password.value !== repeatPassword.value) {
      setErrorMessage('Passwords dont match');
      return;
    }

    try {
      const { data } = await registerUser(
        username.value,
        email.value,
        password.value
      );

      dispatch(userActions.register(data));
      setErrorMessage('');
    } catch (err: any) {
      console.log('ERROR: ', err);
      if (axios.isAxiosError(err)) {
        err = err as AxiosError;
        setErrorMessage(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/');
    }
  }, [isLoggedIn]);

  return (
    <div className={styles.main}>
      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <label>Användarnamn </label>
            <input type="text" name="username" required />
          </div>
          <div className={styles.inputContainer}>
            <label>Email </label>
            <input type="email" name="email" required />
          </div>
          <div className={styles.inputContainer}>
            <label>Lösenord </label>
            <input type="password" name="password" minLength={6} required />
          </div>
          <div className={styles.inputContainer}>
            <label>Upprepa lösenord </label>
            <input
              type="password"
              name="repeatPassword"
              minLength={6}
              required
            />
          </div>
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          <div>
            <input type="submit" value="Registrera" />
          </div>
        </form>
      </div>
    </div>
  );
};
