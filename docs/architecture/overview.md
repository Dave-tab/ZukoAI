# Zuko — System Architecture Overview

---

## 1. High-Level System Architecture

Zuko employs a decoupled, multi-tier architecture designed to serve university students with high availability, deterministic calculations, strict data isolation, and low-latency interaction.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND CLIENT (REACT 19 SPA)                       │
│  - AppLayout (Desktop Sidebar & Mobile Bottom Navigation - D11)                 │
│  - Home / Overview Dashboard (KPIs, WalletCard, Goal Snapshot, Alerts - D11)   │
│  - Budgets & Limits View (Lagos Calendar-Month Boundary Evaluation - D06)       │
│  - Transaction Ledger Table & Manual Expense Logging Flow (D01, D03)            │
│  - Financial Goals Milestone Dashboard & Contribution Handlers                  │
│  - AI Financial Assistant Interface & Quick Modal Advisor (D08)                 │
│  - Consistent Financial Service Boundary Layer (IFinanceService - D07)         │
│  - Client-Side Deterministic Financial Math Engine (Rules 8.B & 8.C)            │
└───────────────────────┬─────────────────────────────────▲───────────────────────┘
                        │ HTTPS (REST / JSON)             │ Post-Mutation / Polling (D10)
                        ▼                                 │
┌─────────────────────────────────────────────────────────┴───────────────────────┐
│                       FULL-STACK NODE.JS BACKEND (SUPABASE)                     │
│  - Authentication & JWT Session Validation                                      │
│  - Backend-Enforced User Ownership & Row-Level Security (D09)                   │
│  - Canonical Transaction Storage & Ledger Ledger Engine (D01)                   │
│  - Cryptographic Webhook Receiver & Idempotent Deduplication (D04)              │
│  - Authoritative BMONI Wallet API Client & Balance Endpoint (D05, D07)          │
│  - Post-Mutation Reliable Refresh Dispatcher (D10)                              │
└───────────────────────┬─────────────────────────────────▲───────────────────────┘
                        │ Event Webhook / RPC             │ Batch Classification
                        ▼                                 │
┌─────────────────────────────────────────────────────────┴───────────────────────┐
│                         FULL-STACK PYTHON AI SERVICE                            │
│  - Assistive Transaction Categorization Engine (D08)                            │
│  - Shared Category Taxonomy Mapping & Confidence Scoring                        │
│  - Paper Receipt OCR & Text Extraction Pipeline                                 │
│  - Contextual Student Financial Health & Velocity Insights                      │
│  - BMONI Nigerian Sandbox Research & Verification Tools                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Pipelines

### 2.1 The Central Transaction Pipeline (`D01`, `D03`, `D04`)
All transaction sources flow into one centralized system, are normalized into a canonical model, evaluated for budget eligibility independently of lifecycle status, and consumed by the budget calculation engine:

```
┌─────────────────────────┐
│   Manual Cash Outlay    │──┐
└─────────────────────────┘  │
┌─────────────────────────┐  │     ┌────────────────────────────────────────────────┐
│   BMONI Card Webhook    │──┼────>│      CENTRAL TRANSACTION SYSTEM (D01)          │
└─────────────────────────┘  │     │   (Normalized Storage, User Ownership - D09)   │
┌─────────────────────────┐  │     └───────────────────────┬────────────────────────┘
│ Bank Deposit / Transfer │──┘                             │
└─────────────────────────┘                                ▼
                                           ┌────────────────────────────────────────┐
                                           │       NORMALIZATION & VALIDATION       │
                                           │  (Source, Type, Currency, Lagos Date)  │
                                           └───────────────────────┬────────────────┘
                                                                   │
                                                                   ▼
                                           ┌────────────────────────────────────────┐
                                           │     BUDGET ELIGIBILITY FILTER (D03)    │
                                           │  (Transfers Isolated; Status Checked)  │
                                           └───────────────────────┬────────────────┘
                                                                   │
                                                                   ▼
                                           ┌────────────────────────────────────────┐
                                           │     CENTRAL BUDGET ENGINE (D06, 8.B)   │
                                           │  (Lagos Month: Remaining = Limit-Spent)│
                                           └───────────────────────┬────────────────┘
                                                                   │
                                                                   ▼
                                           ┌────────────────────────────────────────┐
                                           │        DASHBOARD & BUDGETS UI (D10)    │
                                           └────────────────────────────────────────┘
```

