# KissURL Design System (DESIGN.md)

> Fully implemented design tokens, component architecture, and interaction states for the public KissURL application.

---

## 1. Core Visual Principles & 60 / 30 / 10 Implementation

The actual code in `src/index.css` implements the **60 / 30 / 10** token hierarchy:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 60% — NEUTRAL BASE (Light Mode Default)                                │
│   • Canvas Background: var(--bg-canvas) (#f8fafc / #090d16)            │
│   • Primary Card Surface: var(--bg-surface) (#ffffff / #0f172a)        │
│   • Subdued Docks: var(--bg-surface-subtle) (#f8fafc / #0b1120)        │
├────────────────────────────────────────────────────────────────────────┤
│ 30% — STRUCTURAL HIERARCHY & TYPOGRAPHY                                │
│   • Headings & Primary Text: var(--text-primary) (#0f172a, >12:1)      │
│   • Body Text: var(--text-secondary) (#334155, >7:1)                   │
│   • Metadata & Labels: var(--text-muted) (#64748b, >4.5:1)             │
│   • Structural Borders: var(--border-subtle) (#e2e8f0)                 │
├────────────────────────────────────────────────────────────────────────┤
│ 10% — HIGH-IMPACT ACCENT                                               │
│   • Primary CTA & Shorten Action: var(--accent-primary) (#2563eb)      │
│   • Tactile Hover: var(--accent-hover) (#1d4ed8)                       │
│   • Accent Wash: var(--accent-subtle) (#eff6ff)                        │
│   • Semantic Statuses: Success (#047857), Error (#be123c)              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Typography Scale (Typographer-Informed)

| Token / Role | Size / Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Hero Title** | `clamp(2rem, 4vw, 2.75rem)` / `1.15` | `800` | Primary landing headline |
| **Section Title** | `1.15rem` / `1.3` | `800` | "Your Recent Links", modal titles |
| **Body Large** | `clamp(0.95rem, 1.8vw, 1.05rem)` / `1.55` | `400 / 500` | Hero subtitle |
| **Body** | `0.95rem` / `1.5` | `400 / 500` | Input fields, descriptions |
| **Caption / Label** | `0.725rem` / `1.4` | `700` | Form labels (uppercase) |
| **Tabular Monospace** | `0.875rem` / `1.4` | `600 / 700` | Short URLs, click counts, IP data |

---

## 3. Spacing Scale
All spacing in the application uses strict, relative tokens:
- `--space-1`: `0.25rem` (4px)
- `--space-2`: `0.5rem` (8px)
- `--space-3`: `0.75rem` (12px)
- `--space-4`: `1rem` (16px)
- `--space-6`: `1.5rem` (24px)
- `--space-8`: `2rem` (32px)

---

## 4. Component Language & States

1. **Shortener Hero (`ShortenerHero.jsx`)**:
   - **Empty**: Focused, clean input with prompt.
   - **Typing / Validating**: Auto-protocol prepend (`https://`), polite error messaging.
   - **Loading**: Non-blocking indicator, disabled button.
   - **Major Result State**: High-contrast result card with 1-click Copy, Open, QR generator, and Customize shortcut.
2. **Recent Links (`RecentLinks.jsx`)**:
   - Subordinated link history showing user's session links with quick copy, QR peek, and CSV export.
3. **Trust Features (`TrustFeatures.jsx`)**:
   - 3 authentic value pillars (Sub-15ms edge latency, Zero tracking cookies, Vector QR codes).
4. **Inclusive Accessibility**:
   - High contrast text ($>7:1$).
   - Universal `:focus-visible` outline.
   - Dynamic zoom resilience from 80% to 200%.
   - Touch targets $\ge 44\text{px}$.
