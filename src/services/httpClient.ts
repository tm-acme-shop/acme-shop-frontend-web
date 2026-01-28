import { legacyLog } from '../logging/legacyLogger';
import { generateRequestId } from '../utils/requestId';
import { getUserId, getLegacyUserId } from '../utils/auth';
import { ENABLE_V1_API } from '../config/featureFlags';
import { API_TIMEOUT_MS } from '../config/apiConfig';
import {
  X_ACME_REQUEST_ID,
  X_USER_ID,
  X_LEGACY_USER_ID,
} from '@tm-acme-shop/shared';

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

  console.log('Making legacy request', url); // TODO(TEAM-FRONTEND): Replace with structured logger

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [X_ACME_REQUEST_ID]: requestId,
    [X_LEGACY_USER_ID]: legacyUserId,
    ...config?.headers,
  };

  legacyLog(`HTTP ${method} ${url}`);

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
    legacyLog(`Request failed: ${String(error)}`);
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

  console.log('HTTP request', method, url); // TODO(TEAM-FRONTEND): Replace with structured logger

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
      console.log('HTTP error', method, url, response.status); // TODO(TEAM-FRONTEND): Replace with structured logger
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = response.status === 204 ? (undefined as T) : await response.json();

    console.log('HTTP response', method, url, response.status); // TODO(TEAM-FRONTEND): Replace with structured logger

    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.log('Request failed', method, url, error); // TODO(TEAM-FRONTEND): Replace with structured logger
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
