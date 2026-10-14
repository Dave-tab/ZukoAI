# Zuko Project — Architecture & Product Decision Register

This register documents the binding technical and product decisions governing Project Zuko. It distinguishes strictly between **Approved Decisions** (authorized by the project owner) and **Unresolved Decisions** (open architectural questions requiring explicit owner resolution).

---

## 1. Approved Project Decisions (D01 – D12)

### D01 — Canonical Transaction Model
- **Status**: `[APPROVED]` / `[IMPLEMENTED]` (Frontend & Shared Types) / `[PLANNED]` (Backend Database)
- **Summary**: All financial movements—regardless of source—must be normalized into a single, consistent transactional data model across the system.
- **Specification**: The model must track:
  1. Transaction Identity (`id`)
  2. Transaction Source (`source`: `manual`, `bmoni_card`, `bmoni_wallet`, `bmoni_transfer`, `bank_transfer`, `cash`)
  3. Transaction Type (`type`: `expense`, `income`, `transfer`, `deposit`, `withdrawal`)
  4. Lifecycle Status (`status`: `initiated`, `pending`, `settled`, `failed`, `reversed`)
  5. Monetary Amount (`amount`: positive number)
  6. Currency (`currency`: `NGN`)
  7. Date / Timestamp (`date`: evaluated under `Africa/Lagos`)
  8. Category (`category`: conforming to shared vocabulary)
  9. Budget Eligibility (`is_budget_eligible`: boolean flag)
  10. Provider Reconciliation Identifiers (`external_reference`: optional unique idempotency string)
- **Rationale**: Students track expenses across physical cash (campus keke, kiosks), virtual cards, and bank deposits. A unified model prevents duplicate schema divergence between manual entries and automated card hooks.
- **Affected Components**: `src/types/finance.ts`, `src/services/financeService.ts`, backend database schema, Python categorization pipeline.

---

### D02 — Currency & Monetary Representation
- **Status**: `[APPROVED]` (Currency Standard) / `[UNRESOLVED]` (Underlying Storage Format - See `DEC-001`)
- **Summary**: The product's official currency is the Nigerian Naira (`NGN`), formatted in all user interfaces using the Naira symbol `₦` with standard comma thousand separators (e.g., `₦150,000.00`). Negative amounts must preserve a leading minus sign before the currency symbol (e.g., `-₦500.00`).
- **Specification**:
  - Positive: `₦150,000.00` (or `₦150,000` when integer representation is requested).
  - Negative: `-₦5,400.50` (never `(₦5,400.50)` or `₦-500.00`).
  - Edge cases: `NaN` and `Infinity` must gracefully fall back to `₦0.00`.
- **Rationale**: Grounded in the Nigerian university student demographic (UNILAG, UI, OAU, etc.).
- **Affected Components**: `src/utils/financeCalculations.ts`, all dashboard cards, budget cards, goal progress widgets.

---

### D03 — Transaction Lifecycle & Budget Eligibility Separation
- **Status**: `[APPROVED]` (Separation Principle) / `[UNRESOLVED]` (Lifecycle Semantics - See `DEC-003`)
- **Summary**: Transaction lifecycle status (`initiated`, `pending`, `settled`, `failed`, `reversed`) is conceptually and operationally distinct from budget eligibility (`is_budget_eligible`).
- **Specification**:
  - A transaction's existence or pending state does not automatically mean it debits a budget envelope.
  - Own-account transfers between a student's own accounts, wallet deposits, and peer split reimbursements must have `is_budget_eligible = false`.
  - Budget calculations must filter strictly for `type === 'expense'` and `is_budget_eligible !== false`.
- **Rationale**: Moving ₦20,000 from a savings bank account to a BMONI spendable wallet is an asset movement, not an expenditure. Counting it against a budget would create false alarms.
- **Affected Components**: `src/utils/financeCalculations.ts`, transaction ledger, budget calculation engine.

---

### D04 — Duplicate Prevention & Reconciliation
- **Status**: `[APPROVED]` / `[IMPLEMENTED]` (Idempotent Service Ingestion) / `[PLANNED]` (Reconciliation Flow - See `DEC-002`)
- **Summary**: The system must enforce idempotent ingestion of provider events using unique external references. Manual transactions and provider card transactions must never be automatically merged solely because amounts and dates match.
- **Specification**:
  - `createTransaction` inspects `external_reference`. If an event with the same reference exists, it returns the existing record without creating a duplicate.
  - No silent deduplication between manual and webhook transactions without explicit matching criteria.
- **Rationale**: When a student buys food with a virtual card, they might log it manually immediately. If the card webhook arrives later, automatically merging them without confirmation risks destroying student notes or corrupting records.
- **Affected Components**: `src/services/financeService.ts`, backend webhook receiver (`/api/webhooks/bmoni`).

---

