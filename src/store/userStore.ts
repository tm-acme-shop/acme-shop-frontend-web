import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { UserV1 } from '@acme-shop/shared-ts';

export interface UserState {
  user: UserV1 | null;
  isAuthenticated: boolean;
}

export interface UserContextValue {
  state: UserState;
  setUser: (user: UserV1) => void;
  clearUser: () => void;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

export const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(initialState);

  const setUser = useCallback((user: UserV1) => {
    console.log('Setting user in store', user.id);

    setState({
      user,
      isAuthenticated: true,
    });
  }, []);

  const clearUser = useCallback(() => {
    console.log('Clearing user from store');
    setState(initialState);
  }, []);

  return (
    <UserContext.Provider value={{ state, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserStore(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserStore must be used within a UserProvider');
  }
  return context;
}

export function getUserDisplayName(user: UserV1): string {
  return user.name;
}
