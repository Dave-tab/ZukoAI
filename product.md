# Zuko — Product Specification

---

## 1. Product Vision & Target Audience

### 1.1 Vision
To empower university students across emerging markets—beginning in Nigeria—to attain complete intentionality and awareness over their money. Zuko transforms confusing banking statements into actionable student spending intelligence, visual envelopes, and guided savings milestones.

### 1.2 Target User Persona
- **Primary Persona**: Undergraduate or polytechnic student (Ages 17–25) receiving monthly or irregular allowances from parents, guardians, or part-time freelance stipends.
- **Pain Points**:
  - Money "evaporates" within the first 10 days of allowance receipt.
  - Difficulty tracking miscellaneous cash outlays (campus shuttles, canteens, printing).
  - Anxiety over semester deadlines (rent deposits, lab manuals, project defense fees).
  - Lack of visibility into true financial standing versus perceived bank balance.

---

## 2. Core User Capabilities

1. **Unified Financial Visibility**: View available semester balance, monthly income, total expenses, and savings rate in a single high-contrast dashboard formatted in Nigerian Naira (`₦`) (D02).
2. **Calendar-Month Category Budgeting**: Allocate monthly spending limits across a shared category vocabulary, evaluated under Nigerian timezone boundaries (`Africa/Lagos`) (D06, D08).
3. **Goal Milestone Tracking**: Establish target savings milestones (e.g. project laptops, certification exams, emergency buffers) with deadline countdowns without implying funds segregation.
4. **Multi-Source Transaction Recording**: Ingest manual cash outlays alongside supported BMONI card and wallet events into a canonical transaction model (D01).
5. **Contextual AI Intelligence**: Receive assistive categorization and actionable advice where user corrections take precedence over AI suggestions (D08).
6. **Dual Desktop & Mobile Navigation**: Seamless access across 5 primary destinations (Home, Budgets, Transactions, Goals, AI Assistant) with profile view/edit and notification bell accessible from Home (D11).

---

## 3. Experience Walkthroughs

### 3.1 Overview Dashboard Experience (Home)
- **Student Hero Banner**: Greets the student by first name, displays verified academic term context (`University of Lagos • First Semester 2026/2027`), and summarizes active budget/goal metrics.
- **Top Quick Actions & Utility**: Direct access to view and edit user profile and an active notification bell (D11).
- **KPI Summary Grid**: 4 cards displaying Authoritative Balance, Monthly Income, Total Expenses, and Net Term Savings.
- **AI Insight Card**: Prominent notification highlighting high-priority spending patterns (e.g., over-limit warnings or utility bundle savings tips).
- **Spending Analytics**: 7-day spending chart with interactive daily outlay bars and category share breakdown.
- **Recent Activity**: Read-only ledger feed showing recent transactions with category icons and payment method tags.

### 3.2 Budgets & Limits Experience
- **Aggregate Envelope Banner**: Summarizes total budgeted allocation across all categories, current utilization percentage, and total over-limit alerts.
- **Calendar-Month Boundaries**: Budget cycles strictly follow calendar months in `Africa/Lagos` time (D06).
- **Filter Tabs**: Toggle between `All`, `Over Budget`, and `Healthy` envelopes.
- **Category Cards**: Individual cards detailing category icon, cap limit, spent amount, progress bar, and truthful remaining amount (negative remaining preserved per Rule 8.B).
- **Budget Modification**: Modal dialog allowing students to set or adjust category limits in Naira (`₦`).

### 3.3 Financial Goals Experience
- **Target Tracking**: Milestone cards with target amount, accumulated savings, deadline dates, and percentage rings.
- **Progress Integrity**: Clearly shows accumulated funds without falsely implying that money has been physically locked or segregated from the student's wallet.

