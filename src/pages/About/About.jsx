import React, { useEffect, useRef, useState } from 'react';
import styles from './About.module.css';

/* ---------- Content (edit here, nothing else needs to change) ---------- */
// Put your own photos in: public/images/   (missing files show a clean placeholder)
const HERO_IMAGE = 'https://wustaff.edu.et/build/assets/banner-DupV4RIu.png';
const CAMPUS_IMAGE =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAvvo84cds-Y0sTyPJTEJkTPbVONUM9DjaX616zWaN2chYvlE0JiPFah2c&s=10';

const PILLARS = [
  {
    title: 'Applied Science Focus',
    text: 'One of Ethiopia\u2019s applied science public universities, preparing graduates with practical, industry-ready skills.',
    icon: 'flask',
  },
  {
    title: 'Three Centers of Excellence',
    text: 'Dedicated centers in health sciences, technology, and art & culture across our three campuses.',
    icon: 'campus',
  },
  {
    title: 'Research & Innovation',
    text: 'Multidisciplinary research in agriculture, science and technology, health, education, business, culture and indigenous knowledge.',
    icon: 'bulb',
  },
  {
    title: 'Community Engagement',
    text: 'Training skilled professionals and strengthening the social, economic, cultural and technological well-being of the nation.',
    icon: 'people',
  },
];

const STATS = [
  { value: 20000, suffix: '+', label: 'Students', note: 'Regular, extension, summer and distance programs' },
  { value: 14, suffix: '', label: 'Colleges & Schools', note: 'Colleges, institutes and schools on three campuses' },
  { value: 83, suffix: '+', label: 'Undergraduate Programs', note: 'Across sciences, health, technology and the arts' },
  { value: 134, suffix: '', label: 'Postgraduate Programs', note: 'Masters, PhD and specialty programs' },
];

/* Our story, told in six steps. Edit freely. */
const HISTORY = [
  {
    year: '1882',
    title: 'The town of Dessie is founded',
    text: 'Emperor Yohannes IV chose this highland site for his camp and named it \u201cMy Joy\u201d. Dessie grew into the trade and learning center of Wollo.',
  },
  {
    year: '2004',
    title: 'A university begins to open',
    text: 'As part of Ethiopia\u2019s plan to bring higher education closer to people, Wollo University started with the Faculty of Education and welcomed its first 750 students.',
  },
  {
    year: '2005',
    title: 'Born as a second-generation university',
    text: 'Wollo University was officially established in Dessie, one of the second generation of public universities built across the country.',
  },
  {
    year: 'Later',
    title: 'Technology comes to Kombolcha',
    text: 'Engineering and informatics moved into the Kombolcha Institute of Technology, close to the industrial heart of the region.',
  },
  {
    year: 'Later',
    title: 'A home for health sciences',
    text: 'The Tertiary Care Campus brought medicine, nursing, pharmacy and public health together to train the region\u2019s health workers.',
  },
  {
    year: 'Today',
    title: 'An applied science university',
    text: 'More than 20,000 students learn on three campuses, with research and community service that serve Wollo and beyond.',
  },
];

const CAMPUSES = [
  {
    name: 'Dessie Campus',
    tag: 'Main Campus',
    img: 'https://wustaff.edu.et/build/assets/banner-DupV4RIu.png',
    text: 'Home to eight colleges and schools: Agriculture, Business and Economics, Natural Sciences, Social Sciences and Humanities, Teachers\u2019 Education and Behavioral Sciences, Arts, Law, and Veterinary Medicine.',
  },
  {
    name: 'Kombolcha Institute of Technology',
    tag: 'KIoT',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQU0C610iOLKA26Y-iGorzpSnjoB6oH7wh_ps1n_YJcHfdGbuFbxLg_Q4&s=10',
    text: 'The College of Informatics and four schools: Electrical and Biomedical Engineering, Textile Engineering and Fashion, Civil, Water Resources Engineering and Architecture, and Mechanical and Chemical Engineering.',
  },
  {
    name: 'Tertiary Care Campus',
    tag: 'TCC',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBiz-DKkkc6eFJ6KJMyHO5y2EgqjejvIzSJNKI7jnMBgjtAql47233AzI&s=10',
    text: 'The College of Medicine and Health Sciences: medicine, nursing and midwifery, medical laboratory, pharmacy, public health and environmental health.',
  },
];

