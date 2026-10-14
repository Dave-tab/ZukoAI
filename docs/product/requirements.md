# Zuko — Product & User Experience Requirements

This document specifies the testable functional requirements (`FR-xxx`) and user experience standards approved for Project Zuko, incorporating decisions `D01`–`D12` and the approved Home Dashboard architecture.

---

## 1. Approved Home Dashboard Requirements

The following 21 requirements constitute the approved specification for the Home / Overview Dashboard experience:

| # | Requirement | Specification & Behavioral Details | Status |
| :--- | :--- | :--- | :--- |
| **1** | **Greeting Placement** | Plain text greeting rendered outside and above any container card directly below top bar. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **2** | **Student Identity Context** | Time-aware greeting (`"Welcome back, [First Name] 👋"`) utilizing student's real profile name. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **3** | **Quick Actions Cluster** | Action buttons directly below/aligned with greeting: `"+ New Budget"` and `"+ New Goal"`, plus `"Ask Zuko"`. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **4** | **Wallet Card Theme** | Compact, visually rich emerald/dark-green gradient card (`from-slate-900 via-emerald-950 to-slate-900`). | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **5** | **Authoritative Balance Source** | Displays the actual balance supplied by the balance service boundary (`D05`). | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **6** | **Balance Privacy Mask** | Eye toggle button allows student to show or mask the numeric balance (`₦••••••••`). | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **7** | **Demo Indicator** | Demo wallet state clearly noted; no claims of live BMONI banking connectivity (`D12`). | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **8** | **No Invented Provider Data** | No fabricated card numbers, invented bank routing numbers, or fake live sync animations. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **9** | **3 Financial Summary Metrics** | 3 compact summary cards: Monthly Income, Monthly Expenses, and Net Term Savings. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **10** | **Truthful Metric Labeling** | Net savings/cash flow is **never** labeled as "remaining budget" or "spendable cash". | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **11** | **Contextual Zuko Insight** | Exactly one concise, high-priority insight card rendered from verified insight records. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **12** | **Ask Zuko Modal Trigger** | Quick interaction button opens the floating Ask Zuko modal with pre-seeded context. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **13** | **Minimal Goal Snapshot Widget** | Renders top active goal with name, percent complete, current saved, and target amount. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **14** | **Goal Widget Navigation** | Clicking the header or snapshot widget navigates directly to the full Goals page. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **15** | **Empty Goal Fallback** | If no goals exist, renders an inviting empty milestone card with `"Set First Milestone"` CTA. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **16** | **Budget Health Preview Cap** | Preview displays no more than 2 category envelopes on mobile and 3–4 on desktop. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **17** | **Budgets View All Action** | Direct `"Manage →"` or `"View All"` link in budget header opens the full Budgets page. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **18** | **Recent Transactions Cap** | Recent feed displays no more than 3 transactions on mobile and 5–6 on desktop. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **19** | **Ledger View All Action** | Direct `"Full Ledger →"` link opens the complete Transactions history view. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **20** | **Spending Chart Placement** | Large spending chart is removed from hero and placed in dedicated analytics section. | `[APPROVED]`<br>`[IMPLEMENTED]` |
| **21** | **Mobile-First Ergonomics** | Viewport layout eliminates horizontal clipping, respects bottom nav, touch targets >= 44px. | `[APPROVED]`<br>`[IMPLEMENTED]` |

---

## 2. Functional Requirements Matrix (`FR-xxx`)

### 2.1 Overview Dashboard & Financial Metrics

#### `FR-001` Authoritative Balance Card
- **Approval Status**: `[APPROVED]` (`D02`, `D05`)
- **Implementation Status**: `[IMPLEMENTED]` (Frontend UI) / `[PLANNED]` (Backend Connection)
- **Description**: Displays student spendable cash formatted in Nigerian Naira (`₦`) via `IFinanceService.getWalletBalance()`.
- **Acceptance Criteria**:
  1. Formats with standard comma grouping and two decimal places (e.g., `₦125,000.00`).
  2. Never calculated by deducting planned budget envelope allocations from an assumed starting balance.
  3. Preserves show/hide eye mask state.
  4. Surfaces appropriate loading, empty, and simulated verification states without fabricating numbers.

