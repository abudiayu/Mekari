import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Logo from '../../assets/wolloLogo.png';

/* ── Icons ── */
const HomeIcon = ({ size = 28 }) => (
  <svg className="ab-home-icon" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M12 2.8 1.8 11.9c-.3.3-.1.8.3.8H4V21a1 1 0 0 0 1 1h4.5v-6.2h5V22H19a1 1 0 0 0 1-1v-8.3h1.9c.4 0 .6-.5.3-.8L12 2.8z" />
  </svg>
);

const ChevronDown = ({ className = 'ab-chevron-icon' }) => (
  <svg className={className} viewBox="0 0 12 12" width="10" height="10" fill="none" aria-hidden="true">
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} fill="none" aria-hidden="true"
    stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8.5" cy="8.5" r="5.5" />
    <line x1="13" y1="13" x2="18" y2="18" />
  </svg>
);

const UserIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);

/* ── Menu data ── */
const NAV_ITEMS = [
  {
    label: 'Latest',
    links: [
      { label: 'News & Events', to: '/news' },
      { label: 'Announcements', to: '/events' },
      // { label: 'Announcements', to: '/#' },
    ],
  },
  {
    label: 'About',
    links: [
      { label: 'About the University', to: '/about' },
      { label: 'Vision & Mission', to: '/mission' },
      { label: 'Leadership', to: '/#' },
      { label: 'Contact Us', to: '/#' },
    ],
  },
  {
    label: 'Admission',
    links: [
      { label: 'Undergraduate', to: '/#' },
      { label: 'Postgraduate', to: '/#' },
      { label: 'Admission Requirements', to: '/#' },
      { label: 'Scholarships', to: '/#' },
    ],
  },
  {
    label: 'Academics',
    heading: 'Colleges',
    links: [
      { label: 'Informatics', to: '/#' },
      { label: 'Engineering', to: '/#' },
    ],
  },
  {
    label: 'Research',
    links: [
      { label: 'Research Groups', to: '/#' },
      { label: 'Publications', to: '/#' },
      { label: 'Research Projects', to: '/#' },
    ],
  },
  {
    label: 'Offices',
    links: [
      { label: 'President Office', to: '/#' },
      { label: 'Registrar', to: '/#' },
      { label: 'Library', to: '/#' },
    ],
  },
  {
    label: 'Services',
    links: [
      { label: 'Student Services', to: '/#' },
      { label: 'ICT Services', to: '/#' },
      { label: 'Alumni', to: '/#' },
    ],
  },
];

const LOGIN_PATH = '/auth';

