import { User, UserV1, fromUserV1 } from '@tm-acme-shop/shared';
import { getApiClient } from './apiClient';
import { ENABLE_V1_API } from '../config/featureFlags';
import { legacyLog } from '../logging/legacyLogger';
import { createLogger } from '../logging';

const log = createLogger('user-service');

/**
 * Get the current user using the v2 API.
 */
export async function getCurrentUser(userId: string): Promise<User> {
  log.info('Fetching current user', { userId });

  const client = getApiClient();
  return client.getUser(userId);
}

/**
 * Get the current user using the v1 API.
 * @deprecated Use getCurrentUser instead.
 *
 * TODO(TEAM-API): Remove getUserV1 once all callers are migrated
 */
export async function getCurrentUserV1(userId: string): Promise<UserV1> {
  log.info('Fetching user (v1)');
  legacyLog(`Fetching user ${userId} with v1 API`);

  const client = getApiClient();
  return client.getUserV1(userId);
}

/**
 * Get the current user, using v1 or v2 API based on feature flag.
 * Always returns a User object (converts v1 if needed).
 */
export async function getCurrentUserPreferred(userId: string): Promise<User> {
  if (ENABLE_V1_API) {
    log.info('Using v1 API for user fetch');
    const userV1 = await getCurrentUserV1(userId);
    return fromUserV1(userV1);
  }

  log.info('Using v2 API for user fetch', { userId });
  return getCurrentUser(userId);
}

/**
 * Update user profile.
 */
export async function updateUserProfile(
  userId: string,
  data: { firstName?: string; lastName?: string }
): Promise<User> {
  log.info('Updating user profile', { userId });

  const client = getApiClient();
  return client.updateUser(userId, data);
}

/**
 * List all users.
 * TODO(TEAM-API): Add pagination support
 */
export async function listUsers(options?: {
  limit?: number;
  offset?: number;
}): Promise<User[]> {
  log.info('Listing users');

  const client = getApiClient();
  const response = await client.listUsers({
    limit: options?.limit || 20,
    offset: options?.offset || 0,
  });
  return response.users;
}

/**
 * List all users using the legacy v1 API.
 * @deprecated Use listUsers instead.
 */
export async function listUsersV1(): Promise<UserV1[]> {
  log.warn('Listing users with v1 API');

  const client = getApiClient();
  return client.listUsersV1();
}
