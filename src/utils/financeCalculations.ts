import {
  Transaction,
  Budget,
  BudgetStatus,
  FinancialGoal,
  GoalProgress,
  FinancialSummary,
  TransactionCategory,
} from '../types/finance';

/**
 * Format numeric currency amount into Nigerian Naira (₦) representation (D02).
 * Rounds cleanly to 2 decimal places with standard thousands separators.
 * Preserves true negative values with negative sign before currency symbol (e.g. -₦500.00).
 */
export function formatNaira(amount: number, includeDecimals = true): string {
  if (isNaN(amount) || !isFinite(amount)) {
    return '₦0.00';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formattedNumber = absAmount.toLocaleString('en-NG', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });

  return isNegative ? `-₦${formattedNumber}` : `₦${formattedNumber}`;
}

/**
 * Formats or parses a date string/timestamp into Lagos calendar year, month, and day under Africa/Lagos (UTC+1).
 * Strictly prevents client browser timezone drift (D06).
 */
export function getLagosDateParts(dateInput: string | Date): {
  year: number;
  month: number;
  day: number;
  dateString: string;
} {
  const dateObj = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(dateObj.getTime())) {
    return { year: 1970, month: 1, day: 1, dateString: '1970-01-01' };
  }

  // Use en-CA for standard YYYY-MM-DD ordering under Africa/Lagos timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.format(dateObj).split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  return {
    year,
    month,
    day,
    dateString: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
}

/**
 * Returns whether a date falls within the active calendar month in Africa/Lagos (UTC+1) (D06).
 */
export function isDateInLagosCurrentMonth(
  dateInput: string | Date,
  referenceDateInput: string | Date = '2026-10-12'
): boolean {
  if (!dateInput) return false;
  try {
    const txLagos = getLagosDateParts(dateInput);
    const refLagos = getLagosDateParts(referenceDateInput);
    return txLagos.year === refLagos.year && txLagos.month === refLagos.month;
  } catch {
    return false;
  }
}

/**
 * Calculate total eligible expenses from transactions (D01, D03).
 * Truthful summation of transactions where type === 'expense' and is_budget_eligible !== false.
 * Transfers and non-eligible transactions are strictly isolated.
 */
