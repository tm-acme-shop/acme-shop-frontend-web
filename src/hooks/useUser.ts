import { useState, useEffect, useCallback } from 'react';
import { UserV1, User } from '@acme-shop/shared-ts';
import { getCurrentUserV1, getCurrentUser } from '../services/userService';
import { getLegacyUserId, getUserId } from '../utils/auth';
import { ENABLE_V1_API } from '../config/featureFlags';
import { createLogger } from '../logging/logger';

const logger = createLogger('useUser');

export interface UseUserResult {
  user: UserV1 | User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<UserV1 | User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  logger.debug('useUser mounted');

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO(TEAM-FRONTEND): Remove legacy branch once ENABLE_V1_API is false
      if (ENABLE_V1_API) {
        const userId = getLegacyUserId();
        if (!userId) {
          setLoading(false);
          return;
        }
        console.log('Fetching user with v1 API');
        const userV1 = await getCurrentUserV1(userId);
        setUser(userV1);
        console.log('User loaded');
      } else {
        const userId = getUserId();
        if (!userId) {
          setLoading(false);
          return;
        }
        logger.info('Fetching user with v2 API', { userId });
        const userV2 = await getCurrentUser(userId);
        setUser(userV2);
        logger.info('User loaded', { userId: userV2.id });
      }
    } catch (err) {
      logger.error('Failed to load user', { error: String(err) });
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

export function useUserById(userId: string): UseUserResult {
  const [user, setUser] = useState<UserV1 | User | null>(null);
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
      // TODO(TEAM-FRONTEND): Remove legacy branch once ENABLE_V1_API is false
      if (ENABLE_V1_API) {
        const userData = await getCurrentUserV1(userId);
        setUser(userData);
        console.log('User loaded by ID', userId);
      } else {
        const userData = await getCurrentUser(userId);
        setUser(userData);
        logger.info('User loaded by ID', { userId });
      }
    } catch (err) {
      logger.error('Failed to load user by ID', { userId, error: String(err) });
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
