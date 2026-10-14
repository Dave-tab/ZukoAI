# Zuko — AI Assistant & Financial Intelligence Specification

---

## 1. Operating Charter: Assistive AI Philosophy (`D08`)

Artificial Intelligence in Zuko serves strictly as an **assistive intelligence layer**, not an autonomous financial actor.

### Guiding Principles:
1. **User Authority Takes Absolute Precedence (`D08`)**: The user always has final authority over transaction categories, budget allocations, and goal milestones. An AI suggestion must never silently overwrite a student's explicit choice.
2. **Deterministic Math Over Model Guesses**: Financial calculations (balances, remaining limits, percent used) are computed by deterministic TypeScript math functions (`src/utils/financeCalculations.ts`), **never** generated or estimated by an LLM prompt.
3. **Transparent Uncertainty**: When the AI model cannot categorize a transaction with high confidence, it flags the record for user review rather than guessing and corrupting budget envelope metrics.

---

## 2. Core AI Capabilities & Functional Pipeline

```
┌────────────────────────────────────────────────────────┐
│             STUDENT INPUT / TRANSACTION FEED           │
│  - POS description: "UNILAG BKSTR CSC301 TEXT"         │
│  - Raw receipt image or voice note                     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│              PYTHON AI SERVICE / GEMINI SDK            │
│  - Text normalization & merchant entity extraction     │
│  - Category taxonomy classification (Shared Vocabulary)│
│  - Confidence scoring calculation                      │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
    [High Confidence >= T]      [Low Confidence < T]
             │                           │
             ▼                           ▼
┌────────────────────────┐  ┌────────────────────────────┐
│ Suggested Category     │  │ Flagged for User Review    │
│ (e.g. Books & Academic)│  │ ("Is this Books or Other?")│
└────────────────────────┘  └────────────────────────────┘
```

### 2.1 Assistive Transaction Categorization (`D08`)
- Analyzes messy raw merchant strings (e.g., `PAYSTACK-FOOD-UNILAG-CAFE`, `OPAY-POS-TUNDE-PRINTING`) and suggests matching categories from the shared vocabulary.
- *Open Decision `DEC-006`*: The numerical threshold $T$ (e.g., 0.85) and the exhaustive taxonomy remain subject to owner approval.

### 2.2 Receipt OCR & Text Extraction
- Extracts merchant name, transaction date, line items, and total amount in Nigerian Naira (`₦`) from smartphone photos of POS slips or bookstore invoices.
- Pre-populates the manual transaction entry form for student review and approval before persisting.

### 2.3 Contextual Student Spending Insights
- Monitors spending velocity against calendar-month days remaining:
  - *High-Velocity Alert*: "You have consumed 71% of your Food & Dining budget with 19 days remaining in October."
  - *Milestone Velocity*: "Saving an extra ₦2,500/week will complete your Dev Laptop goal by December 15."
  - *Campus Optimization*: "Off-campus shuttle expenses averaged ₦1,200/day last week. Consider a monthly student BRT card."

---

## 3. UI Interaction Standards & Modal Behavior

The application provides two complementary entry points for AI interaction:

### 3.1 Quick Floating Modal (`FloatingAskZukoModal`)
- **Purpose**: Rapid contextual questions and immediate insight deep-dives without navigating away from the current view.
- **Trigger**: Clicked via `"Ask Zuko"` button on Home or `"Ask Zuko about this"` on an `AIInsightCard`.
- **Interaction Standards**:
  1. **Viewport Containment**: Stays fully centered within visible viewport across all screen sizes.
  2. **Focus Trap & Accessibility**: Captures keyboard focus while open; supports `Escape` key dismissal.
  3. **Backdrop Dismissal**: Clicking outside the modal container gracefully closes the overlay.
  4. **Scroll Lock**: Body scroll is locked while modal is active to prevent awkward background scroll leaks.
  5. **Pre-Seeded Context**: When opened from an insight card, pre-populates relevant context and suggested student prompts.

### 3.2 Full AI Assistant Destination (`AIAssistantPage`)
- **Purpose**: In-depth financial advisory, comprehensive spending breakdown inquiries, and semester planning.
- **Trigger**: Accessible via the 5th destination on both desktop sidebar and mobile bottom navigation (`D11`).
- **Features**:
  - Full-screen conversational view with interactive student prompt chips.
  - Active financial context injection (current balances, active budgets, goal targets).
  - Categorized query suggestions (Budget Strategy, Impulse Control, Savings Milestones).

---

## 4. Integration Boundaries & Security

1. **Server-Side API Proxying**: Live LLM calls must occur via a server-side route or secure backend function. **Never expose the `GEMINI_API_KEY` to client-side code.**
2. **Context Minimization**: When passing financial context to an LLM, exclude student matriculation numbers, email addresses, and private card identifiers. Pass only aggregated category amounts and velocity ratios.
