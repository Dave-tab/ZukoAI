# Zuko — Data Models & Service Contracts

---

## 1. Canonical Transaction Model Specification (`D01`, `D03`, `D04`)

Zuko's financial data flow centers on a single canonical transaction entity. Every financial entry—whether captured via a manual cash modal, parsed from a paper receipt, or delivered via a BMONI card webhook—must normalize into this structure.

### 1.1 Model Attributes & Semantics

| Field | Type | Required | Description & Business Rules |
| :--- | :--- | :---: | :--- |
| `id` | `string` | **Yes** | Unique identifier (e.g., `tx-1728901234-abc12` in prototype; UUID in database). |
| `title` | `string` | **Yes** | Descriptive label (e.g., `"Cafeteria Lunch"`, `"Algorithms Textbook"`). |
| `amount` | `number` | **Yes** | Numeric value strictly greater than 0. Formatted in Nigerian Naira (`₦`) (`D02`). *(Storage precision unresolved: see `DEC-001`)*. |
| `currency` | `'NGN'` | **Yes** | Fixed to Nigerian Naira (`NGN`). |
| `type` | `TransactionType` | **Yes** | Categorical type: `'expense' \| 'income' \| 'transfer' \| 'deposit' \| 'withdrawal'`. |
| `category` | `TransactionCategory` | **Yes** | Transaction category conforming to the shared vocabulary (`D08`). |
| `date` | `string` | **Yes** | Date string (`YYYY-MM-DD`), evaluated under the `Africa/Lagos` timezone (`D06`). |
| `source` | `TransactionSource` | **Yes** | Provenance: `'manual' \| 'bmoni_card' \| 'bmoni_wallet' \| 'bmoni_transfer' \| 'bank_transfer' \| 'cash'`. |
| `status` | `TransactionStatus` | **Yes** | Lifecycle state: `'initiated' \| 'pending' \| 'settled' \| 'failed' \| 'reversed'`. Distinct from budget eligibility (`D03`). |
| `is_budget_eligible`| `boolean` | **Yes** | Explicit flag indicating whether the transaction qualifies to debit a budget envelope (`D03`). |
| `external_reference`| `string` | No | Unique provider identifier (e.g. `BMONI-AUTH-20261004-811`) used for idempotent duplicate rejection (`D04`). |
| `merchant` | `string` | No | Vendor or counterparty name (e.g., `"UNILAG Bookstore"`, `"BRT Shuttle"`). |
| `note` | `string` | No | User-entered explanation or receipt context. |

---

## 2. Core TypeScript Domain Interfaces (`src/types/finance.ts`)

```typescript
export type TransactionCategory =
  | 'Food & Dining'
  | 'Transportation'
  | 'Books & Academic'
  | 'Housing & Rent'
  | 'Healthcare & Personal'
  | 'Entertainment & Social'
  | 'Utilities & Data'
  | 'Income / Allowance'
  | 'General & Miscellaneous';

export type TransactionType = 'expense' | 'income' | 'transfer' | 'deposit' | 'withdrawal';
export type TransactionStatus = 'initiated' | 'pending' | 'settled' | 'failed' | 'reversed';
export type TransactionSource = 'manual' | 'bmoni_card' | 'bmoni_wallet' | 'bmoni_transfer' | 'bank_transfer' | 'cash';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  currency: 'NGN';
  status: TransactionStatus;
  is_budget_eligible: boolean;
  merchant?: string;
  source: TransactionSource;
  external_reference?: string;
  note?: string;
}

export type BudgetPeriod = 'monthly' | 'weekly' | 'semester';

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  period: BudgetPeriod;
  spent?: number;
  color?: string;
  icon?: string;
}

export interface BudgetStatus {
  category: TransactionCategory;
  limit: number;
  spent: number;
  remaining: number; // Truthfully preserves negative values (Rule 8.B)
  percentUsed: number;
  isOverBudget: boolean;
  overAmount: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  status: 'in_progress' | 'completed' | 'paused';
  color?: string;
  icon?: string;
  description?: string;
}

export interface GoalProgress {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  percentComplete: number;
  isCompleted: boolean;
  daysRemaining: number;
}

export interface FinancialSummary {
  authoritativeBalance: number; // Strictly isolated from budget envelopes (D05)
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  activeBudgetsCount: number;
  overBudgetsCount: number;
  activeGoalsCount: number;
}
```

