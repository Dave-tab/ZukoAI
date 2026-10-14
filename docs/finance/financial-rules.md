# Zuko — Financial Rules & Calculation Engine

---

## 1. Non-Negotiable Financial Truths

Financial correctness in Zuko is governed by strict mathematical honesty. Because students depend on this application to navigate real campus constraints, the system enforces the following approved rules:

1. **One Canonical Transaction Model (`D01`)**: All spending entries normalize into a single structure with explicit budget eligibility.
2. **Approved Currency (`D02`)**: Nigerian Naira (`NGN`, `₦`) is the standard currency. *(Database unit precision is open: see `DEC-001`)*.
3. **Transaction Lifecycle vs. Eligibility (`D03`)**: Lifecycle state is distinct from budget eligibility. Own-account transfers and deposits are strictly isolated from spending totals.
4. **Authoritative Wallet Balance Isolation (`D05`)**: The spendable wallet balance represents actual student funds. It is **never** calculated by subtracting category budget envelopes from an assumed starting sum.
5. **Nigerian Timezone Boundaries (`D06`)**: All calendar months and date evaluations operate under the **`Africa/Lagos`** timezone (UTC+1).
6. **Truthful Over-Budget Remaining (Rule 8.B)**: Over-budget spending preserves the true negative remaining amount and is never silently clamped to zero.
7. **Goal Progress Without Phantom Vaults (Rule 8.C)**: Goal tracking records accumulation milestones without implying that money has been physically segregated or locked from the student's spendable cash.

---

## 2. Mathematical Formulations & Algorithms

### 2.1 Currency Formatting (`formatNaira`)
Converts any numeric amount into standard Nigerian Naira notation:
```typescript
export function formatNaira(amount: number, includeDecimals = true): string {
  if (isNaN(amount) || !isFinite(amount)) return '₦0.00';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-NG', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });
  return isNegative ? `-₦${formatted}` : `₦${formatted}`;
}
```

### 2.2 Africa/Lagos Calendar Month Evaluation (`D06`)
To eliminate client browser timezone drift, all timestamps evaluate using `Intl.DateTimeFormat`:
- UTC `2026-10-31T22:59:59Z` ➔ `2026-10-31 23:59:59` Lagos (Still October).
- UTC `2026-10-31T23:00:00Z` ➔ `2026-11-01 00:00:00` Lagos (Rolls over to November).

### 2.3 Eligible Category Expenditure (`calculateCategorySpent`)
Evaluates total spending debiting a budget envelope:

$$S = \sum_{\substack{t \in \text{Transactions} \\ t.category = C \\ t.type = \text{'expense'} \\ t.is\_budget\_eligible \neq \text{false} \\ (\text{if current month only: } t.date \in \text{LagosCurrentMonth})}} t.amount$$

Transfers, deposits, income, and transactions where `is_budget_eligible === false` are strictly excluded.

### 2.4 Truthful Budget Status (Rule 8.B)
For a category budget envelope with limit $L$ and spent amount $S$:

$$\text{Remaining} = L - S$$

$$\text{IsOverBudget} = S > L$$

$$\text{OverAmount} = \max(0, S - L)$$

$$\text{PercentUsed} = \begin{cases} 
\text{round}\left(\frac{S}{L} \times 100 \times 10\right) / 10 & \text{if } L > 0 \\
100 & \text{if } L = 0 \text{ and } S > 0 \\
0 & \text{if } L = 0 \text{ and } S = 0 
\end{cases}$$

$$\text{VisualProgress} = \min(100, \max(0, \text{PercentUsed}))$$

#### Concrete Verification Example:
- **Scenario A (Under Budget)**: Limit ₦20,000, Spent ₦14,000  
  `Remaining = ₦6,000.00`, `PercentUsed = 70.0%`, `IsOverBudget = false`.
- **Scenario B (Over Budget)**: Limit ₦20,000, Spent ₦26,500  
  `Remaining = -₦6,500.00` *(Preserved, NOT clamped to 0)*, `PercentUsed = 132.5%`, `IsOverBudget = true`, `OverAmount = ₦6,500.00`. Visual bar stops at 100%, styled in alert rose.

### 2.5 Goal Milestone Progress (Rule 8.C)
For a milestone target $T$ and accumulated savings $C$:

$$\text{RemainingAmount} = \max(0, T - C)$$

$$\text{PercentComplete} = \begin{cases}
\min\left(100, \text{round}\left(\frac{C}{T} \times 100 \times 10\right) / 10\right) & \text{if } T > 0 \\
100 & \text{if } T = 0
\end{cases}$$

$$\text{DaysRemaining} = \max\left(0, \left\lceil \frac{\text{TargetDate} - \text{ReferenceDate}}{1000 \times 60 \times 60 \times 24} \right\rceil\right)$$

#### Critical Distinction: Non-Segregated Funds
Goal accumulation represents a **tracking milestone**, not a physical vault. Saving ₦45,000 towards a ₦150,000 laptop does not lock that ₦45,000 away from the student's BMONI wallet. It remains spendable cash unless the student chooses to keep it intact.

### 2.6 Financial Summary & Net Savings
- $\text{Total Income} = \sum_{t \in \text{Income}} t.amount$
- $\text{Total Expenses} = \sum_{t \in \text{Eligible Expenses}} t.amount$
- $\text{Net Savings} = \text{Total Income} - \text{Total Expenses}$
- $\text{Savings Rate} = \begin{cases} \max\left(0, \text{round}\left(\frac{\text{Net Savings}}{\text{Total Income}} \times 100 \times 10\right) / 10\right) & \text{if Total Income} > 0 \\ 0 & \text{if Total Income} = 0 \end{cases}$

---

## 3. Summary of Wallet vs. Ledger Accounting (`D05`)

| Metric | Source of Truth | What It Represents | Misconceptions to Avoid |
| :--- | :--- | :--- | :--- |
| **Authoritative Wallet Balance** | Provider / Backend Wallet API | Spendable cash in student's BMONI wallet account. | **DO NOT** subtract category budget expenses from this balance. |
| **Ledger Balance** | Sum of Income minus Sum of Expenses | Theoretical net accumulation from tracked records. | May differ from wallet if student made unrecorded cash moves. |
| **Budget Remaining** | Budget limit minus category expenses | Allowance buffer before reaching self-imposed limit. | **DO NOT** treat as cash. ₦0 budget remaining does NOT mean ₦0 cash. |
| **Goal Saved Amount** | Accumulated milestone tally | Progress toward target purchase. | **DO NOT** assume funds are locked or unavailable. |
