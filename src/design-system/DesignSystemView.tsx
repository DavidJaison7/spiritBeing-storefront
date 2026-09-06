import React, { useState } from 'react';
import './DesignSystemView.css';

const SECTIONS = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing & Radius' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'forms', label: 'Forms' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'tags', label: 'Tags & Chips' },
  { id: 'layout', label: 'Layout & Grids' },
  { id: 'surfaces', label: 'Cards & Surfaces' },
] as const;

const SWATCHES = [
  { name: 'paper', var: '--sb-color-paper' },
  { name: 'ink', var: '--sb-color-ink' },
  { name: 'accent', var: '--sb-color-accent' },
  { name: 'accent-bright', var: '--sb-color-accent-bright' },
  { name: 'accent-mega', var: '--sb-color-accent-mega' },
  { name: 'muted', var: '--sb-color-muted' },
  { name: 'ash', var: '--sb-color-ash' },
  { name: 'steel', var: '--sb-color-steel' },
  { name: 'void-soft', var: '--sb-color-void-soft' },
  { name: 'live', var: '--sb-color-live' },
  { name: 'wishlist', var: '--sb-color-wishlist' },
  { name: 'discord', var: '--sb-color-discord' },
];

interface DesignSystemViewProps {
  onBack?: () => void;
}

