import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { User, UserV1 } from '@tm-acme-shop/shared';

// FE-100: Initial frontend with UserV1 types (2022-06)
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

// API-140: Introduce User type alongside UserV1 (2023-02)
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
    console.log('Setting user in store'); // TODO(TEAM-FRONTEND): Replace with structured logger

    setState({
      user,
      isLegacy,
      isAuthenticated: true,
    });
  }, []);

  const clearUser = useCallback(() => {
    console.log('Clearing user from store'); // TODO(TEAM-FRONTEND): Replace with structured logger
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

// FE-175: DEPRECATED - UserV1 usage in stores scheduled for removal (2024-02)
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
