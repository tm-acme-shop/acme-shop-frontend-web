import { UserV1 } from '@acme-shop/shared-ts';
import { getApiClient } from './apiClient';

export async function getCurrentUserV1(userId: string): Promise<UserV1> {
  console.log('Fetching user (v1)');
  console.log(`Fetching user ${userId} with v1 API`);

  const client = getApiClient();
  return client.getUserV1(userId);
}

export async function listUsersV1(): Promise<UserV1[]> {
  console.log('Listing users with v1 API');

  const client = getApiClient();
  return client.listUsersV1();
}
