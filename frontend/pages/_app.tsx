import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { persistor, store } from '../lib/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { LogoutButton, Menu } from '../lib/components';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Menu />
        <LogoutButton />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
