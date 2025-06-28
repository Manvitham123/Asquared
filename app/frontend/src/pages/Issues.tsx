import React from "react";
import "../assets/css/issues.css";
import "../assets/css/navbar.css";
import Navbar from "../components/Navbar";

const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";

const MagazineGallery: React.FC = () => {
  return (
    <div>
         <Navbar />
      <main>
        <div className="magazine-container">
          <h1>Past Issues</h1>
          <div className="magazine-gallery">
            <a href="/issues1.html" className="magazine">
              <img src={`${S3_PREFIX}/images/sept-issue/cover.jpg`} alt="Fall 2022 cover" />
              <p>Fall 2022</p>
            </a>
            <a href="/issues3.html" className="magazine">
              <img src={`${S3_PREFIX}/images/oct-issue/cover.jpg`} alt="Fall 2023 cover" />
              <p>Fall 2023</p>
            </a>
            <a href="/issues2.html" className="magazine">
              <img src={`${S3_PREFIX}/images/Spring-issue/cover.jpg`} alt="Spring 2024 cover" />
              <p>Spring 2024</p>
            </a>
            <a href="/issues4.html" className="magazine">
              <img src={`${S3_PREFIX}/images/Fall-2024-issue/cover.jpg`} alt="Fall 2024 cover" />
              <p>Fall 2024</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MagazineGallery;
