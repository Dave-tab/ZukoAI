import {
  Transaction,
  Budget,
  FinancialGoal,
  AIInsight,
  StudentProfile,
  NotificationItem,
  IFinanceService,
} from '../types/finance';

/**
 * Verified Initial Student Profile
 */
export const initialStudentProfile: StudentProfile = {
  name: 'David Ayantade',
  university: 'University of Lagos (UNILAG)',
  major: 'Computer Science',
  year: 'Year 3 (Penultimate)',
  semester: 'First Semester 2026/2027',
  avatarUrl: '/src/assets/images/student_user_avatar_1791964531534.jpg',
  email: 'd.ayantade@student.unilag.edu.ng',
  matricNumber: '210805044',
};

/**
 * Realistic Student Transaction Log conforming to Canonical Model (D01, D03, D04).
 * Demonstrates manual entries, BMONI card authorizations, and transfer isolation.
 */
export const initialTransactions: Transaction[] = [
  {
    id: 'tx-001',
    title: 'Monthly Family Allowance',
    amount: 150000,
    type: 'income',
    category: 'Income / Allowance',
    date: '2026-10-01',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: false, // Income does not debit budget envelopes
    merchant: 'Parent Bank Transfer',
    source: 'bank_transfer',
    external_reference: 'BMONI-DEP-20261001-901',
    note: 'Monthly semester allowance support',
  },
  {
    id: 'tx-002',
    title: 'Off-Campus Room Contribution',
    amount: 45000,
    type: 'expense',
    category: 'Housing & Rent',
    date: '2026-10-02',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: true,
    merchant: 'Campus Lodge Landlord',
    source: 'bank_transfer',
    external_reference: 'BMONI-XFR-20261002-332',
    note: 'Quarterly room rent share',
  },
  {
    id: 'tx-003',
    title: 'Algorithms & Data Structures Textbook',
    amount: 12500,
    type: 'expense',
    category: 'Books & Academic',
    date: '2026-10-04',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: true,
    merchant: 'University Bookstore',
    source: 'bmoni_card',
    external_reference: 'BMONI-AUTH-20261004-811',
    note: 'Required textbook for CSC 301',
  },
  {
    id: 'tx-004',
    title: 'Weekly Cafeteria Meal Ticket',
    amount: 14200,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-10-05',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: true,
    merchant: 'Faculty Canteen',
    source: 'bmoni_card',
    external_reference: 'BMONI-AUTH-20261005-449',
    note: 'Lunch vouchers for week 1',
  },
  {
    id: 'tx-005',
    title: 'Campus Shuttle Pass (BRT & Keke)',
    amount: 6800,
    type: 'expense',
    category: 'Transportation',
    date: '2026-10-06',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: true,
    merchant: 'Lagos BRT & Uni Shuttle',
    source: 'manual',
    note: 'Transportation to Faculty of Science',
  },
  {
    id: 'tx-006',
    title: 'Departmental Lab Manual & Photocopies',
    amount: 4500,
    type: 'expense',
    category: 'Books & Academic',
    date: '2026-10-07',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: true,
    merchant: 'Faculty Business Center',
    source: 'manual',
    note: 'Printed project manuals',
  },
  {
    id: 'tx-007',
    title: 'Grocery Supplies & Provisions',
    amount: 18500,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-10-08',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: true,
    merchant: 'Yaba Student Market',
    source: 'bank_transfer',
    external_reference: 'BMONI-XFR-20261008-592',
    note: 'Milk, oats, noodles, snacks',
  },
  {
    id: 'tx-008',
    title: 'Campus Internet Data Bundle (100GB)',
    amount: 10000,
    type: 'expense',
    category: 'Utilities & Tech',
    date: '2026-10-09',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: true,
    merchant: 'MTN Broadband Student Pack',
    source: 'bmoni_wallet',
    external_reference: 'BMONI-WAL-20261009-721',
    note: 'Research & programming project downloads',
  },
  {
    id: 'tx-009',
    title: 'Weekend Cinema with Study Group',
    amount: 8500,
    type: 'expense',
    category: 'Entertainment',
    date: '2026-10-10',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: true,
    merchant: 'Silverbird Cinemas Yaba',
    source: 'bmoni_card',
    external_reference: 'BMONI-AUTH-20261010-118',
    note: 'Movie night after midterm test',
  },
  {
    id: 'tx-010',
    title: 'Haircut & Toiletries',
    amount: 5200,
    type: 'expense',
    category: 'Personal Care',
    date: '2026-10-11',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: true,
    merchant: 'Campus Barber Shop',
    source: 'manual',
    note: 'Personal hygiene and haircut',
  },
  {
    id: 'tx-011',
    title: 'Late Night Dinner & Grills',
    amount: 6300,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-10-12',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: true,
    merchant: 'New Hall Suya & Shawarma',
    source: 'manual',
    note: 'Supper after late coding session in lab',
  },
  {
    id: 'tx-012',
    title: 'Peer Study Group Account Transfer',
    amount: 5000,
    type: 'transfer',
    category: 'Miscellaneous',
    date: '2026-10-12',
    currency: 'NGN',
    status: 'settled',
    is_budget_eligible: false, // D03: Own-account transfers/deposits do not count as category spending
    merchant: 'Internal Student Transfer',
    source: 'bmoni_transfer',
    external_reference: 'BMONI-TRF-20261012-902',
    note: 'Transfer to study partner for group project contribution',
  },
];

