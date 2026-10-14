# Zuko — Student Financial Intelligence

> **AI-powered financial management and awareness assistant tailored for university students.**  
> Transforming confusing banking notifications, unrecorded cash expenses, and irregular allowance streams into actionable campus spending intelligence, visual budget envelopes, and milestone savings momentum.

---

## 1. Product Vision, Purpose & Demographic

University students in emerging markets—beginning in Nigeria (UNILAG, UI, OAU, etc.)—face unique financial realities:
- **Irregular Allowance Streams**: Monthly or irregular family stipends that often evaporate within the first 10 days of receipt.
- **Unrecorded Cash Micro-Expenses**: Crucial off-campus cash movements (campus shuttles/keke, photocopy centers, canteens, faculty dues) rarely appear in standard banking apps.
- **Milestone Anxiety**: Looming deadlines for departmental lab manuals, textbooks, hostel deposits, and project fees.
- **False Balance Perception**: Mistaking total bank balance for spendable allowance, ignoring committed upcoming expenses.

**Zuko** solves this by providing:
1. **Unified Financial Visibility**: Real-time spendable wallet balance, monthly income, total expenses, and net term savings rate.
2. **Calendar-Month Category Budgeting**: Envelopes evaluated under the Nigerian timezone (`Africa/Lagos`) with truthful negative remaining calculation (Rule 8.B).
3. **Goal Milestone Momentum**: Savings milestone tracking with deadline countdowns without falsely implying physical funds segregation (Rule 8.C).
4. **Multi-Source Transaction Recording**: Normalization of manual cash entries, virtual cards, and bank transfers into a canonical transaction model (`D01`).
5. **Contextual AI Financial Intelligence**: Assistive pattern alerts and merchant categorization where student corrections take absolute precedence (`D08`).

---

## 2. Product Boundary & Operating Charter

- **Financial Intelligence, NOT Execution**: Zuko is an **information and awareness assistant**. It is **not** a bank, payment processor, money transmitter, or custodian of funds.
- **Non-Goals**: Zuko does not execute bank wire transfers, custody student deposits, trade cryptocurrencies, scrape traditional bank passwords, or calculate commercial credit scores.
- **Demo Mode Disclosure (`D12`)**: The application currently operates in **Demo Mode** using an in-memory financial service (`src/services/financeService.ts`). **BMONI banking rails are NOT yet connected.** All figures are simulated demonstration data.

---

## 3. Confirmed Technology Stack

Verified directly from repository configuration and code:

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.0.1` | Declarative UI component tree & hooks |
| **Type System** | TypeScript | `^7.0.2` | Static typing, interface contracts & compile safety |
| **Build & Bundler** | Vite | `^8.3.0` | Fast local dev server & production bundling |
| **Styling Engine** | Tailwind CSS | `^4.3.3` | Utility styling conforming to Zero-Pill Discipline |
| **Iconography** | Lucide React | `^0.546.0` | Consistent semantic UI icons |
| **Motion & Animation** | Motion | `^12.23.24` | Smooth transitions and state animations |
| **Backend Utilities** | Express & dotenv | `^4.21.2` / `^17.2.3` | Server-side endpoints & environment handling |
| **AI SDK** | `@google/genai` | `^2.4.0` | Google Gemini API TypeScript SDK |
| **Test Execution** | TSX | `^4.21.0` | TypeScript execution engine for test scripts |

---

## 4. High-Level Architecture & Modules

```
┌────────────────────────────────────────────────────────────────────────┐
│                     REACT 19 FRONTEND CLIENT (SPA)                     │
│  - AppLayout: Desktop Sidebar & Mobile Bottom Navigation (D11)         │
│  - Overview Dashboard (Home): WalletCard, KPIs, Charts, Goal Snapshot │
│  - Budgets Page: Category Envelopes, Progress Gauges, Creation Modals  │
│  - Transactions Page: Filterable Canonical Ledger & Manual Entry Modal │
│  - Goals Page: Milestone Cards, Accumulation Meters, Contributions     │
│  - AI Assistant Page & Floating Ask Zuko Modal (Contextual Advisor)    │
│  - Shared Service Layer: IFinanceService (D07)                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (REST)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   NODE.JS BACKEND (SUPABASE - TARGET)                  │
│  - PostgreSQL Database with Row-Level Security (D09)                   │
│  - BMONI Wallet API Client & Webhook Receiver (D04, D05)               │
│  - Canonical Transaction Storage & User Isolation                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ RPC / Hooks
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   PYTHON AI SERVICE (TARGET EXTENSION)                 │
│  - Assistive Categorization & Shared Category Taxonomy (D08)           │
│  - Receipt OCR Parsing & Financial Velocity Insights                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Main Financial Correctness Principles

