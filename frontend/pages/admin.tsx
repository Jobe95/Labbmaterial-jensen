import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/pages/Admin.module.scss';
import { useRouter } from 'next/router';
import { getAllUsers } from '../lib/api/api';
import { UserModel } from '../lib/models';
import { ProtectedRoute } from '../lib/components';

const Admin = () => {
  const router = useRouter();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        console.log(res);
        setUsers(res.data);
        setErrorMessage('');
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 403) {
          router.back();
        }
        setErrorMessage(err.response.statusText);
      });
  }, []);

  if (errorMessage) {
    return <></>;
  }

  const buildUserItem = (user: UserModel, index: number) => {
    return (
      <div
        key={index}
        className={styles.userItem}
        onClick={() => {
          router.push(`/profile?id=${user.userId}`);
        }}
      >
        <div className={styles.text}>
          <div>{user.username}</div>
          <div>{user.email}</div>
        </div>
        <div className={styles.ico}>&#65291;</div>
      </div>
    );
  };

  console.log(users);
  return (
    <ProtectedRoute role="ADMIN_USER">
      <div>
        <Head>
          <title>Admin Page</title>
          <meta name="description" content="Admin page of our application" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
          {users && (
            <div className={styles.content}>
              {users.map((val, index) => buildUserItem(val, index))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