/**
 * Student Budgets for the term.
 * Includes healthy envelopes and one envelope slightly over limit
 * to showcase truthful budget alerting per Rule 8.B.
 */
export const initialBudgets: Budget[] = [
  {
    id: 'bg-001',
    category: 'Food & Dining',
    limit: 42000,
    period: 'monthly',
    color: '#10b981', // Emerald Mint
    icon: 'Utensils',
  },
  {
    id: 'bg-002',
    category: 'Books & Academic',
    limit: 25000,
    period: 'monthly',
    color: '#3b82f6', // Sapphire Blue
    icon: 'BookOpen',
  },
  {
    id: 'bg-003',
    category: 'Transportation',
    limit: 12000,
    period: 'monthly',
    color: '#f59e0b', // Amber
    icon: 'Bus',
  },
  {
    id: 'bg-004',
    category: 'Entertainment',
    limit: 8000, // Spent is 8500 -> Over budget by 500 per Rule 8.B
    period: 'monthly',
    color: '#ec4899', // Pink
    icon: 'Gamepad2',
  },
  {
    id: 'bg-005',
    category: 'Utilities & Tech',
    limit: 15000,
    period: 'monthly',
    color: '#8b5cf6', // Violet
    icon: 'Wifi',
  },
  {
    id: 'bg-006',
    category: 'Personal Care',
    limit: 10000,
    period: 'monthly',
    color: '#14b8a6', // Teal
    icon: 'Sparkles',
  },
];

/**
 * Financial Goals for university students.
 */
export const initialGoals: FinancialGoal[] = [
  {
    id: 'gl-001',
    title: 'MacBook Air M2 for Final Year Project',
    targetAmount: 480000,
    currentAmount: 310000,
    targetDate: '2026-12-15',
    category: 'Technology',
    status: 'in_progress',
    color: '#059669', // Emerald
    icon: 'Laptop',
    description: 'Saving for development machine for machine learning final project',
  },
  {
    id: 'gl-002',
    title: 'Next Semester Accommodation Deposit',
    targetAmount: 180000,
    currentAmount: 125000,
    targetDate: '2027-01-30',
    category: 'Housing',
    status: 'in_progress',
    color: '#2563eb', // Royal Blue
    icon: 'Home',
    description: 'Securing off-campus single room ahead of final semester rush',
  },
  {
    id: 'gl-003',
    title: 'Emergency Student Buffer Fund',
    targetAmount: 50000,
    currentAmount: 50000,
    targetDate: '2026-10-01',
    category: 'Safety Net',
    status: 'completed',
    color: '#10b981', // Mint
    icon: 'ShieldCheck',
    description: '30-day cushion for unexpected medical or travel expenses',
  },
  {
    id: 'gl-004',
    title: 'Professional Cloud Certification Exam',
    targetAmount: 65000,
    currentAmount: 22000,
    targetDate: '2026-11-28',
    category: 'Career & Certs',
    status: 'in_progress',
    color: '#f59e0b', // Amber
    icon: 'Award',
    description: 'AWS Certified Solutions Architect voucher student discount',
  },
];

/**
 * AI Insights derived from student spending trends.
 */
export const initialAIInsights: AIInsight[] = [
  {
    id: 'ins-001',
    title: 'Entertainment Budget Warning',
    summary: 'You have spent ₦8,500 on Entertainment, exceeding your monthly ₦8,000 threshold by ₦500. Consider dining at the hall canteen rather than outside cinema spots this weekend.',
    type: 'warning',
    impactAmount: 500,
    date: '2026-10-12',
    isDemoInsight: true,
  },
  {
    id: 'ins-002',
    title: 'Academic Textbook Savings Opportunity',
    summary: 'You spent ₦12,500 on CSC textbooks. Sharing senior-year PDF reserves via the departmental library group could save an estimated ₦15,000 next semester.',
    type: 'opportunity',
    impactAmount: 15000,
    date: '2026-10-11',
    isDemoInsight: true,
  },
  {
    id: 'ins-003',
    title: 'Consistent Laptop Goal Momentum',
    summary: 'Your MacBook M2 savings goal is 64.6% funded (₦310,000 of ₦480,000). At your current savings rate, you will reach the target 12 days ahead of your December 15 deadline.',
    type: 'achievement',
    impactAmount: 310000,
    date: '2026-10-10',
    isDemoInsight: true,
  },
  {
    id: 'ins-004',
    title: 'Bulk Data Bundle Efficiency Tip',
    summary: 'Purchasing 100GB monthly bundle saved you ~₦4,200 compared to daily micro-recharges over the same period. Excellent utility planning!',
    type: 'tip',
    impactAmount: 4200,
    date: '2026-10-09',
    isDemoInsight: true,
  },
];

