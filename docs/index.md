# Zuko Project Documentation — Master Index

Welcome to the definitive documentation repository for **Zuko**, an AI-powered financial management and awareness assistant tailored for university students in emerging markets, beginning with Nigeria.

This documentation serves as the **single, authoritative source of truth** for all engineering contributors, product owners, and integration partners across frontend, backend, AI, and third-party financial rails.

---

## 1. Documentation Structure & Map

```
docs/
├── index.md                              # This master index
├── decisions/
│   └── decision-register.md              # Approved Decisions (D01-D12) & Unresolved Register (DEC-001 to DEC-007)
├── product/
│   ├── overview.md                       # Product vision, user personas, problem space & non-goals
│   └── requirements.md                   # Functional requirements (FR-xxx) & Home Dashboard specifications
├── architecture/
│   ├── overview.md                       # System architecture, component topology & pipelines
│   ├── data-and-service-contracts.md     # Canonical transaction model, TypeScript interfaces & database schemas
│   └── security-and-access-control.md    # Multi-user data ownership, RLS policies & credential isolation
├── finance/
│   └── financial-rules.md                # Monetary semantics, budget math, wallet isolation & Lagos month boundaries
├── ai/
│   └── ai-assistant.md                   # Assistive categorization, shared taxonomy, insights & modal behavior
├── integrations/
│   └── bmoni.md                          # BMONI status (Unintegrated), webhook verification & sandbox requirements
├── engineering/
│   ├── standards.md                      # UI guidelines, zero-pill discipline, states & production readiness
│   └── testing.md                        # Verification requirements, test suite execution & coverage audit
└── team/
    └── developer-handoff.md              # Ownership matrix, cross-team contracts & governance workflows
```

---

## 2. Quick Navigation by Role

| Role / Responsibility | Primary Authoritative Documents | Key Focus Areas |
| :--- | :--- | :--- |
| **All Contributors** | [Decision Register](./decisions/decision-register.md)<br>[Master README](../README.md) | Approved project rules (`D01`–`D12`), unresolved questions (`DEC-001`–`DEC-007`), setup and governance |
| **Frontend Developers** | [Product Requirements](./product/requirements.md)<br>[Engineering Standards](./engineering/standards.md)<br>[AI Assistant](./ai/ai-assistant.md) | UI/UX specifications, zero-pill discipline, state handling, mobile-first design, navigation shell |
| **Backend Developers** | [Data & Service Contracts](./architecture/data-and-service-contracts.md)<br>[Security & Access Control](./architecture/security-and-access-control.md)<br>[BMONI Integration](./integrations/bmoni.md) | Database migrations, Row Level Security (`D09`), idempotent webhook receiver (`D04`), balance endpoint (`D05`) |
| **AI / ML Engineers** | [AI Assistant Specification](./ai/ai-assistant.md)<br>[Financial Rules](./finance/financial-rules.md) | Assistive categorization (`D08`), shared taxonomy, receipt OCR extraction, contextual student insight logic |
| **QA & Test Engineers**| [Testing Specification](./engineering/testing.md)<br>[Financial Rules](./finance/financial-rules.md) | Financial math verification, Lagos calendar boundaries (`D06`), duplicate prevention, automated test suites |
| **Product & Leadership**| [Product Overview](./product/overview.md)<br>[Developer Handoff](./team/developer-handoff.md) | Scope boundaries, roadmap milestones, unresolved decision register, cross-team handoffs |

---

## 3. Core Project Boundaries & Non-Negotiable Rules

Before reviewing or extending the project, every developer must understand these fundamental constraints:

1. **Product Operating Charter**: Zuko is a **financial management and intelligence assistant**. It is **not** a bank, payment processor, money transmitter, or custodian of funds. Simulated functionality must never be represented as live banking transactions.
2. **BMONI Is NOT Integrated**: The BMONI API has not yet been connected to this codebase. All wallet figures and transactions in the prototype are **demo data**. No developer may claim live BMONI synchronisation, fabricate API endpoints, or store provider secrets in the browser client.
3. **Wallet Balance Separation (`D05`)**: The authoritative spendable wallet balance represents actual student funds. It must **never** be calculated by subtracting planned category budget envelopes from an assumed starting balance.
4. **Timezone Boundaries (`D06`)**: All calendar months and budget periods are strictly evaluated under the **`Africa/Lagos`** timezone (UTC+1) to prevent client browser drift.
5. **Truthful Over-Budget Calculation (Rule 8.B)**: Over-budget spending preserves the true negative remaining amount (e.g., `-₦6,500.00`). Visual progress gauges may cap at 100%, but the financial value must never be clamped to zero.
6. **Backend-Enforced Security (`D09`)**: User data ownership must be enforced at the database/API boundary (e.g., via PostgreSQL Row-Level Security). Frontend-only access checks are strictly non-compliant.
7. **Governance Workflow**: Any substantive change to shared models, financial logic, or cross-developer contracts must follow:  
   **Inspect → Review → Approve → Execute → Verify → Close**.

---

## 4. Documentation Status Legend

Throughout all documentation files, requirements and rules are explicitly labeled with their approval and implementation status:

- `[APPROVED]`: Formally approved by the project owner; represents binding project policy.
- `[IMPLEMENTED]`: Verified as existing and operational in the current codebase.
- `[PARTIALLY IMPLEMENTED]`: Initiated in the repository, but with remaining operational or backend gaps.
- `[PLANNED]`: Approved for development, but awaiting future implementation phases.
- `[UNRESOLVED]`: Subject to an open architectural or business decision; must not be implemented unilaterally.
- `[BLOCKED]`: Implementation cannot proceed until a prerequisite decision or external dependency is resolved.
- `[UNVERIFIED]`: Cannot be confirmed from repository evidence or available documentation.
- `[RECOMMENDED]`: Established engineering best practice that has not been formally codified as an owner rule.
