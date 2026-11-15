import React, { useState } from 'react';
import styles from './Library.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

/* ------------------------------------------------------------------
   DATA
   lat/lng are approximate. Check them on a map and adjust.
   Health + Social Science libraries are placeholders until you
   send the real names, descriptions and hours.
------------------------------------------------------------------- */
const CAMPUSES = [
  {
    id: 'kiot',
    tab: 'KIoT',
    label: 'KIoT Campus',
    fullName: 'Kombolcha Institute of Technology',
    lat: 11.0786,
    lng: 39.7347,
    intro: 'Three libraries, built around the way KIoT students study and learn.',
    libraries: [
      {
        id: 'fresh',
        name: 'Fresh Library',
        description: 'Study space and textbooks for first-year (freshman) students.',
        hours: 'Mon–Sat, 8:00 AM – 9:00 PM',
      },
      {
        id: 'engineering',
        name: 'Engineering Library',
        description:
          'Civil, mechanical, electrical and chemical engineering books and journals.',
        hours: 'Mon–Sat, 8:00 AM – 9:00 PM',
      },
      {
        id: 'informatics',
        name: 'Informatics Library',
        description:
          'Computer science, software engineering and IT resources with computer access.',
        hours: 'Mon–Sat, 8:00 AM – 10:00 PM',
      },
    ],
  },
  {
    id: 'health',
    tab: 'Health',
    label: 'Health Campus',
    fullName: 'Health Campus',
    lat: 11.1186,
    lng: 39.63,
    intro: 'Two libraries supporting health science students.',
    libraries: [
      {
        id: 'health-1',
        name: 'Health Library I',
        description: 'Details coming soon.',
        hours: 'Hours to be announced',
      },
      {
        id: 'health-2',
        name: 'Health Library II',
        description: 'Details coming soon.',
        hours: 'Hours to be announced',
      },
    ],
  },
  {
    id: 'social',
    tab: 'Social Science',
    label: 'Social Science Campus',
    fullName: 'Social Science Campus',
    lat: 11.1186,
    lng: 39.63,
    intro: 'Two libraries supporting social science students.',
    libraries: [
      {
        id: 'social-1',
        name: 'Social Science Library I',
        description: 'Details coming soon.',
        hours: 'Hours to be announced',
      },
      {
        id: 'social-2',
        name: 'Social Science Library II',
        description: 'Details coming soon.',
        hours: 'Hours to be announced',
      },
    ],
  },
];

const mapSrc = ({ lat, lng }) => {
  const dx = 0.014;
  const dy = 0.009;
  const bbox = [lng - dx, lat - dy, lng + dx, lat + dy].join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
};

const pad = (n) => String(n).padStart(2, '0');

const Arrow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function Library({ onViewLibrary }) {
  const [campusId, setCampusId] = useState('kiot');
  const [libId, setLibId] = useState('engineering');

  const campus = CAMPUSES.find((c) => c.id === campusId) || CAMPUSES[0];
  const active =
    campus.libraries.find((l) => l.id === libId) || campus.libraries[0];

  const featured =
    CAMPUSES[0].libraries.find((l) => l.id === 'engineering') ||
    CAMPUSES[0].libraries[0];

  const pickCampus = (c) => {
    setCampusId(c.id);
    setLibId(c.libraries[0].id);
  };

  const view = (lib, c) => onViewLibrary && onViewLibrary(lib, c);

  return (
    <section className={styles.root} aria-label="Libraries at Wollo University">
      <div className={styles.hero}>
        {/* ---------------- LEFT ---------------- */}
        <div className={styles.left}>
          <span className={cx(styles.eyebrow, styles.anim)} style={{ '--d': 0 }}>
            Wollo University
          </span>

          <h2 className={styles.title}>
            <span className={cx(styles.line, styles.anim)} style={{ '--d': 1 }}>
              Libraries at{' '}
              <span className={styles.hl}>{campus.tab}</span>
            </span>
            <span className={cx(styles.line, styles.anim)} style={{ '--d': 2 }}>
              {campus.id === 'kiot' ? 'Campus' : 'Campus'}
            </span>
          </h2>

          <p className={cx(styles.text, styles.anim)} style={{ '--d': 3 }}>
            {campus.intro}
          </p>

          {/* campus tabs */}
          <div
            className={cx(styles.tabs, styles.anim)}
            style={{ '--d': 4 }}
            role="tablist"
            aria-label="Campus"
          >
            {CAMPUSES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={c.id === campusId}
                className={cx(styles.tab, c.id === campusId && styles.tabOn)}
                onClick={() => pickCampus(c)}
              >
                {c.tab}
                <span className={styles.tabCount}>
                  {c.libraries.length} {c.libraries.length === 1 ? 'library' : 'libraries'}
                </span>
              </button>
            ))}
          </div>

          {/* library list */}
          <ul className={styles.list}>
            {campus.libraries.map((lib, i) => {
              const on = lib.id === active.id;
              return (
                <li
                  key={`${campus.id}-${lib.id}`}
                  className={cx(styles.item, on && styles.itemOn, styles.anim)}
                  style={{ '--d': 5 + i }}
                >
                  <button
                    type="button"
                    className={styles.itemMain}
                    onMouseEnter={() => setLibId(lib.id)}
                    onFocus={() => setLibId(lib.id)}
                    onClick={() => setLibId(lib.id)}
                  >
                    <span className={styles.itemNum}>{pad(i + 1)}</span>
                    <span className={styles.itemBody}>
                      <span className={styles.itemName}>{lib.name}</span>
                      <span className={styles.itemCampus}>{campus.label}</span>
                      <span className={styles.itemDesc}>{lib.description}</span>
                      <span className={styles.itemHours}>{lib.hours}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={styles.itemLink}
                    onClick={() => view(lib, campus)}
                  >
                    View library
                    <span className={styles.itemArrow}>
                      <Arrow />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------------- RIGHT: MAP CARD ---------------- */}
        <div className={cx(styles.media, styles.anim)} style={{ '--d': 1 }}>
          <iframe
            key={campus.id}
            className={styles.map}
            title={`Map of ${campus.fullName}`}
            src={mapSrc(campus)}
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          <div className={styles.mediaTop}>
            <span className={styles.mediaChip}>
              <i className={styles.pin} />
              {campus.fullName}
            </span>
          </div>

          <div className={styles.featured}>
            <span className={styles.featuredLabel}>
              {campus.id === 'kiot' ? 'Featured' : 'Selected'} · {campus.label}
            </span>
            <strong className={styles.featuredName}>
              {campus.id === 'kiot' ? featured.name : active.name}
            </strong>
            <p className={styles.featuredText}>
              {campus.id === 'kiot' ? featured.description : active.description}
            </p>
            <button
              type="button"
              className={styles.cta}
              onClick={() =>
                campus.id === 'kiot' ? view(featured, campus) : view(active, campus)
              }
            >
              <span className={styles.ctaLabel}>
                View {campus.id === 'kiot' ? featured.name : active.name}
              </span>
              <span className={styles.ctaIcon}>
                <Arrow />
              </span>
            </button>
          </div>

          <div className={styles.facts}>
            <div>
              <span className={styles.factKey}>Campus</span>
              <span className={styles.factVal}>{campus.fullName}</span>
            </div>
            <div>
              <span className={styles.factKey}>Libraries</span>
              <span className={styles.factVal}>
                {campus.libraries.map((l) => l.name).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Library;