export type TransactionCategory =
  | 'Food & Dining'
  | 'Books & Academic'
  | 'Housing & Rent'
  | 'Transportation'
  | 'Entertainment'
  | 'Utilities & Tech'
  | 'Personal Care'
  | 'Income / Allowance'
  | 'Savings Deposit'
  | 'Miscellaneous';

export type TransactionType =
  | 'expense'
  | 'income'
  | 'transfer'
  | 'deposit'
  | 'withdrawal';

export type TransactionSource =
  | 'manual'
  | 'bmoni_card'
  | 'bmoni_wallet'
  | 'bmoni_transfer'
  | 'cash'
  | 'bank_transfer'
  | 'campus_card'
  | 'stipend';

export type TransactionStatus =
  | 'initiated'
  | 'pending'
  | 'settled'
  | 'failed'
  | 'reversed';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // ISO date string YYYY-MM-DD
  currency: 'NGN';
  status: TransactionStatus;
  is_budget_eligible: boolean;
  external_reference?: string;
  note?: string;
  merchant?: string;
  source?: TransactionSource;
}

export type BudgetPeriod = 'monthly' | 'weekly' | 'semester';

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  period: BudgetPeriod;
  color?: string; // Hex or Tailwind color class
  icon?: string;
}

export type GoalStatus = 'in_progress' | 'completed' | 'paused';

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category: string;
  status: GoalStatus;
  color?: string;
  icon?: string;
  description?: string;
}

export interface BudgetStatus {
  category: TransactionCategory;
  limit: number;
  spent: number;
  remaining: number; // limit - spent (can be negative if over budget per Rule 8.B)
  percentUsed: number; // (spent / limit) * 100
  isOverBudget: boolean;
  overAmount: number; // max(0, spent - limit)
}

export interface GoalProgress {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number; // max(0, targetAmount - currentAmount)
  percentComplete: number; // min(100, (currentAmount / targetAmount) * 100)
  isCompleted: boolean;
  daysRemaining: number;
}

export interface FinancialSummary {
  authoritativeBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // percentage
  activeBudgetsCount: number;
  overBudgetsCount: number;
  activeGoalsCount: number;
}

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  type: 'tip' | 'warning' | 'achievement' | 'opportunity';
  impactAmount?: number;
  date: string;
  isDemoInsight: boolean;
}

export interface StudentProfile {
  name: string;
  university: string;
  major: string;
  year: string;
  avatarUrl?: string;
  semester: string;
  email?: string;
  matricNumber?: string;
}

/**
 * Approved Navigation Destinations across Desktop Sidebar & Mobile Bottom Nav (D11)
 */
export type AppPage =
  | 'dashboard'
  | 'budgets'
  | 'transactions'
  | 'goals'
  | 'ai-assistant';

/**
 * Notification Item for Student Financial Alerts (D11, FR-006)
 */
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'milestone';
  timestamp: string;
  read: boolean;
  linkPage?: AppPage;
}

/**
 * Consistent Financial Service Boundary Interface (D07)
 */
export interface IFinanceService {
  getWalletBalance(): Promise<{ available_balance: number; currency: 'NGN' }>;
  getTransactions(): Promise<Transaction[]>;
  getBudgets(): Promise<Budget[]>;
  getGoals(): Promise<FinancialGoal[]>;
  getInsights(): Promise<AIInsight[]>;
  getProfile(): Promise<StudentProfile>;
  getNotifications(): Promise<NotificationItem[]>;
  updateProfile(profile: Partial<StudentProfile>): Promise<StudentProfile>;
  createBudget(budget: Omit<Budget, 'id'>): Promise<Budget>;
  updateBudget(budget: Budget): Promise<Budget>;
  deleteBudget(budgetId: string): Promise<void>;
  createGoal(goal: Omit<FinancialGoal, 'id'>): Promise<FinancialGoal>;
  updateGoal(goal: FinancialGoal): Promise<FinancialGoal>;
  deleteGoal(goalId: string): Promise<void>;
  createTransaction(tx: Omit<Transaction, 'id'>): Promise<Transaction>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(): Promise<void>;
}