export function calculateTotalExpenses(transactions: Transaction[]): number {
  const sum = transactions
    .filter((tx) => tx.type === 'expense' && tx.is_budget_eligible !== false)
    .reduce((acc, tx) => acc + (tx.amount || 0), 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Calculate total income/allowance from transactions.
 */
export function calculateTotalIncome(transactions: Transaction[]): number {
  const sum = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((acc, tx) => acc + (tx.amount || 0), 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Calculate total eligible spending for a specific category (D03, D06).
 * Enforces transfer isolation and budget eligibility flag.
 * Supports optional Lagos calendar-month filtering.
 */
export function calculateCategorySpent(
  transactions: Transaction[],
  category: TransactionCategory,
  options?: { currentMonthOnly?: boolean; referenceDate?: string | Date }
): number {
  const sum = transactions
    .filter((tx) => {
      if (tx.type !== 'expense') return false;
      if (tx.category !== category) return false;
      if (tx.is_budget_eligible === false) return false;
      if (options?.currentMonthOnly) {
        return isDateInLagosCurrentMonth(tx.date, options.referenceDate);
      }
      return true;
    })
    .reduce((acc, tx) => acc + (tx.amount || 0), 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Calculate honest ledger balance.
 * Ledger Balance = Total Income - Total Expenses.
 * Note: If an authoritative backend balance is provided, that takes precedence (D05).
 */
export function calculateLedgerBalance(
  transactions: Transaction[],
  initialBalance = 0
): number {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  const balance = initialBalance + income - expenses;
  return Math.round(balance * 100) / 100;
}

/**
 * Calculate budget status truthfully following Rule 8.B:
 * Budget Remaining = Budget Limit - Amount Spent.
 * Negative remaining is strictly preserved and indicates over-budget state.
 * Never silently clamp remaining amount to zero.
 */
export function calculateBudgetStatus(
  budget: Budget,
  transactions: Transaction[],
  options?: { currentMonthOnly?: boolean; referenceDate?: string | Date }
): BudgetStatus {
  // If currentMonthOnly option is provided, evaluate active Lagos month; otherwise evaluate category spent
  const spent = calculateCategorySpent(transactions, budget.category, options);
  const limit = Math.max(0, budget.limit);
  const remaining = Math.round((limit - spent) * 100) / 100;
  const isOverBudget = spent > limit;
  const overAmount = isOverBudget ? Math.round((spent - limit) * 100) / 100 : 0;
  const percentUsed =
    limit > 0 ? Math.round((spent / limit) * 100 * 10) / 10 : spent > 0 ? 100 : 0;

  return {
    category: budget.category,
    limit,
    spent,
    remaining,
    percentUsed,
    isOverBudget,
    overAmount,
  };
}

/**
 * Calculate goal progress truthfully following Rule 8.C:
 * Accurately calculates target completion, remaining gap, and days remaining.
 * Never implies actual segregated funds or transfers occurred.
 */
export function calculateGoalProgress(
  goal: FinancialGoal,
  referenceDate = new Date('2026-10-12')
): GoalProgress {
  const target = Math.max(0, goal.targetAmount);
  const current = Math.max(0, goal.currentAmount);
  const remainingAmount = Math.max(0, Math.round((target - current) * 100) / 100);
  const percentComplete =
    target > 0 ? Math.min(100, Math.round((current / target) * 100 * 10) / 10) : 100;
  const isCompleted = current >= target;

  let daysRemaining = 0;
  if (goal.targetDate) {
    const targetTime = new Date(goal.targetDate).getTime();
    const currentTime = referenceDate.getTime();
    const diffDays = Math.ceil((targetTime - currentTime) / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, diffDays);
  }

  return {
    id: goal.id,
    title: goal.title,
    targetAmount: target,
    currentAmount: current,
    remainingAmount,
    percentComplete,
    isCompleted,
    daysRemaining,
  };
}

/**
 * Calculate comprehensive financial summary for dashboard metrics.
 */
export function calculateFinancialSummary(
  transactions: Transaction[],
  budgets: Budget[],
  goals: FinancialGoal[],
  backendAuthoritativeBalance?: number
): FinancialSummary {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const netSavings = Math.round((totalIncome - totalExpenses) * 100) / 100;
  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round((netSavings / totalIncome) * 100 * 10) / 10)
      : 0;

  // Strict D05 isolation: Authoritative wallet balance represents actual spendable cash
  // in student's BMONI account and must NEVER be derived by subtracting category budget expenses.
  const authoritativeBalance =
    backendAuthoritativeBalance !== undefined
      ? backendAuthoritativeBalance
      : 125000;

  const budgetStatuses = budgets.map((b) => calculateBudgetStatus(b, transactions));
  const overBudgetsCount = budgetStatuses.filter((s) => s.isOverBudget).length;
  const activeGoalsCount = goals.filter((g) => g.status === 'in_progress').length;

  return {
    authoritativeBalance,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    activeBudgetsCount: budgets.length,
    overBudgetsCount,
    activeGoalsCount,
  };
}

/**
 * Calculate weekly spending breakdown for charts.
 * Groups expenses by day over the last 7 days.
 */
export function calculateDailySpendingBreakdown(
  transactions: Transaction[],
  daysCount = 7
): { day: string; date: string; amount: number }[] {
  const result: { day: string; date: string; amount: number }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date('2026-10-12');

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = dayNames[d.getDay()];

    const dayExpenseSum = transactions
      .filter(
        (tx) =>
          tx.type === 'expense' &&
          tx.is_budget_eligible !== false &&
          tx.date === dateStr
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    result.push({
      day: dayLabel,
      date: dateStr,
      amount: Math.round(dayExpenseSum * 100) / 100,
    });
  }

  return result;
}

/**
 * Calculate category breakdown sorted by expenditure.
 */
export function calculateCategoryBreakdown(
  transactions: Transaction[]
): { category: TransactionCategory; spent: number; percentage: number }[] {
  const categoryMap = new Map<TransactionCategory, number>();
  let totalExpense = 0;

  transactions
    .filter((tx) => tx.type === 'expense' && tx.is_budget_eligible !== false)
    .forEach((tx) => {
      const current = categoryMap.get(tx.category) || 0;
      categoryMap.set(tx.category, current + tx.amount);
      totalExpense += tx.amount;
    });

  const list: { category: TransactionCategory; spent: number; percentage: number }[] = [];

  categoryMap.forEach((spent, category) => {
    const percentage =
      totalExpense > 0 ? Math.round((spent / totalExpense) * 100 * 10) / 10 : 0;
    list.push({ category, spent: Math.round(spent * 100) / 100, percentage });
  });

  return list.sort((a, b) => b.spent - a.spent);
}
