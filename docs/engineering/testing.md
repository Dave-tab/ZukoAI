# Zuko — Testing & Verification Specification

---

## 1. Testing Philosophy & Minimum Standards (`D12`, `FR-051`)

In financial software, automated testing is the primary bulwark against financial distortion, phantom accounting, and silent edge-case corruption.

### Core Testing Mandates:
1. **Evidence-Based Reporting**: Never claim a test passed unless it was explicitly executed and succeeded.
2. **Deterministic Verification**: Financial math calculations must be tested against precise edge cases (e.g. division by zero, negative amounts, timezone transitions).
3. **Distinguish Automated from Manual**: Clearly distinguish automated TypeScript assertions from manual browser visual checks.
4. **Document Blocked Tests**: Where business rules or lifecycle semantics remain unresolved (e.g., `DEC-003`), document the test scenario as blocked pending decision rather than guessing the expected outcome.

---

## 2. Existing Automated Test Suite (`npm run test:finance`)

The project includes a comprehensive, executable financial verification suite located at `scripts/verify-financial-correctness.ts`.

### 2.1 Execution Command
```bash
npm run test:finance
```

### 2.2 Test Suite Breakdown & Verification Results

| Suite # | Target Area & Approved Decision | Specific Test Assertions | Verified Status |
| :--- | :--- | :--- | :---: |
| **Suite 1** | **Africa/Lagos Month Boundaries (`D06`)** | - UTC `2026-10-31T22:59:59Z` resolves to October 31 in Lagos.<br>- UTC `2026-10-31T23:00:00Z` rolls over to November 1 in Lagos (UTC+1).<br>- October 31 23:59:59 Lagos transaction evaluates within active October month.<br>- November 1 00:00:00 Lagos transaction is excluded from October current month. | **PASS** (4/4) |
| **Suite 2** | **Budget Eligibility & Transfers (`D01`, `D03`)**| - Category spent only sums eligible expenses, ignoring transfers & non-eligible entries.<br>- Total expenses calculation strictly excludes own-account movements. | **PASS** (2/2) |
| **Suite 3** | **Truthful Budget Math (Rule 8.B)** | - Under-budget calculates remaining: ₦6,000, percentUsed: 70%, isOverBudget: false.<br>- Over-budget strictly preserves negative remaining (`-₦6,500.00`), never clamping to 0.<br>- Over-budget sets `isOverBudget = true` and calculates exact overAmount (₦6,500).<br>- Over-budget reflects true utilization percentage (`132.5%`). | **PASS** (4/4) |
| **Suite 4** | **Authoritative Wallet Isolation (`D05`)** | - Authoritative balance preserved at ₦125,000.00.<br>- Wallet balance is never derived by deducting planned budget envelope allocations.<br>- Ledger balance (150,000 - 12,000 = 138,000) tracked independently from spendable cash. | **PASS** (3/3) |
| **Suite 5** | **Goal Milestone Math (Rule 8.C)** | - Remaining gap accurately calculated (`350,000 - 140,000 = 210,000`).<br>- Percent complete evaluates cleanly (`40.0%`).<br>- Incomplete goal sets `isCompleted = false`.<br>- Days remaining accurately calculated to deadline (80 days).<br>- Exceeded goal caps percentComplete at 100% and remaining at 0.<br>- Zero target does not produce `NaN` or divide-by-zero error. | **PASS** (6/6) |
| **Suite 6** | **Idempotent Ingestion (`D04`, `FR-032`)** | - First transaction ingestion adds new record.<br>- Second ingestion with identical `external_reference` is rejected idempotently (count unchanged).<br>- Idempotent call returns original transaction reference. | **PASS** (3/3) |
| **Suite 7** | **Currency Representation (`D02`)** | - Positive amounts format with `₦` and 2 decimals (`₦150,000.00`).<br>- Whole naira formats without decimals when requested (`₦150,000`).<br>- Negative amounts preserve leading minus sign (`-₦5,400.50`).<br>- `NaN` gracefully falls back to `₦0.00`. | **PASS** (4/4) |

**Overall Verification Audit**: **26 PASSED, 0 FAILED** (Exit code 0).

---

## 3. Standard Verification Scripts Matrix

| Command | Tooling | Purpose | Execution Requirement |
| :--- | :--- | :--- | :--- |
| `npm run lint` | TypeScript (`tsc --noEmit`) | Validates complete codebase type safety and import integrity. | Mandatory before commit. |
| `npm run test:finance` | `tsx scripts/verify-financial-correctness.ts` | Executes the 26 automated financial correctness assertions. | Mandatory before commit. |
| `npm run build` | Vite (`vite build`) | Verifies production bundle compilation and tree-shaking. | Mandatory before staging. |

---

## 4. Blocked & Outstanding Test Scenarios

The following test suites cannot be executed in the current repository due to unresolved decisions or missing infrastructure:

1. **Database Row-Level Security Tenant Isolation Test (`FR-033`)**:
   - *Test Concept*: Student A attempts to query Student B's transactions using Student A's authenticated JWT.
   - *Status*: `[BLOCKED]` pending Supabase database provisioning and migration deployment.
2. **Live BMONI Webhook Signature & Replay Test**:
   - *Test Concept*: Transmit test payload signed with sandbox `BMONI_WEBHOOK_KEY` and verify HMAC validation.
   - *Status*: `[BLOCKED]` pending BMONI sandbox account provisioning.
3. **Refund & Chargeback Lifecycle Test (`DEC-003`)**:
   - *Test Concept*: Card authorization debits budget; subsequent chargeback reverses expenditure.
   - *Status*: `[BLOCKED]` pending explicit owner decision on `DEC-003` (Transaction Lifecycle Semantics).
4. **Manual / Card Reconciliation Matching Test (`DEC-002`)**:
   - *Test Concept*: Manual cash log matches incoming webhook; prompts student to confirm link.
   - *Status*: `[BLOCKED]` pending explicit owner approval of reconciliation user flow (`DEC-002`).
