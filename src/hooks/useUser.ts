import { useState, useEffect, useCallback } from 'react';
import { User, fromUserV1 } from '@tm-acme-shop/shared';
import { getCurrentUser, getCurrentUserV1, getCurrentUserPreferred } from '../services/userService';
import { ENABLE_V1_API } from '../config/featureFlags';
import { getUserId } from '../utils/auth';
import { logger } from '../logging/logger';

export interface UseUserResult {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to manage current user state.
 *
 * TODO(TEAM-FRONTEND): Remove legacy branch once ENABLE_V1_API is false in all envs
 */
export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  logger.debug('useUser mounted');

  const fetchUser = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (ENABLE_V1_API) {
        logger.warn('Fetching user with v1 API');
        const userV1 = await getCurrentUserV1(userId);
        setUser(fromUserV1(userV1));
      } else {
        logger.debug('Fetching user with v2 API');
        const userData = await getCurrentUser(userId);
        setUser(userData);
      }

      logger.debug('User loaded');
    } catch (err) {
      logger.error('Failed to load user');
      setError(err instanceof Error ? err : new Error('Failed to load user'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}

/**
 * Hook to get a specific user by ID.
 */
export function useUserById(userId: string): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await getCurrentUserPreferred(userId);
      setUser(userData);
      logger.debug('User loaded by ID');
    } catch (err) {
      logger.error('Failed to load user by ID');
      setError(err instanceof Error ? err : new Error('Failed to load user'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