export const DesignSystemView: React.FC<DesignSystemViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('brand');
  const [pillTab, setPillTab] = useState('all');

  return (
    <div className="sb-ds">
      <header className="sb-ds__header sb-container">
        <div>
          <p className="sb-type-eyebrow">Internal reference</p>
          <h1 className="sb-type-display-sm">Spirit Being Library</h1>
          <p className="sb-type-body-sm sb-ds__intro">
            Design tokens and components for consistent UI. Import via{' '}
            <code>src/design-system/index.css</code> · See{' '}
            <code>src/design-system/README.md</code>
          </p>
        </div>
        {onBack && (
          <button type="button" className="sb-btn sb-btn--ghost sb-btn--compact" onClick={onBack}>
            Back to store
          </button>
        )}
      </header>

      <div className="sb-ds__layout sb-container">
        <nav className="sb-ds__nav" aria-label="Design system sections">
          {SECTIONS.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="sb-ds__nav-link">
              {section.label}
            </a>
          ))}
        </nav>

        <main className="sb-ds__main sb-stack sb-stack--lg">
          <section id="colors" className="sb-ds__section">
            <h2 className="sb-type-headline">Color palette</h2>
            <div className="sb-ds__swatches">
              {SWATCHES.map((swatch) => (
                <div key={swatch.name} className="sb-ds__swatch">
                  <div className="sb-ds__swatch-color" style={{ background: `var(${swatch.var})` }} />
                  <p className="sb-type-label">{swatch.name}</p>
                  <code className="sb-ds__code">{swatch.var}</code>
                </div>
              ))}
            </div>
          </section>

          <section id="typography" className="sb-ds__section">
            <h2 className="sb-type-headline">Typography</h2>
            <div className="sb-stack">
              <p className="sb-type-display-xl">Display XL</p>
              <p className="sb-type-display-lg">Display LG</p>
              <p className="sb-type-display-sm">Display SM</p>
              <p className="sb-type-headline">Headline · Tile title</p>
              <p className="sb-type-title">Title · Subsection</p>
              <p className="sb-type-body">Body — Faith. Identity. Purpose. Designed for the chosen ones.</p>
              <p className="sb-type-body-sm">Body SM — Secondary descriptive copy.</p>
              <p className="sb-type-caption">Caption — meta and footnotes</p>
              <p className="sb-type-label">Label · uppercase micro</p>
              <p className="sb-type-eyebrow">Eyebrow</p>
              <p className="sb-type-script">Script accent</p>
              <p className="sb-type-mono">Mono · 24/7 online store</p>
            </div>
          </section>

          <section id="spacing" className="sb-ds__section">
            <h2 className="sb-type-headline">Spacing & radius</h2>
            <div className="sb-ds__spacing-row">
              {[1, 2, 3, 4, 6, 8].map((n) => (
                <div key={n} className="sb-ds__space-block" style={{ width: `var(--sb-space-${n})` }}>
                  <span>{n}</span>
                </div>
              ))}
            </div>
            <div className="sb-cluster sb-cluster--lg sb-ds__radius-demo">
              <div className="sb-ds__radius-box" style={{ borderRadius: 'var(--sb-radius-xs)' }}>xs</div>
              <div className="sb-ds__radius-box" style={{ borderRadius: 'var(--sb-radius-md)' }}>md</div>
              <div className="sb-ds__radius-box" style={{ borderRadius: 'var(--sb-radius-lg)' }}>lg</div>
              <div className="sb-ds__radius-box" style={{ borderRadius: 'var(--sb-radius-pill)' }}>pill</div>
              <div className="sb-ds__radius-box" style={{ borderRadius: 'var(--sb-radius-fluid)' }}>fluid</div>
            </div>
          </section>

          <section id="buttons" className="sb-ds__section">
            <h2 className="sb-type-headline">Buttons & CTAs</h2>
            <div className="sb-cluster sb-cluster--lg">
              <button type="button" className="sb-btn sb-btn--primary sb-btn--compact">Primary</button>
              <button type="button" className="sb-btn sb-btn--secondary sb-btn--compact">Secondary</button>
              <button type="button" className="sb-btn sb-btn--accent sb-btn--compact">Accent</button>
              <button type="button" className="sb-btn sb-btn--ghost sb-btn--compact">Ghost</button>
              <button type="button" className="sb-btn sb-btn--link">Explore <span>→</span></button>
            </div>
            <div className="sb-ds__full-width-demo">
              <button type="button" className="sb-drawer-auth-cta">Full width drawer CTA</button>
            </div>
          </section>

          <section id="forms" className="sb-ds__section">
            <h2 className="sb-type-headline">Forms</h2>
            <div className="sb-ds__form-grid">
              <div className="sb-field">
                <label className="sb-field-label" htmlFor="ds-email">Email</label>
                <input id="ds-email" className="sb-field-input" type="email" placeholder="Email address" />
              </div>
              <div className="sb-field">
                <label className="sb-field-label" htmlFor="ds-note">Message</label>
                <textarea id="ds-note" className="sb-field-textarea" placeholder="Your note…" />
              </div>
            </div>
            <form className="sb-newsletter-form sb-ds__newsletter" onSubmit={(e) => e.preventDefault()}>
              <input className="sb-field-input" type="email" placeholder="Email address" />
              <button type="submit" className="sb-drawer-auth-cta sb-drawer-auth-cta--compact">Join</button>
            </form>
          </section>

          <section id="tabs" className="sb-ds__section">
            <h2 className="sb-type-headline">Tabs</h2>
            <div className="sb-tabs-bar sb-ds__tabs-bar">
              <div className="sb-tabs">
                {['brand', 'orders', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`sb-tab${activeTab === tab ? ' is-active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="sb-tabs sb-tabs--pill">
              {['all', 'tees', 'caps'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`sb-tab${pillTab === tab ? ' is-active' : ''}`}
                  onClick={() => setPillTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          <section id="tags" className="sb-ds__section">
            <h2 className="sb-type-headline">Tags · Pills · Chips</h2>
            <div className="sb-cluster sb-cluster--lg">
              <span className="sb-tag">Tag</span>
              <span className="sb-tag sb-tag--accent">Accent</span>
              <span className="sb-tag sb-tag--live">Live</span>
              <span className="sb-pill">Default</span>
              <span className="sb-pill is-live">Live</span>
              <span className="sb-pill is-coming">Coming</span>
              <span className="sb-badge">Badge</span>
            </div>
            <div className="sb-chips">
              <span className="sb-chip">Oversized</span>
              <span className="sb-chip">Heavyweight</span>
              <span className="sb-chip sb-chip--light">Cotton</span>
            </div>
          </section>

          <section id="layout" className="sb-ds__section">
            <h2 className="sb-type-headline">Layout & grids</h2>
            <hr className="sb-rule sb-rule--soft" />
            <div className="sb-grid-4 sb-ds__grid-demo">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="sb-ds__grid-cell">Col {n}</div>
              ))}
            </div>
          </section>

          <section id="surfaces" className="sb-ds__section">
            <h2 className="sb-type-headline">Cards & surfaces</h2>
            <div className="sb-grid-2 sb-ds__surface-grid">
              <div className="sb-card sb-ds__card-demo">
                <p className="sb-type-title">Light card</p>
                <p className="sb-type-caption">`.sb-card` on paper background</p>
              </div>
              <div className="sb-card sb-card--dark sb-ds__card-demo">
                <p className="sb-type-title sb-type-on-dark">Dark card</p>
                <p className="sb-type-caption">`.sb-card--dark`</p>
              </div>
              <div className="sb-glass sb-ds__card-demo">
                <p className="sb-type-title">Glass panel</p>
                <p className="sb-type-caption">`.sb-glass`</p>
              </div>
              <a href="#surfaces" className="sb-tile sb-ds__tile-demo">
                <span className="sb-pill is-live">Live</span>
                <h3 className="sb-type-headline sb-type-on-dark">Tile</h3>
                <p className="sb-type-caption">`.sb-tile` · mega menu pattern</p>
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
