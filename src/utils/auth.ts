import { ENABLE_NEW_AUTH } from '../config/featureFlags';
import { logger } from '../logging/logger';

const AUTH_TOKEN_KEY = 'acme_auth_token';
const USER_ID_KEY = 'acme_user_id';
const LEGACY_USER_ID_KEY = 'acme_legacy_user_id';

/**
 * Get the current user ID for X-User-Id header.
 */
export function getUserId(): string {
  logger.debug('Getting user ID', { legacy: false });
  return localStorage.getItem(USER_ID_KEY) || '';
}

/**
 * Get the legacy user ID for X-Legacy-User-Id header.
 * @deprecated Use getUserId instead for X-User-Id header.
 */
export function getLegacyUserId(): string {
  console.log('Getting legacy user ID'); // TODO(TEAM-FRONTEND): Replace with structured logger
  return localStorage.getItem(LEGACY_USER_ID_KEY) || localStorage.getItem(USER_ID_KEY) || '';
}

/**
 * Get the appropriate user ID based on feature flag.
 */
export function getCurrentUserId(): string {
  if (ENABLE_NEW_AUTH) {
    return getLegacyUserId();
  }
  return getUserId();
}

/**
 * Set the current user ID.
 */
export function setUserId(userId: string): void {
  logger.info('Setting user ID', { userId });
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
  logger.info('Setting auth token');
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Clear all auth data.
 */
export function clearAuth(): void {
  logger.info('Clearing auth data');
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