#### `FR-002` Net Term Savings Rate Calculation
- **Approval Status**: `[APPROVED]`
- **Implementation Status**: `[IMPLEMENTED]`
- **Description**: Calculates net savings and savings percentage across the active evaluation period.
- **Formulas**:
  - `Net Savings = Total Income - Total Eligible Expenses`
  - `Savings Rate = (Net Savings / Total Income) * 100` (rounded to 1 decimal place)
- **Acceptance Criteria**:
  1. If `Total Income = 0`, savings rate displays `0.0%` (never `NaN` or divide-by-zero error).
  2. Negative net savings displays with leading minus sign (e.g. `-₦5,400.00`) and reflects a `0.0%` savings rate.

#### `FR-003` Spending Analytics & Distribution Chart
- **Approval Status**: `[APPROVED]`
- **Implementation Status**: `[IMPLEMENTED]`
- **Description**: Interactive chart toggling between 7-day daily expenditure outlays and category share distributions.
- **Acceptance Criteria**:
  1. Toggle between Daily Outlay and Category Share occurs smoothly in client state.
  2. Hovering over daily bars displays tooltip with date and exact Naira figure.
  3. Bar tracks use structured rounding (`rounded-md` / `rounded-t-xl`) conforming to zero-pill discipline.
  4. Empty states display helpful fallback notices if expenses are zero.

---

### 2.2 Navigation, Profile & Notifications (`D11`)

#### `FR-004` Shared Desktop & Mobile Navigation
- **Approval Status**: `[APPROVED]` (`D11`)
- **Implementation Status**: `[IMPLEMENTED]`
- **Description**: 5 primary application destinations accessible across desktop sidebar and mobile bottom navigation:
  1. **Home** (`dashboard`)
  2. **Budgets** (`budgets`)
  3. **Transactions** (`transactions`)
  4. **Goals** (`goals`)
  5. **AI Assistant** (`ai-assistant`)
- **Acceptance Criteria**:
  1. Navigation state is synchronized across viewport resizes.
  2. Mobile bottom bar uses minimum 44px touch targets with active destination indicator.
  3. Desktop sidebar includes university academic context and student profile footer.

#### `FR-005` Student Profile Access & Editing
- **Approval Status**: `[APPROVED]` (`D11`)
- **Implementation Status**: `[IMPLEMENTED]` (In-Memory Modal) / `[UNRESOLVED]` (Persistence - See `DEC-007`)
- **Description**: Top header avatar button opens a student profile modal allowing view and update of name, university, major, and matriculation number.
- **Acceptance Criteria**:
  1. Clicking top header avatar opens the profile modal.
  2. Saving updates the profile in the shared service and triggers an immediate toast confirmation (`D10`).

#### `FR-006` Notification Bell & Feed Popover
- **Approval Status**: `[APPROVED]` (`D11`)
- **Implementation Status**: `[IMPLEMENTED]` (In-Memory Popover) / `[UNRESOLVED]` (Backend Feed - See `DEC-007`)
- **Description**: Top header notification bell with active unread badge counter opening an alert list.
- **Acceptance Criteria**:
  1. Unread count badge highlights when unread items exist; hides when count is 0.
  2. Clicking notification marks item as read; "Mark all as read" clears all badges.

---

### 2.3 Budgets & Spending Limits (`D03`, `D06`, `D10`)

#### `FR-010` Truthful Budget Calculation & Negative Remaining
- **Approval Status**: `[APPROVED]` (Rule 8.B)
- **Implementation Status**: `[IMPLEMENTED]`
- **Description**: Calculates category budget consumption truthfully without clamping over-budget values.
- **Formulas**:
  - `Remaining = Limit - Spent`
  - `IsOverBudget = Spent > Limit`
  - `OverAmount = max(0, Spent - Limit)`
  - `PercentUsed = Limit > 0 ? (Spent / Limit) * 100 : (Spent > 0 ? 100 : 0)`
- **Acceptance Criteria**:
  1. Over-budget state preserves negative remaining (e.g., limit ₦20,000, spent ₦26,500 ➔ remaining `-₦6,500.00`).
  2. Progress bar stops at 100% width with rose alert styling, but text displays true `132.5%` utilization.

#### `FR-011` Calendar-Month Budgets in Nigerian Timezone
- **Approval Status**: `[APPROVED]` (`D06`)
- **Implementation Status**: `[IMPLEMENTED]`
- **Description**: Budget cycles follow calendar months under `Africa/Lagos` timezone boundaries.
- **Acceptance Criteria**:
  1. Evaluated using `Intl.DateTimeFormat` with `timeZone: 'Africa/Lagos'`.
  2. Month boundary rollover occurs precisely at midnight West Africa Time.

