import React from 'react';
import type { HomeContent } from '../types/HomeContent';
import '../css/HeroBanner.css';

interface HeroBannerProps {
  content: HomeContent;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ content }) => {
  const {
    title,
    subtitle,
    description,
    imageUrl,
    videoUrl,
    buttonText,
    buttonLink
  } = content;
 console.log('Button text:', buttonText);
  return (
    <section className="hero-banner">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            {subtitle && <p className="hero-subtitle">{subtitle}</p>}
            {title && <h1 className="hero-title">{title}</h1>}
            {description && <p className="hero-description">{description}</p>}
           {buttonText ? (
  <button 
    className="hero-btn"
    onClick={() => buttonLink && window.open(buttonLink, '_self')}
  >
    {buttonText}
  </button>
) : (
  <button className="hero-btn" onClick={() => window.open('/discover', '_self')}>
    Shop Now
  </button>
)}
          </div>
          <div className="hero-media">
            {videoUrl ? (
              <video autoPlay muted loop playsInline>
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : imageUrl ? (
              <img src={imageUrl} alt={title || 'Hero Banner'} />
            ) : (
              <div className="placeholder">No media</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;