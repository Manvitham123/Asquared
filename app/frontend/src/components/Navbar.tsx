import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/navbar.css";

const Navbar: React.FC = () => (
  <nav>
    <div className="logo">
      <img
        src="https://asquared-images.s3.us-east-2.amazonaws.com/images/a2-logo-white-8.29.avif"
        alt="Logo with the letter a and an exponent of two"
      />
    </div>
    <ul>
      <li><Link to="/" tabIndex={0}>Home</Link></li>
      <li><Link to="/about" tabIndex={0}>About us</Link></li>
      <li><Link to="/issues" tabIndex={0}>Mags</Link></li>
      <li><Link to="/joinus" tabIndex={0}>Join Us</Link></li>
      <li><Link to="/events" tabIndex={0}>Events</Link></li>
      <li><Link to="/affiliates" tabIndex={0}>Affiliate program</Link></li>
      <li><Link to="/blog" tabIndex={0}>Blog</Link></li>
    </ul>
  </nav>
);

export default Navbar;
