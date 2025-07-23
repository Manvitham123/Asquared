import React, { useState, useEffect, useRef } from 'react';

import '../../assets/css/flipbook.css';

interface FlipbookProps {
  pages: string[];
  title?: string;
}

export const Flipbook: React.FC<FlipbookProps> = ({ pages, title = 'Magazine' }) => {
  const [currentLocation, setCurrentLocation] = useState(0);
  const [enlargedPage, setEnlargedPage] = useState<number | null>(null);
  const maxLocation = pages.length + 1;
  const bookRef = useRef<HTMLDivElement>(null);
    const prevBtnRef = useRef<HTMLButtonElement>(null);
    const nextBtnRef = useRef<HTMLButtonElement>(null);



  useEffect(() => {
    const setZIndexes = () => {
      const paperElements = document.querySelectorAll('.paper');
      paperElements.forEach((paper, index) => {
        (paper as HTMLElement).style.zIndex = `${pages.length - index}`;
      });
    };
    setZIndexes();
  }, [pages]);
  useEffect(() => {
  const book = document.getElementById('book');
  if (!book) return;

  if (currentLocation === 0) {
    book.style.transform = 'translateX(0%)';
  } else if (currentLocation < maxLocation - 1) {
    book.style.transform = 'translateX(50%)';
  } else {
    book.style.transform = 'translateX(100%)';
  }
}, [currentLocation]);

const openBook = () => {
  const book = bookRef.current;
  const prevBtn = prevBtnRef.current;
  const nextBtn = nextBtnRef.current;
  const width = window.innerWidth;

  // Only shift the book and arrows on desktop screens
  if (book && width > 900) {
    book.style.transform = "translateX(50%)";
    if (prevBtn && nextBtn) {
      prevBtn.style.transform = "translateX(-130px)"; // Move arrows out wider
      nextBtn.style.transform = "translateX(130px)";
    }
  } else {
    // On mobile/tablet, keep book and arrows centered, but move arrows out a bit
    if (book) book.style.transform = "translateX(0%)";
    if (prevBtn && nextBtn) {
      prevBtn.style.transform = "translateX(-50px)";
      nextBtn.style.transform = "translateX(50px)";
    }
  }
};

const closeBook = () => {
  const book = bookRef.current;
  const prevBtn = prevBtnRef.current;
  const nextBtn = nextBtnRef.current;
  // Always center the book and arrows when closed
  if (book) book.style.transform = "translateX(0%)";
  if (prevBtn && nextBtn) {
    prevBtn.style.transform = "translateX(0px)";
    nextBtn.style.transform = "translateX(0px)";
  }
};



 const goNextPage = () => {
  if (currentLocation < maxLocation) {
    const nextLocation = currentLocation + 1;
    console.log(`Going to page ${nextLocation}`);
    if (currentLocation === 0) openBook();
    if (nextLocation === maxLocation - 1) {
      closeBook(); // Closing the book at the end
    }

    const paper = document.getElementById(`paper-${currentLocation}`);
    paper?.classList.add('flipped');
    paper?.style && (paper.style.zIndex = `${currentLocation}`);
    setCurrentLocation(nextLocation);
  }
};

const goPrevPage = () => {
  if (currentLocation > 0) {
    const prevIndex = currentLocation - 1;
    console.log(`Going to page ${prevIndex}`);
    // Remove flipped from the current page (not prevIndex)
    const paper = document.getElementById(`paper-${currentLocation}`);
    paper?.classList.remove('flipped');
    paper?.style && (paper.style.zIndex = `${pages.length - currentLocation + 1}`);
    setCurrentLocation(prevIndex);
    if (prevIndex === 0) {
      closeBook();
    } else if (currentLocation === maxLocation - 1) {
      openBook();
    }
  }
};
  const toggleEnlarge = (index: number) => {
    setEnlargedPage(enlargedPage === index ? null : index);
  };

  const pairedPages: [string?, string?][] = [];
  for (let i = 0; i < pages.length; i += 2) {
    pairedPages.push([pages[i], pages[i + 1]]);
  }

  return (
    <div className="flipbook-container">
      <h2>{title}</h2>

     <button ref={prevBtnRef} className="nav-button prev" onClick={goPrevPage} aria-label="Previous Page">◀</button>

      <div ref={bookRef} id="book" className="book">
        {pairedPages.map(([left, right], idx) => (
         <div
  key={idx}
  className={`paper ${idx + 1 <= currentLocation ? 'flipped' : ''}`}
  id={`paper-${idx + 1}`}
>
            <div className="front">
              <div
                className={`front-content ${enlargedPage === idx * 2 ? 'enlarged' : ''}`}
                onClick={() => toggleEnlarge(idx * 2)}
              >
                {left && <img src={left.startsWith('http') ? left : `https://d1gmweuuxd5quh.cloudfront.net/images/${left.replace(/^\/+/, '')}`} alt={`Page ${idx * 2 + 1}`} />}
              </div>
            </div>
            <div className="back">
              <div
                className={`back-content ${enlargedPage === idx * 2 + 1 ? 'enlarged' : ''}`}
                onClick={() => toggleEnlarge(idx * 2 + 1)}
              >
                {right && <img src={right.startsWith('http') ? right : `https://d1gmweuuxd5quh.cloudfront.net/images/${right.replace(/^\/+/, '')}`} alt={`Page ${idx * 2 + 2}`} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button ref={nextBtnRef} className="nav-button next" onClick={goNextPage} aria-label="Next Page">▶</button>
    </div>
  );
};
