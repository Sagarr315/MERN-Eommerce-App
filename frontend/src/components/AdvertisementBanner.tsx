import React from 'react';
import type { HomeContent } from '../types/HomeContent';
import '../css/AdvertisementBanner.css';

interface AdvertisementBannerProps {
  content: HomeContent;
}

const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({ content }) => {
  const {
    title,
    subtitle,
    description,
    imageUrl,
    buttonText,
    buttonLink
  } = content;

  return (
    <section className="ad-banner">
      <div className="container">
        <div className="ad-content">
          <div className="ad-text">
            {subtitle && <p className="ad-subtitle">{subtitle}</p>}
            {title && <h2 className="ad-title">{title}</h2>}
            {description && <p className="ad-description">{description}</p>}
            {buttonText ? (
  <button 
    className="ad-btn"
    onClick={() => buttonLink && window.open(buttonLink, '_self')}
  >
    {buttonText}
  </button>
) : (
  <button 
    className="ad-btn"
    onClick={() => window.open('/products', '_self')}
  >
    Shop Now
  </button>
)}
          </div>
          {imageUrl && (
            <div className="ad-media">
              <img src={imageUrl} alt={title || 'Advertisement'} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdvertisementBanner;