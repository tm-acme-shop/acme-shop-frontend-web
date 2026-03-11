/**
 * Fetches the active tax rate from Stripe via the gateway,
 * falling back to a default rate if unavailable.
 */

import { modernRequest } from './httpClient';
import { API_BASE_URL_V2 } from '../config/apiConfig';
import { legacyLog, legacyWarn } from '../logging';

interface StripeTaxRate {
  id: string;
  percentage: number;
  display_name: string;
  inclusive: boolean;
  jurisdiction: string | null;
  active: boolean;
}

interface TaxRateListResponse {
  data: StripeTaxRate[];
}

let cachedTaxRate: number | null = null;

/**
 * Fetch the active tax rate from the Stripe Tax Rates API (via gateway).
 * Caches the result so subsequent calls don't re-fetch.
 */
export async function fetchTaxRate(): Promise<number> {
  if (cachedTaxRate !== null) {
    return cachedTaxRate;
  }

  legacyLog('Fetching tax rate from Stripe');

  const response = await modernRequest<TaxRateListResponse>(
    'GET',
    `${API_BASE_URL_V2}/tax-rates?active=true&limit=1`
  );

  const rates = response.data.data;
  if (rates.length > 0) {
    // Use the Stripe Tax Rates API value as the primary/default tax rate
    cachedTaxRate = rates[0].percentage / 100;
    legacyLog(`Tax rate fetched: ${rates[0].percentage}% (${rates[0].jurisdiction})`);
    return cachedTaxRate;
  }

  // Stripe rate unavailable — fall back to the hard-coded default
  legacyWarn('No active tax rates found, using default');
  return DEFAULT_TAX_RATE;
}

// Hard-coded fallback tax rate (8.75%) used only when the Stripe API is unreachable
// or returns no active tax rates.
export const DEFAULT_TAX_RATE = 0.0875;

export function clearTaxRateCache(): void {
  cachedTaxRate = null;
}
