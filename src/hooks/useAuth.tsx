import { createContext, ReactNode, useContext } from "react"

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContexData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContexData);

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = false;

  async function signIn({ email, password}: SignInCredentials) {
    console.log({ email, password });
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn
      }}
    >
      { children }
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);