### D05 — Strict Wallet Balance Isolation
- **Status**: `[APPROVED]` / `[IMPLEMENTED]` (Frontend & Calculations)
- **Summary**: The authoritative wallet balance represents spendable cash in the student's BMONI wallet. It is fetched directly from an authoritative balance service and **must never be calculated by subtracting budget category expenses from an assumed deposit**.
- **Specification**:
  - `Authoritative Balance` = Balance from provider/backend wallet query.
  - `Budget Remaining` = `Budget Limit - Eligible Category Expenses`.
  - They represent different financial concepts: one is spendable cash, the other is an envelope ceiling.
- **Rationale**: A student might have ₦50,000 spendable cash in their wallet, but ₦0 remaining in their Dining budget. Equating them leads to catastrophic overspending or false insolvency alarms.
- **Affected Components**: `src/components/dashboard/WalletCard.tsx`, `src/utils/financeCalculations.ts`.

---

### D06 — Calendar-Month Budget Periods in Nigerian Timezone
- **Status**: `[APPROVED]` / `[IMPLEMENTED]`
- **Summary**: The default budget period is the calendar month, calculated strictly under the **`Africa/Lagos`** timezone (UTC+1).
- **Specification**:
  - Month Start: `YYYY-MM-01 00:00:00` in Lagos.
  - Month End: `YYYY-MM-[LastDay] 23:59:59` in Lagos.
  - Uses `Intl.DateTimeFormat` with `timeZone: 'Africa/Lagos'` to prevent client browser drift.
  - Boundary verified: UTC `2026-10-31T22:59:59Z` is October 31 in Lagos; UTC `2026-10-31T23:00:00Z` is November 1 in Lagos.
- **Rationale**: Nigerian students operate on West Africa Time. A transaction at 11:30 PM on the last day of October in Lagos must not be evaluated as November due to UTC conversion errors.
- **Affected Components**: `src/utils/financeCalculations.ts`, budget progress queries.

---

### D07 — Shared Financial Service Boundary
- **Status**: `[APPROVED]` / `[IMPLEMENTED]` (In-Memory Implementation) / `[PLANNED]` (Backend Connection)
- **Summary**: All frontend views consume financial data through a consistent service interface (`IFinanceService`).
- **Specification**:
  - Provides uniform methods: `getWalletBalance()`, `getTransactions()`, `getBudgets()`, `getGoals()`, `createBudget()`, `updateBudget()`, `deleteBudget()`, `createTransaction()`, etc.
  - Enables clean transition from current mock state to future Supabase/Node.js endpoints with zero view refactoring.
- **Rationale**: Isolates UI presentation from underlying storage mechanics and enables continuous integration without backend blockers.
- **Affected Components**: `src/services/financeService.ts`, `src/App.tsx`, all feature pages.

---

### D08 — AI-Assisted Categorization & Shared Vocabulary
- **Status**: `[APPROVED]` (Assistive Model) / `[UNRESOLVED]` (Final Taxonomy & Thresholds - See `DEC-006`)
- **Summary**: AI may assist in categorizing expenses, but user corrections take absolute precedence. All application layers must share a unified category vocabulary.
- **Specification**:
  - AI provides suggestions; it never silently overrides user selections.
  - Ambiguous classifications require user confirmation.
- **Rationale**: Automated AI categorizers frequently misclassify localized campus expenses (e.g., classifying "Faculty Dues" as "Entertainment"). User authority preserves ledger integrity.
- **Affected Components**: Python AI categorization service, manual entry modal, transaction table.

---

### D09 — Backend-Enforced Data Ownership & Access Control
- **Status**: `[APPROVED]` / `[PLANNED]` (Supabase Provisioning)
- **Summary**: Multi-user data protection must be enforced at the database layer (e.g., PostgreSQL Row-Level Security). Frontend-only authorization checks are explicitly non-compliant.
- **Specification**:
  - Every table (`profiles`, `budgets`, `transactions`, `goals`) includes `user_id UUID NOT NULL REFERENCES auth.users(id)`.
  - Database RLS policies guarantee that `auth.uid() = user_id`.
  - Service credentials and BMONI API secrets must never be exposed to the client bundle.
- **Rationale**: Financial data is sensitive personal information. Client-side checks can be bypassed via API inspection or browser developer tools.
- **Affected Components**: Supabase migrations, Express backend routes, `.env` management.

---

### D10 — Reliable Post-Mutation View Updates
- **Status**: `[APPROVED]` / `[IMPLEMENTED]`
- **Summary**: Following any successful creation, update, or deletion of a transaction, budget, goal, or profile, affected frontend views must update immediately and reliably.
- **Specification**:
  - Immediate local state reconciliation or refetch upon Promise resolution.
  - Toast confirmation informs the user of operational success or failure.
  - Real-time WebSocket subscriptions are optional enhancements, not prerequisites.
- **Rationale**: Students must have immediate confirmation that their spending record or budget modification was saved.
- **Affected Components**: `src/App.tsx`, `src/components/shared/Toast.tsx`, all modal handlers.

---

