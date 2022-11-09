import { useRouter } from 'next/router';
import React from 'react';
import styles from './Menu.module.scss';
import { ProtectedRoute } from '..';

export const Menu = () => {
  const router = useRouter();

  const blockedPaths = ['/login'];

  const handleClick = (path: string) => {
    if (
      (path === '/' && router.pathname !== '/') ||
      (path === '/admin' && router.pathname !== '/admin') ||
      (path === '/profile' && router.query.id) ||
      (path === '/profile' && router.pathname !== '/profile')
    ) {
      router.push(path);
    }
  };

  if (blockedPaths.includes(router.pathname)) {
    return <></>;
  }

  const isActiveBgColor = (pathToCheck: string): string => {
    if (router.pathname === pathToCheck) {
      return 'rgb(99, 183, 187)';
    } else {
      return '';
    }
  };

  return (
    <div className={styles.main}>
      <ProtectedRoute role="NORMAL_USER">
        <div
          style={{
            background: isActiveBgColor('/'),
          }}
          onClick={() => handleClick('/')}
          className={styles.menuItem}
        >
          Recept
        </div>
      </ProtectedRoute>
      <ProtectedRoute role="NORMAL_USER">
        <div
          style={{
            background: isActiveBgColor('/profile'),
          }}
          onClick={() => handleClick('/profile')}
          className={styles.menuItem}
        >
          Profile
        </div>
      </ProtectedRoute>
      <ProtectedRoute role="ADMIN_USER">
        <div
          style={{
            background: isActiveBgColor('/admin'),
          }}
          onClick={() => handleClick('/admin')}
          className={styles.menuItem}
        >
          Admin
        </div>
      </ProtectedRoute>
    </div>
  );
};