Every calculation in Zuko is governed by strict mathematical honesty:

1. **One Canonical Transaction Model (`D01`)**: All entries normalize into a unified schema tracking source, type, status, amount, date, category, and budget eligibility.
2. **Approved Currency (`D02`)**: Standardized on Nigerian Naira (`NGN`, `₦`). Negative amounts preserve a leading minus sign (e.g. `-₦5,400.50`).
3. **Transaction Lifecycle vs. Eligibility (`D03`)**: Lifecycle status is distinct from budget eligibility. Own-account transfers and wallet deposits have `is_budget_eligible = false`.
4. **Strict Wallet Balance Isolation (`D05`)**: The authoritative spendable balance is fetched from the wallet service and **never** derived by deducting budget category expenses from an assumed starting balance.
5. **Africa/Lagos Month Boundaries (`D06`)**: Budget cycles evaluate under the `Africa/Lagos` timezone (UTC+1) to prevent client browser drift.
6. **Truthful Over-Budget Remaining (Rule 8.B)**: Over-budget spending preserves the true negative balance (`Remaining = Limit - Spent`). Visual progress bars stop at 100%, but values are never clamped to zero.
7. **Goal Progress Without Phantom Vaults (Rule 8.C)**: Accumulated savings record milestone progress without implying that funds are locked away from the student's spendable cash.
8. **Duplicate Ingestion Prevention (`D04`, `FR-032`)**: Provider events are processed idempotently by unique `external_reference`.

---

## 6. Security & Data Ownership Mandate (`D09`)

- **Backend-Enforced Ownership**: User data isolation must be enforced at the database level (e.g., PostgreSQL Row-Level Security). Frontend-only checks are non-compliant.
- **Zero Client Secrets**: BMONI private keys, webhook secrets, and database service keys must reside exclusively in server-side environment variables.
- **Credential Storage**: Client environment variables (`VITE_*`) must never contain private keys.

---

## 7. Developer Ownership & Responsibilities

| Role | Primary Assigned Scope | Interface Boundaries |
| :--- | :--- | :--- |
| **Frontend Developer A** | Overview Dashboard, Budgets, Goals, Shared Layout, Financial Math, Toast System, Test Suite | Consumes `IFinanceService` (`D07`); maintains UI consistency & zero-pill discipline |
| **Frontend Developer B** | Manual Expense Entry Modal, Transaction History Ledger Table, AI Chatbot Shell | Supplies `AddExpenseModal` & full ledger view; shares canonical types |
| **Full-Stack Node.js Developer** | Supabase Database, RLS Migrations (`D09`), BMONI Server Client (`D05`), Webhook Receiver (`D04`) | Exposes authenticated REST endpoints; guarantees tenant isolation |
| **Full-Stack Python Developer** | AI Categorization Engine (`D08`), Receipt OCR Extraction, Velocity Algorithms | Interfaces via shared category taxonomy; maintains student context privacy |

---

## 8. Local Setup & Verification Instructions

### 8.1 Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **Package Manager**: `npm` (or `bun`)

