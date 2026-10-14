# Zuko — Developer Ownership & Handoff Specification

---

## 1. Team Ownership Matrix & Division of Work

Zuko is developed collaboratively across specialized engineering disciplines. To prevent interface breakage, merge conflicts, and architectural drift, work is strictly partitioned:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND DEVELOPER A                            │
│  - Overview Dashboard Experience (Home)                                │
│  - Budgets & Spending Limits Page & Modals                             │
│  - Financial Goals Milestone Page & Modals                             │
│  - Shared Application Shell (Desktop Sidebar & Mobile Bottom Nav - D11)│
│  - Header Utility (Profile View/Edit & Notification Bell - D11)        │
│  - Central Financial Service Interface (IFinanceService - D07)        │
│  - Deterministic Math Utilities & Africa/Lagos Time Engine (D02, D06)   │
│  - Central Toast Notification & Reliability State System               │
│  - Automated Financial Correctness Test Suite (D12)                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Interface Contracts
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND DEVELOPER B                            │
│  - Manual Expense Entry Modal Form (AddExpenseModal)                   │
│  - Full Filterable Transaction History Ledger View                     │
│  - AI Conversational Chatbot UI Interface Shell                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Data Queries & Webhooks
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FULL-STACK NODE.JS DEVELOPER                       │
│  - Supabase Database Provisioning & PostgreSQL Migrations              │
│  - Backend-Enforced User Ownership & Row-Level Security (D09)          │
│  - Server-Side BMONI REST Client & Balance Endpoint (D05, D07)         │
│  - Cryptographic Webhook Receiver with HMAC-SHA256 Verification        │
│  - Idempotent Transaction Ingestion Pipeline (D04, FR-032)             │
│  - Post-Mutation Reliable Refresh Notifications (D10)                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Event Hook & Categorization
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FULL-STACK PYTHON DEVELOPER                        │
│  - Assistive Transaction Categorization Engine (D08)                   │
│  - Shared Category Taxonomy Mapping & Confidence Scoring               │
│  - Paper Receipt OCR & Text Extraction Pipeline                        │
│  - Contextual Financial Insight Generation Algorithms                  │
│  - BMONI Sandbox Research & Payload Verification                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 6-Stage Governance Sequence

All non-trivial engineering work, cross-team modifications, or changes to shared models must follow the project's established governance workflow:

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌───────────┐     ┌──────────┐     ┌─────────┐
│ INSPECT  │ ──> │  REVIEW  │ ──> │  APPROVE  │ ──> │  EXECUTE  │ ──> │  VERIFY  │ ──> │  CLOSE  │
└──────────┘     └──────────┘     └───────────┘     └───────────┘     └──────────┘     └─────────┘
```

1. **INSPECT**:
   - Audit actual current repository files, existing documentation, and current dependencies.
   - Never assume prior reports or assumed structures describe current code.
2. **REVIEW**:
   - Identify proposed changes, dependencies, risks, and any open decisions (`DEC-001`–`DEC-007`).
   - Define exact integration boundaries and interface contracts.
3. **APPROVE**:
   - Obtain explicit authorization from the project owner for scope, data model changes, or financial rules.
   - Do not proceed with assumptions on unresolved decisions.
4. **EXECUTE**:
   - Implement strictly within the approved boundary.
   - Do not refactor unrelated pages or rewrite working code.
5. **VERIFY**:
   - Run type checks (`npm run lint`), build checks (`npm run build`), and the automated financial test suite (`npm run test:finance`).
   - Document actual observed results.
6. **CLOSE**:
   - Deliver clear summary covering changes, verification evidence, remaining blockers, and next steps.

---

## 3. Staged Development History & Milestone Audit

| Stage | Focus Area | Status | Verified Deliverables & Evidence |
| :---: | :--- | :---: | :--- |
| **Stage 1** | **Shared Types & Mock Service** | `[IMPLEMENTED]` | Defined canonical types in `src/types/finance.ts` and initial mock state in `src/services/financeService.ts`. |
| **Stage 2** | **Application Shell & Navigation**| `[IMPLEMENTED]` | Built responsive 5-destination shell: `Sidebar.tsx` (desktop) and `MobileBottomNav.tsx` (mobile) per `D11`. |
| **Stage 3** | **Profile & Notifications** | `[IMPLEMENTED]` | Added header entry points: `ProfileModal.tsx` and `NotificationsPopover.tsx` per `D11`. |
| **Stage 4** | **Dashboard & Budgets Integration**| `[IMPLEMENTED]` | Implemented Home overview dashboard and category budgets page synchronized with `financeService`. |
| **Stage 5** | **Goals Review & Completion** | `[IMPLEMENTED]` | Audited and completed `GoalsPage.tsx`, `GoalCard.tsx`, `GoalForm.tsx`, and milestone progress math. |
| **Stage 6** | **Transactions & AI Integration** | `[IMPLEMENTED]` | Coordinated boundaries; investigated and resolved Home AI insight card blur/overlay defect. |
| **Stage 7** | **Reliability & State Handling** | `[IMPLEMENTED]` | Standardized loading, empty, and error states; mounted global `Toast` system; enforced zero-pill discipline. |
| **Stage 8** | **Financial Correctness & Tests** | `[IMPLEMENTED]` | Executed `scripts/verify-financial-correctness.ts`: 26 automated unit and integration tests passing. |
| **Stage 9** | **Documentation Consolidation** | `[CURRENT]` | Consolidated complete project-wide rules, architecture, financial math, BMONI boundary, and decision register. |
| **Phase 1+**| **Backend & BMONI Connection** | `[PLANNED]` | Supabase database provisioning, RLS policies (`D09`), live BMONI client, and webhook ingestion (`D04`, `D05`). |

---

## 4. Cross-Team Interface Coordination Rules

1. **Shared Types Are Immutable Without Review**: No developer may modify `src/types/finance.ts` without notifying all other contributors.
2. **Service Contract Stability (`D07`)**: Frontend views must only call methods declared in `IFinanceService`. Backend developers must ensure that live API responses map cleanly to these return types.
3. **Zero Secrets in Client**: The Node.js and Python developers must never expect or require the React frontend to pass secret API keys or database service roles.
4. **Idempotent Webhook Reference Mandate (`D04`)**: All card webhooks dispatched to `/api/webhooks/bmoni` must include a unique `external_reference` string.

---

## 5. New Contributor Onboarding Checklist

When joining the Zuko project, complete these steps before writing any code:

1. **Read Core Documentation**:
   - Master Overview: [`README.md`](../../README.md)
   - Documentation Index: [`docs/index.md`](../index.md)
   - Decision Register: [`docs/decisions/decision-register.md`](../decisions/decision-register.md)
   - Financial Rules: [`docs/finance/financial-rules.md`](../finance/financial-rules.md)
   - BMONI Status & Boundaries: [`docs/integrations/bmoni.md`](../integrations/bmoni.md)
2. **Verify Local Environment**:
   ```bash
   npm install
   npm run lint          # Must pass with 0 errors
   npm run test:finance   # All 26 financial tests must pass
   npm run build         # Production bundle must compile
   ```
3. **Confirm Assigned Ownership**: Check Section 1 of this document to confirm which files and features belong to your role. Do not modify components assigned to other developers.
4. **Acknowledge Open Blockers**: Check `docs/decisions/decision-register.md` for `DEC-001` through `DEC-007`. If your planned work touches an unresolved decision, request owner approval before proceeding.
