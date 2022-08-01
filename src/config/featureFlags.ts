export const ENABLE_DEBUG_LOGGING = import.meta.env.DEV;

export const ENABLE_V1_API = import.meta.env.VITE_ENABLE_V1_API !== 'false';

export interface FeatureFlags {
  enableDebugLogging: boolean;
  enableV1Api: boolean;
}

export function getFeatureFlags(): FeatureFlags {
  return {
    enableDebugLogging: ENABLE_DEBUG_LOGGING,
    enableV1Api: ENABLE_V1_API,
  };
}

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[flag];
}
