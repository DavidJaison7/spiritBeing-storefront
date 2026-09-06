# Spirit Being Design System

Canonical UI library for the SpiritBeing storefront. All shared patterns live under the `sb-` prefix.

**Live reference:** open `#design-system` in the app (e.g. `http://localhost:5173/#design-system`).

---

## File structure

```
src/design-system/
├── tokens.css       ← CSS custom properties (colors, type, spacing, motion)
├── typography.css   ← Text style utilities
├── layout.css       ← Containers, grids, stacks
├── components.css   ← Buttons, forms, tabs, tags, cards
├── tokens.ts        ← JS/TS token exports + class name map
├── index.css        ← Single import for the whole system
└── README.md        ← This file
```

Import once in `src/index.css`:

```css
@import "./design-system/index.css";
```

---

## Typography

| Role | Class | Font | Use |
|------|-------|------|-----|
| Display XL | `.sb-type-display-xl` | Anton | Hero wordmarks, FAQ title |
| Display LG | `.sb-type-display-lg` | Anton | Section heroes |
| Headline | `.sb-type-headline` | Anton | Tile titles, card headers |
| Title | `.sb-type-title` | Archivo | Subsection headings |
| Body | `.sb-type-body` | Archivo | Paragraphs |
| Body SM | `.sb-type-body-sm` | Archivo | Secondary copy |
| Caption | `.sb-type-caption` | Archivo | Meta, footnotes |
| Label | `.sb-type-label` | Archivo | Uppercase micro labels |
| Eyebrow | `.sb-type-eyebrow` | Archivo | Blue dot + label (mega menus) |
| Script | `.sb-type-script` | Pinyon Script | Accent words |
| Mono | `.sb-type-mono` | Monospace | Ticker, technical labels |

**Font tokens:** `--sb-font-display`, `--sb-font-body`, `--sb-font-script`

Legacy Tailwind helpers still work: `.font-anton`, `.font-script`, `.font-headline`

---

## Color palette

### Surfaces
| Token | Hex | Usage |
|-------|-----|-------|
| `--sb-color-paper` | `#fbf9f9` | App background |
| `--sb-color-white` | `#ffffff` | Inputs, tiles |
| `--sb-color-void-soft` | `#0a0a0a` | Instagram, dark bands |
| `--sb-color-void` | `#000000` | Hero video, statement |

### Text
| Token | Hex |
|-------|-----|
| `--sb-color-ink` | `#1b1c1c` |
| `--sb-color-muted` | `#737373` |
| `--sb-color-ash` | `#666666` |
| `--sb-color-steel` | `#888888` |

### Accent (use `--sb-color-accent` as canonical)
| Token | Hex | Notes |
|-------|-----|-------|
| `--sb-color-accent` | `#0b3dff` | Primary brand blue |
| `--sb-color-accent-bright` | `#2040ff` | Shop tabs, wishlist |
| `--sb-color-accent-mega` | `#1e44ff` | Mega menu electric |

### Semantic
`--sb-color-live`, `--sb-color-wishlist`, `--sb-color-discord`, `--sb-color-success`, `--sb-color-error`

---

## Spacing

4px base scale: `--sb-space-1` (4px) through `--sb-space-16` (64px).

Common patterns:
- Section padding: `--sb-space-10`
- Card padding: `--sb-space-3` / `--sb-space-4`
- Form gap: `--sb-space-2`
- Header → content: `--sb-space-4` (16px)

---

## Border radius

| Token | Value |
|-------|-------|
| `--sb-radius-xs` | 6px — pills, tags |
| `--sb-radius-md` | 12px — buttons, inputs |
| `--sb-radius-lg` | 14px — tiles, mega menu |
| `--sb-radius-xl` | 16px — drawer |
| `--sb-radius-pill` | 999px — chips, badges |
| `--sb-radius-fluid` | clamp — Instagram cards |

---

## Motion

| Token | Value |
|-------|-------|
| `--sb-ease-standard` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--sb-ease-liquid` | `cubic-bezier(0.22, 1.15, 0.36, 1)` |
| `--sb-duration-base` | `0.25s` |
| `--sb-duration-unfold` | `760ms` — accordions |

---

## Layout

| Class | Purpose |
|-------|---------|
| `.sb-container` | Max 1600px + gutter |
| `.sb-container--xl` | Max 1720px (mega menus) |
| `.sb-stack` | Vertical flex, 16px gap |
| `.sb-cluster` | Horizontal wrap |
| `.sb-grid-4` | 4-col product grid |
| `.sb-grid-bento` | 12-col mega menu |
| `.sb-grid-shop` | 12-col shop mega |
| `.sb-rule` | 1px divider |

---

## Buttons

```html
<button class="sb-btn sb-btn--primary">Primary</button>
<button class="sb-btn sb-btn--secondary">Secondary</button>
<button class="sb-btn sb-btn--accent">Accent</button>
<button class="sb-btn sb-btn--ghost">Ghost</button>
<a class="sb-drawer-auth-cta">Full-width CTA</a>
<a class="sb-drawer-auth-cta sb-drawer-auth-cta--compact">Compact CTA</a>
<button class="sb-btn sb-btn--link">Link CTA <span>→</span></button>
```

---

## Forms

```html
<div class="sb-field">
  <label class="sb-field-label">Email</label>
  <input class="sb-field-input" type="email" placeholder="Email address" />
</div>

<form class="sb-newsletter-form">
  <input class="sb-field-input" type="email" />
  <button class="sb-drawer-auth-cta sb-drawer-auth-cta--compact">Join</button>
</form>
```

---

## Tabs

```html
<div class="sb-tabs-bar">
  <div class="sb-tabs">
    <button class="sb-tab is-active">Brand</button>
    <button class="sb-tab">Orders</button>
  </div>
</div>
```

Pill variant: `.sb-tabs.sb-tabs--pill`

Backward compat: `.sb-tab-btn.active` (ShopCategoryView)

---

## Tags · Pills · Chips

```html
<span class="sb-tag">Tag</span>
<span class="sb-tag sb-tag--accent">Accent</span>
<span class="sb-pill is-live">Live</span>
<span class="sb-pill is-coming">Coming Soon</span>
<div class="sb-chips">
  <span class="sb-chip">Oversized</span>
  <span class="sb-chip">Cotton</span>
</div>
<span class="sb-badge">Instagram</span>
```

Mega menu uses `.sb-pill`, `.sb-chips span` — aligned to these tokens.

---

## Dark sections

Wrap content in `.sb-surface-dark` for automatic input/text adjustments on `#0a0a0a` backgrounds.

---

## Migration guide

1. **New UI** → use `sb-*` classes from this library first.
2. **Existing pages** → legacy aliases (`--paper`, `--electric`, `--r`) still work via `tokens.css`.
3. **Tailwind** → prefer CSS variables over hardcoded hex: `bg-[var(--sb-color-paper)]`
4. **TypeScript** → import from `src/design-system/tokens.ts` for class names and color constants.

---

## Z-index scale

| Token | Value | Use |
|-------|-------|-----|
| `--sb-z-dropdown` | 40 | Sticky tabs |
| `--sb-z-scrim` | 60 | Mega scrim |
| `--sb-z-mega` | 70 | Mega menu |
| `--sb-z-drawer` | 80 | Cart / nav drawer |
| `--sb-z-modal` | 90 | Modals |
