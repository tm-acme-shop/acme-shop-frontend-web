import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { User, UserV1 } from '@tm-acme-shop/shared';

/**
 * User state shared by profile and checkout consumers.
 */
export interface UserState {
  user: User | null;
  isLegacy: boolean;
  isAuthenticated: boolean;
}

export interface UserContextValue {
  state: UserState;
  setUser: (user: User, isLegacy?: boolean) => void;
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

  const setUser = useCallback((user: User, isLegacy: boolean = false) => {
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
 * Get a user's display name.
 */
export function getUserDisplayName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
