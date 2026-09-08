import React from 'react';
import './CollectionsMegaMenu.css';
import { MEGA_MENU_IMAGES } from './megaMenuImages';

interface ShopMegaMenuProps {
  isOpen: boolean;
  isHeroContext?: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigateShop: (categorySection?: string) => void;
}

export const ShopMegaMenu: React.FC<ShopMegaMenuProps> = ({ 
  isOpen,
  isHeroContext = false,
  onClose, 
  onMouseEnter, 
  onMouseLeave,
  onNavigateShop
}) => {
  return (
    <>
      <div 
        className={`sb-scrim ${isHeroContext ? 'sb-scrim--hero' : ''} ${isOpen ? 'is-open' : ''}`} 
        hidden={!isOpen} 
        onMouseEnter={onClose} 
        onClick={onClose}
      ></div>
      
      <div 
        className={`sb-mega ${isHeroContext ? 'sb-mega--hero' : ''} ${isOpen ? 'is-open' : ''}`} 
        role="region" 
        aria-label="Shop Categories"
        data-lenis-prevent
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="sb-mega-inner" data-lenis-prevent>
          <div className="sb-mega-top">
            <p>Browse by category · find your fit</p>
          </div>

          <div className="sb-bento sb-bento-shop">
            <a 
              className="sb-tile has-photo sb-shop-tile sb-shop-tile--oversized" 
              href="#" 
              onClick={(e) => { e.preventDefault(); onClose(); onNavigateShop('top'); }}
              style={{"--d": "0s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src={MEGA_MENU_IMAGES.bibleBasics} alt="Oversized t-shirts" loading="lazy" decoding="async" />
              </div>
              <span className="sb-pill is-live">LIVE</span>
              <h3>Oversized t-shirts</h3>
              <p>Unisex tshirts.<br/>Premium heavy-weight cotton.</p>
            </a>

            <a 
              className="sb-tile has-photo sb-shop-tile sb-shop-tile--caps" 
              href="#" 
              onClick={(e) => { e.preventDefault(); onClose(); onNavigateShop('caps'); }}
              style={{"--d": ".09s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src={MEGA_MENU_IMAGES.essentials} alt="Caps" loading="lazy" decoding="async" />
              </div>
              <span className="sb-pill is-live">LIVE</span>
              <h3>Caps</h3>
              <p>Classic fit headwear.</p>
            </a>

            <a 
              className="sb-tile has-photo sb-shop-tile sb-shop-tile--totebags" 
              href="#" 
              onClick={(e) => { e.preventDefault(); onClose(); onNavigateShop('totebags'); }}
              style={{"--d": ".14s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src={MEGA_MENU_IMAGES.littleBeings} alt="Tote Bags" loading="lazy" decoding="async" />
              </div>
              <span className="sb-pill is-live">LIVE</span>
              <h3>Tote Bags</h3>
              <p>Everyday carry.</p>
            </a>
          </div>

          <div className="sb-mega-foot">
            <button
              type="button"
              className="sb-mega-link"
              onClick={() => { onClose(); onNavigateShop('top'); }}
            >
              View all products <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