#### `FR-012` Budget Limit Adjustment & Reliable Updates
- **Approval Status**: `[APPROVED]` (`D10`)
- **Implementation Status**: `[IMPLEMENTED]`
- **Description**: Creating, editing, or deleting a budget limit updates all application views immediately with toast feedback.

---

### 2.4 Financial Goals & Milestones (Rule 8.C)

#### `FR-020` Goal Progress & Remaining Gap
- **Approval Status**: `[APPROVED]` (Rule 8.C)
- **Implementation Status**: `[IMPLEMENTED]`
- **Description**: Tracks milestone target amount, current accumulated funds, remaining gap, and days remaining.
- **Formulas**:
  - `RemainingAmount = max(0, TargetAmount - CurrentAmount)`
  - `PercentComplete = TargetAmount > 0 ? min(100, (CurrentAmount / TargetAmount) * 100) : 100`
- **Acceptance Criteria**:
  1. Never implies that accumulated funds are physically segregated or locked from the student's spendable wallet.
  2. Zero-target edge cases display 100% without `NaN` or zero-division errors.

#### `FR-021` Goal Contributions & Status Management
- **Approval Status**: `[APPROVED]`
- **Implementation Status**: `[IMPLEMENTED]`
- **Description**: Students can record contributions, edit target dates, pause goals, or delete completed milestones with immediate view updates.

---

### 2.5 Central Transactions & Data Integrity (`D01`, `D03`, `D04`, `D09`)

#### `FR-030` Single Canonical Transaction Model
- **Approval Status**: `[APPROVED]` (`D01`)
- **Implementation Status**: `[IMPLEMENTED]` (TypeScript Domain Model) / `[PLANNED]` (Database Schema)
- **Description**: All transaction sources normalize into the canonical data structure defined in `src/types/finance.ts`.

#### `FR-031` Transfer & Deposit Isolation
- **Approval Status**: `[APPROVED]` (`D03`)
- **Implementation Status**: `[IMPLEMENTED]`
- **Description**: Internal transfers and wallet deposits have `is_budget_eligible = false` and are excluded from budget expenditures.

#### `FR-032` Duplicate Prevention & Idempotent Ingestion
- **Approval Status**: `[APPROVED]` (`D04`)
- **Implementation Status**: `[IMPLEMENTED]` (Service Level) / `[PLANNED]` (Database Unique Constraint)
- **Description**: Duplicate provider events bearing an identical `external_reference` are rejected idempotently, returning the existing record without ledger duplication.

#### `FR-033` Backend-Enforced User Ownership
- **Approval Status**: `[APPROVED]` (`D09`)
- **Implementation Status**: `[PLANNED]` (Supabase Provisioning)
- **Description**: User isolation enforced at database layer via Row-Level Security. Frontend-only checks are strictly non-compliant.

---

### 2.6 AI Assistant & Intelligence (`D08`)

#### `FR-040` Assistive AI Categorization & Shared Vocabulary
- **Approval Status**: `[APPROVED]` (`D08`)
- **Implementation Status**: `[PLANNED]` (Python Service) / `[PROVISIONAL VOCABULARY]` (Frontend Types)
- **Description**: AI assists categorization; user manual choices take absolute precedence. Shared taxonomy across all tiers.

#### `FR-041` Floating Ask Zuko Modal & Viewport Isolation
- **Approval Status**: `[APPROVED]`
- **Implementation Status**: `[IMPLEMENTED]`
- **Description**: Quick interaction modal renders smoothly on mobile and desktop, traps focus, handles Escape and backdrop dismissal, and prevents page scroll leaks while open.

---

### 2.7 Demo vs. Live Data Segregation (`D12`)

#### `FR-050` Explicit Demo State & Truthful Disclaimers
- **Approval Status**: `[APPROVED]` (`D12`)
- **Implementation Status**: `[IMPLEMENTED]`
- **Description**: Prototype clearly informs users that wallet rails are simulated and live BMONI banking is not yet connected.

#### `FR-051` Minimum Integration Testing Standard
- **Approval Status**: `[APPROVED]` (`D12`)
- **Implementation Status**: `[IMPLEMENTED]` (Automated Suite: `npm run test:finance` — 26 Passed)
- **Description**: Automated test suite validates financial math, eligibility, duplicate handling, timezone boundaries, and wallet isolation.
