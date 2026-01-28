import { API_BASE_URL, API_TIMEOUT_MS } from '../config/apiConfig';
import { ENABLE_V1_API } from '../config/featureFlags';

export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  enableLegacyApi: boolean;
}

export interface ApiClient {
  baseUrl: string;
  timeout: number;
  enableLegacyApi: boolean;
}

function createApiClient(config: ApiClientConfig): ApiClient {
  return {
    baseUrl: config.baseUrl,
    timeout: config.timeout,
    enableLegacyApi: config.enableLegacyApi,
  };
}

let clientInstance: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!clientInstance) {
    console.log('Creating API client', API_BASE_URL); // TODO(TEAM-FRONTEND): Replace with structured logger

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
