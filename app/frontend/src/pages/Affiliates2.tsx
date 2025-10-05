import React, { useState, useEffect } from 'react';
import Navbar2 from '../components/Navbar2';
import '../assets/css/affiliates2.css';

const Affiliates2: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Sticker images with specific positioning
  const stickers = [
    {
      src: 'https://d1gmweuuxd5quh.cloudfront.net/stickers/bubble.avif',
      style: {
        width: '400px',
        height: 'auto',
        top: '55%',
        right: '40%',
        zIndex: 3,
        '--rotation': '-5deg',
      }
    },
    {
      src: 'https://d1gmweuuxd5quh.cloudfront.net/stickers/patch4.avif',
      style: {
        width: '200px',
        height: 'auto',
        top: '10%',
        left: '45%',
        zIndex: 3,
        '--rotation': '-5deg',
      }
    },
    {
      src: 'https://d1gmweuuxd5quh.cloudfront.net/stickers/tix4.avif',
      style: {
        width: '400px',
        height: 'auto',
        bottom: '-15%',
        left: '-7%',
        zIndex: 3,
        '--rotation': '-20deg',
      }
    },
    {
      src: 'https://d1gmweuuxd5quh.cloudfront.net/stickers/digicam1.avif',
      style: {
        width: '200px',
        height: 'auto',
        top: '10%',
        right: '5%',
        zIndex: 3,
        '--rotation': '12deg',
      }
    },
    {
      src: 'https://d1gmweuuxd5quh.cloudfront.net/stickers/shoeprint1.avif',
      style: {
        width: '700px',
        height: 'auto',
        top: '0%',
        left: '-15%',
        zIndex: 3,
        '--rotation': '0deg',
      }
    },
  ];

  const slides = [
    {
      title: 'Affiliate Program',
      description: `Sign up for our affiliate program to receive exclusive news like discount codes, internship opportunities, event invitations, and more! Our affiliate program is for those interested in a/squared but are not directly involved in the organization`,
      placeholder: 'Enter your email',
      backgroundColor: '#B8C6F7',
      titleColor: '#000',
      textColor: '#000',
    },
    {
      title: 'Model Casting',
      description: `Interested in modeling? Join our model call *Our models are separate from a/squared membership`,
      placeholder: 'Enter your email',
      backgroundColor: '#E8C4E8',
      titleColor: '#000',
      textColor: '#000',
    }
  ];

  useEffect(() => {
    document.body.classList.add('affiliates2-page');
    return () => {
      document.body.classList.remove('affiliates2-page');
    };
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    // Simulate form submission - replace with your actual API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitMessage('Thank you! We\'ll be in touch soon.');
      setEmail('');
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     <div className="affiliates2-background">
      <Navbar2 />
      
      <div className="affiliates2-container">

      {/* Background with stickers */}
      <div className="stickers-background">
        {stickers.map((sticker, index) => (
          <img
            key={index}
            src={sticker.src}
            alt={`Sticker ${index + 1}`}
            className={`background-sticker sticker-${index + 1}`}
            style={{
              position: 'absolute',
              width: sticker.style.width,
              height: sticker.style.height,
              top: sticker.style.top,
              left: sticker.style.left,
              right: sticker.style.right,
              bottom: sticker.style.bottom,
              opacity: 0.8,
              zIndex: sticker.style.zIndex,
              '--rotation': sticker.style['--rotation'],
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="affiliates2-content">
        <div className="slides-container">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className="slide-card"
              style={{ backgroundColor: slide.backgroundColor }}
            >
              <div className="slide-header">
                <div className="slide-indicator"></div>
              </div>
              
              <div className="slide-body">
                <h1 
                  className="slide-title"
                  style={{ color: slide.titleColor }}
                >
                  {slide.title}
                </h1>
                
                <p 
                  className="slide-description"
                  style={{ color: slide.textColor }}
                >
                  {slide.description}
                </p>
                
                <form onSubmit={handleEmailSubmit} className="email-form">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={slide.placeholder}
                    className="email-input"
                    required
                  />
                  <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? '...' : '→'}
                  </button>
                </form>
                
                {submitMessage && (
                  <p className="submit-message">{submitMessage}</p>
                )}
              </div>
              
              <div className="slide-footer">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${((index + 1) / slides.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
   
  );
};

export default Affiliates2;