function Navbar() {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchInputRef = useRef(null);
  const closeTimer = useRef(null);
  const navRef = useRef(null);

  /* Desktop hover helpers */
  const openWithHover = (key) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };
  const closeWithDelay = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };
  const toggleOnClick = (key) => {
    clearTimeout(closeTimer.current);
    setOpenMenu((p) => (p === key ? null : key));
  };

  /* Close everything on outside click */
  useEffect(() => {
    function handle(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
        setMobileOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  /* Auto-focus search input */
  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  /* Lock body scroll while mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery('');
  }

  return (
    <div className="ab-navbar-container" ref={navRef}>
      {/* ═════════ MAIN BAR ═════════ */}
      <nav className="ab-navbar" aria-label="Primary navigation">
        {/* Brand */}
        <Link className="ab-navbar-brand" to="/">
          <img src={Logo} alt="Wollo University" className="ab-navbar-logo" />
          <span className="ab-brand-divider" aria-hidden="true" />
          <div className="ab-navbar-title-block">
            <span className="ab-navbar-title-am">ወሎ ዩኒቨርሲቲ</span>
            <span className="ab-navbar-title">WOLLO UNIVERSITY</span>
            <span className="ab-navbar-subtitle">Since 2007</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="ab-navbar-links">
          <Link to="/" className="ab-navlink-home" aria-label="Home">
            <HomeIcon />
          </Link>

          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="ab-navbar-item-with-menu"
              onMouseEnter={() => openWithHover(item.label)}
              onMouseLeave={closeWithDelay}
            >
              <button
                className={`ab-navlink ${openMenu === item.label ? 'ab-navlink-active' : ''}`}
                onClick={() => toggleOnClick(item.label)}
                aria-expanded={openMenu === item.label}
                aria-haspopup="true"
              >
                {item.label}
                <ChevronDown />
              </button>

              <div className={`ab-dropdown ${openMenu === item.label ? 'ab-dropdown-open' : ''}`}>
                <div className="ab-dropdown-inner">
                  <div className="ab-dropdown-column">
                    <h4 className="ab-dropdown-heading">{item.heading || item.label}</h4>
                    <ul>
                      {item.links.map((link) => (
                        <li key={link.label}>
                          <Link to={link.to} onClick={() => setOpenMenu(null)}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <span className="ab-nav-divider" aria-hidden="true" />

          <button
            className={`ab-nav-search ${searchOpen ? 'ab-nav-search--active' : ''}`}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <SearchIcon />
          </button>

          {/* Login (desktop) */}
          <Link to={LOGIN_PATH} className="ab-login-btn">
            <UserIcon />
            <span>Login</span>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="ab-navbar-right">
          <button
            className={`ab-nav-search ab-nav-search--mobile ${searchOpen ? 'ab-nav-search--active' : ''}`}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <SearchIcon />
          </button>

          <button
            className={`ab-hamburger ${mobileOpen ? 'ab-hamburger--open' : ''}`}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="ab-mobile-drawer"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="ab-hamburger-bar" />
            <span className="ab-hamburger-bar" />
            <span className="ab-hamburger-bar" />
          </button>
        </div>
      </nav>

      {/* ── Search dropdown ── */}
      <div
        className={`ab-search-dropdown ${searchOpen ? 'ab-search-dropdown--open' : ''}`}
        role="search"
        aria-label="Site search"
      >
        <form className="ab-search-field" onSubmit={handleSearchSubmit}>
          <span className="ab-search-field-icon" aria-hidden="true">
            <SearchIcon size={19} />
          </span>

          <input
            ref={searchInputRef}
            type="search"
            className="ab-search-input"
            placeholder="Search departments, news, opportunities…"
            aria-label="Search"
            tabIndex={searchOpen ? 0 : -1}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery && (
            <button type="submit" className="ab-search-go" tabIndex={searchOpen ? 0 : -1} aria-label="Search">
              Go
            </button>
          )}

          <button
            type="button"
            className="ab-search-close"
            aria-label="Close search"
            tabIndex={searchOpen ? 0 : -1}
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
          >
            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </form>
      </div>

      {/* ═════════ MOBILE DRAWER ═════════ */}
      <div
        id="ab-mobile-drawer"
        className={`ab-mobile-drawer ${mobileOpen ? 'ab-mobile-drawer--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <ul className="ab-mobile-nav" role="list">
          <li className="ab-mobile-nav-item">
            <Link to="/" className="ab-mobile-nav-link" onClick={() => setMobileOpen(false)}>
              <span className="ab-mobile-home-icon">
                <HomeIcon size={20} />
                Home
              </span>
            </Link>
          </li>

          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="ab-mobile-nav-item">
              <button
                className="ab-mobile-nav-btn"
                onClick={() => setMobileExpanded((p) => (p === item.label ? null : item.label))}
                aria-expanded={mobileExpanded === item.label}
              >
                {item.label}
                <ChevronDown
                  className={`ab-mobile-chevron ${mobileExpanded === item.label ? 'ab-mobile-chevron--open' : ''}`}
                />
              </button>

              <div className={`ab-mobile-sub ${mobileExpanded === item.label ? 'ab-mobile-sub--open' : ''}`}>
                <div style={{ overflow: 'hidden' }}>
                  {item.links.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="ab-mobile-sub-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Login (mobile) */}
        <div className="ab-mobile-login-wrap">
          <Link to={LOGIN_PATH} className="ab-login-btn ab-login-btn--block" onClick={() => setMobileOpen(false)}>
            <UserIcon size={20} />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;