import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { User, UserV1 } from '@acme-shop/shared-ts';
import { logger } from '../logging/logger';

/**
 * UserState uses union type User | UserV1 to show type-level legacy vs new.
 * NOTE: UserV1 kept for backwards compatibility with legacy profile page.
 *
 * TODO(TEAM-API): Remove UserV1 from store once profile page is fully migrated
 */
export interface UserState {
  user: User | UserV1 | null;
  isLegacy: boolean;
  isAuthenticated: boolean;
}

export interface UserContextValue {
  state: UserState;
  setUser: (user: User | UserV1, isLegacy?: boolean) => void;
  clearUser: () => void;
}

const initialState: UserState = {
  user: null,
  isLegacy: false,
  isAuthenticated: false,
};

export const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(initialState);

  const setUser = useCallback((user: User | UserV1, isLegacy: boolean = false) => {
    logger.info('Setting user in store', {
      userId: user.id,
      isLegacy,
    });

    setState({
      user,
      isLegacy,
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

/**
 * Type guard to check if user is legacy UserV1.
 */
export function isUserV1(user: User | UserV1): user is UserV1 {
  return 'name' in user && !('firstName' in user);
}

/**
 * Get user display name, handling both User and UserV1.
 */
export function getUserDisplayName(user: User | UserV1): string {
  if (isUserV1(user)) {
    return user.name;
  }
  return `${user.firstName} ${user.lastName}`;
}