### 8.2 Installation & Startup
```bash
# 1. Clone repository
git clone <repo-url>
cd zuko

# 2. Install verified dependencies
npm install

# 3. Configure local environment (copy template)
cp .env.example .env

# 4. Start local development server (Port 3000)
npm run dev
```

### 8.3 Verification Commands
```bash
# Run TypeScript compilation check (0 errors required)
npm run lint

# Run automated financial correctness test suite (26 assertions)
npm run test:finance

# Verify production bundle build
npm run build
```

---

## 9. Master Documentation Directory

For complete specifications, architectural blueprints, and decision records, consult the authoritative documentation library:

| Document | File Path | Scope & Contents |
| :--- | :--- | :--- |
| **Documentation Index** | [`docs/index.md`](./docs/index.md) | Master documentation navigation and role-based reading guide |
| **Decision Register** | [`docs/decisions/decision-register.md`](./docs/decisions/decision-register.md) | Approved Decisions (`D01`–`D12`) and Unresolved Register (`DEC-001`–`DEC-007`) |
| **Product Overview** | [`docs/product/overview.md`](./docs/product/overview.md) | Mission, user personas, problem space, capabilities, and non-goals |
| **Product Requirements**| [`docs/product/requirements.md`](./docs/product/requirements.md) | Functional requirements (`FR-xxx`) and 21 Home Dashboard specifications |
| **System Architecture** | [`docs/architecture/overview.md`](./docs/architecture/overview.md) | Component topology, transaction pipelines, and target infrastructure |
| **Data & Service Contracts**| [`docs/architecture/data-and-service-contracts.md`](./docs/architecture/data-and-service-contracts.md) | Canonical models, TypeScript interfaces, and proposed SQL schemas |
| **Security & Access Control**| [`docs/architecture/security-and-access-control.md`](./docs/architecture/security-and-access-control.md) | RLS policies, credential isolation, and webhook cryptographic verification |
| **Financial Rules & Math**| [`docs/finance/financial-rules.md`](./docs/finance/financial-rules.md) | Monetary math, Lagos month boundaries, budget formulas, and ledger rules |
| **AI Assistant Spec** | [`docs/ai/ai-assistant.md`](./docs/ai/ai-assistant.md) | Assistive categorization, shared vocabulary, insights, and modal standards |
| **BMONI Integration** | [`docs/integrations/bmoni.md`](./docs/integrations/bmoni.md) | Integration status (Unintegrated), webhook verification, and sandbox criteria |
| **Engineering Standards** | [`docs/engineering/standards.md`](./docs/engineering/standards.md) | Zero-pill discipline, UI states, mobile ergonomics, and production readiness |
| **Testing Specification**| [`docs/engineering/testing.md`](./docs/engineering/testing.md) | Test suite breakdown, coverage audit, and blocked test scenarios |
| **Developer Handoff** | [`docs/team/developer-handoff.md`](./docs/team/developer-handoff.md) | Ownership matrix, 6-stage governance workflow, and onboarding checklist |

---

## 10. Known Implementation Gaps & Open Decisions

Before extending the codebase, contributors must be aware of the following open blockers:
- **`DEC-001`**: Canonical monetary storage unit (integer kobo vs decimal numeric).
- **`DEC-002`**: Manual cash entry vs card webhook reconciliation workflow.
- **`DEC-003`**: Transaction lifecycle accounting for pending authorizations, failed payments, and refunds.
- **`DEC-004`**: Interim prototype persistence strategy (in-memory vs `localStorage`).
- **`DEC-005`**: BMONI sandbox token semantics and amount conventions.
- **`DEC-006`**: Exhaustive category taxonomy and AI confidence thresholds.
- **`DEC-007`**: Detailed multi-step profile editing and notification persistence workflows.
- **BMONI Integration**: Live BMONI client and webhook receiver are not yet implemented.
- **Supabase Persistence**: Database migrations and Row-Level Security policies are not yet deployed.
