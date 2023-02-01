import { ENABLE_V1_API } from '../config/featureFlags';

const AUTH_TOKEN_KEY = 'acme_auth_token';
const LEGACY_USER_ID_KEY = 'acme_legacy_user_id';
const USER_ID_KEY = 'acme_user_id';

export function getUserId(): string {
  return localStorage.getItem(USER_ID_KEY) || '';
}

export function setUserId(userId: string): void {
  localStorage.setItem(USER_ID_KEY, userId);
}

/**
 * @deprecated Use getUserId() instead
 */
export function getLegacyUserId(): string {
  console.log('Getting legacy user ID');
  return localStorage.getItem(LEGACY_USER_ID_KEY) || '';
}

export function setLegacyUserId(userId: string): void {
  console.log('Setting legacy user ID');
  localStorage.setItem(LEGACY_USER_ID_KEY, userId);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  console.log('Setting auth token');
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuth(): void {
  console.log('Clearing auth data');
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_USER_ID_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAuthToken() && (ENABLE_V1_API ? !!getLegacyUserId() : !!getUserId());
}

export function getCurrentUserId(): string {
  if (ENABLE_V1_API) {
    return getLegacyUserId();
  }
  return getUserId();
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}
