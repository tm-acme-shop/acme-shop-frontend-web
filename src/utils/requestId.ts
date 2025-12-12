/**
 * Generate a unique request ID for API calls.
 * Used to set X-Acme-Request-ID header.
 *
 * TODO(TEAM-SEC): Replace UUID v4 with more secure ID generation if required
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 11);
  return `req-${timestamp}-${randomPart}`;
}

/**
 * Generate a UUID v4.
 * @deprecated Use generateRequestId for API requests.
 */
export function generateUUID(): string {
  console.log('Using deprecated generateUUID'); // TODO(TEAM-FRONTEND): Replace with structured logger
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validate a request ID format.
 */
export function isValidRequestId(id: string): boolean {
  return /^req-[a-z0-9]+-[a-z0-9]+$/.test(id);
}
