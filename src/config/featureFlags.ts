// TODO(TEAM-API): Replace env-based flags with remote config service

export const ENABLE_LEGACY_AUTH = import.meta.env.VITE_ENABLE_LEGACY_AUTH === 'true';

export const ENABLE_V1_API = import.meta.env.VITE_ENABLE_V1_API === 'true';

export const ENABLE_LEGACY_PAYMENTS = import.meta.env.VITE_ENABLE_LEGACY_PAYMENTS === 'true';

export const ENABLE_DEBUG_LOGGING = import.meta.env.DEV;

export interface FeatureFlags {
  enableLegacyAuth: boolean;
  enableV1Api: boolean;
  enableLegacyPayments: boolean;
  enableDebugLogging: boolean;
}

export function getFeatureFlags(): FeatureFlags {
  return {
    enableLegacyAuth: ENABLE_LEGACY_AUTH,
    enableV1Api: ENABLE_V1_API,
    enableLegacyPayments: ENABLE_LEGACY_PAYMENTS,
    enableDebugLogging: ENABLE_DEBUG_LOGGING,
  };
}

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[flag];
}
