# Zuko — Security & Access Control Specification

---

## 1. Core Security Principles (`D09`)

Financial information is private, sensitive student data. Zuko enforces strict tenant isolation and security boundaries approved by the project owner:

1. **Backend-Enforced Data Ownership (`D09`)**: Multi-user isolation must be implemented and verified at the database/API layer. Frontend-only authorization checks are explicitly non-compliant.
2. **Zero Client Secrets**: No third-party API private keys (BMONI, Supabase service roles, payment secrets) may ever be exposed to the client-side JavaScript bundle.
3. **No Fabricated Security Guarantees**: Security mechanisms must not be represented as active or production-ready until backed by deployed database policies and automated tests.

---

## 2. PostgreSQL Row-Level Security (RLS) Architecture

In the target persistent architecture (Supabase / PostgreSQL), every table containing student data must enable Row-Level Security.

```sql
-- Enable Row Level Security across all user tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Isolation Policy
CREATE POLICY "Users can only view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can only update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Budgets Isolation Policy
CREATE POLICY "Users can only read their own budgets"
  ON budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own budgets"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own budgets"
  ON budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own budgets"
  ON budgets FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Transactions Isolation Policy
CREATE POLICY "Users can only read their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Financial Goals Isolation Policy
CREATE POLICY "Users can only read their own financial goals"
  ON financial_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own financial goals"
  ON financial_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own financial goals"
  ON financial_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own financial goals"
  ON financial_goals FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 3. Credential Isolation & Environment Configuration

### 3.1 Strict Variable Categorization

| Environment Variable | Target Boundary | Description & Security Protocol |
| :--- | :--- | :--- |
| `BMONI_API_KEY` | **Node.js Server Only** | BMONI partner API key. **NEVER** expose to Vite/browser. |
| `BMONI_API_SECRET` | **Node.js Server Only** | BMONI private API secret for authenticated queries. |
| `BMONI_WEBHOOK_KEY` | **Node.js Server Only** | Secret key used for cryptographic HMAC-SHA256 webhook validation. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Node.js Server Only** | Administrative key bypassing RLS for webhook background writes. |
| `DATABASE_URL` | **Node.js Server Only** | PostgreSQL connection string. |
| `GEMINI_API_KEY` | **Server-Side Proxy** | Google Gemini SDK key for AI insights. |
| `VITE_SUPABASE_URL` | **Client Bundle** | Public Supabase API gateway URL (Safe for client). |
| `VITE_SUPABASE_ANON_KEY` | **Client Bundle** | Public anonymous client key (Subject to RLS restrictions). |

### 3.2 Template Configuration (`.env.example`)
The repository maintains a `.env.example` file documenting all required configuration variables by purpose without disclosing secret values:

```bash
# Server Configuration (Port 3000)
PORT=3000
NODE_ENV=development

# Database Configuration (Node.js Scope - Target)
# DATABASE_URL=postgresql://user:password@localhost:5432/zuko

# AI Service Configuration
# GEMINI_API_KEY=your_gemini_api_key_here

# BMONI Sandbox Credentials (Node.js Scope - Target)
# BMONI_API_KEY=your_bmoni_sandbox_key
# BMONI_API_SECRET=your_bmoni_sandbox_secret
# BMONI_WEBHOOK_KEY=your_bmoni_webhook_signing_secret
```

---

## 4. Webhook Security & Tamper Prevention

1. **HMAC-SHA256 Cryptographic Verification**: Inbound webhooks from payment providers must be verified using constant-time comparison (`crypto.timingSafeEqual`) to prevent timing attacks.
2. **Payload Replay Protection**: Webhook headers should be validated against timestamp windows (e.g., rejecting events older than 300 seconds).
3. **Idempotency Guard (`D04`)**: The database requires a unique constraint on `transactions.external_reference`. Duplicate payloads cannot create duplicate ledger debits.

---

## 5. Security Status Audit

| Security Boundary | Target Standard | Current Repository Status |
| :--- | :--- | :--- |
| **User Data Isolation** | PostgreSQL Row-Level Security (`D09`) | `[PLANNED]` (Awaiting Supabase deployment; currently local in-memory) |
| **Credential Protection**| Zero secrets in client bundle | `[IMPLEMENTED]` (No keys committed in repository) |
| **Webhook Verification** | HMAC-SHA256 signature verification | `[PLANNED]` (Specification documented in `docs/bmoni-integration.md`) |
| **Idempotency Safeguard**| Duplicate rejection via reference (`D04`)| `[IMPLEMENTED]` (Service-level check in `financeService.createTransaction`) |
| **Demo Mode Disclosure**| Explicit notice of mock rails (`D12`) | `[IMPLEMENTED]` (`WalletCard` displays demo badge and boundary notes) |
