import { client } from './client';
import axios from 'axios';
import { userActions } from '../redux/slices/userSlice';

const refreshInterceptor = (store: any) => {
  let isRefreshRunning = false;
  const handleError = async (error: any) => {
    const { response, config } = error;
    // We only want to refresh if we have 401 so throw error
    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      return axios
        .get('/api/refresh', {
          baseURL: 'http://localhost:4000',
          withCredentials: true,
        })
        .then((res) => {
          isRefreshRunning = true;
          config!.headers = { ...config!.headers };
          return client(config!);
        })
        .catch((err) => {
          // Remove user from redux store
          if (err.response.status === 401) {
            store.dispatch(userActions.signOut());
          }
          return Promise.reject(error);
        });
    }
    return Promise.reject(error);
  };

  client.interceptors.response.use((response) => response, handleError);
};

export default refreshInterceptor;
