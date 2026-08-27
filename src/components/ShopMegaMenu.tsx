import React from 'react';
import './CollectionsMegaMenu.css';

interface ShopMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigateShop: () => void;
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
            <p>Shop by Category</p>
          </div>

          <div className="sb-bento">
            <a 
              className="sb-tile has-photo t-essentials" 
              href="#" 
              onClick={(e) => { e.preventDefault(); onClose(); onNavigateShop(); }}
              style={{"--d": "0s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src="/assets/Collections/Rectangle 255723.png" alt="T-shirts" loading="lazy" />
              </div>
              <span className="sb-pill is-live">LIVE</span>
              <h3>T-shirts</h3>
              <p>Premium heavy-weight cotton<br/>tees.</p>
            </a>

            <a 
              className="sb-tile has-photo t-bible" 
              href="#" 
              onClick={(e) => { e.preventDefault(); onClose(); onNavigateShop(); }}
              style={{"--d": ".09s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src="/assets/Collections/Rectangle 255729.png" alt="Caps" loading="lazy" />
              </div>
              <span className="sb-pill is-live">LIVE</span>
              <h3>Caps</h3>
              <p>Classic fit headwear.</p>
            </a>

            <a 
              className="sb-tile has-photo t-little" 
              href="#" 
              onClick={(e) => { e.preventDefault(); onClose(); onNavigateShop(); }}
              style={{"--d": ".14s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src="/assets/Collections/Rectangle 255730.png" alt="Tote Bags" loading="lazy" />
              </div>
              <span className="sb-pill is-coming">COMING SOON</span>
              <h3>Tote Bags</h3>
              <p>Everyday carry.</p>
            </a>
          </div>

          <div className="sb-mega-foot">
            <button 
              className="hover:underline text-sm font-medium tracking-wide"
              onClick={() => { onClose(); onNavigateShop(); }}
            >
              View all products &rarr;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
