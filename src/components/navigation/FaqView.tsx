import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FAQ_CATEGORIES, FaqBlock } from '../../data/faqContent';
import './FaqView.css';

function FaqAnswer({ blocks }: { blocks: FaqBlock[] }) {
  return (
    <div className="sb-faq__q-copy">
      {blocks.map((block, index) => {
        if (block.type === 'p') {
          return <p key={index}>{block.text}</p>;
        }
        if (block.type === 'ul') {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="sb-faq__q-note">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export const FaqView: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(FAQ_CATEGORIES[0].id);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);

  const tabsRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const railFillRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  const moveUnderline = useCallback((tabEl: HTMLButtonElement | null) => {
    const underline = underlineRef.current;
    if (!tabEl || !underline) return;
    underline.style.width = `${tabEl.offsetWidth}px`;
    underline.style.transform = `translateX(${tabEl.offsetLeft}px)`;
  }, []);

  const syncRail = useCallback(
    (categoryId: string) => {
      const panel = panelRefs.current[categoryId];
      const fill = railFillRefs.current[categoryId];
      if (!panel || !fill) return;

      const openItem = panel.querySelector('.sb-faq__q-item.is-open') as HTMLElement | null;
      if (!openItem) {
        fill.style.height = '0px';
        fill.style.opacity = '0';
        return;
      }

      fill.style.opacity = '1';
      fill.style.top = `${openItem.offsetTop}px`;
      fill.style.height = `${openItem.offsetHeight}px`;
    },
    []
  );

  const selectTab = useCallback(
    (categoryId: string, tabEl?: HTMLButtonElement | null) => {
      setActiveTabId(categoryId);
      setOpenQuestion(null);
      setIsEntering(true);
      window.setTimeout(() => setIsEntering(false), 700);

      if (tabEl) {
        moveUnderline(tabEl);
        tabEl.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      }

      window.requestAnimationFrame(() => syncRail(categoryId));
    },
    [moveUnderline, syncRail]
  );

  const toggleQuestion = useCallback(
    (categoryId: string, question: string) => {
      setOpenQuestion((prev) => (prev === question ? null : question));
      window.requestAnimationFrame(() => syncRail(categoryId));
    },
    [syncRail]
  );

  useEffect(() => {
    const tabsEl = tabsRef.current;
    if (!tabsEl) return;

    const activeTab = tabsEl.querySelector<HTMLButtonElement>(
      `[data-tab-id="${activeTabId}"]`
    );
    moveUnderline(activeTab);
  }, [activeTabId, moveUnderline]);

  useEffect(() => {
    const panel = panelRefs.current[activeTabId];
    if (!panel || !('ResizeObserver' in window)) return;

    const observer = new ResizeObserver(() => syncRail(activeTabId));
    panel.querySelectorAll('.sb-faq__q-item').forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [activeTabId, openQuestion, syncRail]);

  useEffect(() => {
    const handleResize = () => {
      const tabsEl = tabsRef.current;
      if (!tabsEl) return;
      const activeTab = tabsEl.querySelector<HTMLButtonElement>(
        `[data-tab-id="${activeTabId}"]`
      );
      moveUnderline(activeTab);
      syncRail(activeTabId);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTabId, moveUnderline, syncRail]);

  return (
    <div className="sb-faq">
      <main className="sb-faq__wrap">
        <aside className="sb-faq__masthead">
          <div className="sb-faq__eyebrow">Support &nbsp;/&nbsp; 01</div>
          <h1 className="sb-faq__title">
            <span className="sb-faq__title-word">FAQ</span>
            <span className="sb-faq__title-script">answered</span>
          </h1>
          <p className="sb-faq__blurb">
            Fit, shipping, exchanges, and what the brand is actually about. Pick a section, open a
            question.
            <br />
            <br />
            <span className="sb-faq__verse">
              Ask, and it will be given to you &nbsp;·&nbsp; Matthew 7:7
            </span>
          </p>

          <div className="sb-faq__contact">
            <div className="sb-faq__contact-label">Still searching</div>
            <div className="sb-faq__contact-row">
              <a href="mailto:orders@spiritbeing.in">orders@spiritbeing.in</a>
              <a href="https://wa.me/919000000000" target="_blank" rel="noopener noreferrer">
                WhatsApp us
              </a>
              <a href="https://instagram.com/spiritbeing" target="_blank" rel="noopener noreferrer">
                @spiritbeing
              </a>
            </div>
          </div>
        </aside>

        <section className="sb-faq__panelwrap">
          <div className="sb-faq__tabs-shell">
            <div className="sb-faq__tabs" role="tablist" aria-label="FAQ categories" ref={tabsRef}>
              {FAQ_CATEGORIES.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  className="sb-faq__tab"
                  role="tab"
                  data-tab-id={category.id}
                  id={`t-${category.id}`}
                  aria-selected={activeTabId === category.id}
                  aria-controls={`p-${category.id}`}
                  onClick={(e) => selectTab(category.id, e.currentTarget)}
                  onKeyDown={(e) => {
                    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                    e.preventDefault();
                    const next =
                      (index + (e.key === 'ArrowRight' ? 1 : -1) + FAQ_CATEGORIES.length) %
                      FAQ_CATEGORIES.length;
                    const nextTab = tabsRef.current?.querySelector<HTMLButtonElement>(
                      `[data-tab-id="${FAQ_CATEGORIES[next].id}"]`
                    );
                    if (nextTab) selectTab(FAQ_CATEGORIES[next].id, nextTab);
                  }}
                >
                  {category.label}{' '}
                  <span className="sb-faq__tab-count">
                    {String(category.items.length).padStart(2, '0')}
                  </span>
                </button>
              ))}
              <span className="sb-faq__tab-underline" ref={underlineRef} aria-hidden="true" />
            </div>
          </div>

          {FAQ_CATEGORIES.map((category) => {
            const isActive = activeTabId === category.id;
            return (
              <div
                key={category.id}
                className={`sb-faq__panel${isActive ? ' is-active' : ''}${isActive && isEntering ? ' is-entering' : ''}`}
                id={`p-${category.id}`}
                role="tabpanel"
                aria-labelledby={`t-${category.id}`}
                ref={(el) => {
                  panelRefs.current[category.id] = el;
                }}
              >
                <div className="sb-faq__rail">
                  <span
                    className="sb-faq__rail-fill"
                    ref={(el) => {
                      railFillRefs.current[category.id] = el;
                    }}
                  />
                </div>

                {category.items.map((item, itemIndex) => {
                  const isOpen = isActive && openQuestion === item.question;
                  return (
                    <div
                      key={item.question}
                      className={`sb-faq__q-item${isOpen ? ' is-open' : ''}`}
                      style={{ ['--i' as string]: itemIndex }}
                    >
                      <button
                        type="button"
                        className="sb-faq__q-head"
                        aria-expanded={isOpen}
                        onClick={() => toggleQuestion(category.id, item.question)}
                      >
                        <span>{item.question}</span>
                        <span className="sb-faq__q-icon" aria-hidden="true">
                          <i />
                          <i />
                        </span>
                      </button>
                      <div className="sb-faq__q-body">
                        <div className="sb-faq__q-body-inner">
                          <FaqAnswer blocks={item.blocks} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className="sb-faq__closing">
            <div>
              <div className="sb-faq__closing-title">
                Didn&apos;t find it? <em>ask us</em>
              </div>
              <div className="sb-faq__closing-sub">
                We reply within one working day, Monday to Saturday.
              </div>
            </div>
            <a className="sb-faq__closing-cta" href="mailto:orders@spiritbeing.in">
              Write to us
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
