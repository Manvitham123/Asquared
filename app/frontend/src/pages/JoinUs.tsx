import React from "react";
import Navbar from "../components/Navbar";
import "../assets/css/joinus.css";
import "../assets/css/navbar.css";

//const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";
const S3_PREFIX = "https://d1gmweuuxd5quh.cloudfront.net"; // Updated to use CloudFront for better performance

const JoinUs: React.FC = () => (
  <div>
    <Navbar />
    <main>
      <div className="banner-container">
        <div className="banner">
          {[...Array(6)].map((_, i) => (
            <img
              key={i}
              src={`${S3_PREFIX}/images/a_squardBoardGroup.avif`}
              alt="a squared group photo of members sitting on a couch the photo revolves to show every member"
            />
          ))}
        </div>
      </div>
      <div className="form-container">
        <h1>2025 recruitment Season begins soon!</h1>
        <form id="contact-form" action="https://formspree.io/f/movdvaav" method="POST">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" placeholder="Enter your name" required tabIndex={0} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required tabIndex={0} />
          </div>
          <div className="form-group">
            <button type="submit" tabIndex={0}>Submit</button>
          </div>
        </form>
      </div>
      <div className="logo2">
        <img src={`${S3_PREFIX}/images/asquared-logo-white-better.avif`} alt="a squared logo of asquared spelled out in block letters" />
      </div>
    </main>
  </div>
);

export default JoinUs;
