export const ENABLE_DEBUG_LOGGING = import.meta.env.DEV;

export interface FeatureFlags {
  enableDebugLogging: boolean;
}

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  if (flag === 'enableDebugLogging') {
    return ENABLE_DEBUG_LOGGING;
  }
  return false;
}
