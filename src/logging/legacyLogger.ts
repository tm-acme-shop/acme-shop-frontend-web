/**
 * Legacy logging functions.
 * @deprecated Use the structured logger from './logger' instead.
 *
 * TODO(TEAM-FRONTEND): Replace all legacyLog usages with logger.info/warn/error
 */

/**
 * @deprecated Use logger.info with structured objects instead.
 */
export function legacyLog(message: string): void {
  console.log('[LEGACY]', message);
}

/**
 * @deprecated Use logger.warn with structured objects instead.
 */
export function legacyWarn(message: string): void {
  console.warn('[LEGACY]', message);
}

/**
 * @deprecated Use logger.error with structured objects instead.
 */
export function legacyError(message: string): void {
  console.error('[LEGACY]', message);
}

/**
 * @deprecated Use logger.debug with structured objects instead.
 */
export function legacyDebug(message: string): void {
  console.log('[LEGACY-DEBUG]', message);
}