### 2.2 The Wallet Balance Pipeline (Strict Isolation - `D05`)
Per approved decision **`D05`**, the authoritative wallet balance is fetched **directly and independently** through an approved service boundary. It is **never** calculated by subtracting category budget expenses from an assumed starting balance:

```
┌───────────────────────────────────┐
│        BMONI NIGERIAN RAILS       │
│     (Spendable Student Account)   │
└─────────────────┬─────────────────┘
                  │ Secure Server-to-Server HTTPS Query
                  ▼
┌───────────────────────────────────┐
│     NODE.JS BACKEND SERVICE       │
│      (GET /api/wallet/balance)    │
└─────────────────┬─────────────────┘
                  │ Authoritative Normalized Response
                  ▼
┌───────────────────────────────────┐
│   FRONTEND SERVICE BOUNDARY (D07) │
│   (financeService.getWalletBalance)
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│     DASHBOARD WALLET CARD (D05)   │
│   (Independent Spendable Balance) │
└───────────────────────────────────┘
```

---

## 3. Data Flow, Security & Boundary Policies

### 3.1 Backend-Enforced User Ownership (`D09`)
- **Database-Level Isolation**: Every financial record in the database (`profiles`, `budgets`, `transactions`, `goals`) must be associated with a verified `user_id UUID`.
- **Row-Level Security (RLS)**: PostgreSQL policies enforce `auth.uid() = user_id` on all `SELECT`, `INSERT`, `UPDATE`, and `DELETE` operations.
- **Zero Client Trust**: The frontend client cannot view or mutate another student's ledger records by tampering with request payloads, client parameters, or state.
- **Credential Protection**: BMONI private keys, webhook HMAC secrets, and database service keys must reside exclusively in server-side environment variables.

### 3.2 Reliable Post-Mutation Updates (`D10`)
- Following any successful mutation (e.g., adding an expense, adjusting a budget envelope limit, or recording a goal contribution), the frontend views must immediately and reliably reflect the updated values.
- Supported via Promise resolution in `src/App.tsx`, accompanied by immediate toast feedback.

### 3.3 Safe Failure & Degraded States
- If an external provider API is unreachable, the UI surfaces understandable loading, error, or stale-data states without fabricating numbers.
- Webhook ingestion enforces idempotent deduplication (`D04`) using unique provider references.

---

## 4. Current State vs. Target Infrastructure

| Layer | Target Architecture | Current Repository Reality | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React 19 SPA with TypeScript & Tailwind CSS | Fully implemented and verified in `src/`. | `[IMPLEMENTED]` |
| **Navigation Shell** | Dual Desktop Sidebar & Mobile Bottom Nav (`D11`) | Implemented in `AppLayout`, `Sidebar`, and `MobileBottomNav`. | `[IMPLEMENTED]` |
| **Financial Service Boundary** | Abstract Service Contract (`IFinanceService` - `D07`) | Singleton in-memory service in `src/services/financeService.ts`. | `[IMPLEMENTED]` (In-Memory) |
| **Database & Persistence** | PostgreSQL (Supabase) with RLS (`D09`) | In-memory arrays; resets on full page refresh. | `[PLANNED]` (Node.js Scope) |
| **BMONI Banking Rails** | Node.js REST client & webhook receiver (`D04`, `D05`) | **NOT INTEGRATED**. Demo mode explicitly labeled. | `[PLANNED]` (Unintegrated) |
| **AI Processing** | Python microservice with shared category taxonomy (`D08`)| Provisional Gemini SDK integration & static demo insights. | `[PARTIALLY IMPLEMENTED]` |
| **Automated Verification** | Integration test suite asserting `D01`–`D07`, Rules 8.B/8.C | Executable test suite in `scripts/verify-financial-correctness.ts`. | `[IMPLEMENTED]` (26 Passed) |
