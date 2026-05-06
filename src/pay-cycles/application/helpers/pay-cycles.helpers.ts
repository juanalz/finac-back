/**
 * pay-cycles.helpers.ts
 *
 * Pure functions for working with stored financial cycle boundaries.
 * All dates are handled as plain "YYYY-MM-DD" strings to avoid
 * timezone issues that arise with the Date constructor.
 */

/** Parse a YYYY-MM-DD string into { year, month (1-12), day } */
export function parseDate(iso: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}

/** Format { year, month, day } back to YYYY-MM-DD */
export function formatDate(year: number, month: number, day: number): string {
  return [
    year.toString().padStart(4, "0"),
    month.toString().padStart(2, "0"),
    day.toString().padStart(2, "0"),
  ].join("-");
}

/**
 * Compare two YYYY-MM-DD strings lexicographically.
 * Returns negative if a < b, 0 if equal, positive if a > b.
 */
export function compareDates(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export interface FinancialCycle {
  /** Label, e.g. "Marzo 2024" */
  label: string;
  /** Start date (inclusive), YYYY-MM-DD */
  startDate: string;
  /** End date (inclusive), YYYY-MM-DD */
  endDate: string;
}

export function cycleFromPayDates(
  firstPaydate: string,
  lastPayDate: string,
): FinancialCycle {
  const { year, month } = parseDate(lastPayDate);
  const monthNames = [
    "",
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return {
    label: `${monthNames[month]} ${year}`,
    startDate: firstPaydate,
    endDate: lastPayDate,
  };
}

export interface CycleSummary {
  cycle: FinancialCycle;
  income: number;
  expense: number;
  balance: number;
  transactionCount: number;
  categoryBreakdown: {
    categoryId: string | null;
    categoryName: string;
    categoryEmoji: string;
    total: number;
  }[];
}
