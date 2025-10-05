import React from "react";
import Navbar2 from "../components/Navbar2";
import Bottom from "../components/Bottom";
import "../assets/css/comingsoon.css";

const ComingSoon: React.FC = () => {
  React.useEffect(() => {
    document.body.classList.add('comingsoon-page');
    return () => {
      document.body.classList.remove('comingsoon-page');
    };
  }, []);

  return (
    <div className="comingsoon-collage-bg">
      <Navbar2 />
      <main className="comingsoon-main">
        <div className="comingsoon-container">
          <h1 className="comingsoon-title">Coming Soon</h1>
          <p className="comingsoon-text">
            This page is under construction.<br />Check back soon!
          </p>
        </div>
      </main>
      <Bottom />
    </div>
  );
};

export default ComingSoon;
