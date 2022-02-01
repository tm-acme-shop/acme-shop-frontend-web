import { useMemo } from 'react';
import { FeatureFlags, isFeatureEnabled, ENABLE_DEBUG_LOGGING } from '../config/featureFlags';

export function useFeatureFlag(flagName: keyof FeatureFlags): boolean {
  return useMemo(() => isFeatureEnabled(flagName), [flagName]);
}

export function useDebugLogging(): boolean {
  return useMemo(() => ENABLE_DEBUG_LOGGING, []);
}
