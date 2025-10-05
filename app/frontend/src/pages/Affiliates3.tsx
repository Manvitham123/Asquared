import React, { useEffect } from 'react';
import '../assets/css/affiliates3.css';
import Navbar2 from '../components/Navbar2';
import Bottom from '../components/Bottom';

const Affiliates3: React.FC = () => {
  useEffect(() => {
    document.body.classList.add('affiliates3-page');
    return () => document.body.classList.remove('affiliates3-page');
  }, []);

  return (
    <div>
      <Navbar2 />
      <div className="overlay-container">
      <div className="affiliates3-container">
        {/* dim overlay */}
        <div className="bg-overlay" aria-hidden="true" />
        <div className="paper-container">
          <div className="paper-inner">
            <div className="title-row">
              <img
                src="https://asquared-images.s3.amazonaws.com/images/affiliates/sticker.png"
                alt="A-squared sticker"
                className="sticker"
              />
              <h1 className="title-text">ffiliate Program</h1>
            </div>

            <p className="description">
              Sign up for our affiliate program to receive exclusive news such as local
              discount codes, internship opportunities, event invitations, and more!
            </p>

            <form 
              className="email-form"
              onSubmit={async (e) => {
                e.preventDefault();

                const emailElement = document.getElementById('email') as HTMLInputElement;
                const email = emailElement.value;

                const payload = {
                  name: 'None',
                  email,
                  grade: 'N/A',
                  gender: 'N/A',
                  interests: 'Affiliate Program',
                  questions: '',
                  hear: 'Website'
                };

                try {
                  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/joinus-submit`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                  });

                  const result = await response.json();
                  if (result.success) {
                    alert('Successfully submitted!');
                    // Clear the input after successful submission
                    (document.getElementById('email') as HTMLInputElement).value = '';
                  } else {
                    alert(`Error: ${result.error}`);
                  }
                } catch (error) {
                  console.error(error);
                  alert('Failed to submit. Please try again later.');
                }
              }}
            >
              <div className="form-fields">
                <div className="input-group">
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="form-input"
                    required
                  />
                  <button type="submit" className="submit-button-circle" aria-label="Submit">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
       <Bottom />
    </div>
  );
};

export default Affiliates3;
