# Zuko — Developer Handoff Specification

---

## 1. Team Responsibilities & Ownership Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND DEVELOPER A                            │
│  - Overview Dashboard (Verified UI)                                    │
│  - Budgets Page & Modals (Verified UI)                                 │
│  - Goals Page & Modals (Stage 5 Target)                                │
│  - Shared Layout (Desktop Sidebar & Mobile Bottom Navigation - D11)    │
│  - Home Header with Profile View/Edit & Notification Bell (D11)       │
│  - Consistent Financial Service Boundary Layer (D07)                   │
│  - Client-side financial formatters & math utilities (D02, D06)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Interface Contracts
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND DEVELOPER B                            │
│  - Manual Expense Entry Modal & Form                                   │
│  - Full Filterable Transaction Ledger Table                            │
│  - AI Chatbot Interface Shell                                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Data Queries & Webhooks
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FULL-STACK NODE.JS DEVELOPER                       │
│  - Supabase Database Setup & PostgreSQL Migrations                     │
│  - Backend-Enforced User Ownership & Access Control (D09)              │
│  - BMONI Server Client & Cryptographic Webhook Receiver (D04, D05)     │
│  - Authoritative Balance Endpoint (`/api/wallet/balance`) (D05, D07)   │
│  - Post-Mutation Reliable Refresh Support (D10)                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Event Hook & Categorization
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FULL-STACK PYTHON DEVELOPER                        │
│  - Assistive Transaction Categorization Engine (D08)                   │
│  - Receipt Image OCR Parsing                                           │
│  - Financial Insight Generation Algorithms                             │
│  - BMONI Sandbox Python Research Tools                                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Cross-Team Interface Contracts

### 2.1 Proposed Canonical Database Schema Contract (Node.js ➔ All Developers)
> *Note: This represents a proposed architectural contract, not an approved final migration. Monetary representation is subject to Owner Decision `DEC-001`.*

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  university TEXT DEFAULT 'University of Lagos',
  semester TEXT DEFAULT 'First Semester 2026/2027',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budgets table (D06: Calendar Month in Africa/Lagos)
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  limit_amount NUMERIC(12, 2) NOT NULL CHECK (limit_amount > 0),
  period TEXT NOT NULL DEFAULT 'monthly',
  created_at TIMESTAMPTZ DEFAULT NOW(),
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
  source TEXT NOT NULL CHECK (source IN ('manual', 'bmoni_card', 'bmoni_wallet', 'bmoni_transfer')),
  status TEXT NOT NULL DEFAULT 'settled' CHECK (status IN ('initiated', 'pending', 'settled', 'failed', 'reversed')),
  is_budget_eligible BOOLEAN DEFAULT TRUE,
  external_reference TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backend-Enforced User Ownership (D09)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users access own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
```

### 2.2 Manual Expense Modal Contract (Frontend Dev B ➔ Dev A)
```typescript
export interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTransaction: Transaction) => void;
  defaultCategory?: TransactionCategory;
}
```

### 2.3 Consistent Financial Service Interface (D07)
```typescript
export interface IFinanceService {
  getWalletBalance(): Promise<{ available_balance: number; currency: 'NGN' }>;
  getTransactions(): Promise<Transaction[]>;
  getBudgets(): Promise<Budget[]>;
  getGoals(): Promise<FinancialGoal[]>;
  createBudget(budget: Omit<Budget, 'id'>): Promise<Budget>;
  updateBudget(budget: Budget): Promise<Budget>;
  deleteBudget(budgetId: string): Promise<void>;
  createTransaction(tx: Omit<Transaction, 'id'>): Promise<Transaction>;
}
```

---

## 3. Minimum Integration Testing Standards (D12)

Before any backend-connected release is signed off, the team must implement and pass the following integration test scenarios:
1. **Budget Debit Verification**: A confirmed eligible expense successfully debits the matching category budget and decreases remaining amount.
2. **Manual & Provider Symmetry**: A manual expense entry updates the exact same budget calculation engine as a card webhook event.
3. **Transfer Isolation**: Deposits and own-account transfers do not increment category spent totals.
4. **Duplicate Prevention**: Ingesting the same BMONI card event reference twice is rejected idempotently.
5. **Wallet vs. Budget Isolation**: Storing budget expenses does not alter the authoritative wallet balance returned by the balance endpoint.
6. **Timezone Boundary Conformance**: Transactions stamped at 23:59:59 on the last day of the month fall strictly within that month's budget window under `Africa/Lagos` time.
7. **Tenant Isolation**: An authenticated student cannot read or mutate another student's transactions or budgets.

---

## 4. Dependency-Aware Implementation Roadmap

1. **Stage 5 — Financial Goals Implementation (Frontend Developer A)**:
   - Complete and verify the Goals page milestones per approved Stitch designs.
2. **Phase 1 — Supabase Database & Security (Node.js Developer)**:
   - Provision Supabase project.
   - Run migrations for `profiles`, `budgets`, `transactions`, and `goals`.
   - Configure backend-enforced RLS policies (D09).
3. **Phase 2 — BMONI Webhook Receiver (Node.js Developer)**:
   - Create Express endpoint `/api/webhooks/bmoni`.
   - Add HMAC signature verification and idempotency handling (D04).
4. **Phase 3 — Manual Expense Form & Full Ledger Table (Frontend Developer B)**:
   - Implement `AddExpenseModal` and full filterable `TransactionsPage`.
5. **Phase 4 — AI Categorization Engine (Python Developer)**:
   - Implement assistive transaction category classification with shared vocabulary (D08).
6. **Phase 5 — Client Database Connection (Frontend Developer A & Node.js)**:
   - Connect frontend service boundary (D07) to live Supabase queries and post-mutation reliable updates (D10).
