import { useMemo } from 'react';
import { FeatureFlags, getFeatureFlags } from '../config/featureFlags';

/**
 * Hook for reading feature flags.
 *
 * TODO(TEAM-FRONTEND): Replace stringly-typed flag names with a typed enum
 */
export function useFeatureFlag(flagName: keyof FeatureFlags): boolean {
  const flags = useMemo(() => getFeatureFlags(), []);
  return flags[flagName];
}

/**
 * Hook to get all feature flags.
 */
export function useFeatureFlags(): FeatureFlags {
  return useMemo(() => getFeatureFlags(), []);
}

/**
 * Hook to check if legacy auth is enabled.
 */
export function useLegacyAuth(): boolean {
  return useFeatureFlag('enableLegacyAuth');
}

/**
 * Hook to check if v1 API is enabled.
 */
export function useV1Api(): boolean {
  return useFeatureFlag('enableV1Api');
}

/**
 * Hook to check if legacy payments are enabled.
 */
export function useLegacyPayments(): boolean {
  return useFeatureFlag('enableLegacyPayments');
}
