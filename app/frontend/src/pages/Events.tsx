import React from "react";
import Navbar from "../components/Navbar";
import "../assets/css/events.css";
import "../assets/css/navbar.css";

//const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";
const S3_PREFIX = "https://d1gmweuuxd5quh.cloudfront.net"; // Updated to use CloudFront for better performance

const Events: React.FC = () => (
  <div>
    <Navbar />
    <aside>
      <div className="side-accent-group left">
        <img src={`${S3_PREFIX}/images/stickers/polaroid2.avif`} alt="Polaroid sticker" />
        <img src={`${S3_PREFIX}/images/stickers/leather2.avif`} alt="Leather patch" />
        <img src={`${S3_PREFIX}/images/stickers/shoeprint2.avif`} alt="Shoe print" />
      </div>
      <div className="side-accent-group right">
        <img src={`${S3_PREFIX}/images/stickers/tix2.avif`} alt="Ticket sticker" />
        <img src={`${S3_PREFIX}/images/stickers/vinyl2.avif`} alt="Vinyl record sticker" />
        <img src={`${S3_PREFIX}/images/stickers/mp3player1.avif`} alt="MP3 player sticker" />
      </div>
    </aside>
    <header>
      <h1>What we do:</h1>
      <p>This semester we did some internal rework and bonded together</p>
      <p>But don't worry — we throw campus-wide events (parties and other cool stuff), so look forward to the upcoming fall semester!</p>
    </header>
    <main>
      <section aria-labelledby="spring2025">
        <h2 id="spring2025">Spring 2025 Events</h2>
        <article className="event" tabIndex={0}>
          <h3>Spring 2025 Launch Party</h3>
          <div className="carousel" id="spring-launch-carousel">
            <img src={`${S3_PREFIX}/images/events/100_0462.JPG`} alt="Guests posing at launch party" tabIndex={0} />
            <img src={`${S3_PREFIX}/images/events/launch.jpg`} alt="guests looking at decorations for the launch" tabIndex={0} />
            <img src={`${S3_PREFIX}/images/events/Magazines25.jpeg`} alt="Magazines hung up on hanger rack with bows" tabIndex={0} />
          </div>
        </article>
        <article className="event" tabIndex={0}>
          <h3>Espresso Your Love Coffee Pop-Up</h3>
          <div className="carousel" id="coffee-carousel">
            <img src={`${S3_PREFIX}/images/events/Espresso.png`} alt="Espresso your love flyer" tabIndex={0} />
            <img src={`${S3_PREFIX}/images/events/528D40A8-3023-4383-AE32-B97AF185E6D0_1_102_o.jpeg`} alt="asquared member typing out love letters on a typewriter" tabIndex={0} />
            <img src={`${S3_PREFIX}/images/events/heart.png`} alt="asquared heart patch sticker" tabIndex={0} />
          </div>
        </article>
      </section>
      <h2>Fall 2024 Events</h2>
      <section id="fall2024">
        <article className="event" tabIndex={0}>
          <h3>A/Scared Halloween Party</h3>
          <div className="carousel" id="halloween-carousel">
            <img src={`${S3_PREFIX}/images/events/DSCF8002.JPG`} alt="Guest in michael jackson costume posing" tabIndex={0} />
            <img src={`${S3_PREFIX}/images/events/DSCF8013.JPG`} alt="asquared members posing at party in costume" tabIndex={0} />
            <img src={`${S3_PREFIX}/images/events/002263290030.JPG`} alt="People dancing at Halloween party" tabIndex={0} />
          </div>
        </article>
        <article className="event" tabIndex={0}>
          <h3>Fall 2024 Launch Party</h3>
          <div className="carousel" id="fall-launch-carousel">
            <img src={`${S3_PREFIX}/images/events/IMG_1336.JPG`} alt="Board members posing holding magazines" tabIndex={0} />
            <img src={`${S3_PREFIX}/images/events/IMG_1254.JPG`} alt="asquared magazines and stickers layed out" tabIndex={0} />
            <img src={`${S3_PREFIX}/images/events/IMG_1281.JPG`} alt="Members holding up magazines and smiling" tabIndex={0} />
          </div>
        </article>
        <article className="event" tabIndex={0}>
          <h3>Y2K Themed Party</h3>
          <div className="carousel" id="y2k-carousel">
            <img src={`${S3_PREFIX}/images/events/DSC05317.JPG`} alt="people posing with Y2K themed outfits" tabIndex={0} />
            <img src={`${S3_PREFIX}/images/events/DSC05329.JPG`} alt="asquared members psoing at party" tabIndex={0} />
            <img src={`${S3_PREFIX}/images/events/IMG_8991.jpg`} alt="DJ posing for picture" tabIndex={0} />
          </div>
        </article>
      </section>
    </main>
  </div>
);

export default Events;
