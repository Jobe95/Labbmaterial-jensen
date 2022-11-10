import React, { useState } from 'react';
import styles from './LoginForm.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loginUser } from '../../../api/api';
import axios, { AxiosError } from 'axios';

import { selectIsLoggedIn, userActions } from '../../../redux/slices/userSlice';
import router from 'next/router';

export const LoginForm = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = document.forms[0];
    try {
      const { data } = await loginUser(email.value, password.value);
      dispatch(userActions.signIn(data));
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
            <label>Email </label>
            <input type="email" name="email" required />
          </div>
          <div className={styles.inputContainer}>
            <label>Lösenord </label>
            <input type="password" name="password" required minLength={6} />
          </div>
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          <div>
            <input type="submit" value="Logga in" />
          </div>
        </form>
      </div>
    </div>
  );
};
