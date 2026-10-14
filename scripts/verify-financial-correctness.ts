/**
 * Zuko Financial Correctness & Integration Verification Suite (Stage 8)
 *
 * Verifies approved rules:
 * - D01: Canonical transaction model with budget eligibility flag
 * - D02: NGN currency formatting and negative representation
 * - D03: Transfer and non-eligible transaction isolation
 * - D04: Duplicate prevention & idempotency by external_reference
 * - D05: Authoritative wallet balance isolation from budget metrics
 * - D06: Africa/Lagos (UTC+1) calendar-month boundary calculations
 * - D07: Singleton financial service boundary consistency
 * - Rule 8.B: Truthful negative remaining calculation for over-budget states
 * - Rule 8.C: Goal progress calculation without phantom segregated funds
 * - Boundary 2.1: Demo mode and live separation
 */

import {
  formatNaira,
  getLagosDateParts,
  isDateInLagosCurrentMonth,
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateCategorySpent,
  calculateLedgerBalance,
  calculateBudgetStatus,
  calculateGoalProgress,
  calculateFinancialSummary,
} from '../src/utils/financeCalculations';
import {
  Transaction,
  Budget,
  FinancialGoal,
} from '../src/types/finance';
import { financeService } from '../src/services/financeService';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedCount++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedCount++;
    console.error(`  ✗ FAIL: ${testName}`);
    if (detail) console.error(`    Detail: ${detail}`);
  }
}

