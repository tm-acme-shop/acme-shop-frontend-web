import { User } from '@tm-acme-shop/shared';
import { getApiClient } from './apiClient';

/**
 * Get the current user using the v2 API.
 */
export async function getCurrentUser(userId: string): Promise<User> {
  console.log('Fetching current user', userId); // TODO(TEAM-FRONTEND): Replace with structured logger

  const client = getApiClient();
  return client.getUser(userId);
}

/**
 * Update user profile.
 */
export async function updateUserProfile(
  userId: string,
  data: { firstName?: string; lastName?: string }
): Promise<User> {
  console.log('Updating user profile', userId); // TODO(TEAM-FRONTEND): Replace with structured logger

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
  console.log('Listing users'); // TODO(TEAM-FRONTEND): Replace with structured logger

  const client = getApiClient();
  const response = await client.listUsers({
    limit: options?.limit || 20,
    offset: options?.offset || 0,
  });
  return response.users;
}
