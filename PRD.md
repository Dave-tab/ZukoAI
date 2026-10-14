# Zuko — Product Requirements Document (PRD)

---

## 1. Overview & Requirement Classification

This document provides testable functional requirements (`FR-xxx`) and acceptance criteria for all engineering contributors to Zuko, incorporating the project owner's approved cross-developer decisions (`D01`–`D12`).

### Requirement Status Legend:
- **`APPROVED`**: Explicitly approved by the project owner; must be strictly implemented or maintained.
- **`IMPLEMENTED - VERIFIED`**: Built in code and verified against Stitch design specifications.
- **`PLANNED`**: Approved for development; assigned to designated team members.
- **`PENDING OWNER DECISION`**: Identified architectural or business rule requiring explicit project owner approval.

---

## 2. Functional Requirements Matrix

### 2.1 Overview Dashboard & Financial Metrics

#### `FR-001` Authoritative Balance Card (D02, D05)
- **Status**: `APPROVED` / `IMPLEMENTED - VERIFIED` (Frontend UI) / `PLANNED` (Backend Integration)
- **Description**: The dashboard must display the user's available balance formatted in Nigerian Naira (`₦`) via a dedicated service boundary.
- **Inputs**: Authoritative balance value from verified ledger or BMONI wallet endpoint.
- **Acceptance Criteria**:
  1. Amount must display standard comma separators and two decimal places (e.g. `₦125,000.00`) using the Naira currency symbol `₦` (D02).
  2. The authoritative wallet balance must be obtained from an approved balance service and **never** calculated by subtracting budget spending from an assumed starting balance (D05).
  3. Anticipated/future income must not be added to current balance.
  4. Appropriate loading, error, and stale-data states must be supported without fabricating numbers.

#### `FR-002` Net Term Savings Rate Calculation
- **Status**: `IMPLEMENTED - VERIFIED`
- **Description**: Dashboard must calculate and display net savings and savings percentage for the current term.
- **Formula**: `Net Savings = Total Income - Total Expenses`; `Savings Rate = (Net Savings / Total Income) * 100`.
- **Acceptance Criteria**:
  1. Percentage must round cleanly to one decimal place.
  2. If Total Income is 0, savings rate must display `0%` without `NaN` or dividing by zero.

#### `FR-003` Spending Patterns & Analytics Chart
- **Status**: `IMPLEMENTED - VERIFIED`
- **Description**: Provide an interactive SVG chart displaying 7-day spending outlays and category share distributions.
- **Acceptance Criteria**:
  1. Switcher must toggle between Daily Outlay and Category Share without full-page reloads.
  2. Hovering over a daily bar must display a floating tooltip showing the exact Naira sum and date.
  3. Chart must scale dynamically to the peak expenditure day with dashed gridlines.

---

### 2.2 Navigation, Profile & Notifications (D11)

#### `FR-004` Shared Desktop and Mobile Navigation (D11)
- **Status**: `APPROVED` / `PLANNED` (Mobile Bar Enhancement)
- **Description**: Provide consistent access across desktop sidebar and dedicated mobile bottom navigation.
- **Acceptance Criteria**:
  1. Both desktop and mobile navigation must support exactly the 5 approved primary destinations:
     - **Home**
     - **Budgets**
     - **Transactions**
     - **Goals**
     - **AI Assistant**
  2. Mobile navigation must render as an accessible bottom-navigation bar with thumb-friendly icons and concise labels on mobile viewports.
  3. Active destination must highlight cleanly across both treatments.

#### `FR-005` Profile Access & Editing from Home (D11)
- **Status**: `APPROVED` / `PLANNED`
- **Description**: The Home view must provide a direct way for users to view and edit their student profile.
- **Acceptance Criteria**:
  1. Profile entry point is visible and accessible from the Home view header.
  2. Clicking opens the student profile view/edit interface.
  3. Note: Detailed multi-step editing workflow, field validation, and remote persistence remain subject to backend provisioning.

