import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { createContext, ReactNode, useContext, useState } from "react"

import { api } from "../services/api";

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
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContexData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticated = !!user;

  const router = useRouter();

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

      
      router.push('/dashboard')
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signIn
      }}
    >
      { children }
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);