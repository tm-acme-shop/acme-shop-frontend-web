import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { UserV1, User } from '@acme-shop/shared-ts';
import { createLogger } from '../logging/logger';

const logger = createLogger('userStore');

// TODO(TEAM-API): Remove UserV1 from store once v1 API is fully deprecated
export interface UserState {
  user: UserV1 | User | null;
  isAuthenticated: boolean;
}

export interface UserContextValue {
  state: UserState;
  setUser: (user: UserV1 | User) => void;
  clearUser: () => void;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

export const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(initialState);

  const setUser = useCallback((user: UserV1 | User) => {
    logger.info('Setting user in store', { userId: user.id });

    setState({
      user,
      isAuthenticated: true,
    });
  }, []);

  const clearUser = useCallback(() => {
    logger.info('Clearing user from store');
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

export function isUserV1(user: UserV1 | User): user is UserV1 {
  return 'legacyId' in user;
}

export function getUserDisplayName(user: UserV1 | User): string {
  return user.name;
}
