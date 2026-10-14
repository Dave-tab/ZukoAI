# Zuko — System Architecture Specification

> **Documentation Notice**: This document has been consolidated into the comprehensive architecture suite.  
> - For High-Level Architecture & Pipelines, see [**`docs/architecture/overview.md`**](./architecture/overview.md).
> - For Data Models, Canonical Types & SQL Contracts, see [**`docs/architecture/data-and-service-contracts.md`**](./architecture/data-and-service-contracts.md).
> - For User Ownership & Row-Level Security, see [**`docs/architecture/security-and-access-control.md`**](./architecture/security-and-access-control.md).
> - For the Master Decision Register (`D01`–`D12`, `DEC-001`–`DEC-007`), see [**`docs/decisions/decision-register.md`**](./decisions/decision-register.md).

---

## 1. High-Level System Architecture Summary

Zuko employs a decoupled architecture designed to serve university students with high availability, low latency, and deterministic financial calculations, grounded in the project owner's approved cross-developer decisions (`D01`–`D12`).

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND CLIENT (REACT 19 SPA)                       │
│  - AppLayout (Desktop Sidebar & Mobile Bottom Nav - D11)                        │
│  - Home / Overview Dashboard (Profile View/Edit & Notification Bell - D11)     │
│  - Budgets & Limits (Calendar-Month Nigeria Timezone - D06)                    │
│  - Consistent Financial Service Boundary Layer (D07)                            │
└───────────────────────┬─────────────────────────────────▲───────────────────────┘
                        │ HTTPS (JSON / REST)             │ Realtime / Polling
                        ▼                                 │
┌─────────────────────────────────────────────────────────┴───────────────────────┐
│                       FULL-STACK NODE.JS BACKEND (SUPABASE)                     │
│  - Authentication & JWT Validation  - Backend-Enforced Access Control (D09)     │
│  - BMONI Wallet API Client (D05)    - Webhook Receiver & Deduplication (D04)    │
│  - Canonical Transaction Model (D01)- Post-Mutation Reliable Refresh (D10)      │
└───────────────────────┬─────────────────────────────────▲───────────────────────┘
                        │ Event Stream / RPC              │ Batch Categorization
                        ▼                                 │
┌─────────────────────────────────────────────────────────┴───────────────────────┐
│                         FULL-STACK PYTHON AI SERVICE                            │
│  - Assistive Categorization (D08)   - Receipt OCR & Text Extraction             │
│  - Shared Category Vocabulary (D08) - BMONI Sandbox Research                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Pipelines

### 2.1 The Central Transaction Pipeline (`D01`, `D03`, `D04`)
All transaction sources flow into one central transaction system, are normalized into a canonical model, evaluated for budget eligibility independently of lifecycle status, and consumed by the budget calculation engine:

```
MANUAL EXPENSE ENTRY ──────┐
                           │
SUPPORTED BMONI EVENTS ────┼───> [CENTRAL TRANSACTION SYSTEM] (D01)
                           │        (Canonical Normalized Ledger)
OTHER APPROVED SOURCES ────┘                  │
                                              ▼
                               [NORMALIZATION & CLASSIFICATION]
                               (Source, Type, Lifecycle Status - D01, D03)
                                              │
                                              ▼
                                 [BUDGET ELIGIBILITY FILTER] (D03)
                                 (Transfers/Deposits Isolated; Status Evaluated)
                                              │
                                              ▼
                                [CENTRAL BUDGET CALCULATION] (D06)
                                (Calendar Month / Africa/Lagos Timezone)
                                              │
                                              ▼
                                  [DASHBOARD & BUDGETS UI]
```

### 2.2 The Wallet Balance Pipeline (Independent Isolation - `D05`)
Per approved decision **`D05`**, the authoritative BMONI wallet balance is fetched **directly and independently** through an approved service boundary. It is **never** calculated by subtracting budget category expenses from an assumed starting balance:

```
[BMONI WALLET RAILS]
        │
        ▼ (Secure API Query via Node.js Server)
[SERVER-SIDE INTEGRATION / BACKEND SERVICE BOUNDARY] (D07)
        │
        ▼ (Authoritative Balance Response)
[AUTHENTICATED FRONTEND QUERY]
        │
        ▼
[DASHBOARD WALLET BALANCE DISPLAY]
```

---

## 3. Data Flow, Security & Boundary Policies

### 3.1 Backend-Enforced User Ownership (`D09`)
- **Database-Level Protection**: Multi-user financial records must be secured at the database layer (e.g., PostgreSQL Row-Level Security).
- **Zero Frontend Authority**: Users must be strictly prevented from accessing or modifying another student's records by manipulating frontend state, client parameters, or API requests.
- **Credential Protection**: BMONI secret keys, webhook secrets, and database service keys must reside exclusively in server-side environment variables.

### 3.2 Reliable Post-Mutation Updates (`D10`)
- Following any successful financial data change (e.g., saving a manual expense or updating a budget limit), the frontend views must reliably reflect the updated values immediately.
- Supported via centralized toast feedback and local state synchronization.

### 3.3 Safe Failure & Stale Data States
- If the external BMONI Wallet API is unreachable, the UI surfaces an appropriate loading, error, or stale-data state without fabricating numbers.
- Webhook ingestion enforces idempotent deduplication (`D04`) using unique provider references.
