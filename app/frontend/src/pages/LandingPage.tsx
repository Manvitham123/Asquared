import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../assets/css/index2.css";
import "../assets/css/navbar.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
       navigate('/index');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
    
        <a href="/index3">
          <img
            src="https://asquared-images.s3.us-east-2.amazonaws.com/images/logo.avif"
            className="hi"
            alt="Logo with the letter a and an exponent of two"
          />
        </a>

      <div className="loader">
        <span className="loader_elemnt"></span>
        <span className="loader_elemnt"></span>
        <span className="loader_elemnt"></span>
      </div>

      <div className="nav">
        <ul>
          <li><a href="/" tabIndex={0}>Home</a></li>
          <li><a href="/about" tabIndex={0}>About us</a></li>
          <li><a href="/issues" tabIndex={0}>Mags</a></li>
          <li><a href="/joinus" tabIndex={0}>Join Us</a></li>
          <li><a href="/events" tabIndex={0}>Events</a></li>
          <li><a href="/affiliates" tabIndex={0}>Affiliate program</a></li>
          <li><a href="/shoots" tabIndex={0}>Blog</a></li>
        </ul>
      </div>

      <div><h1 className="footer-text">Loading</h1></div>
    </main>
  );
};

export default LandingPage;
