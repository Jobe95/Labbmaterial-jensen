import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { persistor, store } from '../lib/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { LogoutButton, Menu } from '../lib/components';
import { useStore } from 'react-redux';
import refreshInterceptor from '../lib/api/refreshInterceptor';

function MyApp({ Component, pageProps }: AppProps) {
  refreshInterceptor(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Menu />
        <LogoutButton />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
    // <Provider store={store}>
    //   <Menu />
    //   <LogoutButton />
    //   <Component {...pageProps} />
    // </Provider>
  );
}

export default MyApp;
