# Zuko — Financial System Specification

> **Documentation Notice**: This document has been consolidated into the comprehensive financial specification suite.  
> - For Mathematical Formulations, Code Implementations & Calculation Algorithms, see [**`docs/finance/financial-rules.md`**](./finance/financial-rules.md).
> - For Canonical Domain Types & SQL Contracts, see [**`docs/architecture/data-and-service-contracts.md`**](./architecture/data-and-service-contracts.md).
> - For the Master Decision Register (`D01`–`D12`, `DEC-001`–`DEC-007`), see [**`docs/decisions/decision-register.md`**](./decisions/decision-register.md).
> - For the Automated Verification Suite (`npm run test:finance`), see [**`docs/engineering/testing.md`**](./engineering/testing.md).

---

## 1. Core Financial Principles (Approved)

Financial correctness is non-negotiable in Zuko. The system is designed around strict financial truthfulness and clear ledger accounting principles approved by the project owner:

1. **One Canonical Transaction Model (`D01`)**: All spending records—regardless of whether entered by hand or received via supported BMONI events—must be normalized into one consistent transactional format.
2. **Approved Currency (`D02`)**: Nigerian Naira (`NGN`, displayed as `₦`) is the approved currency for all financial features. Monetary storage representation (`DEC-001`) remains unresolved pending owner approval.
3. **Separate Lifecycle from Budget Eligibility (`D03`)**: A transaction's lifecycle status does not by itself define budget eligibility. Internal transfers and deposits do not debit budgets.
4. **Deterministic Budget Arithmetic**: `Budget Remaining = Budget Limit - Eligible Spending`.
5. **Negative Balance Truthfulness (Rule 8.B)**: Over-budget spending preserves the true negative balance. Visual progress indicators may cap at 100%, but the financial number must never be clamped to zero.
6. **Strict Separation of Wallet & Budget Remaining (`D05`)**: A student's physical/virtual wallet balance is an asset balance. Budget remaining is a category limit ceiling. They must never be confused, derived from one another, or conflated in calculations.
7. **Transfer & Deposit Isolation (`D03`)**: Internal transfers between a student's own accounts, wallet deposits, and peer recharges do **not** automatically count as category budget spending.
8. **Calendar-Month Budgets in Nigerian Timezone (`D06`)**: Budget cycles strictly follow calendar months calculated under `Africa/Lagos` time boundaries.

---

## 2. Wallet Balance vs. Budget Remaining (`D05`)

| Metric | Source of Truth | Purpose | Misconceptions to Avoid |
| :--- | :--- | :--- | :--- |
| **Authoritative Wallet Balance** | BMONI Nigerian Wallet Rails | Represents actual spendable cash in student's BMONI account. | **DO NOT** subtract category budget expenses from this number. |
| **Budget Remaining** | Zuko Central Ledger Calculations | Represents remaining allowance buffer before exceeding self-imposed category limits. | **DO NOT** treat this as cash in hand. A student can have ₦50,000 in their wallet but ₦0 remaining in their Dining budget. |

---

## 3. Deduplication & Reconciliation Rules (`D04`)

### The Manual vs. Provider Card Race Condition
A student buys a textbook at the campus bookstore for ₦12,500 using their BMONI Mastercard.
1. The student manually records: `₦12,500 - Books & Academic`.
2. Minutes later, BMONI dispatches a card authorization webhook: `₦12,500 - University Bookstore`.

### Approved Principles (`D04`):
1. **No Silent Merging**: Manual records and provider-sourced records must **not** be automatically merged solely because their amounts and dates look similar.
2. **No Double-Counting**: The system must not silently count the same underlying financial activity twice.
3. **Idempotent Ingestion**: Ingestion of provider-sourced events must enforce idempotency using BMONI's unique transaction references (`external_reference`).
4. *Pending Decision (`DEC-002`)*: The specific reconciliation workflow (e.g. user prompt to confirm a match vs. explicit merge queue) remains unresolved pending owner approval.
