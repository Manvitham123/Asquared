import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/issues.css";
import "../assets/css/navbar.css";

import Bottom from "../components/Bottom";
import Navbar2 from "../components/Navbar2";
/*const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";*/
const S3_PREFIX = "https://cdn.asquaredmag.org"; // Updated to use new CDN

const MagazineGallery: React.FC = () => {
  React.useEffect(() => {
    document.body.classList.add('issues-page');
    return () => {
      document.body.classList.remove('issues-page');
    };
  }, []);
  return (
    <div>
      <Navbar2 />
      <div className="issues-overlay-container">
        <main>
          <div className="magazine-container">
            <h1>Past Issues</h1>
            <div className="magazine-gallery">
              <Link to="/issue1" className="magazine">
                <img
                  src={`${S3_PREFIX}/images/sept-issue/cover.jpg`}
                  alt="Fall 2023 cover"
                />
                <p>Fall 2023</p>
              </Link>
              <Link to="/issue3" className="magazine">
                <img
                  src={`${S3_PREFIX}/images/oct-issue/cover.jpg`}
                  alt="Fall 2023 cover"
                />
                <p>Fall 2023</p>
              </Link>
              <Link to="/issue2" className="magazine">
                <img
                  src={`${S3_PREFIX}/images/Spring-issue/cover.jpg`}
                  alt="Spring 2024 cover"
                />
                <p>Spring 2024</p>
              </Link>
              <Link to="/issue4" className="magazine">
                <img
                  src={`${S3_PREFIX}/images/Fall-2024-issue/cover.jpg`}
                  alt="Fall 2024 cover"
                />
                <p>Fall 2024</p>
              </Link>
               <Link to="/issue5" className="magazine">
                <img
                  src={`${S3_PREFIX}/images/Winter-2025-issue/cover.jpg`}
                  alt="Winter 2025 cover"
                />
                <p>Winter 2025</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
      <Bottom />
    </div>
  );
};

export default MagazineGallery;
