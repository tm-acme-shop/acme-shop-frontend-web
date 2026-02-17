import { ENABLE_LEGACY_AUTH } from '../config/featureFlags';
import { createLogger } from '../logging';

const AUTH_TOKEN_KEY = 'acme_auth_token';
const USER_ID_KEY = 'acme_user_id';
const LEGACY_USER_ID_KEY = 'acme_legacy_user_id';

const log = createLogger('auth');

/**
 * Get the current user ID for X-User-Id header.
 */
export function getUserId(): string {
  log.debug('Getting user ID');
  return localStorage.getItem(USER_ID_KEY) || '';
}

/**
 * Get the legacy user ID for X-Legacy-User-Id header.
 * @deprecated Use getUserId instead for X-User-Id header.
 */
export function getLegacyUserId(): string {
  log.debug('Getting legacy user ID');
  return localStorage.getItem(LEGACY_USER_ID_KEY) || localStorage.getItem(USER_ID_KEY) || '';
}

/**
 * Get the appropriate user ID based on feature flag.
 */
export function getCurrentUserId(): string {
  if (ENABLE_LEGACY_AUTH) {
    return getLegacyUserId();
  }
  return getUserId();
}

/**
 * Set the current user ID.
 */
export function setUserId(userId: string): void {
  log.info('Setting user ID');
  localStorage.setItem(USER_ID_KEY, userId);
  localStorage.setItem(LEGACY_USER_ID_KEY, userId);
}

/**
 * Get the auth token.
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Set the auth token.
 */
export function setAuthToken(token: string): void {
  log.info('Setting auth token');
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Clear all auth data.
 */
export function clearAuth(): void {
  log.info('Clearing auth data');
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(LEGACY_USER_ID_KEY);
}

/**
 * Check if user is authenticated.
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken() && !!getUserId();
}

/**
 * Get auth headers for API requests.
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}
