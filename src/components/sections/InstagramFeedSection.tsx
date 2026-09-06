import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { INSTAGRAM_FEED_IMAGES } from '../../data/instagramFeedImages';
import './InstagramFeedSection.css';

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  link: string;
}

const INSTAGRAM_HANDLE = 'https://instagram.com/spiritbeinggen';

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig_1',
    image: INSTAGRAM_FEED_IMAGES[0],
    caption: 'Studio drop day — Spirit Being in motion.',
    link: INSTAGRAM_HANDLE,
  },
  {
    id: 'ig_2',
    image: INSTAGRAM_FEED_IMAGES[1],
    caption: 'Holy Spirit tee — archive fit on rotation.',
    link: INSTAGRAM_HANDLE,
  },
  {
    id: 'ig_3',
    image: INSTAGRAM_FEED_IMAGES[2],
    caption: 'New Creation acid wash — from the latest run.',
    link: INSTAGRAM_HANDLE,
  },
  {
    id: 'ig_4',
    image: INSTAGRAM_FEED_IMAGES[3],
    caption: 'Faith. Identity. Purpose. — from the community feed.',
    link: INSTAGRAM_HANDLE,
  },
  {
    id: 'ig_5',
    image: INSTAGRAM_FEED_IMAGES[4],
    caption: 'Chosen ones uniform — heavyweight cotton in frame.',
    link: INSTAGRAM_HANDLE,
  },
  {
    id: 'ig_6',
    image: INSTAGRAM_FEED_IMAGES[5],
    caption: 'Street frames from the @spiritbeinggen archive.',
    link: INSTAGRAM_HANDLE,
  },
  {
    id: 'ig_7',
    image: INSTAGRAM_FEED_IMAGES[6],
    caption: 'Community repost — tag us to get featured.',
    link: INSTAGRAM_HANDLE,
  },
  {
    id: 'ig_8',
    image: INSTAGRAM_FEED_IMAGES[7],
    caption: 'Essentials collection mood — more on the feed.',
    link: INSTAGRAM_HANDLE,
  },
];

export const InstagramFeedSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const updateCarouselState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>('.ig-feed-card');
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track.querySelector('.ig-feed-row')!).gap) || 8;
    const step = card.offsetWidth + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const scrollLeft = track.scrollLeft;

    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft < maxScroll - 4);

    const visibleCards = Math.max(1, Math.round((track.clientWidth + gap) / step));
    const pages = Math.max(1, INSTAGRAM_POSTS.length - visibleCards + 1);
    setPageCount(pages);

    const page = Math.min(pages - 1, Math.max(0, Math.round(scrollLeft / step)));
    setActivePage(page);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateCarouselState();

    track.addEventListener('scroll', updateCarouselState, { passive: true });
    window.addEventListener('resize', updateCarouselState);

    return () => {
      track.removeEventListener('scroll', updateCarouselState);
      window.removeEventListener('resize', updateCarouselState);
    };
  }, [updateCarouselState]);

  const scrollByCard = (direction: 'prev' | 'next') => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>('.ig-feed-card');
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track.querySelector('.ig-feed-row')!).gap) || 8;
    const delta = (card.offsetWidth + gap) * (direction === 'next' ? 1 : -1);

    track.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const scrollToPage = (page: number) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>('.ig-feed-card');
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track.querySelector('.ig-feed-row')!).gap) || 8;
    const step = card.offsetWidth + gap;

    track.scrollTo({ left: page * step, behavior: 'smooth' });
  };

  return (
    <section className="ig-feed-section" aria-label="Instagram feed">
      <div className="ig-feed-inner">
        <div className="ig-feed-head">
          <div className="ig-feed-brand">
            <img
              src="/instagram-icon.png"
              alt=""
              className="ig-feed-brand-icon"
              width={28}
              height={28}
              decoding="async"
            />
            <div>
              <p className="ig-feed-handle">@spiritbeinggen</p>
              <p className="ig-feed-sub">Instagram · studio archive</p>
            </div>
          </div>

          <a
            href={INSTAGRAM_HANDLE}
            target="_blank"
            rel="noopener noreferrer"
            className="sb-drawer-auth-cta ig-feed-follow"
          >
            Follow on Instagram
          </a>
        </div>


        <div className="ig-feed-carousel">
          <button
            type="button"
            className="ig-feed-nav ig-feed-nav--prev"
            onClick={() => scrollByCard('prev')}
            disabled={!canPrev}
            aria-label="Previous Instagram posts"
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <div
            className="ig-feed-track"
            ref={trackRef}
            aria-roledescription="carousel"
            aria-label="Instagram post previews"
          >
            <div className="ig-feed-row">
              {INSTAGRAM_POSTS.map((post) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-feed-card"
                  aria-label={`View Instagram post: ${post.caption}`}
                >
                  <div className="ig-feed-card-media">
                    <span className="ig-feed-card-badge">
                      <img src="/instagram-icon.png" alt="" width={12} height={12} />
                      Instagram
                    </span>

                    <img
                      src={post.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="ig-feed-card-img"
                    />
                  </div>

                  <div className="ig-feed-card-foot">
                    <p className="ig-feed-card-caption">{post.caption}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="ig-feed-nav ig-feed-nav--next"
            onClick={() => scrollByCard('next')}
            disabled={!canNext}
            aria-label="Next Instagram posts"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        {pageCount > 1 && (
          <div className="ig-feed-dots" role="tablist" aria-label="Instagram feed pages">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                className={`ig-feed-dot${index === activePage ? ' is-active' : ''}`}
                aria-label={`Go to feed page ${index + 1}`}
                aria-selected={index === activePage}
                onClick={() => scrollToPage(index)}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