async function runVerificationSuite() {
  console.log('\n======================================================');
  console.log(' ZUKO STAGE 8: FINANCIAL CORRECTNESS VERIFICATION');
  console.log('======================================================\n');

  // TEST SUITE 1: Lagos Month Boundary & Timezone Calculations (D06)
  console.log('--- Suite 1: Africa/Lagos (UTC+1) Month Boundary Calculations ---');
  {
    // UTC 2026-10-31 22:59:59Z is 23:59:59 in Lagos (Still October)
    const octBoundaryUTC = '2026-10-31T22:59:59Z';
    const octLagos = getLagosDateParts(octBoundaryUTC);
    assert(
      octLagos.year === 2026 && octLagos.month === 10 && octLagos.day === 31,
      '2026-10-31T22:59:59Z resolves to October 31 in Lagos',
      `Got year: ${octLagos.year}, month: ${octLagos.month}, day: ${octLagos.day}`
    );

    // UTC 2026-10-31 23:00:00Z is 00:00:00 in Lagos (November 1st)
    const novBoundaryUTC = '2026-10-31T23:00:00Z';
    const novLagos = getLagosDateParts(novBoundaryUTC);
    assert(
      novLagos.year === 2026 && novLagos.month === 11 && novLagos.day === 1,
      '2026-10-31T23:00:00Z rolls over to November 1 in Lagos (UTC+1)',
      `Got year: ${novLagos.year}, month: ${novLagos.month}, day: ${novLagos.day}`
    );

    // Month boundary evaluation against reference date in October
    const refDate = '2026-10-12';
    assert(
      isDateInLagosCurrentMonth(octBoundaryUTC, refDate) === true,
      'October 31 23:59:59 Lagos transaction is within October current month'
    );
    assert(
      isDateInLagosCurrentMonth(novBoundaryUTC, refDate) === false,
      'November 1 00:00:00 Lagos transaction is excluded from October current month'
    );
  }

  // TEST SUITE 2: Budget Eligibility & Transfer Isolation (D01, D03)
  console.log('\n--- Suite 2: Budget Eligibility & Transfer Isolation ---');
  {
    const sampleTxs: Transaction[] = [
      {
        id: 'tx-test-1',
        title: 'Cafeteria Lunch',
        amount: 2500,
        type: 'expense',
        category: 'Food & Dining',
        date: '2026-10-05',
        currency: 'NGN',
        status: 'settled',
        is_budget_eligible: true,
        source: 'bmoni_card',
      },
      {
        id: 'tx-test-2',
        title: 'Transfer to Roommate for Groceries',
        amount: 5000,
        type: 'transfer',
        category: 'Food & Dining',
        date: '2026-10-06',
        currency: 'NGN',
        status: 'settled',
        is_budget_eligible: false, // Internal transfer isolated from budget
        source: 'bank_transfer',
      },
      {
        id: 'tx-test-3',
        title: 'Snacks from Kiosk',
        amount: 1500,
        type: 'expense',
        category: 'Food & Dining',
        date: '2026-10-07',
        currency: 'NGN',
        status: 'settled',
        is_budget_eligible: true,
        source: 'cash',
      },
      {
        id: 'tx-test-4',
        title: 'Non-budget personal movement',
        amount: 10000,
        type: 'expense',
        category: 'Food & Dining',
        date: '2026-10-08',
        currency: 'NGN',
        status: 'settled',
        is_budget_eligible: false, // Explicitly non-eligible
        source: 'bank_transfer',
      },
    ];

    const foodSpent = calculateCategorySpent(sampleTxs, 'Food & Dining');
    assert(
      foodSpent === 4000,
      'Category spent only sums eligible expenses (2500 + 1500 = 4000), ignoring transfers & non-eligible txs',
      `Expected 4000, got ${foodSpent}`
    );

    const totalExpenses = calculateTotalExpenses(sampleTxs);
    assert(
      totalExpenses === 4000,
      'Total expenses calculation strictly ignores transfers and non-eligible items',
      `Expected 4000, got ${totalExpenses}`
    );
  }

  // TEST SUITE 3: Budget Status & Truthful Negative Remaining (Rule 8.B)
  console.log('\n--- Suite 3: Truthful Budget Calculation & Negative Remaining Preservation ---');
  {
    const budgetUnder: Budget = {
      id: 'b-1',
      category: 'Food & Dining',
      limit: 20000,
      period: 'monthly',
      color: '#10b981',
      icon: 'Utensils',
    };

    const txsUnder: Transaction[] = [
      {
        id: 'tx-u1',
        title: 'Food 1',
        amount: 14000,
        type: 'expense',
        category: 'Food & Dining',
        date: '2026-10-02',
        currency: 'NGN',
        status: 'settled',
        is_budget_eligible: true,
        source: 'bmoni_card',
      },
    ];

    const statusUnder = calculateBudgetStatus(budgetUnder, txsUnder);
    assert(
      statusUnder.remaining === 6000 && statusUnder.isOverBudget === false && statusUnder.percentUsed === 70,
      'Under-budget calculates remaining: 6000, percentUsed: 70%, isOverBudget: false',
      `Got remaining: ${statusUnder.remaining}, percentUsed: ${statusUnder.percentUsed}`
    );

    const txsOver: Transaction[] = [
      {
        id: 'tx-o1',
        title: 'Food Big Order',
        amount: 26500,
        type: 'expense',
        category: 'Food & Dining',
        date: '2026-10-02',
        currency: 'NGN',
        status: 'settled',
        is_budget_eligible: true,
        source: 'bmoni_card',
      },
    ];

    const statusOver = calculateBudgetStatus(budgetUnder, txsOver);
    assert(
      statusOver.remaining === -6500,
      'Over-budget preserves true negative remaining (-₦6,500.00), NEVER clamps to 0',
      `Expected -6500, got ${statusOver.remaining}`
    );
    assert(
      statusOver.isOverBudget === true && statusOver.overAmount === 6500,
      'Over-budget sets isOverBudget=true and calculates exact overAmount (6500)',
      `Got isOverBudget: ${statusOver.isOverBudget}, overAmount: ${statusOver.overAmount}`
    );
    assert(
      statusOver.percentUsed === 132.5,
      'Over-budget reflects true percentUsed (>100%, 132.5%)',
      `Got ${statusOver.percentUsed}%`
    );
  }

  // TEST SUITE 4: Authoritative Wallet Balance Isolation (D05)
  console.log('\n--- Suite 4: Authoritative Wallet Balance Isolation (D05) ---');
  {
    const budgets: Budget[] = [
      { id: 'b-1', category: 'Food & Dining', limit: 25000, period: 'monthly', color: '#10b981', icon: 'Utensils' },
      { id: 'b-2', category: 'Transportation', limit: 10000, period: 'monthly', color: '#06b6d4', icon: 'Bus' },
    ];

    const txs: Transaction[] = [
      {
        id: 'tx-inc',
        title: 'Allowance',
        amount: 150000,
        type: 'income',
        category: 'Income / Allowance',
        date: '2026-10-01',
        currency: 'NGN',
        status: 'settled',
        is_budget_eligible: false,
        source: 'bank_transfer',
      },
      {
        id: 'tx-exp1',
        title: 'Groceries',
        amount: 12000,
        type: 'expense',
        category: 'Food & Dining',
        date: '2026-10-03',
        currency: 'NGN',
        status: 'settled',
        is_budget_eligible: true,
        source: 'bmoni_card',
      },
    ];

    const goals: FinancialGoal[] = [];

    // Authoritative balance provided by backend/wallet service
    const authoritativeBalance = 125000;
    const summary = calculateFinancialSummary(txs, budgets, goals, authoritativeBalance);

    assert(
      summary.authoritativeBalance === 125000,
      'Authoritative balance is strictly preserved at ₦125,000.00',
      `Got ${summary.authoritativeBalance}`
    );

    // Verify it is NOT derived from subtracting unspent budget envelope limits (25000 + 10000)
    const totalBudgetLimits = budgets.reduce((acc, b) => acc + b.limit, 0);
    assert(
      summary.authoritativeBalance !== (150000 - totalBudgetLimits),
      'Wallet balance is NEVER derived by deducting planned budget envelope allocations',
      `Authoritative: ${summary.authoritativeBalance}, Derived would be: ${150000 - totalBudgetLimits}`
    );

    // Ledger balance calculated separately from ledger records
    const ledgerBal = calculateLedgerBalance(txs, 0);
    assert(
      ledgerBal === 138000,
      'Ledger balance (150000 - 12000 = 138000) is tracked independently from wallet cash',
      `Expected 138000, got ${ledgerBal}`
    );
  }

  // TEST SUITE 5: Goal Progress & Non-Segregated Funds (Rule 8.C)
  console.log('\n--- Suite 5: Goal Progress Calculation (Rule 8.C) ---');
  {
    const goalInProgress: FinancialGoal = {
      id: 'g-1',
      title: 'Dev Laptop Fund',
      targetAmount: 350000,
      currentAmount: 140000,
      targetDate: '2026-12-31',
      category: 'Education & Career',
      status: 'in_progress',
      color: '#10b981',
      icon: 'Laptop',
    };

    const refDate = new Date('2026-10-12');
    const progress = calculateGoalProgress(goalInProgress, refDate);

    assert(
      progress.remainingAmount === 210000,
      'Goal remaining gap is accurately calculated (350000 - 140000 = 210000)',
      `Expected 210000, got ${progress.remainingAmount}`
    );
    assert(
      progress.percentComplete === 40,
      'Goal percentComplete is 40.0%',
      `Expected 40, got ${progress.percentComplete}`
    );
    assert(
      progress.isCompleted === false,
      'Incomplete goal has isCompleted=false'
    );
    assert(
      progress.daysRemaining === 80,
      'Days remaining accurately calculated from reference date to targetDate (80 days)',
      `Expected 80, got ${progress.daysRemaining}`
    );

    // Completed goal edge case
    const completedGoal: FinancialGoal = {
      id: 'g-2',
      title: 'Tuition Reserve',
      targetAmount: 50000,
      currentAmount: 55000,
      targetDate: '2026-11-30',
      category: 'Education & Career',
      status: 'completed',
      color: '#10b981',
      icon: 'Check',
    };
    const compProgress = calculateGoalProgress(completedGoal, refDate);
    assert(
      compProgress.percentComplete === 100 && compProgress.remainingAmount === 0 && compProgress.isCompleted === true,
      'Exceeded goal caps percentComplete at 100% and remainingAmount at 0'
    );

    // Zero target edge case
    const zeroGoal: FinancialGoal = {
      id: 'g-3',
      title: 'Zero Target',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: '2026-12-01',
      category: 'General',
      status: 'in_progress',
      color: '#10b981',
      icon: 'Target',
    };
    const zeroProgress = calculateGoalProgress(zeroGoal, refDate);
    assert(
      !isNaN(zeroProgress.percentComplete) && zeroProgress.percentComplete === 100,
      'Zero target does not trigger division by zero or NaN'
    );
  }

  // TEST SUITE 6: Idempotent Ingestion & Duplicate Handling (D04, FR-032)
  console.log('\n--- Suite 6: Idempotent Ingestion & Duplicate Handling (D04, FR-032) ---');
  {
    const initialTxCount = (await financeService.getTransactions()).length;

    const txToIngest = {
      title: 'BMONI POS Bookstore Purchase',
      amount: 4500,
      type: 'expense' as const,
      category: 'Books & Academic' as const,
      date: '2026-10-10',
      currency: 'NGN' as const,
      status: 'settled' as const,
      is_budget_eligible: true,
      merchant: 'UNILAG Bookstore',
      source: 'bmoni_card' as const,
      external_reference: 'BMONI-AUTH-UNIQUE-999',
    };

    // First ingestion: Should succeed
    const ingested1 = await financeService.createTransaction(txToIngest);
    const countAfterFirst = (await financeService.getTransactions()).length;
    assert(
      countAfterFirst === initialTxCount + 1,
      'First transaction ingestion adds a new record to the shared service',
      `Count after first: ${countAfterFirst}`
    );

    // Second ingestion with SAME external_reference: Should be idempotent
    const ingested2 = await financeService.createTransaction(txToIngest);
    const countAfterSecond = (await financeService.getTransactions()).length;
    assert(
      countAfterSecond === countAfterFirst,
      'Duplicate transaction with same external_reference is rejected (count unchanged)',
      `Expected ${countAfterFirst}, got ${countAfterSecond}`
    );
    assert(
      ingested1.id === ingested2.id,
      'Idempotent call returns original transaction reference',
      `Original ID: ${ingested1.id}, Returned ID: ${ingested2.id}`
    );
  }

  // TEST SUITE 7: Currency Formatting & Representation (D02)
  console.log('\n--- Suite 7: Currency Formatting & Representation (D02) ---');
  {
    assert(
      formatNaira(150000) === '₦150,000.00',
      'Positive naira formats with ₦ and decimal precision (₦150,000.00)',
      `Got ${formatNaira(150000)}`
    );
    assert(
      formatNaira(150000, false) === '₦150,000',
      'Whole naira formats without decimals when requested (₦150,000)',
      `Got ${formatNaira(150000, false)}`
    );
    assert(
      formatNaira(-5400.5) === '-₦5,400.50',
      'Negative amounts preserve leading minus sign (-₦5,400.50)',
      `Got ${formatNaira(-5400.5)}`
    );
    assert(
      formatNaira(NaN) === '₦0.00',
      'NaN gracefully formats to ₦0.00',
      `Got ${formatNaira(NaN)}`
    );
  }

  console.log('\n======================================================');
  console.log(` RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('======================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runVerificationSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
