
import "../assets/css/bottom.css";
import { FaInstagram, FaTiktok, FaLinkedin } from "react-icons/fa";

const Bottom = () => (
  <footer className="bottom-footer">
    <div className="bottom-main">
      <div className="bottom-newsletter">
        <h3>FROM OUR BLOCK<br/>TO YOUR FEED</h3>
        <p>be the first to hear about new stuff from a/squared</p>
        <form className="bottom-form">
          <input type="email" placeholder="email address" />
          <button type="submit">sign up</button>
        </form>
      </div>
      <div className="bottom-links">
        <div>
          <h4>zines</h4>
          <div className="bottom-links-list">
            <a href="/magazines">all issues</a>
            <a href="/blog">blog</a>
            <a href="/events">events</a>
            <a href="/affiliates">affiliates</a>
            <a href="/recruitment">join the team</a>
          </div>
        </div>
        <div>
          <h4>about</h4>
          <div className="bottom-links-list">
            <a href="/">about us</a>
            <a href="/affiliates">contact</a>
            <a href="/">faq</a>
            <a href="/">privacy</a>
          </div>
        </div>
        <div>
          <h4>region</h4>
          <select>
            <option>united states</option>
            <option>canada</option>
            <option>uk</option>
          </select>
        </div>
      </div>
    </div>
    <div className="bottom-brand-row">
      <div className="bottom-brand">A/squared</div>
      <div className="bottom-socials">
        <a href="https://www.instagram.com/asquared_mag?utm_source=ig_web_button_share_sheet&igsh=NnRsMnh3azB5MG5i" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a href="https://tiktok.com/@asquaredmag" aria-label="TikTok" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
        <a href="https://www.linkedin.com/company/a-squared-mag/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
      </div>
    </div>
    <div className="bottom-cookie">
      <span>© 2025 A/2. Made with love by the A/squared team.</span>
    </div>
  </footer>
);

export default Bottom;
