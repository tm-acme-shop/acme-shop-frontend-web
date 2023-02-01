/**
 * @deprecated Use logger from './logger' instead
 * TODO(TEAM-FRONTEND): Replace all legacyLog usages with logger
 */
export function legacyLog(...args: unknown[]): void {
  console.log(...args);
}

/**
 * @deprecated Use logger.warn() from './logger' instead
 * TODO(TEAM-FRONTEND): Replace all legacyWarn usages with logger.warn
 */
export function legacyWarn(...args: unknown[]): void {
  console.warn(...args);
}

/**
 * @deprecated Use logger.error() from './logger' instead
 * TODO(TEAM-FRONTEND): Replace all legacyError usages with logger.error
 */
export function legacyError(...args: unknown[]): void {
  console.error(...args);
}
