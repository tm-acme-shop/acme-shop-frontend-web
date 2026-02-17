import { logger } from '../logging/logger';
import { generateRequestId } from '../utils/requestId';
import { getUserId, getLegacyUserId } from '../utils/auth';
import { ENABLE_V1_API } from '../config/featureFlags';
import { API_TIMEOUT_MS } from '../config/apiConfig';
const X_ACME_REQUEST_ID = 'X-Acme-Request-Id';
const X_USER_ID = 'X-User-Id';
const X_LEGACY_USER_ID = 'X-Legacy-User-Id';

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
 * Make an HTTP request using the legacy header format.
 * @deprecated Use modernRequest instead with X-User-Id header.
 *
 * TODO(TEAM-SEC): Ensure request IDs are cryptographically secure
 */
export async function legacyRequest<T>(
  method: string,
  url: string,
  body?: unknown,
  config?: RequestConfig
): Promise<HttpResponse<T>> {
  const requestId = generateRequestId();
  const legacyUserId = getLegacyUserId();

  logger.warn('Making legacy request', { url });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [X_ACME_REQUEST_ID]: requestId,
    [X_LEGACY_USER_ID]: legacyUserId,
    ...config?.headers,
  };

  logger.warn('Legacy HTTP request', { method, url });

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
    logger.error('Legacy request failed', { error: String(error) });
    throw error;
  }
}

/**
 * Make an HTTP request using the modern header format.
 */
export async function modernRequest<T>(
  method: string,
  url: string,
  body?: unknown,
  config?: RequestConfig
): Promise<HttpResponse<T>> {
  const requestId = generateRequestId();
  const userId = getUserId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [X_ACME_REQUEST_ID]: requestId,
    [X_USER_ID]: userId,
    ...config?.headers,
  };

  logger.debug('HTTP request', { method, url });

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
      logger.error('HTTP error', { method, url, status: response.status });
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = response.status === 204 ? (undefined as T) : await response.json();

    logger.debug('HTTP response', { method, url, status: response.status });

    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    logger.error('Request failed', { method, url, error: String(error) });
    throw error;
  }
}

/**
 * Make an HTTP request, choosing between legacy and modern headers based on feature flag.
 */
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
