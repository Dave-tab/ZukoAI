# Zuko — Engineering Standards & Production Readiness

---

## 1. Scope Control & Architectural Integrity

1. **Inspect Before Modifying**: Never edit or add code based on outdated assumptions. Always audit current repository files and existing documentation first.
2. **Preserve Approved Boundaries**: Do not refactor established service abstractions (`IFinanceService`), change database models, or redesign user flows without explicit owner approval.
3. **No Unilateral Resolution of Blockers**: When encountering an open decision (`DEC-001`–`DEC-007`), document the blocker and await explicit owner authorization rather than implementing an assumption.
4. **Cross-Developer Coordination**: Any proposed modification affecting shared interfaces, canonical types, or API contracts must be reviewed with affected team members before execution.

---

## 2. Frontend Design Constitution & Zero-Pill Discipline

Zuko adheres to rigorous design discipline to ensure the product feels like a purpose-built, high-utility financial instrument rather than generic AI prototype slop.

### 2.1 The Zero-Pill Discipline
- **Strict Rule**: **NEVER** use `rounded-full` on rectangular interactive controls, buttons, cards, containers, badges, chips, or progress bars.
- **Permitted Radii**: Use structured geometry: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, or `rounded-2xl`.
- **Strict Exception**: Only circular 1:1 aspect-ratio icon buttons or user avatars may use `rounded-full` (e.g., `w-8 h-8 rounded-full`).
- **Implementation Audit**:
  - `Badge.tsx`: Uses `rounded-md` (previously `rounded-full`, corrected).
  - `BudgetProgressBar.tsx`: Uses `rounded-md` for progress tracks.
  - `GoalCard.tsx` / `BudgetCard.tsx`: Uses `rounded-2xl` for containers and `rounded-lg` for status chips.

### 2.2 Anti-AI Slop & Aesthetic Standards
- **No Floating Neon Blobs**: Avoid generic neon purple-cyan gradients or meaningless background blobs. Use intentional, muted financial palettes (deep slate, emerald green, warm amber, crimson alert).
- **Tabular Numerics for Currency**: All financial figures must use `tabular-nums` and font monospacing where necessary to prevent visual layout shifts during updates.
- **Information Density**: Deliver compact, scannable student metrics rather than oversized empty cards.

---

## 3. Mobile Ergonomics & Accessibility

1. **Touch Target Size**: All mobile buttons, navigation icons, and input controls must maintain a minimum touch target area of **44 × 44 pixels**.
2. **Viewport & Overflow Control**: Prevent horizontal scroll leaks on mobile viewports (`max-w-full overflow-x-hidden`).
3. **Safe Area & Bottom Navigation Spacing**: Views must include adequate bottom padding (minimum `pb-24` or `80px`) to prevent bottom navigation bars from obscuring action buttons or card footers.
4. **Color Contrast & Readability**: Body text must achieve a minimum contrast ratio of 4.5:1 against card backgrounds (e.g., `text-slate-900` or `text-slate-700` on white; `text-white` on dark emerald).

---

## 4. Comprehensive State Handling Standards

Every user flow must account for the four fundamental UI states:

```
┌────────────────────────────────────────────────────────┐
│                   UI STATE SPECTRUM                    │
├──────────────┬──────────────┬──────────────┬───────────┤
│   LOADING    │    EMPTY     │    ERROR     │  SUCCESS  │
└──────────────┴──────────────┴──────────────┴───────────┘
```

### 4.1 Loading States
- Render skeleton placeholders or subtle spinners during asynchronous operations.
- Avoid full-page blocking spinners for minor queries.

### 4.2 Empty States
- When a data collection is empty (e.g., 0 transactions, 0 active budgets, 0 goals), the view must render a friendly, contextual message with an immediate CTA button (e.g., `"Set First Milestone"`).
- Never render a blank white container or broken calculation meters.

### 4.3 Error States
- Clearly explain what went wrong in plain, student-friendly language.
- Never expose raw stack traces, SQL errors, or unformatted HTTP status codes to users.
- Provide actionable next steps (e.g., `"Retry"`, `"Check Internet Connection"`).
- Failed operations must **never** be presented as successful.

### 4.4 Success States (Toast System)
- Successful data updates must provide immediate user feedback via the centralized toast notification system (`src/components/shared/Toast.tsx`).
- Toasts auto-dismiss after 4 seconds, provide an accessible dismiss button (`X`), and include ARIA live roles (`role="status"`).

---

## 5. Production Readiness Criteria

Before any code deployment or staging release is certified as production-ready, the engineering team must satisfy the following checklist:

| Category | Verification Criteria | Status |
| :--- | :--- | :--- |
| **Configuration** | All environment variables documented in `.env.example`; zero committed secrets. | `[VERIFIED]` |
| **Type Safety** | Clean TypeScript compilation check (`tsc --noEmit`) with 0 errors. | `[VERIFIED]` |
| **Financial Math** | 26/26 automated unit and integration tests passing (`npm run test:finance`). | `[VERIFIED]` |
| **Timezone Logic**| Budget cycles tested against `Africa/Lagos` month rollover boundaries (`D06`). | `[VERIFIED]` |
| **State Handling**| Empty, loading, and error states handled across Dashboard, Budgets, and Goals. | `[VERIFIED]` |
| **Zero-Pill Rule** | No illegal `rounded-full` classes on rectangular buttons, badges, or progress tracks. | `[VERIFIED]` |
| **Database RLS** | PostgreSQL Row-Level Security policies deployed and verified (`D09`). | `[PLANNED]` (Blocker) |
| **Live BMONI Rails**| Webhook HMAC verification and live balance client deployed and tested. | `[PLANNED]` (Blocker) |
| **Demo Disclosures**| Clear labeling that prototype operates on simulated mock rails (`D12`). | `[VERIFIED]` |

> **Production Sign-Off Rule**: The application must **NOT** be declared production-ready solely because it builds and renders cleanly in a local preview. Production certification requires backend database deployment, live BMONI connectivity, and verified multi-user security.