/**
 * Initial Student Financial Notifications (D11, FR-006)
 */
export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-001',
    title: 'Budget Limit Exceeded',
    message: 'Your Entertainment budget exceeded the ₦8,000 limit by ₦500.',
    type: 'warning',
    timestamp: 'Today, 2:30 PM',
    read: false,
    linkPage: 'budgets',
  },
  {
    id: 'notif-002',
    title: 'Allowance Received',
    message: '₦150,000 was credited to your account from Parent Bank Transfer.',
    type: 'success',
    timestamp: 'Oct 01, 2026',
    read: true,
    linkPage: 'dashboard',
  },
  {
    id: 'notif-003',
    title: 'Goal Progress Milestone',
    message: 'MacBook Air M2 goal reached 64.6% funding (₦310,000)!',
    type: 'milestone',
    timestamp: 'Oct 10, 2026',
    read: false,
    linkPage: 'goals',
  },
  {
    id: 'notif-004',
    title: 'Calendar Month Reset Notice',
    message: 'Budget cycle conforms to Africa/Lagos timezone (UTC+1).',
    type: 'info',
    timestamp: 'Oct 01, 2026',
    read: true,
    linkPage: 'budgets',
  },
];

/**
 * Concrete In-Memory Implementation of IFinanceService (D07)
 * Serves as the clean architectural boundary between UI components and future backend APIs.
 */
export class InMemoryFinanceService implements IFinanceService {
  private transactions: Transaction[] = [...initialTransactions];
  private budgets: Budget[] = [...initialBudgets];
  private goals: FinancialGoal[] = [...initialGoals];
  private insights: AIInsight[] = [...initialAIInsights];
  private profile: StudentProfile = { ...initialStudentProfile };
  private notifications: NotificationItem[] = [...initialNotifications];
  private authoritativeBalance = 125000; // Authoritative cash wallet balance (D05)

  async getWalletBalance(): Promise<{ available_balance: number; currency: 'NGN' }> {
    return {
      available_balance: this.authoritativeBalance,
      currency: 'NGN',
    };
  }

  async getTransactions(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async getBudgets(): Promise<Budget[]> {
    return [...this.budgets];
  }

  async getGoals(): Promise<FinancialGoal[]> {
    return [...this.goals];
  }

  async getInsights(): Promise<AIInsight[]> {
    return [...this.insights];
  }

  async getProfile(): Promise<StudentProfile> {
    return { ...this.profile };
  }

  async getNotifications(): Promise<NotificationItem[]> {
    return [...this.notifications];
  }

  async updateProfile(profileUpdates: Partial<StudentProfile>): Promise<StudentProfile> {
    this.profile = {
      ...this.profile,
      ...profileUpdates,
    };
    return { ...this.profile };
  }

  async createBudget(budgetData: Omit<Budget, 'id'>): Promise<Budget> {
    const newBudget: Budget = {
      ...budgetData,
      id: `bg-${Date.now()}`,
    };
    this.budgets = [newBudget, ...this.budgets];
    return newBudget;
  }

  async updateBudget(budget: Budget): Promise<Budget> {
    this.budgets = this.budgets.map((b) => (b.id === budget.id ? budget : b));
    return budget;
  }

  async deleteBudget(budgetId: string): Promise<void> {
    this.budgets = this.budgets.filter((b) => b.id !== budgetId);
  }

  async createGoal(goalData: Omit<FinancialGoal, 'id'>): Promise<FinancialGoal> {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: `gl-${Date.now()}`,
    };
    this.goals = [newGoal, ...this.goals];
    return newGoal;
  }

  async updateGoal(goal: FinancialGoal): Promise<FinancialGoal> {
    this.goals = this.goals.map((g) => (g.id === goal.id ? goal : g));
    return goal;
  }

  async deleteGoal(goalId: string): Promise<void> {
    this.goals = this.goals.filter((g) => g.id !== goalId);
  }

  async createTransaction(txData: Omit<Transaction, 'id'>): Promise<Transaction> {
    // Idempotent ingestion: Reject duplicates with the same external_reference (D04, FR-032)
    if (txData.external_reference) {
      const existing = this.transactions.find(
        (t) => t.external_reference === txData.external_reference
      );
      if (existing) {
        return existing;
      }
    }

    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      currency: 'NGN',
    };
    this.transactions = [newTx, ...this.transactions];
    return newTx;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
  }

  async markAllNotificationsAsRead(): Promise<void> {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
  }
}

/**
 * Exported Singleton Instance of the Financial Service Boundary (D07)
 */
export const financeService = new InMemoryFinanceService();
