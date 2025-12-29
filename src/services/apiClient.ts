import { ApiClient, createApiClient } from '@tm-acme-shop/shared';
import { API_BASE_URL, API_TIMEOUT_MS } from '../config/apiConfig';
import { ENABLE_V1_API } from '../config/featureFlags';
import { logger } from '../logging/logger';

let clientInstance: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!clientInstance) {
    logger.info('Creating API client', { baseUrl: API_BASE_URL });

    clientInstance = createApiClient({
      baseUrl: API_BASE_URL,
      timeout: API_TIMEOUT_MS,
      enableLegacyApi: ENABLE_V1_API,
    });
  }
  return clientInstance;
}

export function resetApiClient(): void {
  clientInstance = null;
}

export { ApiClient };
