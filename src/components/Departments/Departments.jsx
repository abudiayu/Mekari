import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Departmnets.module.css";

/* Images from src/assets/BlogImages
   (adjust the "../../" if your Departments folder is at a different depth) */
import kiotImg from "../../assets/BlogImages/kiot.png";
import libraryImg from "../../assets/BlogImages/wollo-library.png";
import titaImg from "../../assets/BlogImages/wollo-tita.png";

const IMG = { kiot: kiotImg, library: libraryImg, tita: titaImg };

/* ------------------------------------------------------------------ */
/*  Data – same faculties/departments as your E-Library.               */
/*  Years, courses and descriptions are SAMPLE values: edit freely.    */
/*  Per-department photos: import more images above and change `img`.  */
/* ------------------------------------------------------------------ */
const FACULTY_STYLE = {
  Informatics: { accent: "#2563eb", bg: "#dbeafe" },
  Engineering: { accent: "#ea580c", bg: "#fff3e8" },
  "Medicine & Health Sciences": { accent: "#be123c", bg: "#ffe9ee" },
  "Social Science": { accent: "#7c3aed", bg: "#ede9fe" },
  Agriculture: { accent: "#16a34a", bg: "#dcfce7" },
};
const FACULTIES = Object.keys(FACULTY_STYLE);

const d = (name, faculty, icon, years, courses, blurb, img, pos) => ({
  name,
  faculty,
  icon,
  years,
  courses,
  blurb,
  img: IMG[img],
  pos,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
});

const DEPARTMENTS = [
  d("Computer Science", "Informatics", "code", 4, 42, "Algorithms, programming, AI and the theory behind modern software.", "kiot", "15% 50%"),
  d("Information Technology", "Informatics", "network", 4, 38, "Networks, systems and the infrastructure that keeps organizations online.", "kiot", "60% 40%"),
  d("Information Systems", "Informatics", "database", 4, 36, "Data, analysis and systems that help organizations make decisions.", "library", "30% 55%"),
  d("Software Engineering", "Informatics", "layers", 4, 40, "Design, build, test and ship reliable software in real teams.", "kiot", "85% 55%"),
  d("Civil Engineering", "Engineering", "building", 5, 48, "Roads, bridges, buildings and water systems that shape communities.", "kiot", "85% 40%"),
  d("Electrical Engineering", "Engineering", "bolt", 5, 46, "Circuits, power and electronics for a connected, powered world.", "tita", "20% 55%"),
  d("Mechanical Engineering", "Engineering", "gear", 5, 47, "Machines, energy and manufacturing from concept to production.", "kiot", "40% 60%"),
  d("Medicine", "Medicine & Health Sciences", "heart", 6, 60, "Clinical training and medical science to care for patients and communities.", "tita", "50% 50%"),
  d("Anesthesia", "Medicine & Health Sciences", "drop", 4, 34, "Safe pain control and patient care before, during and after surgery.", "tita", "70% 40%"),
  d("Nursing", "Medicine & Health Sciences", "cross", 4, 38, "Hands-on patient care, health promotion and compassionate practice.", "library", "70% 45%"),
  d("Pharmacy", "Medicine & Health Sciences", "pill", 5, 44, "Medicines, safe use and pharmaceutical care for better health.", "tita", "30% 55%"),
  d("Law", "Social Science", "scale", 4, 40, "Legal reasoning, justice and institutions that protect rights.", "library", "50% 30%"),
  d("Economics", "Social Science", "chart", 3, 32, "Markets, policy and development explained with data and theory.", "library", "20% 60%"),
  d("Plant Science", "Agriculture", "leaf", 4, 36, "Crop production, soils and sustainable methods for food security.", "tita", "15% 60%"),
  d("Animal Science", "Agriculture", "paw", 4, 34, "Livestock nutrition, breeding and animal health for modern farms.", "tita", "80% 50%"),
];

const STEPS = [
  { icon: "grid", title: "Choose Your Faculty", text: "Pick one of five faculties, from Informatics to Agriculture, to narrow your search." },
  { icon: "search", title: "Find Your Department", text: "Search by name or browse cards to compare years, courses and focus areas." },
  { icon: "book", title: "Explore Resources", text: "Open the department page, then visit the E-Library for slides, notes and books." },
];

const POPULAR_VISIBLE = 12;

