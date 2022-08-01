import { UserV1, User } from '@acme-shop/shared-ts';
import { getApiClient } from './apiClient';
import { ENABLE_V1_API } from '../config/featureFlags';

export async function getCurrentUserV1(userId: string): Promise<UserV1> {
  console.log('Fetching user (v1)');
  console.log(`Fetching user ${userId} with v1 API`);

  const client = getApiClient();
  return client.getUserV1(userId);
}

export async function getCurrentUser(userId: string): Promise<User> {
  console.log('Fetching user (v2)');
  console.log(`Fetching user ${userId} with v2 API`);

  const client = getApiClient();
  return client.getUser(userId);
}

export async function getCurrentUserPreferred(userId: string): Promise<User | UserV1> {
  if (ENABLE_V1_API) {
    return getCurrentUserV1(userId);
  }
  return getCurrentUser(userId);
}

export async function listUsersV1(): Promise<UserV1[]> {
  console.log('Listing users with v1 API');

  const client = getApiClient();
  return client.listUsersV1();
}
