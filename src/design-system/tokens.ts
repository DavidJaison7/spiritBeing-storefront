/**
 * Spirit Being Design System — programmatic tokens
 * Mirror of CSS custom properties in tokens.css
 */

export const sbColors = {
  paper: '#fbf9f9',
  paperWarm: '#f2f0ea',
  ink: '#1b1c1c',
  inkDeep: '#16141c',
  white: '#ffffff',
  muted: '#737373',
  ash: '#666666',
  steel: '#888888',
  accent: '#0b3dff',
  accentBright: '#2040ff',
  accentMega: '#1e44ff',
  void: '#000000',
  voidSoft: '#0a0a0a',
  live: '#ff3e3e',
  wishlist: '#f43f5e',
  discord: '#5865f2',
} as const;

export const sbFonts = {
  display: "'Anton', sans-serif",
  body: "'Archivo', sans-serif",
  script: "'Pinyon Script', cursive",
  mono: "ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
} as const;

export const sbSpacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

export const sbRadius = {
  xs: '6px',
  sm: '10px',
  md: '12px',
  lg: '14px',
  xl: '16px',
  pill: '999px',
  fluid: 'clamp(14px, 2.5vw, 22px)',
} as const;

export const sbContainers = {
  sm: '1280px',
  md: '1600px',
  lg: '1680px',
  xl: '1720px',
} as const;

export const sbMotion = {
  easeStandard: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeLiquid: 'cubic-bezier(0.22, 1.15, 0.36, 1)',
  durationFast: '0.2s',
  durationBase: '0.25s',
  durationUnfold: '760ms',
} as const;

/** Component class name reference */
export const sbComponents = {
  btn: {
    primary: 'sb-btn sb-btn--primary',
    secondary: 'sb-btn sb-btn--secondary',
    accent: 'sb-btn sb-btn--accent',
    ghost: 'sb-btn sb-btn--ghost',
    compact: 'sb-btn sb-btn--primary sb-btn--compact',
    link: 'sb-btn sb-btn--link',
    drawerCta: 'sb-drawer-auth-cta',
    drawerCtaCompact: 'sb-drawer-auth-cta sb-drawer-auth-cta--compact',
  },
  form: {
    field: 'sb-field',
    label: 'sb-field-label',
    input: 'sb-field-input',
    textarea: 'sb-field-textarea',
    newsletter: 'sb-newsletter-form',
  },
  tabs: {
    bar: 'sb-tabs-bar',
    list: 'sb-tabs',
    tab: 'sb-tab',
    pillList: 'sb-tabs sb-tabs--pill',
  },
  tags: {
    tag: 'sb-tag',
    tagAccent: 'sb-tag sb-tag--accent',
    pill: 'sb-pill',
    pillLive: 'sb-pill is-live',
    chip: 'sb-chip',
    chips: 'sb-chips',
    badge: 'sb-badge',
  },
  type: {
    displayXl: 'sb-type-display-xl',
    displayLg: 'sb-type-display-lg',
    headline: 'sb-type-headline',
    body: 'sb-type-body',
    label: 'sb-type-label',
    eyebrow: 'sb-type-eyebrow',
    script: 'sb-type-script',
    mono: 'sb-type-mono',
  },
  layout: {
    container: 'sb-container',
    stack: 'sb-stack',
    cluster: 'sb-cluster',
    grid4: 'sb-grid-4',
    bento: 'sb-grid-bento',
    rule: 'sb-rule',
  },
} as const;

export type SbColor = keyof typeof sbColors;
export type SbComponent = typeof sbComponents;
