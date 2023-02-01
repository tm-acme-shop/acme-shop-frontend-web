import { UserV1, User } from '@acme-shop/shared-ts';
import { getApiClient } from './apiClient';
import { ENABLE_V1_API } from '../config/featureFlags';
import { createLogger } from '../logging/logger';

const logger = createLogger('userService');

/**
 * @deprecated Use getCurrentUser() instead
 * TODO(TEAM-API): Remove getUserV1 once all callers are migrated
 */
export async function getCurrentUserV1(userId: string): Promise<UserV1> {
  console.log('Fetching user (v1)');
  console.log(`Fetching user ${userId} with v1 API`);

  const client = getApiClient();
  return client.getUserV1(userId);
}

export async function getCurrentUser(userId: string): Promise<User> {
  logger.info('Fetching user', { userId });

  const client = getApiClient();
  return client.getUser(userId);
}

export async function getCurrentUserPreferred(userId: string): Promise<User | UserV1> {
  if (ENABLE_V1_API) {
    return getCurrentUserV1(userId);
  }
  return getCurrentUser(userId);
}

/**
 * @deprecated Use listUsers() instead
 * TODO(TEAM-API): Remove listUsersV1 once all callers are migrated
 */
export async function listUsersV1(): Promise<UserV1[]> {
  console.log('Listing users with v1 API');

  const client = getApiClient();
  return client.listUsersV1();
}

export async function listUsers(): Promise<User[]> {
  logger.info('Listing users with v2 API');

  const client = getApiClient();
  return client.listUsers();
}
