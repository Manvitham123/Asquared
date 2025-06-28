import React, { useEffect } from 'react';
import '../assets/css/index3.css';
import '../assets/css/home.css';

const Index3Page: React.FC = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const nav = document.querySelector('.nav') as HTMLElement;
      const logo = document.querySelector('.other') as HTMLElement;

      if (logo) {
        logo.style.visibility = 'visible';
        logo.style.opacity = '1';
      }
      if (nav) {
        nav.style.visibility = 'visible';
        nav.style.opacity = '1';
      }
    }, 8500);

    const fadeInSections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    });

    fadeInSections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
    <main>
      <div className="collage">
        <div className="other">
          <img src="/images/asquared-logo-white-better.avif" alt="a squared logo of asquared spelled out in block letters" />
        </div>
        <ul className="main-content">
          {Array.from({ length: 31 }, (_, i) => (
            <li key={i}>
              <img
                rel="preload"
                src={`/images/${getImagePath(i + 1)}`}
                alt={`Gallery image ${i + 1}`}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="fade-in-section">
        <div className="nav" role="navigation" aria-label="Main site navigation">
          <div className="wrapper">
            <div className="middle">
    
                
             <img src="/images/logo.avif" className="hi" alt="Logo with the letter a and an exponent of two" />
              <div className="surround">
                <a href="/index.html" tabIndex={0}>Home</a>
                <a href="/about.html" tabIndex={0}>About us</a>
                <a href="/issues.html" tabIndex={0}>Mags</a>
                <a href="/joinus.html" tabIndex={0}>Join Us</a>
                <a href="/events.html" tabIndex={0}>Events</a>
                <a href="/affiliates.html" tabIndex={0}>Affiliate program</a>
                <a href="/shoots.html" tabIndex={0}>Blog</a>
              </div>
            </div>
            <h1 className="footer-text">ART + FASHION + CULTURE</h1>
          </div>
        </div>
      </div>
    </main>
    </>
  );
};

function getImagePath(index: number): string {
  const paths = [
    'IMG_3232.avif', 'IMG_3265.avif', 'IMG_4062.avif', 'IMG_4081.avif', 'IMG_4440.avif',
    'IMG_4521.avif', 'IMG_7258.avif', 'IMG_9169.avif', 'icecream.avif', 'DSCN0140.avif',
    'IMG_9302.avif', 'IMG_0654.avif', 'stickers/bubble.avif', 'IMG_4335.avif', 'IMG_4396.avif',
    'IMG_0241.avif', 'IMG_0674.avif', 'stickers/tix2.avif', 'A2StickerPaper2.avif', 'IMG_0241.avif',
    'stickers/digicam1.avif', 'stickers/leather2.avif', 'stickers/shoeprint2.avif', 'stickers/polaroid2.avif', 'stickers/patch1.avif',
    'stickers/mp3player1.avif', 'stickers/pricesticker2.avif', 'stickers/tix5.avif', 'stickers/tix4.avif', 'stickers/vinyl2.avif',
    'stickers/6C2222FA-72FC-4CC0-AD20-5B69EB52EB3D.avif'
  ];
  return paths[index - 1] || '';
}

export default Index3Page;
