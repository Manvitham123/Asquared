import React from "react";
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
      <li><a href="/index.html" tabIndex={0}>Home</a></li>
      <li><a href="/about.html" tabIndex={0}>About us</a></li>
      <li><a href="/issues.html" tabIndex={0}>Mags</a></li>
      <li><a href="/joinus.html" tabIndex={0}>Join Us</a></li>
      <li><a href="/events.html" tabIndex={0}>Events</a></li>
      <li><a href="/affiliates.html" tabIndex={0}>Affiliate program</a></li>
      <li><a href="/shoots.html" tabIndex={0}>Blog</a></li>
    </ul>
  </nav>
);

export default Navbar;
