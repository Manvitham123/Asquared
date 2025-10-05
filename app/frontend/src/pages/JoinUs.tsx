import React, { useEffect } from "react";
import Navbar2 from "../components/Navbar2";
import Bottom from "../components/Bottom";
import "../assets/css/joinus.css";

const S3_PREFIX = "https://cdn.asquaredmag.org";
//const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-22eGFmIY65w1LlJsovoHzyfxsPk3l_oXAjaCSd-i_u3SfSWCYvvUsxxv7Ia21aZD2A/exec"; // Replace with your URL

const JoinUs: React.FC = () => {
  useEffect(() => {
    document.body.classList.add("joinus-page");
    return () => document.body.classList.remove("joinus-page");
  }, []);
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("http://asquaredmag.org/api/joinus-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("✅ Form submitted successfully!");
      form.reset();
    } else {
      alert("❌ Submission failed.");
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Network error.");
  }
};


  return (
    <div>
      <Navbar2 />
      <main>
        <div className="banner-container">
          <div className="banner">
            {[...Array(6)].map((_, i) => (
              <img
                key={i}
                src={`${S3_PREFIX}/images/a_squardBoardGroup.avif`}
                alt="a squared group photo of members sitting on a couch"
              />
            ))}
          </div>
        </div>

        <div className="form-container">
          <h1>2025 Recruitment Season Begins Soon!</h1>
          <p className="form-subtitle">Interested? Fill out the form below.</p>

          {/* ✅ Updated Form */}
          <form id="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input type="text" name="name" placeholder="Enter your full name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" placeholder="example@umich.edu" required />
            </div>

            <div className="form-group">
              <label htmlFor="grade">Grade:</label>
              <select name="grade" required>
                <option value="">Select your grade</option>
                <option>Freshman</option>
                <option>Sophomore</option>
                <option>Junior</option>
                <option>Senior</option>
                <option>Graduate</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pronouns">Pronouns:</label>
              <select name="pronouns" required>
                <option value="">Select pronouns</option>
                <option>She/Her</option>
                <option>He/Him</option>
                <option>They/Them</option>
                <option>Prefer Not to Say</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="interests">What are you interested in?</label>
              <textarea name="interests" placeholder="Your interests..." required></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="questions">Anything else we should know and/or questions?</label>
              <textarea name="questions" placeholder="Any additional info..."></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="hear">How did you hear about us?</label>
              <input type="text" name="hear" placeholder="Instagram, friend, event..." />
            </div>

            <div className="form-group">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>

        <div className="logo2">
          <img src={`${S3_PREFIX}/logos/asquared-logo-black-long.png`} alt="a squared logo" />
        </div>
      </main>
      <Bottom />
    </div>
  );
};

export default JoinUs;
