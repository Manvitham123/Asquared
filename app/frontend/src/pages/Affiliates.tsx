import React from "react";
import Navbar from "../components/Navbar";
import "../assets/css/affiliates.css";
import "../assets/css/navbar.css";

// const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";
const S3_PREFIX = "https://d1gmweuuxd5quh.cloudfront.net"; // Uncomment this line to use CloudFront for better performance

const Affiliates: React.FC = () => (
  <>
    <Navbar />
    <main className="affiliate-section">
      <div className="affiliate-content">
        <h1>Affiliate Program</h1>
        <p className="affiliate-description" tabIndex={0}>
          Join our affiliate program to receive exclusive opportunities in business, fashion, PR, and everything A/squared. Includes job and internship listings, extracurriculars around campus, discount codes, and more!
        </p>
        <a href="https://docs.google.com/forms/d/1CcQNGkOQDrBrzOxM9EqPBGEtfDdSRX0ucWtXGxKN0Wo/viewform?edit_requested=true" target="_blank" className="affiliate-btn" tabIndex={0}>Join Now</a>
      </div>
      <div className="affiliate-images">
        <img src={`${S3_PREFIX}/images/spring25shoots/IMG_8936.jpg`} alt="girl posing on retro tv holding a camcorder" tabIndex={0} />
        <img src={`${S3_PREFIX}/images/spring25shoots/rdP3WEfa.jpeg`} alt="4 people posing in the snow" tabIndex={0} />
        <img src={`${S3_PREFIX}/images/spring25shoots/IMG_6663.jpg`} alt="Girl wearing a beatiful white gown laying on marble stairs" tabIndex={0} />
      </div>
      <img src={`${S3_PREFIX}/images/stickers/patch%2Bpocket.avif`} className="sticker sticker-right" alt="a squared patch sticker" tabIndex={0} />
      <div className="affiliate-collage">
        <img src={`${S3_PREFIX}/images/spring25shoots/I624_Ywn.jpeg`} className="collage-base" alt="group of people walking on campus but man in the middle is turned facing camera" tabIndex={0} />
        <img src={`${S3_PREFIX}/images/spring25shoots/Zji6nKok.jpeg`} className="collage-base" alt="four people pose in front of a fence wearing y2k outfits" tabIndex={0} />
        <img src={`${S3_PREFIX}/images/spring25shoots/rwuHa_CY.jpeg`} className="sticker" alt="girl laying next to her purse with her belongings layed out" tabIndex={0} />
      </div>
      <img src={`${S3_PREFIX}/images/stickers/leather2.avif`} className="sticker sticker-left" alt="leather asquared sticker" tabIndex={0} />
      <div className="affiliate-images extra-images">
        <img src={`${S3_PREFIX}/images/spring25shoots/IMG_4521.JPG`} alt="girl posing in an office core outfit with a cup of coffee" tabIndex={0} />
        <img src={`${S3_PREFIX}/images/spring25shoots/ri4PLyiC.jpeg`} alt="3 girls sitting on a bed posing infront of posters" tabIndex={0} />
      </div>
      <div className="affiliate-stickers">
        <div className="sticker-group-left">
          <img src={`${S3_PREFIX}/images/stickers/tix2.avif`} className="sticker-left" alt="ticket sticker" tabIndex={0} />
          <img src={`${S3_PREFIX}/images/stickers/polaroid1.avif`} className="sticker-left" style={{marginTop: "-60px", transform: "rotate(5deg)"}} alt="polaroid sticker" tabIndex={0} />
        </div>
        <div className="sticker-group-right">
          <img src={`${S3_PREFIX}/images/stickers/shoeprint2.avif`} className="sticker-right" alt="shoeprint sticker" tabIndex={0} />
          <img src={`${S3_PREFIX}/images/stickers/tix5.avif`} className="sticker-right" style={{marginTop: "-40px", transform: "rotate(-8deg)"}} alt="ticket sticker" tabIndex={0} />
        </div>
      </div>
    </main>
  </>
);

export default Affiliates;
