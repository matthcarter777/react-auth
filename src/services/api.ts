import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../hooks/useAuth';

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue = [];

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['@ReactAuth.token']}`
  }
});

api.interceptors.response.use(response => {
  return response;
}, (error: AxiosError) => {
  if (error.response.status === 401) {
    if (error.response.data?.code === 'token.expired') {
      cookies = parseCookies();

      const { '@ReactAuth.refreshToken': refreshToken } = cookies;
      const originalConfig = error.config;

      if (!isRefreshing) {
        isRefreshing = true;

        api.post('/refresh', {
          refreshToken,
        }).then(response => {
          const { token } = response.data;
  
          setCookie(
            undefined,
            '@ReactAuth.token',
            token, {
              maxAge: 60 * 60 * 24 * 30, //30 days,
              path: '/'
            }
          )
    
          setCookie(
            undefined,
            '@ReactAuth.refreshToken',
            response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30, //30 days,
              path: '/'
            }
          )
  
          api.defaults.headers['Authorization'] = `Bearer ${token}`;

          failedRequestQueue.forEach(request => request.resolve(token));
          failedRequestQueue = [];
        }).catch(err => {
          failedRequestQueue.forEach(request => request.reject(err));
          failedRequestQueue = [];
        }).finally(() => {
          isRefreshing = false;
        });
      } else {
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            resolve: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig))
            },
            reject: (err: AxiosError) => {
              reject(err)
            }
          })
        })
      }
    } else {
      signOut();
    }
  }

  return Promise.reject(error)
})