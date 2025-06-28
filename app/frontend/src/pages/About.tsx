import React from "react";
import "../assets/css/about.css";
import "../assets/css/navbar.css";
import Navbar from "../components/Navbar";


const AboutPage: React.FC = () => {
  return (
    <>
      <Navbar />

      <main>
        <section className="hero-section">
          <h1>About Us</h1>
        </section>

        <div className="about-wrapper" tabIndex={0}>
          <section className="about-us" aria-labelledby="about-header">
            <h2 id="about-header">About Us</h2>
            <p>
              Asquared Magazine is a student-powered exploration of fashion, identity, and creative culture at the University of Michigan. We believe in DIY aesthetics, radical collaboration, and storytelling that pushes boundaries.
            </p>
            <p>
              Every issue is a collective experiment — mixing photography, writing, styling, and design to reflect the world around us, and reimagine the one we want to build.
            </p>
            <p>
              We’re not just a magazine. We’re a platform, a party, a protest, and a point of view.
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default AboutPage;
