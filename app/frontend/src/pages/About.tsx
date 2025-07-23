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
              Welcome to A/squared Magazine — your guide to fashion, culture, and the arts in Ann Arbor.
            </p>
            <p>
               Created by students, for students, we highlight emerging trends, local creatives, and the unique voices shaping our campus and city. From style spotlights to cultural commentary, every piece reflects the energy of our community.
            </p>
            <p>
              Explore what's making Ann Arbor now. ☆
            </p>
        

          </section>
        </div>
      </main>
    </>
  );
};

export default AboutPage;
