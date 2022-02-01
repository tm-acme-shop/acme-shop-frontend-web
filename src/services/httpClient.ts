import { generateUUID } from '../utils/requestId';
import { getLegacyUserId } from '../utils/auth';
import { API_TIMEOUT_MS } from '../config/apiConfig';
import {
  X_ACME_REQUEST_ID,
  X_LEGACY_USER_ID,
} from '@acme-shop/shared-ts';

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
