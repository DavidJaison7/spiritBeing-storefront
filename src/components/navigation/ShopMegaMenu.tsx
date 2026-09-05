import React from 'react';
import './CollectionsMegaMenu.css';
import { MEGA_MENU_IMAGES } from './megaMenuImages';

interface ShopMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigateShop: (categorySection?: string) => void;
}

export const ShopMegaMenu: React.FC<ShopMegaMenuProps> = ({ 
  isOpen, 
  onClose, 
  onMouseEnter, 
  onMouseLeave,
  onNavigateShop
}) => {
  return (
    <>
      <div 
        className={`sb-scrim ${isOpen ? 'is-open' : ''}`} 
        hidden={!isOpen} 
        onMouseEnter={onClose} 
        onClick={onClose}
      ></div>
      
      <div 
        className={`sb-mega ${isOpen ? 'is-open' : ''}`} 
        role="region" 
        aria-label="Shop Categories"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="sb-mega-inner">
          <div className="sb-mega-top">
            <p>Browse by category · find your fit</p>
          </div>

          <div className="sb-bento sb-bento-shop">
            <a 
              className="sb-tile has-photo sb-shop-tile" 
              href="#" 
              onClick={(e) => { e.preventDefault(); onClose(); onNavigateShop('tshirts'); }}
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
              className="sb-tile has-photo sb-shop-tile" 
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
              className="sb-tile has-photo sb-shop-tile" 
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
              className="hover:underline text-sm font-medium tracking-wide"
              onClick={() => { onClose(); onNavigateShop('tshirts'); }}
            >
              View all products &rarr;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
