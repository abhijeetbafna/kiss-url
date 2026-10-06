# KissURL Design System (DESIGN.md)

> Grounded in **Kigen Design** token systems, **Typographer** hierarchy, **Inclusive Design Principles**, **Unicorn Studio** purposeful micro-interactions, **Inspo.page** UI patterns, and **Impeccable.style** visual authority.

---

## 1. Core Visual Principles & 60 / 30 / 10 Balance

KissURL applies the **60 / 30 / 10** color rule to ensure visual calm, clarity, and deliberate emphasis:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 60% — NEUTRAL / BASE                                                   │
│   • Canvas background: #f8fafc (Light) / #090d16 (Dark)               │
│   • Primary card surfaces: #ffffff (Light) / #0f172a (Dark)           │
│   • Elevated surfaces & docks: #ffffff / #162036                       │
├────────────────────────────────────────────────────────────────────────┤
│ 30% — SECONDARY / STRUCTURAL SUPPORT                                   │
│   • Primary typography: Slate-900 (#0f172a)                           │
│   • Secondary body text: Slate-700 (#334155)                           │
│   • Borders & dividers: Slate-200 (#e2e8f0)                           │
│   • Subdued backgrounds & tags: Slate-100 (#f1f5f9)                   │
├────────────────────────────────────────────────────────────────────────┤
│ 10% — HIGH-IMPACT ACCENT                                               │
│   • Primary brand & interactive CTA: Electric Cobalt (#2563eb)        │
│   • Hover state: #1d4ed8 / Active: #1e40af                            │
│   • Accent wash: #eff6ff                                              │
│   • Selective status indicators: Emerald (#059669), Amber (#d97706)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Typography Hierarchy (Typographer-Informed)

| Level | Size / Line Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display 1** | `clamp(2.25rem, 4vw, 3.25rem)` / `1.15` | `800` | `-0.035em` | Landing hero headline |
| **Display 2** | `clamp(1.75rem, 3vw, 2.25rem)` / `1.2` | `800` | `-0.025em` | Section headers |
| **Title Medium** | `1.25rem` / `1.35` | `700` | `-0.015em` | Card titles, modal headers |
| **Body Large** | `1.05rem` / `1.6` | `400 / 500` | `0` | Lead paragraphs, hero subtext |
| **Body Regular** | `0.925rem` / `1.55` | `400 / 500` | `0` | Default body, input text, table rows |
| **Caption / Label** | `0.75rem` / `1.4` | `700` | `+0.04em` | Form labels, table headers (uppercase) |
| **Tabular Monospace** | `0.85rem` / `1.4` | `600` | `0` | Slugs, URLs, click counts, IP metadata |

---

## 3. Inclusive Design Standards

1. **High Contrast Compliance**: All primary body text achieves $>7:1$ contrast against the surface; display titles achieve $>12:1$ contrast.
2. **Dynamic Browser Zoom (80% to 200%)**:
   - Layouts use relative units (`rem`, `%`, `flex-wrap`, `minmax(0, 1fr)`).
   - No fixed pixel widths on responsive text containers.
   - Touch targets are minimum `44px × 44px`.
3. **Non-Color-Only Statuses**: Errors and success states always pair clear iconography and descriptive text alongside semantic colors.
4. **Accessible Focus**: Clear, high-contrast `:focus-visible` ring (`2px solid var(--color-accent)` with `2px offset`).

---

## 4. Motion & Micro-Interactions (Purposeful & Restrained)

- **Timing**: State feedback `150ms`, drawer/modal entrance `200ms`.
- **Easing**: Spring curve `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Interactions with Feedback**:
  - Input focus elevation.
  - Shorten button loading pulse.
  - Success result reveal with subtle spring animation.
  - Copy to clipboard checkmark confirmation.
  - QR Code real-time live canvas redraw.

---

## 5. Anti-UI Slop Guidelines

- ❌ No fake customer testimonials or fake 5-star badges.
- ❌ No meaningless floating cards without real functions.
- ❌ No giant neon gradients that obscure text legibility.
- ✅ Real interactive modules with instant live feedback.
- ✅ Real tabular analytics with CSV/JSON export.
- ✅ Real OpenGraph preview dock for Twitter/X, LinkedIn, WhatsApp, and Slack.
