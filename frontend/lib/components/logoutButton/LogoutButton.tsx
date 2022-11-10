import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../api/api';
import { selectIsLoggedIn, userActions } from '../../redux/slices/userSlice';
import styles from './LogoutButton.module.scss';

export const LogoutButton = () => {
  const router = useRouter();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  const blockedPaths = ['/login'];

  const handleLogout = async () => {
    try {
      const signOut = async () => {
        await logoutUser();
        dispatch(userActions.signOut());
      };
      signOut();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn]);

  if (blockedPaths.includes(router.pathname) || !isLoggedIn) {
    return <></>;
  }

  return (
    <div onClick={handleLogout} className={styles.logOutBtn}>
      Logga ut
    </div>
  );
};
