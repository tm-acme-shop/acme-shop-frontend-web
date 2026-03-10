/**
 * Fetches the active tax rate from Stripe via the gateway,
 * falling back to a default rate if unavailable.
 */

import { modernRequest } from './httpClient';
import { API_BASE_URL_V2 } from '../config/apiConfig';
import { createLogger } from '../logging';

const log = createLogger('tax-service');

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

  log.info('Fetching tax rate from Stripe');

  const response = await modernRequest<TaxRateListResponse>(
    'GET',
    `${API_BASE_URL_V2}/tax-rates?active=true&limit=1`
  );

  const rates = response.data.data;
  if (rates.length > 0) {
    cachedTaxRate = rates[0].percentage / 100;
    log.info('Tax rate fetched', { percentage: rates[0].percentage, jurisdiction: rates[0].jurisdiction });
    return cachedTaxRate;
  }

  log.warn('No active tax rates found, using default');
  return DEFAULT_TAX_RATE;
}

export const DEFAULT_TAX_RATE = 0.0875;

export function clearTaxRateCache(): void {
  cachedTaxRate = null;
}
