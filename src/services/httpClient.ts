import { generateRequestId, generateUUID } from '../utils/requestId';
import { getLegacyUserId, getUserId } from '../utils/auth';
import { API_TIMEOUT_MS } from '../config/apiConfig';
import { ENABLE_V1_API } from '../config/featureFlags';
import { createLogger } from '../logging/logger';
import {
  X_ACME_REQUEST_ID,
  X_LEGACY_USER_ID,
  X_USER_ID,
} from '@acme-shop/shared-ts';

const logger = createLogger('httpClient');

export interface RequestConfig {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

/**
 * @deprecated Use modernRequest() instead
 * TODO(TEAM-SEC): Remove legacyRequest once v1 API is deprecated
 */
export async function legacyRequest<T>(
  method: string,
  url: string,
  body?: unknown,
  config?: RequestConfig
): Promise<HttpResponse<T>> {
  const requestId = generateUUID();
  const legacyUserId = getLegacyUserId();

  console.log('Making legacy request', url);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [X_ACME_REQUEST_ID]: requestId,
    [X_LEGACY_USER_ID]: legacyUserId,
    ...config?.headers,
  };

  console.log(`HTTP ${method} ${url}`);

  const controller = new AbortController();
  const timeout = config?.timeout || API_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: config?.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = response.status === 204 ? (undefined as T) : await response.json();

    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.log(`Request failed: ${String(error)}`);
    throw error;
  }
}

export async function modernRequest<T>(
  method: string,
  url: string,
  body?: unknown,
  config?: RequestConfig
): Promise<HttpResponse<T>> {
  const requestId = generateRequestId();
  const userId = getUserId();

  logger.info('Making modern request', { url, method });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [X_ACME_REQUEST_ID]: requestId,
    [X_USER_ID]: userId,
    ...config?.headers,
  };

  logger.debug('Request headers prepared', { requestId });

  const controller = new AbortController();
  const timeout = config?.timeout || API_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: config?.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.error('Request failed with status', { status: response.status, url });
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = response.status === 204 ? (undefined as T) : await response.json();

    logger.info('Request completed', { status: response.status, url });

    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    logger.error('Request failed', { error: String(error), url });
    throw error;
  }
}

export async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  config?: RequestConfig
): Promise<HttpResponse<T>> {
  if (ENABLE_V1_API) {
    return legacyRequest<T>(method, url, body, config);
  }
  return modernRequest<T>(method, url, body, config);
}