/* Photo gallery. The first item is shown large. */
const GALLERY = [
  { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBiz-DKkkc6eFJ6KJMyHO5y2EgqjejvIzSJNKI7jnMBgjtAql47233AzI&s=10', label: 'Wollo University', caption: 'Our main campus in Dessie' },
  { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_Rx9aNwKwIisWrjRkynAkfleq_nrjXSmjuzOEM1H_cZXFQoPkkdGAT8wE&s=10', label: 'Students', caption: 'Learning together' },
  { src: 'https://wustaff.edu.et/build/assets/banner-DupV4RIu.png', label: 'Laboratories', caption: 'Hands-on, applied learning' },
  { src: 'https://static.wixstatic.com/media/118341_b124faf4e2b8400a8ebfca993a20ad44~mv2.jpg/v1/fill/w_1000,h_666,al_c,q_85,usm_0.66_1.00_0.01/118341_b124faf4e2b8400a8ebfca993a20ad44~mv2.jpg', label: 'Graduation', caption: 'Graduates serving the nation' },
  { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg1wT5HEvqmehVU6NP3r4OyRfVyLxgeAgmLXY4WBE_yeE4KjMhsJaTEHzn&s=10', label: 'Dessie highlands', caption: 'At 2,500 m above sea level' },
];

const COLLEGES = [
  'Agriculture',
  'Business & Economics',
  'Natural Sciences',
  'Social Sciences & Humanities',
  'Teachers\u2019 Education & Behavioral Sciences',
  'Arts',
  'Law',
  'Veterinary Medicine',
  'Medicine & Health Sciences',
  'Informatics',
  'Electrical & Biomedical Engineering',
  'Textile Engineering & Fashion',
  'Civil, Water Resources & Architecture',
  'Mechanical & Chemical Engineering',
];

const FACTS = [
  { label: 'Location', value: 'Dessie, South Wollo, Amhara Region' },
  { label: 'Distance', value: '\u2248 400 km from Addis Ababa' },
  { label: 'Elevation', value: '2,470 \u2013 2,550 m above sea level' },
  { label: 'Type', value: 'Public \u00b7 Applied Sciences University' },
];

const HISTORY_PHOTO =
  'https://static.wixstatic.com/media/118341_b124faf4e2b8400a8ebfca993a20ad44~mv2.jpg/v1/fill/w_1000,h_666,al_c,q_85,usm_0.66_1.00_0.01/118341_b124faf4e2b8400a8ebfca993a20ad44~mv2.jpg';

/* ---------- Small helpers ---------- */
const icons = {
  flask: (
    <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9" />
  ),
  campus: <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M12 9v.01" />,
  bulb: (
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  ),
  people: (
    <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 20v-1.5a3.5 3.5 0 0 0-2.5-3.3M15.5 5.2a3 3 0 0 1 0 5.6" />
  ),
};

function Icon({ name }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

/* Shows the photo if it loads; renders nothing (the placeholder behind it shows) if not */
function Photo({ src, className, alt = '', eager = false }) {
  const [failed, setFailed] = useState(false);

  // Retry if the src changes
  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) return null;
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${inView ? styles.revealed : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Counter({ value, suffix = '', start }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setN(value);
      return undefined;
    }
    const duration = 1400;
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value]);

  return (
    <>
      {n.toLocaleString()}
      {suffix}
    </>
  );
}

/* ---------- Component ---------- */
function About() {
  const [statsRef, statsInView] = useInView({ threshold: 0.3 });

  return (
    <section className={styles.about}>
      {/* ===== HERO ===== */}
      <header className={styles.hero}>
        <Photo className={styles.heroImg} src={HERO_IMAGE} eager />
        <div className={styles.heroOverlay} />

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>About Wollo University</p>
            <h1 className={styles.heroTitle}>
              Knowledge for Sustainable Development
            </h1>
            <p className={styles.heroText}>
              A public applied science university in the highlands of Dessie,
              Ethiopia, committed to quality education, research and
              community service that moves the region forward.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.btnPrimary} href="#history">
                Read Our Story
              </a>
              <a className={styles.btnGhost} href="#campuses">
                Explore Our Campuses
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ===== STATS (sits on the hero edge) ===== */}
      <div className={styles.container}>
        <div className={styles.stats} ref={statsRef}>
          {STATS.map((s) => (
            <div className={styles.stat} key={s.label}>
              <div className={styles.statValue}>
                <Counter value={s.value} suffix={s.suffix} start={statsInView} />
              </div>
              <div className={styles.statLabel}>{s.label}</div>
              <p>{s.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== INTRO ===== */}
      <div className={`${styles.container} ${styles.intro}`}>
        <div className={styles.introText}>
          <p className={styles.kicker}>Who we are</p>
          <h2 className={styles.heading}>
            A fast-growing university with a clear vision
          </h2>
          <p>
            Wollo University is located in Dessie, in the Amhara Region of
            South Wollo, Ethiopia. Established in 2005 as one of the
            second-generation universities of the country, it began with the
            Faculty of Education and has grown into a multi-campus institution
            serving thousands of learners.
          </p>
          <p>
            Driven by a vision to provide quality education and contribute to
            the industrial and social development of Ethiopia, the university
            strives to become a leading institution in the country and in East
            Africa.
          </p>
          <ul className={styles.factList}>
            {FACTS.map((f) => (
              <li key={f.label}>
                <span>{f.label}</span>
                <strong>{f.value}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.introVisual}>
          <div className={styles.visualFrame}>
            <div className={styles.visualPlaceholder}>
              <span>WU</span>
            </div>
            <Photo
              className={styles.visualImg}
              src={CAMPUS_IMAGE}
              alt="Wollo University campus"
            />
          </div>
          <div className={styles.floatBadge}>
            <strong>Since 2005</strong>
            <span>Serving Wollo &amp; beyond</span>
          </div>
        </div>
      </div>

      {/* ===== HISTORY ===== */}
      <div className={styles.historyWrap} id="history">
        <div className={`${styles.container} ${styles.history}`}>
          <div className={styles.historyIntro}>
            <p className={styles.kicker}>Our history</p>
            <h2 className={styles.heading}>From a single faculty to three campuses</h2>
            <p className={styles.historyLead}>
              Wollo University grew step by step. Here is the short version
              of how a faculty of education became one of Ethiopia&rsquo;s
              applied science universities.
            </p>
            <div className={styles.historyPhoto}>
              <div className={styles.photoFallback}>
                <span>Dessie</span>
              </div>
              <Photo
                className={styles.photoFill}
                src={HISTORY_PHOTO}
                alt="The city of Dessie and the Wollo highlands"
              />
            </div>
          </div>

          <ol className={styles.timeline}>
            {HISTORY.map((h, i) => (
              <li key={h.title}>
                <Reveal delay={i * 40}>
                  <div className={styles.step}>
                    <span className={styles.stepYear}>{h.year}</span>
                    <h3>{h.title}</h3>
                    <p>{h.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ===== PILLARS ===== */}
      <div className={styles.pillarsWrap}>
        <div className={styles.container}>
          <p className={styles.kicker}>Reasons to pursue</p>
          <h2 className={styles.heading}>Why choose Wollo University</h2>

          <div className={styles.pillars}>
            {PILLARS.map((p) => (
              <article className={styles.pillar} key={p.title}>
                <Icon name={p.icon} />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CAMPUSES ===== */}
      <div className={styles.campusesWrap} id="campuses">
        <div className={styles.container}>
          <p className={`${styles.kicker} ${styles.kickerLight}`}>Our campuses</p>
          <h2 className={`${styles.heading} ${styles.headingLight}`}>
            Three campuses, one university
          </h2>

          <div className={styles.campuses}>
            {CAMPUSES.map((c) => (
              <article className={styles.campus} key={c.name}>
                <div className={styles.campusPhoto}>
                  <div className={styles.photoFallback}>
                    <span>{c.tag}</span>
                  </div>
                  <Photo className={styles.photoFill} src={c.img} alt={c.name} />
                </div>
                <div className={styles.campusBody}>
                  <span className={styles.campusTag}>{c.tag}</span>
                  <h3>{c.name}</h3>
                  <p>{c.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ===== GALLERY ===== */}
      <div className={styles.container}>
        <div className={styles.galleryHead}>
          <p className={styles.kicker}>Life at Wollo</p>
          <h2 className={styles.heading}>A look around our university</h2>
        </div>
        <div className={styles.gallery}>
          {GALLERY.map((g) => (
            <figure className={styles.shot} key={g.label}>
              <div className={styles.photoFallback}>
                <span>{g.label}</span>
              </div>
              {/* alt is empty because the figcaption already describes the photo */}
              <Photo className={styles.photoFill} src={g.src} alt="" />
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* ===== VISION / MISSION ===== */}
      <div className={`${styles.container} ${styles.vm}`}>
        <div className={styles.vmCard}>
          <span className={styles.vmLabel}>Our vision</span>
          <p>
            To be a leading university in Ethiopia and in East Africa,
            recognized for outstanding quality education, research,
            technology transfer and community development services.
          </p>
        </div>
        <div className={styles.vmCard}>
          <span className={styles.vmLabel}>Our mission</span>
          <p>
            To provide quality education and conduct problem-solving
            research that contributes to the industrial and social
            development of Ethiopia.
          </p>
        </div>
        <div className={`${styles.vmCard} ${styles.vmAccent}`}>
          <span className={styles.vmLabel}>Our motto</span>
          <p className={styles.motto}>&ldquo;Knowledge for Sustainable Development&rdquo;</p>
        </div>
      </div>

      {/* ===== COLLEGES ===== */}
      <div className={styles.container}>
        <div className={styles.colleges}>
          <div>
            <p className={styles.kicker}>Academics</p>
            <h2 className={styles.heading}>Colleges, institutes &amp; schools</h2>
          </div>
          <ul className={styles.chips}>
            {COLLEGES.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div className={styles.container}>
        <div className={styles.cta}>
          <div>
            <h2>Ready to be part of Wollo University?</h2>
            <p>Learn about admissions, programs and campus life at our official website.</p>
          </div>
          <a
            className={styles.btnLight}
            href="https://www.kikiai.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit KIKI AI
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;