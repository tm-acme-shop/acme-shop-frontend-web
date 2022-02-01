import { ApiClient, createApiClient } from '@acme-shop/shared-ts';
import { API_BASE_URL, API_TIMEOUT_MS } from '../config/apiConfig';

let clientInstance: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!clientInstance) {
    console.log('Creating API client', API_BASE_URL);

    clientInstance = createApiClient({
      baseUrl: API_BASE_URL,
      timeout: API_TIMEOUT_MS,
      enableLegacyApi: true,
    });
  }
  return clientInstance;
}

export function resetApiClient(): void {
  clientInstance = null;
}

export { ApiClient };