#### `FR-006` Notification Bell from Home (D11)
- **Status**: `APPROVED` / `PLANNED`
- **Description**: The Home view must provide an active notification bell icon.
- **Acceptance Criteria**:
  1. Notification bell is positioned prominently in the Home view header.
  2. Note: Unread badges, notification feed drawer, notification types, and push settings are pending detailed backend specification.

---

### 2.3 Budgets & Spending Limits (D03, D06, D10)

#### `FR-010` Truthful Budget Calculation & Negative Remaining
- **Status**: `APPROVED` / `IMPLEMENTED - VERIFIED`
- **Description**: Calculate budget utilization truthfully according to Rule 8.B.
- **Formula**: `Remaining = Budget Limit - Amount Spent`.
- **Acceptance Criteria**:
  1. If `Amount Spent > Budget Limit`, `Remaining` must be negative (e.g. `-₦500.00`).
  2. Underlying remaining calculation must never be clamped to zero.
  3. Visual progress bar must stop cleanly at 100% while highlighting a rose/red over-budget indicator.

#### `FR-011` Calendar-Month Budget Periods & Nigerian Timezone (D06)
- **Status**: `APPROVED` / `IMPLEMENTED - VERIFIED`
- **Description**: Budget cycles follow calendar months calculated under `Africa/Lagos` timezone boundaries.
- **Acceptance Criteria**:
  1. Budget period begins at 00:00:00 on the 1st day of the calendar month and concludes at 23:59:59 on the final day of that month in `Africa/Lagos` time.
  2. Date interpretation must not drift based on the developer or client browser's local timezone.
  3. Month transitions automatically evaluate new spending against the new month envelope.

#### `FR-012` Budget Limit Adjustment & Reliable Updates (D10)
- **Status**: `APPROVED` / `IMPLEMENTED - VERIFIED`
- **Description**: Allow students to adjust category spending caps with immediate reliable view refresh.
- **Acceptance Criteria**:
  1. Clicking the edit pen on a budget card opens the modal with pre-populated values.
  2. Saving updates the envelope limit immediately and reliably recalculates aggregate totals across all views without requiring page reloads (D10).

---

### 2.4 Central Transaction System & Data Integrity (D01, D03, D04, D07, D09)

#### `FR-030` Single Canonical Transaction Model (D01)
- **Status**: `APPROVED` / `PLANNED` (Node.js & Supabase Scope)
- **Description**: All transactions—manual entries, BMONI card authorizations, and bank transfers—must normalize into a canonical transaction model.
- **Acceptance Criteria**:
  1. Must explicitly distinguish: transaction source, transaction type, lifecycle status, amount, currency (`NGN`), transaction date, category, budget eligibility, and reconciliation identifiers.
  2. Sits behind a consistent financial service boundary (D07) accessible to all frontend views.

#### `FR-031` Own-Account Transfer & Deposit Isolation (D03)
- **Status**: `APPROVED` / `PLANNED`
- **Description**: Own-account deposits, withdrawals, and internal transfers must not automatically be treated as category expenses.
- **Acceptance Criteria**:
  1. Internal transfers between student's own accounts and wallet deposits must have `is_budget_eligible = false`.
  2. Budget spending queries must strictly filter for eligible expenses only.

#### `FR-032` Duplicate Prevention & Reconciliation (D04)
- **Status**: `APPROVED` / `PLANNED` (Node.js Scope)
- **Description**: Ingestion must enforce reliable duplicate prevention for provider events via external references and idempotent processing.
- **Acceptance Criteria**:
  1. Manual records and provider-sourced records must not be automatically merged solely because their amounts and dates look similar.
  2. The system must not silently count the same underlying financial activity twice.