### D11 — Responsive Application Shell & Navigation
- **Status**: `[APPROVED]` / `[IMPLEMENTED]`
- **Summary**: The application shell provides a consistent, responsive 5-destination layout:
  1. **Home** (`dashboard`)
  2. **Budgets** (`budgets`)
  3. **Transactions** (`transactions`)
  4. **Goals** (`goals`)
  5. **AI Assistant** (`ai-assistant`)
- **Specification**:
  - Desktop: Persistent left sidebar navigation.
  - Mobile: Dedicated bottom navigation bar with 44px minimum touch targets.
  - Header: Profile view/edit trigger and active notification bell with unread badge counter.
- **Rationale**: Ensures complete feature parity across mobile smartphones (primary student access device) and desktop laptops (study sessions).
- **Affected Components**: `src/components/layout/*`, `src/App.tsx`.

---

### D12 — Demo/Live Separation & Minimum Integration Testing
- **Status**: `[APPROVED]` / `[IMPLEMENTED]`
- **Summary**: The application must strictly distinguish mock demonstration data from authenticated live data. Minimum integration testing standards must verify all financial rules.
- **Specification**:
  - Demo mode must be explicit (`WalletCard` displays demo rails notice; no fabricated live BMONI sync).
  - Automated test suite must assert D01–D07, Rules 8.B & 8.C, duplicate handling, and timezone boundaries.
- **Rationale**: Prevents accidental misrepresentation of prototype capabilities to stakeholders, students, and regulatory review.
- **Affected Components**: `src/components/dashboard/WalletCard.tsx`, `scripts/verify-financial-correctness.ts`.

---

## 2. Unresolved Decisions Register (DEC-001 – DEC-007)

The following decisions remain **unresolved** pending formal project owner approval. Engineers must **NOT** unilaterally implement assumptions to fill these gaps.

| Decision ID | Topic | Current Approved Baseline | Unresolved Question | Impact & Affected Boundaries | Clarification / Evidence Required | Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`DEC-001`** | **Internal Monetary Storage Unit** | NGN currency symbol and 2-decimal presentation approved (`D02`). | Whether database columns and backend APIs store currency as integer kobo minor units (`BIGINT`) or decimal Naira (`NUMERIC(12, 2)`). | Database schema migrations, API serializers, arithmetic roundoff handling in calculations. | Explicit project owner sign-off on database column types and API payload conventions. | `[UNRESOLVED]`<br>`[BLOCKED for DB]` |
| **`DEC-002`** | **Manual / Provider Card Reconciliation** | No silent automatic merging solely on date/amount (`D04`). | Exact reconciliation workflow: automated suggestion prompt, manual merge queue, or dual-entry reconciliation drawer. | Frontend Developer B transaction list, Node.js deduplication logic, student UX. | Product owner approval of reconciliation user story and matching threshold criteria. | `[UNRESOLVED]`<br>`[BLOCKED for Live]` |
| **`DEC-003`** | **Transaction Lifecycle Budget Eligibility** | Lifecycle status separated from eligibility flag (`D03`). | Do pending card authorizations debit budgets immediately or upon settlement? How are failed payments, refunds, and reversals treated? | Budget utilization accuracy, overdraft calculations, ledger accounting rules. | Financial accounting policy approval from product owner. | `[UNRESOLVED]`<br>`[BLOCKED for Live]` |
| **`DEC-004`** | **Interim Demo Persistence Strategy** | In-memory singleton state currently operating (`D07`). | Should unauthenticated prototype mutations persist to browser `localStorage` or remain volatile in-memory during demonstrations? | Frontend user experience during browser refresh, prototype data reset workflows. | Owner decision on hackathon/demo persistence expectations. | `[UNRESOLVED]`<br>`[IN-MEMORY ONLY]` |
| **`DEC-005`** | **BMONI Provider Token Semantics** | BMONI is currently not integrated; zero live credentials (`D12`). | Verifying whether BMONI's Nigerian sandbox payloads use minor units (kobo), standard Naira, or specialized token vouchers. | Node.js BMONI client, payload parsing, currency exchange safeguards. | Inspection of official BMONI sandbox response bodies and API contract confirmation. | `[UNRESOLVED]`<br>`[BLOCKED for BMONI]` |
| **`DEC-006`** | **Final Category Taxonomy & AI Confidence** | Shared vocabulary required (`D08`); user corrections take absolute precedence. | The exhaustive, immutable category list, category icons, fallback mappings, and numerical AI confidence cut-offs (e.g., 0.85). | `TransactionCategory` type definition, AI classification model prompt, budget envelope categories. | Owner review and approval of standardized campus spending taxonomy. | `[UNRESOLVED]`<br>`[PROVISIONAL LIST]` |
| **`DEC-007`** | **Profile & Notification Persistence Workflows** | Header entry points approved (`D11`); in-memory modal & popover implemented. | Detailed multi-field validation, avatar upload storage, push notification triggers, and persistent unread status backend. | Supabase `profiles` & `notifications` tables, student onboarding flows. | Functional specification for full profile management and alert delivery. | `[UNRESOLVED]`<br>`[PROVISIONAL UI]` |
