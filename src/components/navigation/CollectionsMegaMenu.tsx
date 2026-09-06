import React from 'react';
import './CollectionsMegaMenu.css';
import { COLLECTIONS } from '../../data/collections';

interface CollectionsMegaMenuProps {
  isOpen: boolean;
  isHeroContext?: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigateCollection?: (collectionId: string) => void;
}

export const CollectionsMegaMenu: React.FC<CollectionsMegaMenuProps> = ({
  isOpen,
  isHeroContext = false,
  onClose,
  onMouseEnter,
  onMouseLeave,
  onNavigateCollection,
}) => {
  const handleCollectionClick = (collectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    onNavigateCollection?.(collectionId);
  };

  const sorted = [...COLLECTIONS].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <div
        className={`sb-scrim ${isHeroContext ? 'sb-scrim--hero' : ''} ${isOpen ? 'is-open' : ''}`}
        hidden={!isOpen}
        onMouseEnter={onClose}
        onClick={onClose}
      />

      <div
        className={`sb-mega ${isHeroContext ? 'sb-mega--hero' : ''} ${isOpen ? 'is-open' : ''}`}
        role="region"
        aria-label="Collections"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="sb-mega-inner" data-lenis-prevent>
          <div className="sb-mega-top">
            <p>
              {sorted.length} distinct worlds · one shared design language
            </p>
          </div>

          <div className="sb-bento">
            {sorted.map((collection, index) => (
              <a
                key={collection.id}
                className={`sb-tile has-photo ${collection.megaMenuTileClass}${collection.isBlueTile ? ' is-blue' : ''}`}
                href="#"
                onClick={handleCollectionClick(collection.id)}
                style={{ '--d': `${(index * 0.05).toFixed(2)}s` } as React.CSSProperties}
              >
                <div className="sb-photo">
                  <img
                    src={collection.megaMenuImage}
                    alt={collection.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className={`sb-pill ${collection.status === 'live' ? 'is-live' : 'is-coming'}`}>
                  {collection.status === 'live' ? 'LIVE' : 'COMING SOON'}
                </span>
                <h3>{collection.title}</h3>
                <p>{collection.tagline}</p>
                {collection.chips && collection.chips.length > 0 && (
                  <div className="sb-chips" style={{ marginTop: '14px' }}>
                    {collection.chips.map((chip) => (
                      <span key={chip}>{chip}</span>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>

          <div className="sb-mega-foot">
            <span>Time-limited drops</span>
          </div>
        </div>
      </div>
    </>
  );
};
