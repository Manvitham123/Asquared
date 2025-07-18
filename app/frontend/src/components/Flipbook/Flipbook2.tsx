import React, { useState } from 'react';
import '../../assets/css/flipbook.css';

interface Flipbook2Props {
  pages: string[];
  title?: string;
}

const Flipbook2: React.FC<Flipbook2Props> = ({ pages, title = 'Magazine' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flipbook-container" style={{ minHeight: '60vh', paddingTop: '84px' }}>
      <h2>{title}</h2>
      <button className="nav-button prev" onClick={goPrev} aria-label="Previous Page">
        <svg width="42" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 8L12 16L20 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="book" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'auto', minHeight: '420px', marginTop: '20px' }}>
        <img
          src={pages[currentIndex].startsWith('http') ? pages[currentIndex] : `https://d1gmweuuxd5quh.cloudfront.net/images/${pages[currentIndex].replace(/^\/+/,'')}`}
          alt={`Page ${currentIndex + 1}`}
          style={{ width: '100%', maxWidth: '650px', height: 'auto', minHeight: '420px', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 4px 24px #0008' }}
        />
      </div>
      <button className="nav-button next" onClick={goNext} aria-label="Next Page">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8L20 16L12 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{ marginTop: '18px', color: '#fff', fontSize: '1rem' , textAlign: 'center' }}>
        {currentIndex + 1} / {pages.length}
      </div>
    </div>
  );
};

export default Flipbook2;
