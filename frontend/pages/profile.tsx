import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/pages/Profile.module.scss';

import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { getMe, getUser } from '../lib/api/api';
import { ProtectedRoute } from '../lib/components';
import { useSelector } from 'react-redux';
import { UserModel } from '../lib/models';
import { selectUser } from '../lib/redux/slices/userSlice';

const Profile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserModel>();
  const [errorMessage, setErrorMessage] = useState('');
  const user = useSelector(selectUser);

  useEffect(() => {
    try {
      const fetchUser = async (id: string | string[] | undefined) => {
        const userId = Number(id);
        const res = isNaN(userId)
          ? await getMe()
          : await getUser(Number(userId));
        setProfile(res.data);
        setErrorMessage('');
      };

      fetchUser(router.query.id);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        err = err as AxiosError;
        setErrorMessage(err.response.data.message);
      }
    }
  }, []);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <ProtectedRoute role="NORMAL_USER">
      <div>
        <Head>
          <title>Profile Page</title>
          <meta name="description" content="Profile page of our application" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
          {profile && (
            <div className={styles.card}>
              {user?.userId === profile.userId && <div>{'Din profil'}</div>}
              <div>{profile.username}</div>
              <div>{profile.email}</div>
              {profile.roles && (
                <div className={styles.roles}>
                  {profile.roles.map((val, index) => (
                    <div key={index} className={styles.role}>
                      {val}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
