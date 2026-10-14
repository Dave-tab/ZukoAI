# Zuko — Product Vision, Scope & Operating Charter

---

## 1. Product Vision & Mission

**Zuko** is an AI-powered financial management and awareness assistant designed specifically for university and polytechnic students across emerging markets, beginning with Nigeria.

### The Mission
To transform confusing, fragmented banking notifications and unrecorded cash spending into clear, actionable student financial intelligence. Zuko equips students with intentional spending habits, realistic category limits, and milestone savings momentum throughout the academic term.

---

## 2. Target User Persona & Problem Space

### 2.1 Primary User Persona: The Nigerian University Student
- **Demographics**: Undergraduate or higher national diploma (HND) student, aged 17–25, attending institutions such as University of Lagos (UNILAG), University of Ibadan (UI), Obafemi Awolowo University (OAU), or similar campuses.
- **Income Sources**: Monthly or irregular family allowances, semester book allowances, occasional freelance gig income, or campus stipends.
- **Spending Channels**:
  - Offline Cash / POS Agents: Campus shuttle buses (BRT, Keke Napep), local food vendors ("mama put"), photocopy centres, faculty dues.
  - Digital / Card Rails: Online course subscriptions, data bundles, food delivery, virtual card purchases.

### 2.2 Core Financial Pain Points
1. **The "First 10 Days" Exhaustion Cycle**: Allowances received at the start of the month frequently evaporate within 10–14 days due to unmonitored impulse spending and unbudgeted social obligations.
2. **Invisible Cash Leakage**: Off-campus micro-expenses (₦300 for keke, ₦700 for printing handouts, ₦1,200 for lunch) are rarely captured in bank apps, leading to unexplained deficits.
3. **Academic Milestone Anxiety**: Sudden demands for departmental dues, laboratory manuals, textbook packs, or semester hostel deposits create financial distress.
4. **False Balance Perception**: Checking a bank balance of ₦45,000 creates the illusion of wealth, ignoring the fact that ₦30,000 is already committed to upcoming rent or project defense expenses.

---

## 3. Core Product Capabilities

| Capability | Summary | Approved Rule | Current Implementation Status |
| :--- | :--- | :--- | :--- |
| **Unified Financial Overview** | Single-screen visibility over spendable balance, monthly income, total expenses, and net term savings rate. | `D02`, `D05` | `[IMPLEMENTED]` (Dashboard UI) |
| **Calendar-Month Budgeting** | Category spending caps evaluated under the Nigerian timezone (`Africa/Lagos`) with truthful negative remaining. | `D03`, `D06`, Rule 8.B | `[IMPLEMENTED]` (Budgets UI & Math) |
| **Milestone Goal Tracking** | Target savings tracking with deadline countdowns without implying physical funds segregation. | Rule 8.C | `[IMPLEMENTED]` (Goals UI & Math) |
| **Canonical Transaction Ledger** | Normalized transaction model capturing cash, cards, and bank transfers with duplicate safeguards. | `D01`, `D04` | `[IMPLEMENTED]` (Ledger Table & Types) |
| **Contextual AI Intelligence** | High-priority pattern insights and assistive category suggestions where user choices take precedence. | `D08` | `[IMPLEMENTED]` (Demo Insights & Modal) |
| **Responsive 5-Destination Shell** | Unified navigation across desktop sidebar and mobile bottom bar with profile and alert triggers. | `D11` | `[IMPLEMENTED]` (App Layout Shell) |

---

## 4. Product Operating Charter & Critical Boundaries

### 4.1 Observability vs. Financial Execution
Zuko is an **information and awareness assistant**, not a bank or payment processor.
- **What Zuko Does**: Observes, records, organizes, calculates, alerts, and displays financial trends.
- **What Zuko Does NOT Do**:
  - Does NOT execute money transfers or wire payments.
  - Does NOT debit or credit external bank accounts directly from the client.
  - Does NOT hold or custody student funds.
  - Does NOT act as an escrow agent or licensed deposit-taking institution.

### 4.2 Demo Data vs. Live Banking Boundary (`D12`)
- The current application operates in **Demo Mode** using an in-memory financial service (`src/services/financeService.ts`).
- **BMONI Nigerian banking rails are NOT currently connected.**
- All wallet balances and transactions in the prototype are simulated for demonstration.
- Prototype views must never deceive users by claiming active synchronization with a live BMONI bank account.

---

## 5. Explicit Out-of-Scope Boundaries (Non-Goals)

To prevent scope creep and preserve regulatory compliance, Zuko explicitly excludes the following capabilities:

1. **Direct In-App Money Transfers**: The application does not provide a "Send Money" or "Transfer to Account" feature that executes real bank wires.
2. **Custodial Deposit Accounts**: Zuko does not accept cash deposits or hold user capital.
3. **Cryptocurrency & Token Custody**: No digital asset trading, token staking, or speculative yield generation.
4. **Automated Screen Scraping**: Zuko does not scrape student bank login credentials or parse unauthorized mobile bank screenshots.
5. **Credit Scoring & Lending**: The application does not issue loans, calculate commercial credit scores, or partner with predatory lending apps.
6. **Multi-Currency FX Trading**: Zuko standardizes on the Nigerian Naira (`NGN`, `₦`) and does not offer live currency exchange trading.