/* ------------------------------ icons ------------------------------ */
const ICONS = {
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  network: <><circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="19" r="2.5" /><circle cx="19" cy="19" r="2.5" /><path d="M12 7.5v4M12 11.5 6 17M12 11.5l6 5.5" /></>,
  database: <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></>,
  building: <><path d="M4 21V8l8-5 8 5v13" /><path d="M2 21h20M9 21v-6h6v6M9 11h.01M15 11h.01" /></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  heart: <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  cross: <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />,
  pill: <><rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)" /><path d="m8.5 8.5 7 7" /></>,
  scale: <><path d="M12 3v18M5 21h14M5 7h14" /><path d="m5 7-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  leaf: <><path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15" /><path d="M5 19c3-5 6-8 10-10" /></>,
  paw: <><circle cx="6" cy="10" r="2" /><circle cx="10" cy="6" r="2" /><circle cx="15" cy="6" r="2" /><circle cx="19" cy="10" r="2" /><path d="M12 12c-3 0-6 3-6 6 0 2 2 2 4 1.5 1.3-.4 2.7-.4 4 0 2 .5 4 .5 4-1.5 0-3-3-6-6-6z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  pin: <><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  send: <path d="m22 2-11 11M22 2l-7 20-4-9-9-4z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
  cap: <><path d="m2 9 10-5 10 5-10 5z" /><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-8 8" /></>,
  empty: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M8.5 8.5l5 5M13.5 8.5l-5 5" /></>,
};

