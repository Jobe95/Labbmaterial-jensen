import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { refreshToken } from './api';

export const client = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
});

client.interceptors.response.use(
  undefined,
  async function refreshTokenInterceptor(err) {
    const { response, config } = err;

    // We only want to refresh if we have 401 so throw error

    if (response.status !== 401) {
      return Promise.reject(err);
    }

    const res = await axios.get('api/refresh', {
      baseURL: 'http://localhost:4000',
      withCredentials: true,
    });

    if (res.status !== 200) {
      // We have error refreshing
      console.log('ERR');
      return Promise.reject(err);
    }
    // This line is needed to not trigger error
    config.headers = { ...config.headers };
    return client(config);
  }
);
