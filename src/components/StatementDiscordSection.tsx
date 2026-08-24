import React, { useEffect, useRef } from 'react';
import './StatementDiscordSection.css';

export const StatementDiscordSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const contextRef = useRef<HTMLParagraphElement>(null);
  const refsRef = useRef<HTMLParagraphElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);

  const row1 = ['The', 'same', 'Spirit', 'that', 'raised', 'Christ'];
  const row2 = ['walks', 'these', 'streets.'];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = wordsRef.current;
    const context = contextRef.current;
    const refs = refsRef.current;
    const community = communityRef.current;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const update = () => {
      const r = section.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const end = window.innerHeight * 0.28;
      
      // Calculate scroll progress percentage (0 to 1)
      let p = (start - r.top) / (start - end);
      p = Math.max(0, Math.min(1, p));

      // Calculate how many words should be illuminated
      const litCount = Math.floor(p * words.length + 0.0001);

      words.forEach((w, i) => {
        if (w) {
          w.classList.toggle('lit', i < litCount || p >= 1);
        }
      });

      if (context) {
        context.classList.toggle('lit', p >= 0.92);
      }
      if (refs) {
        refs.classList.toggle('lit', p >= 1);
      }
      if (community) {
        community.classList.toggle('lit', p >= 1);
      }
    };

    // Listen to standard scroll (works with Lenis!)
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    
    // Initial run
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section className="sb-statement" id="sbStatement" ref={sectionRef}>
      {/* header */}
      <h2 id="sbLine" aria-label="The same Spirit that raised Christ walks these streets.">
        <span className="row">
          {row1.map((w, idx) => (
            <React.Fragment key={idx}>
              <span
                className="word"
                ref={(el) => {
                  if (el) wordsRef.current[idx] = el;
                }}
              >
                {w}
              </span>
              {idx < row1.length - 1 && ' '}
            </React.Fragment>
          ))}
        </span>
        <span className="row script">
          {row2.map((w, idx) => {
            const wordIdx = row1.length + idx;
            return (
              <React.Fragment key={idx}>
                <span
                  className="word dim-final"
                  ref={(el) => {
                    if (el) wordsRef.current[wordIdx] = el;
                  }}
                >
                  {w}
                </span>
                {idx < row2.length - 1 && ' '}
              </React.Fragment>
            );
          })}
        </span>
      </h2>

      {/* description */}
      <p className="sb-context" id="sbContext" ref={contextRef}>
        Whatever you do, do it all for the glory of God —<br />
        and He will bless the work of your hands.
      </p>
      <p className="sb-refs" id="sbRefs" ref={refsRef}>
        Romans 8:11 &nbsp;&middot;&nbsp; 1 Corinthians 10:31 &nbsp;&middot;&nbsp; Psalm 90:17
      </p>

      {/* community header + Discord CTA */}
      <div className="sb-community" id="sbCommunity" ref={communityRef}>
        <p className="invite">Be part of the Spirit Being community</p>
        <a
          className="discord-cta"
          href="https://discord.gg/YOUR-INVITE"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join the Spirit Being Discord community"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          Join the Discord <span className="arr">&#8594;</span>
        </a>
      </div>
    </section>
  );
};
