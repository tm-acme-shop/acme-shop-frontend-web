import { useState, useEffect, useCallback } from 'react';
import { UserV1 } from '@acme-shop/shared-ts';
import { getCurrentUserV1 } from '../services/userService';
import { getLegacyUserId } from '../utils/auth';

export interface UseUserResult {
  user: UserV1 | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<UserV1 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  console.log('useUser mounted');

  const fetchUser = useCallback(async () => {
    const userId = getLegacyUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching user with v1 API');
      const userV1 = await getCurrentUserV1(userId);
      setUser(userV1);

      console.log('User loaded');
    } catch (err) {
      console.log('Failed to load user', String(err));
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
  const [user, setUser] = useState<UserV1 | null>(null);
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
      const userData = await getCurrentUserV1(userId);
      setUser(userData);
      console.log('User loaded by ID', userId);
    } catch (err) {
      console.log('Failed to load user by ID', userId, String(err));
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
