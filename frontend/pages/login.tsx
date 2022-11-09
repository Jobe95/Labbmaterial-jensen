import React, { useState } from 'react';
import { LoginForm, RegisterForm, SegmentedToggle } from '../lib/components';
import styles from '../styles/pages/Login.module.scss';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.authForm}>
          <SegmentedToggle onChanged={setIsLogin} />
          <div className={styles.card}>
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