const Icon = ({ name, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

/* ----------------------------- helpers ----------------------------- */
function Photo({ src, alt, className = "", pos = "50% 50%", label }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div className={`${styles.photoFallback} ${className}`} role="img" aria-label={alt}>
        <Icon name="image" size={30} />
        <span>{label || alt}</span>
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} loading="lazy" style={{ objectPosition: pos }} onError={() => setFailed(true)} />;
}

function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const [ref, shown] = useReveal();
  return (
    <Tag ref={ref} className={`${styles.reveal} ${shown ? styles.in : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

function CountUp({ to, suffix = "" }) {
  const [ref, shown] = useReveal();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!shown) return undefined;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(to);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const dur = 1200;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

const accentVars = (faculty) => ({
  "--accent": FACULTY_STYLE[faculty].accent,
  "--accent-bg": FACULTY_STYLE[faculty].bg,
});

/* ----------------------------- component --------------------------- */
function Departments() {
  const exploreRef = useRef(null);
  const [faculty, setFaculty] = useState("All");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const scrollToExplore = () => {
    if (exploreRef.current) exploreRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEPARTMENTS.filter((x) => {
      if (faculty !== "All" && x.faculty !== faculty) return false;
      if (!q) return true;
      return [x.name, x.faculty, x.blurb].join(" ").toLowerCase().includes(q);
    });
  }, [faculty, query]);

  const counts = useMemo(() => {
    const m = { All: DEPARTMENTS.length };
    FACULTIES.forEach((f) => (m[f] = DEPARTMENTS.filter((x) => x.faculty === f).length));
    return m;
  }, []);

  const popular = showAll ? DEPARTMENTS : DEPARTMENTS.slice(0, POPULAR_VISIBLE);

  const onSearch = (e) => {
    e.preventDefault();
    scrollToExplore();
  };

  const pickPopular = (name) => {
    setFaculty("All");
    setQuery(name);
    scrollToExplore();
  };

  const onSubscribe = (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    /* TODO: save to your backend / Supabase here */
    setTimeout(() => {
      setStatus("sent");
      setEmail("");
    }, 900);
  };

  return (
    <div className={styles.page}>
      {/* =============================== HERO =============================== */}
      <header className={styles.hero}>
        <Photo src={kiotImg} alt="Wollo University campus" className={styles.heroImg} pos="50% 45%" label="Wollo University" />
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}><Icon name="cap" size={15} /> WOLLO UNIVERSITY</span>
          <h1 className={styles.heroTitle}>Discover Your <span>Department</span></h1>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.heroText}>Explore faculties and departments, compare programs and find the place where your future starts.</p>

          <form className={styles.search} onSubmit={onSearch} role="search">
            <label className={styles.searchSelect}>
              <Icon name="pin" size={18} />
              <select value={faculty} onChange={(e) => setFaculty(e.target.value)} aria-label="Choose faculty">
                <option value="All">All faculties</option>
                {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </label>
            <span className={styles.searchDivider} aria-hidden="true" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a department, e.g. Nursing" aria-label="Search departments" />
            <button type="submit" aria-label="Search"><Icon name="search" size={20} /></button>
          </form>

          <ul className={styles.heroStats}>
            <li><strong><CountUp to={DEPARTMENTS.length} /></strong><span>Departments</span></li>
            <li><strong><CountUp to={FACULTIES.length} /></strong><span>Faculties</span></li>
            <li><strong><CountUp to={3} /></strong><span>Campus Libraries</span></li>
          </ul>
        </div>
      </header>

      {/* ============================== POPULAR ============================= */}
      <section className={styles.popular}>
        <Reveal className={styles.head}>
          <h2>Most Popular Departments</h2>
          <span className={styles.rule} aria-hidden="true" />
        </Reveal>

        <div className={styles.popGrid}>
          {popular.map((x, i) => (
            <Reveal key={x.name} delay={(i % 4) * 70} as="div" className={styles.popWrap}>
              <button type="button" className={styles.popItem} style={accentVars(x.faculty)} onClick={() => pickPopular(x.name)}>
                <span className={styles.popIcon}><Icon name={x.icon} size={18} /></span>
                <span className={styles.popName}>{x.name}</span>
                <em>({x.courses})</em>
              </button>
            </Reveal>
          ))}
        </div>

        {DEPARTMENTS.length > POPULAR_VISIBLE && (
          <div className={styles.center}>
            <button type="button" className={styles.btnGreen} onClick={() => setShowAll((s) => !s)}>
              {showAll ? "Show fewer" : "Browse All Departments"}
            </button>
          </div>
        )}
      </section>

      {/* ============================== EXPLORE ============================= */}
      <section className={styles.explore} ref={exploreRef} id="explore">
        <Reveal className={styles.head}>
          <h2>Explore by Faculty</h2>
          <span className={styles.rule} aria-hidden="true" />
          <p>Filter by faculty, then open a department to see its programs, years and courses.</p>
        </Reveal>

        <div className={styles.filters} role="tablist" aria-label="Filter by faculty">
          {["All", ...FACULTIES].map((f) => (
            <button key={f} type="button" role="tab" aria-selected={faculty === f} className={`${styles.chip} ${faculty === f ? styles.chipActive : ""}`} onClick={() => setFaculty(f)}>
              {f === "All" ? "ALL" : f.toUpperCase()} <em>{counts[f]}</em>
            </button>
          ))}
        </div>

        {query && (
          <div className={styles.queryBar}>
            Showing results for <strong>“{query}”</strong>
            <button type="button" onClick={() => setQuery("")}>Clear</button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <Icon name="empty" size={44} />
            <h3>No departments found</h3>
            <p>Try another faculty or a different keyword.</p>
          </div>
        ) : (
          <div className={styles.cards}>
            {filtered.map((x, i) => (
              <Reveal key={x.name} delay={(i % 4) * 80} as="article" className={styles.card}>
                <div className={styles.cardStyle} style={accentVars(x.faculty)}>
                  <div className={styles.cardPhoto}>
                    <Photo src={x.img} alt="" className={styles.cover} pos={x.pos} label={x.name} />
                    <span className={styles.facTag}>{x.faculty}</span>
                  </div>
                  <span className={styles.pinBadge}><Icon name={x.icon} size={22} /></span>
                  <div className={styles.cardBody}>
                    <h3>{x.name}</h3>
                    <span className={styles.accentRule} aria-hidden="true" />
                    <p>{x.blurb}</p>
                    <ul className={styles.meta}>
                      <li><Icon name="clock" size={15} /> {x.years} years</li>
                      <li><Icon name="folder" size={15} /> {x.courses} courses</li>
                    </ul>
                    <Link to={`/departments/${x.slug}`} className={styles.viewLink}>
                      View department <Icon name="arrow" size={15} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ============================ SUBSCRIBE BANNER ====================== */}
      <section className={styles.bannerWrap}>
        <div className={styles.banner}>
          <Photo src={libraryImg} alt="Wollo University library" className={styles.bannerImg} pos="50% 50%" label="Library" />
          <div className={styles.bannerShade} />
          <Reveal className={styles.bannerInner}>
            <h2>Be Part of Our Family and Get Everything in Your Inbox</h2>
            <form className={styles.subscribe} onSubmit={onSubscribe}>
              <Icon name="mail" size={20} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" required aria-label="Email address" />
              <button type="submit" disabled={status === "sending"} aria-label="Subscribe"><Icon name="send" size={20} /></button>
            </form>
            {status === "sent" && <p className={styles.sent} role="status">Thank you! You are subscribed.</p>}
          </Reveal>
        </div>
      </section>

      {/* ============================ HOW IT WORKS ========================== */}
      <section className={styles.how}>
        <Reveal className={styles.head}>
          <h2>How It Works</h2>
          <span className={styles.rule} aria-hidden="true" />
        </Reveal>

        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 110} as="article" className={styles.step}>
              <span className={styles.stepNum}>{i + 1}</span>
              <span className={styles.stepIcon}><Icon name={s.icon} size={34} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Departments;