#### `FR-033` Backend-Enforced User Ownership (D09)
- **Status**: `APPROVED` / `PLANNED` (Supabase Scope)
- **Description**: Multi-user financial records must be secured at the database layer.
- **Acceptance Criteria**:
  1. Row-Level Security (RLS) or database-level access control must prevent users from accessing or modifying another student's records by manipulating frontend requests.
  2. Frontend authorization checks alone are explicitly non-compliant.

---

### 2.5 Categorization & AI Integration (D08)

#### `FR-034` Assistive AI Categorization & Shared Vocabulary (D08)
- **Status**: `APPROVED` / `PLANNED` (Python & Dev B Scope)
- **Description**: AI may assist in assigning categories to raw transaction descriptions using a shared category vocabulary.
- **Acceptance Criteria**:
  1. AI categorization is assistive; user corrections take absolute precedence and must never be silently overridden.
  2. Categorization, budget definitions, transaction records, and summaries must use a shared, approved category vocabulary.

---

### 2.6 Demo vs. Live Data & Integration Testing Standards (D12)

#### `FR-050` Demo / Live Data Segregation
- **Status**: `APPROVED` / `IMPLEMENTED - VERIFIED` (Frontend)
- **Description**: Clearly distinguish demo/mock data from real persisted or provider-sourced data.
- **Acceptance Criteria**:
  1. Mock financial records must never be presented as authenticated live balances or transactions.
  2. UI badges (`AI Demo Model`, `Mock Data`) must clearly alert users when demo mode is active.

#### `FR-051` Minimum Integration Testing Standard (D12)
- **Status**: `APPROVED` / `PLANNED`
- **Description**: Implement a shared integration test suite verifying critical boundaries before production release.
- **Acceptance Criteria**:
  1. Test: Successful eligible expenses update the correct budget.
  2. Test: Manual expenses update the same budget calculation system.
  3. Test: Deposits and own-account transfers do not count as category spending.
  4. Test: Duplicate provider events are rejected idempotently.
  5. Test: Authoritative wallet balance remains separate from budget metrics.
  6. Test: Nigerian calendar-month boundaries calculate cleanly.
  7. Test: Tenant isolation prevents cross-user record access.

---

## 3. Preserved Unresolved Decisions Log

| Decision ID | Issue & Context | Current Status |
| :--- | :--- | :--- |
| **`DEC-001`** | **Canonical Monetary Storage Unit**<br>Whether database/API amounts are integer minor units (kobo) or decimal numeric. | **Unresolved** — Awaiting project owner decision. |
| **`DEC-002`** | **Manual vs. Provider Reconciliation Policy**<br>Specific matching algorithm and user confirmation flow for reconciling manual cash logs with subsequent card events. | **Unresolved** — Core principle approved (D04); matching policy awaiting approval. |
| **`DEC-003`** | **Transaction Lifecycle Budget Eligibility**<br>Specific accounting rules for pending authorizations, failed payments, refunds, and reversals. | **Unresolved** — Lifecycle separation approved (D03); exact eligibility rules awaiting approval. |
| **`DEC-004`** | **Interim Demo Persistence**<br>Whether unauthenticated frontend changes remain in-memory or cache to `localStorage` during hackathon demos. | **Unresolved** — Awaiting project owner decision. |
| **`DEC-005`** | **BMONI Provider Token Semantics**<br>Verifying BMONI payload currency, token asset types, and amount conventions against official sandbox. | **Unresolved** — Awaiting Node.js developer sandbox verification. |
| **`DEC-006`** | **Final Category Vocabulary & AI Confidence Rules**<br>Exhaustive list of categories, fallback mappings, and AI confidence thresholds. | **Unresolved** — Shared vocabulary approved (D08); detailed taxonomy awaiting approval. |
| **`DEC-007`** | **Profile Editing & Notification Persistence**<br>Detailed interaction workflows, notification types, unread state rules, and backend storage. | **Unresolved** — Header entry points approved (D11); detailed specs awaiting approval. |
