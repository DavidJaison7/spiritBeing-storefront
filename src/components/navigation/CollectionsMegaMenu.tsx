import React from 'react';
import './CollectionsMegaMenu.css';
import { MEGA_MENU_IMAGES } from './megaMenuImages';

interface CollectionsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const CollectionsMegaMenu: React.FC<CollectionsMegaMenuProps> = ({ 
  isOpen, 
  onClose, 
  onMouseEnter, 
  onMouseLeave 
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
        aria-label="Collections"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="sb-mega-inner">
          <div className="sb-mega-top">
            <p>Five distinct worlds · one shared design language</p>
          </div>

          <div className="sb-bento">
            <a 
              className="sb-tile has-photo t-essentials" 
              href="#" 
              onClick={(e) => e.preventDefault()}
              style={{"--d": "0s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src={MEGA_MENU_IMAGES.essentials} alt="Spiritbeing Essentials" loading="lazy" decoding="async" />
              </div>
              <span className="sb-pill is-live">LIVE</span>
              <h3>Spiritbeing Essentials</h3>
              <p>Core pieces for every day.<br/>Logo-centric, high comfort.</p>
            </a>

            <a 
              className="sb-tile has-photo t-bible" 
              href="#" 
              onClick={(e) => e.preventDefault()}
              style={{"--d": ".09s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src={MEGA_MENU_IMAGES.bibleBasics} alt="Bible Basics" loading="lazy" decoding="async" />
              </div>
              <span className="sb-pill is-live">LIVE</span>
              <h3>Bible Basics</h3>
              <p>Scripture as typography<br/>on plain garments.</p>
            </a>

            <a 
              className="sb-tile has-photo t-little" 
              href="#" 
              onClick={(e) => e.preventDefault()}
              style={{"--d": ".14s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src={MEGA_MENU_IMAGES.littleBeings} alt="Little Beings" loading="lazy" decoding="async" />
              </div>
              <span className="sb-pill is-coming">COMING SOON</span>
              <h3>Little Beings</h3>
              <p>Kids. Nurturing little spirit beings.</p>
            </a>

            <a 
              className="sb-tile has-photo t-nomad" 
              href="#" 
              onClick={(e) => e.preventDefault()}
              style={{"--d": ".19s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src={MEGA_MENU_IMAGES.nomadBeings} alt="Nomad Beings" loading="lazy" decoding="async" />
              </div>
              <span className="sb-pill is-coming">COMING SOON</span>
              <h3>Nomad Beings</h3>
              <p>Travel. &ldquo;spiritual nomad&rdquo;.</p>
            </a>

            <a 
              className="sb-tile has-photo t-armoured" 
              href="#" 
              onClick={(e) => e.preventDefault()}
              style={{"--d": ".24s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src={MEGA_MENU_IMAGES.armouredBeings} alt="Armoured Beings" loading="lazy" decoding="async" />
              </div>
              <span className="sb-pill is-coming">COMING SOON</span>
              <h3>Armoured Beings</h3>
              <p>Gym &amp; performance.<br/>Armour of God.</p>
            </a>

            <a 
              className="sb-tile has-photo is-blue t-books" 
              href="#" 
              onClick={(e) => e.preventDefault()}
              style={{"--d": ".29s"} as React.CSSProperties}
            >
              <div className="sb-photo">
                <img src={MEGA_MENU_IMAGES.bookSeries} alt="The Book Series" loading="lazy" decoding="async" />
              </div>
              <span className="sb-pill is-coming">COMING SOON</span>
              <h3>The Book Series</h3>
              <p>A design style featured across all five collections.</p>
              <div className="sb-chips" style={{ marginTop: '14px' }}>
                <span>Psalms</span>
                <span>Proverbs</span>
                <span>Isaiah</span>
              </div>
            </a>
          </div>

          <div className="sb-mega-foot">
            <span>Time-limited drops</span>
          </div>
        </div>
      </div>
    </>
  );
};
