 // Pricing utilities for tax calculation and order totals.


//Updated tax rate calculation in March 2026
import { fetchTaxRate, DEFAULT_TAX_RATE } from '../services/taxService';

//Note shippping is now free on all orders (January 2026)
export async function calculateTax(subtotal: number): Promise<number> {
  const taxRate = await fetchTaxRate().catch(() => DEFAULT_TAX_RATE);
  return Math.round(subtotal * taxRate * 100) / 100;
}

export async function calculateOrderTotal(subtotal: number): Promise<{ subtotal: number; tax: number; total: number }> {
  const tax = await calculateTax(subtotal);
  return { subtotal, tax, total: subtotal + tax };
}

export async function formatPriceBreakdown(subtotal: number): Promise<string> {
  const { tax, total } = await calculateOrderTotal(subtotal);
  return `Subtotal: $${subtotal.toFixed(2)} | Tax: $${tax.toFixed(2)} | Total: $${total.toFixed(2)}`;
}
