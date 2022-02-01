export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_BASE_URL_V1 = `${API_BASE_URL}/api/v1`;

export const API_TIMEOUT_MS = 30000;

export const API_RETRY_ATTEMPTS = 3;

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

export function getApiConfig(): ApiConfig {
  return {
    baseUrl: API_BASE_URL_V1,
    timeout: API_TIMEOUT_MS,
    retryAttempts: API_RETRY_ATTEMPTS,
  };
}
