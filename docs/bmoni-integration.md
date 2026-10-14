# Zuko — BMONI Integration Specification

> **Documentation Notice**: This document has been consolidated into the comprehensive integration suite.  
> - For Full Technical Architecture, Webhook Security & Sandbox Evidence, see [**`docs/integrations/bmoni.md`**](./integrations/bmoni.md).
> - For the Master Decision Register (`DEC-002`, `DEC-005`), see [**`docs/decisions/decision-register.md`**](./decisions/decision-register.md).

---

## 1. Critical Boundary: Integration Status

> ### ⚠️ MANDATORY COMPLIANCE NOTICE: BMONI IS NOT INTEGRATED
> As of the current stage, **no live integration exists between Zuko and the BMONI API**.
> - There are **NO** live BMONI accounts or active banking credentials in this codebase.
> - Spendable balances displayed in the prototype are **simulated demonstration figures** (`D12`).
> - Developers must **NOT** claim live BMONI connectivity, invent fake provider endpoints, or add mock HTTP responses masquerading as verified provider payloads.

---

## 2. Overview & Official Provider Reference

BMONI provides embedded banking, card issuance, and payment rails across emerging markets. This integration brief outlines how the **Full-Stack Node.js Developer** will interface with BMONI's Nigerian infrastructure in accordance with the project owner's approved integration decisions (`D01`–`D07`, `D12`).

- **Official Provider Reference**: [BMONI Embedded Docs — Nigeria Market](https://embedded-docs.bmoni.com/markets/nigeria/)
- **Core Market Capabilities**:
  - Nigerian Naira (NGN) virtual wallets and dedicated virtual accounts.
  - Mastercard virtual card issuance and real-time transaction webhooks.
  - Inbound NGN bank deposits and outbound NGN bank withdrawals.
  - Know Your Customer (KYC) onboarding for Nigerian university students.

---

## 3. Integration Architecture & Credential Boundary

```
┌─────────────────────────────────┐
│        REACT CLIENT (SPA)       │
│    (Zero BMONI Credentials)     │
└────────────────┬────────────────┘
                 │ HTTPS (Authenticated Session via Consistent Service Boundary - D07)
                 ▼
┌─────────────────────────────────────────────────────────┐
│             NODE.JS SERVER (SUPABASE / EXPRESS)         │
│  - Environment Secrets:                                 │
│      BMONI_API_KEY, BMONI_API_SECRET, BMONI_WEBHOOK_KEY │
│  - Server-to-Server REST Client                         │
│  - Cryptographic Webhook Receiver                       │
│  - Backend-Enforced User Ownership (D09)                │
└────────────────┬───────────────────────▲────────────────┘
                 │ Outbound HTTPS API    │ Inbound Webhook Events
                 ▼                       │ (Card Swipes / Deposits)
┌────────────────────────────────────────┴────────────────┐
│                   BMONI NIGERIAN RAILS                  │
│  - Wallet Balance API        - Virtual Card Engine      │
│  - Bank Transfer Inflow      - Webhook Event Dispatcher │
└─────────────────────────────────────────────────────────┘
```

### Security Boundaries:
1. **Zero Client Secrets**: The browser SPA must **never** make direct requests to BMONI API endpoints.
2. **Key Storage**: All BMONI keys must reside in server-side environment variables (`BMONI_API_KEY`, `BMONI_API_SECRET`).
3. **Sandbox Isolation**: Development must use the BMONI Sandbox environment with separate test credentials.
