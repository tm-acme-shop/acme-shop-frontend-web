// TODO(TEAM-API): Replace env-based flags with remote config
export const ENABLE_DEBUG_LOGGING = import.meta.env.DEV;

export const ENABLE_V1_API = import.meta.env.VITE_ENABLE_V1_API !== 'false';

export const ENABLE_LEGACY_AUTH = import.meta.env.VITE_ENABLE_LEGACY_AUTH === 'true';

export interface FeatureFlags {
  enableDebugLogging: boolean;
  enableV1Api: boolean;
  enableLegacyAuth: boolean;
}

export function getFeatureFlags(): FeatureFlags {
  return {
    enableDebugLogging: ENABLE_DEBUG_LOGGING,
    enableV1Api: ENABLE_V1_API,
    enableLegacyAuth: ENABLE_LEGACY_AUTH,
  };
}

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[flag];
}
