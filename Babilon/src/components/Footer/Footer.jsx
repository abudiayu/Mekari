import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

/* To use the real Wollo logo, import it and render it inside the .logo span:
   import logo from '../../assets/logo.png';
   <img src={logo} alt="" />                                                   */

const COLUMNS = [
  {
    title: 'Academics',
    links: [
      { label: 'Departments', to: '/departments' },
      { label: 'Programs & Courses', to: '/programs' },
      { label: 'Research Centers', to: '/research' },
      { label: 'University Library', to: '/library' },
    ],
  },
  {
    title: 'Campus Life',
    links: [
      { label: 'Student Clubs', to: '/clubs' },
      { label: 'Sports & Recreation', to: '/sports' },
      { label: 'Accommodation', to: '/accommodation' },
      { label: 'Cafeteria & Services', to: '/cafeteria' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'E-Learning Portal', to: '/e-learning' },
      { label: 'Alumni Network', to: '/alumni' },
      { label: 'Opportunities', to: '/opportunities' },
      { label: 'Statistics & Rankings', to: '/statistics' },
    ],
  },
];

const LANGUAGES = ['English', 'አማርኛ', 'Afaan Oromoo'];

/* ── Social links (set your real URLs) ── */
const SOCIALS = [
  {
    name: 'X',
    href: 'https://x.com/',
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/',
    icon: (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/',
    icon: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/',
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    name: 'Telegram',
    href: 'https://t.me/',
    icon: (
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/',
    icon: (
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/',
    stroke: true,
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

const cx = (...names) => names.filter(Boolean).join(' ');

function Footer() {
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [open, setOpen] = useState(false);
  const langRef = useRef(null);

  /* close the language menu on outside click / Escape */
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* ── Language ── */}
        <div className={styles.lang} ref={langRef}>
          <button
            type="button"
            className={styles.langBtn}
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9.5" />
              <path d="M2.5 12h19M12 2.5c2.6 2.7 4 6 4 9.5s-1.4 6.800-4 9.500c-2.600-2.700-4-6-4-9.500s1.400-6.800 4-9.500z" />
            </svg>
            <span>{lang}</span>
            <svg className={cx(styles.chev, open && styles.chevOpen)} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {open && (
            <ul className={styles.langMenu} role="listbox" aria-label="Choose language">
              {LANGUAGES.map((l) => (
                <li key={l} role="option" aria-selected={l === lang}>
                  <button
                    type="button"
                    className={cx(styles.langItem, l === lang && styles.langItemOn)}
                    onClick={() => { setLang(l); setOpen(false); }}
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Columns ── */}
        <div className={styles.cols}>
          {COLUMNS.map((col) => (
            <nav className={styles.col} aria-label={col.title} key={col.title}>
              <h3 className={styles.colTitle}>{col.title}</h3>
              <ul className={styles.list}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className={styles.link}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className={cx(styles.col, styles.brand)}>
            <Link to="/" className={styles.brandHead} aria-label="Wollo-Info home">
              <span className={styles.logo} aria-hidden="true">W</span>
              <span className={styles.brandName}>Wollo-Info</span>
            </Link>
            <p className={styles.brandText}>
              Empowering students, staff, and alumni of Wollo University with
              information, opportunities, and connection.
            </p>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className={styles.bottom}>
          <p className={styles.copy}>2025 Abdulqadir MD all rights reserved.</p>

          <ul className={styles.socials}>
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  className={styles.social}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    aria-hidden="true"
                    fill={s.stroke ? 'none' : 'currentColor'}
                    stroke={s.stroke ? 'currentColor' : 'none'}
                    strokeWidth={s.stroke ? 2 : 0}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;