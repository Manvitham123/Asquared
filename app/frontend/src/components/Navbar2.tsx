import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/css/navbar2.css";

type DropdownItem = { name: string; to: string };
type Tab = {
  name: string;
  color: string;
  logo?: boolean;
  to?: string;
  dropdown?: DropdownItem[];
};

const tabs: Tab[] = [
  { name: "Logo", color: "#dbd5c2", logo: true, to: "/" },
  { name: "Our Team", color: "#7e9db0", to: "/team" },
  {
    name: "Media",
    color: "#97ac75",
    dropdown: [
      { name: "Mags", to: "/magazines" },
      { name: "other", to: "/coming-soon" },
    ],
  },
  { name: "Events", color: "#e95a51", to: "/events" },
  { name: "Blog", color: "#c66297", to: "/blog" },
  {
    name: "Join us",
    color: "#decde6",
    dropdown: [
      { name: "Affiliate", to: "/affiliates" },
      { name: "Recruitment", to: "/coming-soon" },
    ],
  },
];

const Navbar2: React.FC = () => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});

  // detect active tab (same logic you had)
  const activeTab = tabs.find((tab) => {
    if (tab.to === "/" && location.pathname === "/") return true;
    if (tab.to && tab.to !== "/") {
      return (
        location.pathname === tab.to ||
        (location.pathname.startsWith(tab.to) &&
          location.pathname.charAt(tab.to.length) === "/")
      );
    }
    if (tab.dropdown) {
      return tab.dropdown.some(
        (item) =>
          location.pathname === item.to ||
          (location.pathname.startsWith(item.to) &&
            location.pathname.charAt(item.to.length) === "/")
      );
    }
    return false;
  });

  const isOnIssuesPage =
    location.pathname.startsWith("/issue") || location.pathname === "/magazines";
  const isOnTeamPage = location.pathname.startsWith("/team");
  const isOnEventsPage = location.pathname.startsWith("/events");
  const isOnBlogPage = location.pathname.startsWith("/blog");

  let finalActiveTab = activeTab;
  if (isOnIssuesPage) finalActiveTab = tabs.find((t) => t.name === "Media");
  else if (isOnTeamPage) finalActiveTab = tabs.find((t) => t.name === "Our Team");
  else if (isOnEventsPage) finalActiveTab = tabs.find((t) => t.name === "Events");
  else if (isOnBlogPage) finalActiveTab = tabs.find((t) => t.name === "Blog");

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Desktop / tablet navbar (your original pill style) */}
      <nav className="navbar desktop-nav">
        {tabs.map((tab) => {
          const hasDropdown = !!tab.dropdown;
          return (
            <div
              key={tab.name}
              className={`nav-item-wrapper ${hasDropdown ? "has-dropdown" : ""}`}
              style={{ position: "relative" }}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {hasDropdown ? (
                <div
                  className={`nav-item${
                    finalActiveTab?.name === tab.name ? " active" : ""
                  }`}
                  style={{ backgroundColor: tab.color }}
                  onMouseEnter={() => setOpenDropdown(tab.name)}
                >
                  {tab.name}
                </div>
              ) : (
                <Link
                  to={tab.to || "/"}
                  className={`nav-item${tab.logo ? " logo-tab" : ""}${
                    finalActiveTab?.name === tab.name ? " active" : ""
                  }`}
                  style={{ backgroundColor: tab.color, display: "block" }}
                >
                  {tab.logo ? (
                    <img
                      src="https://d1gmweuuxd5quh.cloudfront.net/logos/a_squared_logo_black.png"
                      alt="a/squared logo"
                      style={{
                        height: 32,
                        width: 32,
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  ) : (
                    tab.name
                  )}
                </Link>
              )}

              {hasDropdown && (
                <div
                  className={`dropdown-menu ${
                    openDropdown === tab.name ? "show" : ""
                  }`}
                  style={{ backgroundColor: tab.color }}
                >
                  {tab.dropdown!.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="dropdown-item"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-drawer"
          className={`hamburger-btn ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <Link to="/" className="mobile-brand" onClick={closeMobile}>
          A/SQUARED
        </Link>
      </div>
      <div className="mobile-topbar-spacer" aria-hidden="true" />

      {/* Mobile full-screen drawer */}
      <div
        id="mobile-drawer"
        className={`mobile-drawer ${mobileOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
     

        <div className="mobile-list">
          {tabs
            .filter((t) => !t.logo) // skip tiny logo tab on mobile list
            .map((tab) =>
              tab.dropdown ? (
                <div className="mobile-accordion" key={tab.name}>
                  <button
                    className="mobile-accordion-trigger"
                    style={{ backgroundColor: tab.color }}
                    aria-expanded={!!mobileExpanded[tab.name]}
                    onClick={() =>
                      setMobileExpanded((s) => ({
                        ...s,
                        [tab.name]: !s[tab.name],
                      }))
                    }
                  >
                    <span>{tab.name}</span>
                    <span className={`chev ${mobileExpanded[tab.name] ? "up" : ""}`}>
                      ▾
                    </span>
                  </button>
                  <div
                    className={`mobile-accordion-panel ${
                      mobileExpanded[tab.name] ? "open" : ""
                    }`}
                  >
                    {tab.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className="mobile-link child"
                        style={{ backgroundColor: tab.color }}
                        onClick={closeMobile}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={tab.name}
                  to={tab.to || "/"}
                  className="mobile-link"
                  style={{ backgroundColor: tab.color }}
                  onClick={closeMobile}
                >
                  {tab.name}
                </Link>
              )
            )}
        </div>
      </div>
    </>
  );
};

export default Navbar2;