### 3.4 Shared Navigation Architecture (D11)
- **Desktop**: Persistent sidebar navigation drawer with branding, 5 primary navigation links, teammate integration status, and student profile footer.
- **Mobile**: Dedicated bottom navigation bar providing instant thumb reach to the same 5 primary destinations:
  1. **Home** (Dashboard)
  2. **Budgets**
  3. **Transactions**
  4. **Goals**
  5. **AI Assistant**
- **Profile & Notification Bell**: Directly accessible from the Home view header on both desktop and mobile layouts.

---

## 4. Multi-Source Transaction System & Boundaries (D01, D03, D04)

Zuko ingests transactions through approved channels:

| Source | Description | Mechanism | Budget Eligibility Rule |
| :--- | :--- | :--- | :--- |
| **1. Manual Entries** | Cash, off-campus POS, or paper receipts. | User-entered modal form with category selection. | Confirmed manual expenses update category budgets immediately (D03, D10). |
| **2. BMONI Card Events**| Virtual/Physical Mastercard payments. | Automated webhook ingestion via BMONI rails. | Eligible card expenses update category budgets after duplicate prevention (D04). |
| **3. BMONI Wallet Rails**| Direct peer transfers or campus stipends. | Webhook notification / balance polling. | Own-account transfers & deposits do **not** count as category spending. |

### Explicit Product Boundaries:
- **Observability vs. Execution**: Recording an expense or viewing an account balance does **not** equal executing a financial wire transfer. Zuko observes and organizes financial movements; it does not process payments or custody user funds.
- **Strict Wallet Balance Separation (D05)**: The authoritative wallet balance represents actual spendable cash in the BMONI wallet. It is **never** derived by subtracting category budget spending from an initial balance.
- **External Integration Safeguard**: BMONI capabilities (virtual card issuance, wallet funding, bank withdrawal) exist solely to the extent supported by BMONI's licensed Nigerian infrastructure and explicitly approved by the project owner.

---

## 5. Feature Status: Implemented vs. Planned vs. Unverified

| Feature | Implementation Status | Notes |
| :--- | :--- | :--- |
| **Overview Dashboard UI** | **Implemented — Verified** | Conforms to Stitch design `overview_dashboard`. |
| **Budgets Page UI** | **Implemented — Verified** | Conforms to Stitch design `budgets_and_goals`. |
| **Financial Goals UI** | **Implemented — Verified** | Conforms to Stitch design `budgets_and_goals`. |
| **Deterministic Calculations** | **Implemented — Verified** | `financeCalculations.ts` enforces Rule 8.B & Rule 8.C. |
| **Mobile Bottom Navigation (D11)** | **Approved Requirement — Planned** | Approved 5-item bottom bar for mobile viewports. |
| **Profile View/Edit from Home (D11)**| **Approved Requirement — Planned** | Approved access from Home header. |
| **Notification Bell from Home (D11)**| **Approved Requirement — Planned** | Approved bell icon from Home header. |
| **Manual Expense Entry Form** | **Approved Requirement — Planned** | Owned by Frontend Developer B. |
| **Full Transaction History Table**| **Approved Requirement — Planned** | Owned by Frontend Developer B. |
| **AI Chat Assistant Interface** | **Approved Requirement — Planned** | Owned by Frontend Developer B. |
| **Supabase Remote Persistence** | **Planned** | Owned by Full-Stack Node.js Developer. |
| **BMONI Live Wallet Connection** | **Unverified / Planned** | Awaiting Node.js developer client and credentials. |
| **BMONI Webhook Receiver** | **Unverified / Planned** | Awaiting server-side endpoint provisioning. |
| **AI Expense Categorization** | **Unverified / Planned** | Owned by Full-Stack Python Developer. |

---

## 6. What the Product Does Not Currently Support

1. Direct money transfers or bank payments initiated inside the web client.
2. Direct custody, staking, or interest generation on student deposits.
3. Multi-currency foreign exchange conversion in the active UI (standardizes on NGN `₦`).
4. Automated merchant scraping or screen-scraping of traditional Nigerian bank apps.
5. Speculative investments, loans, or credit-scoring algorithms.
