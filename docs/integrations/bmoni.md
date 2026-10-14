# Zuko — BMONI Integration Status & Technical Specification

---

## 1. Critical Boundary: Integration Status

> ### ⚠️ MANDATORY COMPLIANCE NOTICE: BMONI IS NOT INTEGRATED
> As of the current stage, **no live integration exists between Zuko and the BMONI API**.
> - There are **NO** live BMONI accounts or active banking credentials in this codebase.
> - Spendable balances displayed in the prototype are **simulated demonstration figures** (`D12`).
> - Developers must **NOT** claim live BMONI connectivity, invent fake provider endpoints, or add mock HTTP responses masquerading as verified provider payloads.

---

## 2. Overview & Official Provider Reference

**BMONI** is an embedded financial infrastructure provider operating across emerging markets, including Nigeria.

- **Official Documentation**: [BMONI Embedded Docs — Nigeria Market](https://embedded-docs.bmoni.com/markets/nigeria/)
- **Target Market Capabilities**:
  - Dedicated Nigerian Naira (NGN) virtual accounts (NUBAN generation).
  - Virtual and physical Mastercard issuance with real-time spend authorization webhooks.
  - Inbound NGN bank deposits and outbound interbank transfers via NIP (NIBSS Instant Payment).
  - Student KYC verification using BVN (Bank Verification Number) / NIN (National Identity Number).

---

## 3. Target Integration Architecture & Credential Boundaries

When the **Full-Stack Node.js Developer** implements live BMONI rails, the integration must strictly adhere to the following security topology:

```
┌─────────────────────────────────┐
│        REACT CLIENT (SPA)       │
│    (Zero BMONI Credentials)     │
└────────────────┬────────────────┘
                 │ HTTPS (Authenticated Session via Consistent Service Boundary - D07)
                 ▼
┌─────────────────────────────────────────────────────────┐
│             NODE.JS SERVER (SUPABASE / EXPRESS)         │
│  - Environment Secrets (Server Only):                   │
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

### Security Isolation Rules:
1. **Zero Client Secrets**: The browser client must never make direct calls to BMONI endpoints or store BMONI API keys.
2. **Server-Side Proxy**: All BMONI requests route through authenticated server-side endpoints (e.g. `GET /api/wallet/balance`).
3. **Sandbox Isolation**: Development must use the BMONI Sandbox environment with separate test credentials.

---

## 4. Target Capabilities for Zuko MVP

### 4.1 Authoritative Wallet Balance Retrieval (`D05`, `D07`)
- **Purpose**: Supply the spendable wallet balance to the Overview Dashboard.
- **Contract**: Node.js backend queries BMONI wallet account endpoint by student wallet ID.
- **Strict Rule (`D05`)**: Zuko **never** calculates the authoritative wallet balance by deducting category budget spending from an assumed initial deposit.
- **Degraded States**: If the BMONI API is unreachable, the frontend surfaces an appropriate loading, error, or stale-data indicator without fabricating numbers.

### 4.2 Virtual Card Ingestion & Webhooks (`D01`, `D04`)
- **Purpose**: Ingest card transactions into the canonical transaction model (`D01`) and trigger reliable budget updates (`D10`).
- **Flow**:
  1. Student spends funds at campus merchant using virtual Mastercard.
  2. BMONI dispatches HTTP `POST` webhook to `https://<zuko-backend>/api/webhooks/bmoni`.
  3. Node.js backend validates HMAC-SHA256 signature against `BMONI_WEBHOOK_KEY`.
  4. Backend verifies idempotency (`D04`): checks `external_reference` to reject duplicate payloads.
  5. Inserts record into canonical `transactions` table with `source = 'bmoni_card'`.
  6. Recomputes category budget spending and triggers frontend refresh (`D10`).

---

## 5. Webhook Ingestion & Cryptographic Verification

```typescript
// Proposed Server-Side Verification Logic (Node.js)
import crypto from 'crypto';

export function verifyBmoniWebhook(
  rawPayload: string,
  signatureHeader: string,
  secretKey: string
): boolean {
  if (!rawPayload || !signatureHeader || !secretKey) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(rawPayload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}
```

---

## 6. Required Evidence Before Declaring Integration Complete

Integration cannot be documented as complete until the following criteria are verified:

- [ ] Node.js backend has a verified BMONI sandbox account with active API credentials.
- [ ] Server endpoints (`GET /api/wallet/balance`, `POST /api/webhooks/bmoni`) are deployed and responding.
- [ ] Webhook signature verification passes with live test payloads.
- [ ] Duplicate event replay tests confirm that `external_reference` prevents duplicate ledger entries.
- [ ] Front-to-back integration test verifies that `financeService.getWalletBalance()` retrieves real sandbox data.
- [ ] No fake or simulated responses are used in production configurations.
