import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useEffect } from "react";
import { createContext, ReactNode, useContext, useState } from "react"


import { api } from "../services/apiClient";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContexData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContexData);

let authChannel: BroadcastChannel 

export function signOut() {

  destroyCookie(undefined, '@ReactAuth.token');
  destroyCookie(undefined, '@ReactAuth.refreshToken');

  authChannel.postMessage('signOut');
  
  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut();
          break;
        default:
          break;
      }
    }
  }, [])

  useEffect(() => {
    const { '@ReactAuth.token': token } = parseCookies();

    if(token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data;

        setUser({ email, permissions, roles});
      })
      .catch(() => {
        signOut();
      })
    }

  }, []);

  async function signIn({ email, password}: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password
      });

      const { token, refreshToken, permissions, roles } = response.data;
  
      setUser({
        email,
        permissions,
        roles
      });

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
        refreshToken, {
          maxAge: 60 * 60 * 24 * 30, //30 days,
          path: '/'
        }
      )
      
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      
      Router.push('/dashboard');
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signIn,
        signOut
      }}
    >
      { children }
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);