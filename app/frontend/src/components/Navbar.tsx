import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/navbar.css";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleLinkClick = () => setOpen(false);

  return (
    <nav>
      <div className="logo">
        <Link to="/">
          <img
            src="https://d1gmweuuxd5quh.cloudfront.net/images/a2-logo-white-8.29.avif"
            alt="Logo with the letter a and an exponent of two"
          />
        </Link>
      </div>
      <button
        className="hamburger"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={handleToggle}
        type="button"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      <div className={`nav-inner${open ? " open" : ""}`} id="main-nav">
        <ul>
          <li><Link to="/about" tabIndex={0} onClick={handleLinkClick}>About</Link></li>
          <li><Link to="/magazines" tabIndex={0} onClick={handleLinkClick}>Mags</Link></li>
          <li><Link to="/joinus" tabIndex={0} onClick={handleLinkClick}>Join Us</Link></li>
          <li><Link to="/events" tabIndex={0} onClick={handleLinkClick}>Events</Link></li>
          <li><Link to="/affiliates" tabIndex={0} onClick={handleLinkClick}>Affiliates</Link></li>
          <li><Link to="/blog" tabIndex={0} onClick={handleLinkClick}>Blog</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
