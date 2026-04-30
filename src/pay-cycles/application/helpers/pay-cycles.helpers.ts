/**
 * pay-cycles.helpers.ts
 *
 * Pure functions for computing financial month boundaries.
 * All dates are handled as plain "YYYY-MM-DD" strings to avoid
 * timezone issues that arise with the Date constructor.
 */

/** Parse a YYYY-MM-DD string into { year, month (1-12), day } */
export function parseDate(iso: string): { year: number; month: number; day: number } {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month, day };
}

/** Format { year, month, day } back to YYYY-MM-DD */
export function formatDate(year: number, month: number, day: number): string {
  return [
    year.toString().padStart(4, '0'),
    month.toString().padStart(2, '0'),
    day.toString().padStart(2, '0'),
  ].join('-');
}

/** Last day of a given month/year */
export function lastDayOf(year: number, month: number): number {
  return new Date(year, month, 0).getDate(); // day 0 of next month = last day of this month
}

/**
 * Given a config, compute the payday date for a specific (year, month).
 *
 * paydayType = 'LAST' → last day of that month
 * paydayType = 'FIXED' → min(paydayValue, lastDayOf(year, month))
 *   so the 31st in February never overflows.
 */
export function paydayForMonth(
  year: number,
  month: number,
  paydayType: 'FIXED' | 'LAST',
  paydayValue: number,
): string {
  if (paydayType === 'LAST') {
    return formatDate(year, month, lastDayOf(year, month));
  }
  const day = Math.min(paydayValue, lastDayOf(year, month));
  return formatDate(year, month, day);
}

/**
 * Advance a (year, month) pair by +1 month.
 */
export function addMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) return { year: year + 1, month: 1 };
  return { year, month: month + 1 };
}

/**
 * Subtract one month from (year, month).
 */
export function subMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
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
  /** Start date (inclusive), YYYY-MM-DD — the payday */
  startDate: string;
  /** End date (inclusive), YYYY-MM-DD — day before the next payday */
  endDate: string;
}

/**
 * Compute the financial cycle that contains a given `referenceDate`.
 *
 * Algorithm:
 *  1. Start from firstPaydate (the anchor).
 *  2. Walk forward cycle by cycle until we find the one that
 *     straddles referenceDate.
 *
 * A cycle runs [payday_N, payday_{N+1} - 1 day].
 */
export function cycleForDate(
  referenceDate: string,
  firstPaydate: string,
  paydayType: 'FIXED' | 'LAST',
  paydayValue: number,
): FinancialCycle {
  // If reference is before the very first payday, return a "pre-history" cycle
  if (compareDates(referenceDate, firstPaydate) < 0) {
    const { year, month } = parseDate(firstPaydate);
    const prev = subMonth(year, month);
    const prevPayday = paydayForMonth(prev.year, prev.month, paydayType, paydayValue);
    return buildCycle(prevPayday, firstPaydate, paydayType, paydayValue);
  }

  let { year, month } = parseDate(firstPaydate);
  let currentStart = firstPaydate;

  // Walk forward at most 1200 months (~100 years) as a safety cap
  for (let i = 0; i < 1200; i++) {
    const next = addMonth(year, month);
    const nextPayday = paydayForMonth(next.year, next.month, paydayType, paydayValue);

    // Current cycle: [currentStart, nextPayday - 1]
    const endDate = dayBefore(nextPayday);

    if (compareDates(referenceDate, endDate) <= 0) {
      // referenceDate falls within this cycle
      return buildCycle(currentStart, nextPayday, paydayType, paydayValue);
    }

    // Advance
    currentStart = nextPayday;
    year = next.year;
    month = next.month;
  }

  throw new Error('cycleForDate: could not resolve cycle (date too far in future)');
}

/** Return the YYYY-MM-DD of the day before a given date string */
export function dayBefore(iso: string): string {
  const { year, month, day } = parseDate(iso);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() - 1);
  return formatDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/** Build a FinancialCycle object given its start payday and the next payday */
function buildCycle(
  startDate: string,
  nextPayday: string,
  paydayType: 'FIXED' | 'LAST',
  paydayValue: number,
): FinancialCycle {
  const endDate = dayBefore(nextPayday);
  // Label based on the month the cycle is *mostly* in (i.e. the next payday month)
  const { year, month } = parseDate(nextPayday);
  const monthNames = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const label = `${monthNames[month]} ${year}`;
  return { label, startDate, endDate };
}

/**
 * Generate a list of consecutive financial cycles from `fromDate` to `toDate` (inclusive).
 * Both dates are YYYY-MM-DD.
 */
export function cyclesInRange(
  fromDate: string,
  toDate: string,
  firstPaydate: string,
  paydayType: 'FIXED' | 'LAST',
  paydayValue: number,
): FinancialCycle[] {
  const cycles: FinancialCycle[] = [];
  let current = cycleForDate(fromDate, firstPaydate, paydayType, paydayValue);

  while (compareDates(current.startDate, toDate) <= 0) {
    cycles.push(current);
    // Next cycle starts the day after current.endDate
    const nextStart = dayAfter(current.endDate);
    if (compareDates(nextStart, toDate) > 0) break;
    current = cycleForDate(nextStart, firstPaydate, paydayType, paydayValue);
  }

  return cycles;
}

function dayAfter(iso: string): string {
  const { year, month, day } = parseDate(iso);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + 1);
  return formatDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

export function cycleLastDate(
  firstPaydate: string,
  paydayType: 'FIXED' | 'LAST',
  paydayValue: number,
): string {
  let { year, month } = parseDate(firstPaydate);
  const next = addMonth(year, month);
  const nextPayday = paydayForMonth(next.year, next.month, paydayType, paydayValue);
  const endDate = dayBefore(nextPayday);

  return endDate;
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