---

## 3. Financial Service Contract (`IFinanceService` — `D07`)

All frontend components interact with financial data through the `IFinanceService` boundary:

```typescript
export interface IFinanceService {
  // Authoritative Balance (D05)
  getWalletBalance(): Promise<{ available_balance: number; currency: 'NGN' }>;

  // Transactions (D01, D03, D04)
  getTransactions(): Promise<Transaction[]>;
  createTransaction(txData: Omit<Transaction, 'id'>): Promise<Transaction>;

  // Budgets (D06, D10)
  getBudgets(): Promise<Budget[]>;
  createBudget(budgetData: Omit<Budget, 'id'>): Promise<Budget>;
  updateBudget(budget: Budget): Promise<Budget>;
  deleteBudget(budgetId: string): Promise<void>;

  // Goals (Rule 8.C, D10)
  getGoals(): Promise<FinancialGoal[]>;
  createGoal(goalData: Omit<FinancialGoal, 'id'>): Promise<FinancialGoal>;
  updateGoal(goal: FinancialGoal): Promise<FinancialGoal>;
  deleteGoal(goalId: string): Promise<void>;

  // AI Insights & Profile
  getAIInsights(): Promise<AIInsight[]>;
  getStudentProfile(): Promise<StudentProfile>;
  updateProfile(profile: Partial<StudentProfile>): Promise<StudentProfile>;

  // Notifications
  getNotifications(): Promise<NotificationItem[]>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(): Promise<void>;
}
```

---

## 4. Proposed Database Schema Contract (Node.js ➔ All Developers)

> **Important Notice on `DEC-001`**: The schema below illustrates standard PostgreSQL types. Whether monetary amounts are persisted as integer kobo minor units (`BIGINT`) or decimal numeric (`NUMERIC(12, 2)`) is an open project decision (`DEC-001`).

```sql
-- Student Profile table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  university TEXT DEFAULT 'University of Lagos',
  major TEXT,
  academic_year TEXT,
  semester TEXT DEFAULT 'First Semester 2026/2027',
  avatar_url TEXT,
  matric_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budgets table (D06: Calendar Month in Africa/Lagos)
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  limit_amount NUMERIC(12, 2) NOT NULL CHECK (limit_amount >= 0),
  period TEXT NOT NULL DEFAULT 'monthly' CHECK (period IN ('monthly', 'weekly', 'semester')),
  color TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_category_period UNIQUE (user_id, category, period)
);

-- Transactions table (Canonical Model - D01, D03, D04)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'NGN',
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer', 'deposit', 'withdrawal')),
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL CHECK (source IN ('manual', 'bmoni_card', 'bmoni_wallet', 'bmoni_transfer', 'bank_transfer', 'cash')),
  status TEXT NOT NULL DEFAULT 'settled' CHECK (status IN ('initiated', 'pending', 'settled', 'failed', 'reversed')),
  is_budget_eligible BOOLEAN NOT NULL DEFAULT TRUE,
  external_reference TEXT UNIQUE, -- Enforces idempotency (D04, FR-032)
  merchant TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial Goals table (Rule 8.C)
CREATE TABLE financial_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount >= 0),
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  target_date DATE,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'paused')),
  description TEXT,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Cross-Team Component Contracts

### 5.1 Manual Expense Modal Contract (Frontend Dev B ➔ Dev A)
```typescript
export interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  defaultCategory?: TransactionCategory;
}
```

### 5.2 AI Quick Interaction Modal Contract (`FloatingAskZukoModal`)
```typescript
export interface FloatingAskZukoModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: AIInsight[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
  initialPrompt?: string | null;
  initialInsight?: AIInsight | null;
}
```
