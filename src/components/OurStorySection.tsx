import React, { useEffect, useRef } from 'react';
import './OurStorySection.css';

export const OurStorySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elementsToReveal = Array.from(el.querySelectorAll('.rv-up')) as HTMLElement[];

    if (!reduced) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      elementsToReveal.forEach((item) => observer.observe(item));

      return () => {
        observer.disconnect();
      };
    } else {
      elementsToReveal.forEach((item) => item.classList.add('in'));
    }
  }, []);

  return (
    <div className="sb-our-story" id="our-story-section" ref={containerRef}>
      {/* Giant Title */}
      <div className="title-wrap">
        <h1 className="title rv-up">
          Our Story
          <span className="script">not of this world.</span>
        </h1>
      </div>

      {/* Story Layout Grid */}
      <main className="story-grid">
        {/* Right Side: Copy Text */}
        <article className="copy">
          <h2 className="lede rv-up">
            I'm not a company.
            <br />
            I'm a <em>spirit being.</em>
          </h2>

          <p className="rv-up">
            Spirit Being started with one question: if I truly believe I'm a new creation — not of this world, made for
            the Kingdom — shouldn't the way I create reflect that?
          </p>

          <p className="rv-up">
            I'm a solo creator. There's no boardroom behind this brand, no investors, no team of designers. Just one
            person who proclaims the name of the Lord, using the only tools I have — creativity, design, and a supply
            chain built from scratch — to put the gospel back on the streets, in a language this generation actually
            wears.
          </p>

          <p className="principle rv-up">
            Every piece starts with Scripture, not a trend report. The verse comes first. The graphic exists to carry
            it, not decorate it.
          </p>

          <p className="rv-up">
            Because this was never meant to be "Christian merch." It's meant to be a proclamation you put on in the
            morning and carry into every room you walk into.
          </p>

          <p className="rv-up">
            I believe we — the generation between ten and thirty, the ones figuring out who we are in a noisy world —
            were never made to live an average life. We were made for a God kind of life. The zoe life. The life of
            Christ, lived out loud, in identity, power, and authority.
          </p>

          <p className="rv-up">
            So no, this isn't for profit. It's for presence. Every design, every drop, every thread is an offering —
            using what I have to bring honor, value, and praise to His name.
          </p>

          <p className="rv-up">
            If you wear this, my prayer is simple: that people don't just see a graphic tee. That they feel something
            they can't explain. That they meet the One this shirt was made to proclaim.
          </p>

          <p className="signoff rv-up">
            Not of this world.
            <br />
            Made for the Kingdom.
          </p>
        </article>
      </main>
    </div>
  );
};
