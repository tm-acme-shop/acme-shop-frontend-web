/**
 * Legacy logging functions.
 */

export function legacyLog(message: string): void {
  console.log('[LEGACY]', message);
}

export function legacyWarn(message: string): void {
  console.warn('[LEGACY]', message);
}

export function legacyError(message: string): void {
  console.error('[LEGACY]', message);
}

export function legacyDebug(message: string): void {
  console.log('[LEGACY-DEBUG]', message);
}
