import React, {useEffect} from 'react';
import '../assets/css/recruitment.css'; // Create this CSS file
import Navbar2 from '../components/Navbar2';
import Bottom from '../components/Bottom';

const Recruitment: React.FC = () => {
      useEffect(() => {
        document.body.classList.add('recruitment-page');
        return () => document.body.classList.remove('recruitment-page');
      }, []);
  return (
    <div>
        <Navbar2 />
    <div className="recruitment-overlay-container">
      
        <div className="board-container">
          <img src="https://asquared-images.s3.amazonaws.com/images/recruitment/boardWwords.png" alt="Board" className="board-img" />
          
          {/* <div className="event-list">
            <p><span className="red">8/27: Festifall</span><br />4-6:30, E47, Near League</p>
            <p><span className="green">9/1: Mass Meeting</span><br />7-8 PM, League Henderson (3rd Floor)</p>
            <p><span className="blue">9/3: Speed Dating</span><br />7-8 PM, Union</p>
            <p><span className="orange">9/4: Fitnic + Clothing Sale</span><br />5-7 PM, Law Quad</p>
            <p><span className="purple">9/7: Applications Due</span></p>
          </div> */}
        </div>

        <img src="https://asquared-images.s3.amazonaws.com/images/recruitment/letters.png" alt="Fall Recruitment" className="letters-img" />

        <form
          className="signup-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email') as HTMLInputElement;
            const email = emailInput.value;

            const payload = {
              name: 'None',
              email,
              grade: 'N/A',
              gender: 'N/A',
              interests: 'Recruitment',
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
                alert('Thanks for signing up!');
                emailInput.value = '';
              } else {
                alert(`Error: ${result.error}`);
              }
            } catch (err) {
              console.error(err);
              alert('Submission failed.');
            }
          }}
        >
          <input type="email" id="email" placeholder="Sign up" required />
          <button type="submit">→</button>
        </form>

        <div className="application-link-container">
          <p className="application-label">Applications now live!</p>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSfn9_mrUTZE2zhkJKGPOhYSb5IhwcbeUhzNm8-MOEzeTzvHCg/viewform" 
            target="_blank" 
            rel="noopener noreferrer"
            className="application-button"
          >
            Apply Now
          </a>
        </div>
      
    </div>
    <Bottom />
    </div>
  );
};

export default Recruitment;
