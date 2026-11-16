import React, { useEffect, useRef, useState } from "react";
import styles from "./Almuni.module.css";

/* Images from src/assets/BlogImages
   (adjust the "../../" if your Almuni folder is at a different depth) */
import kiotImg from "../../../assets/BlogImages/kiot.png";
import libraryImg from "../../../assets/BlogImages/wollo-library.png";
import titaImg from "../../../assets/BlogImages/wollo-tita.png";

/* ------------------------------------------------------------------ */
/*  Content – edit freely. Names, quotes and numbers are SAMPLE data.  */
/* ------------------------------------------------------------------ */
const ABOUT_FEATURES = [
  { icon: "network", title: "Alumni Services", text: "Transcripts, certificates, career support and a lifelong connection to your university." },
  { icon: "handshake", title: "Mentorship Hub", text: "Graduates guide current students with advice, internships and real job leads." },
];

const STATS = [
  { icon: "cap", to: 20, suffix: "K+", label: "Proud Graduates" },
  { icon: "users", to: 500, suffix: "+", label: "Active Mentors" },
  { icon: "briefcase", to: 150, suffix: "+", label: "Partner Employers" },
  { icon: "award", to: 30, suffix: "+", label: "Alumni Awards" },
];

const FACULTIES = ["All", "Informatics", "Engineering", "Medicine & Health", "Social Science", "Agriculture"];

const FACULTY_ICON = {
  Informatics: "chip",
  Engineering: "gear",
  "Medicine & Health": "heart",
  "Social Science": "scale",
  Agriculture: "leaf",
};

const TESTIMONIALS = [
  { name: "Selamawit A.", role: "Software Engineer", text: "The labs and the library at Wollo gave me real skills. I landed my first job before graduation thanks to the alumni mentors." },
  { name: "Dawit M.", role: "Civil Engineer", text: "Group projects and friendly instructors taught me teamwork. Today I lead site teams and still call my classmates for advice." },
  { name: "Hana B.", role: "Public Health Officer", text: "My years here shaped how I serve my community. The alumni network opened doors I never expected." },
  { name: "Yonas T.", role: "Agricultural Expert", text: "Hands-on learning prepared me for the field. I now help farmers grow more, and I mentor students every year." },
];

const ALUMNI = [
  { name: "Selamawit Alemu", role: "Software Engineer", faculty: "Informatics", year: "Class of 2019", img: kiotImg, pos: "15% 50%" },
  { name: "Dawit Mekonnen", role: "Civil Engineer", faculty: "Engineering", year: "Class of 2017", img: kiotImg, pos: "85% 40%" },
  { name: "Hana Bekele", role: "Public Health Officer", faculty: "Medicine & Health", year: "Class of 2020", img: titaImg, pos: "50% 50%" },
  { name: "Yonas Tesfaye", role: "Agronomist", faculty: "Agriculture", year: "Class of 2018", img: titaImg, pos: "15% 60%" },
  { name: "Meron Kassa", role: "Legal Advisor", faculty: "Social Science", year: "Class of 2016", img: libraryImg, pos: "50% 30%" },
  { name: "Abel Getachew", role: "Data Analyst", faculty: "Informatics", year: "Class of 2021", img: libraryImg, pos: "20% 60%" },
  { name: "Tigist Worku", role: "Nurse Lead", faculty: "Medicine & Health", year: "Class of 2015", img: titaImg, pos: "80% 50%" },
  { name: "Samuel Desta", role: "Electrical Engineer", faculty: "Engineering", year: "Class of 2022", img: kiotImg, pos: "30% 55%" },
];

const EMPLOYERS = [
  { icon: "chip", label: "Tech Companies" },
  { icon: "heart", label: "Hospitals & Clinics" },
  { icon: "cap", label: "Universities" },
  { icon: "globe", label: "NGOs" },
  { icon: "building", label: "Government" },
  { icon: "rocket", label: "Startups" },
];

/* ------------------------------ icons ------------------------------ */
const ICONS = {
  network: <><circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="19" r="2.5" /><circle cx="19" cy="19" r="2.5" /><path d="M12 7.5v4M12 11.5 6 17M12 11.5l6 5.5" /></>,
  handshake: <><path d="m3 12 4-4 4 2 4-2 6 6-4 4-3-1-3 3-3-3-4 1z" /><path d="m11 10 3 3" /></>,
  cap: <><path d="m2 9 10-5 10 5-10 5z" /><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><circle cx="17.5" cy="9" r="2.5" /><path d="M17 14.5a5 5 0 0 1 4.5 5" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  award: <><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8" /></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  heart: <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />,
  scale: <><path d="M12 3v18M5 21h14M5 7h14" /><path d="m5 7-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z" /></>,
  leaf: <><path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15" /><path d="M5 19c3-5 6-8 10-10" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  building: <><path d="M4 21V8l8-5 8 5v13" /><path d="M2 21h20M9 21v-6h6v6M9 11h.01M15 11h.01" /></>,
  rocket: <><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" /><path d="M12 15 9 12c0-5 4-9 11-9 0 7-4 11-9 11z" /><circle cx="15" cy="9" r="1.5" /></>,
  quote: <path d="M7 7h4v5a4 4 0 0 1-4 4M15 7h4v5a4 4 0 0 1-4 4" />,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-8 8" /></>,
  left: <path d="m15 18-6-6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
};

const Icon = ({ name, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

const Star = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
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
      { threshold: 0.15 }
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
    const dur = 1400;
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

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/* ----------------------------- component --------------------------- */
function Almuni() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState("All");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  /* rotate highlighted testimonial */
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const shownAlumni = filter === "All" ? ALUMNI : ALUMNI.filter((a) => a.faculty === filter);

  const onSubmit = (e) => {
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
      {/* =============================== ABOUT ============================== */}
      <section className={styles.about}>
        <div className={styles.aboutBlob} aria-hidden="true" />
        <div className={styles.aboutInner}>
          {/* collage */}
          <div className={styles.collage}>
            <Reveal className={`${styles.shape} ${styles.shapeA}`}>
              <Photo src={libraryImg} alt="Students studying in the library" className={styles.cover} pos="30% 50%" label="Library" />
            </Reveal>
            <Reveal delay={100} className={`${styles.shape} ${styles.shapeB}`}>
              <Photo src={titaImg} alt="Wollo University graduates" className={styles.cover} pos="50% 40%" label="Graduates" />
            </Reveal>
            <Reveal delay={200} className={`${styles.shape} ${styles.shapeC}`}>
              <Photo src={kiotImg} alt="KIoT campus" className={styles.cover} pos="70% 50%" label="KIoT Campus" />
            </Reveal>
            <Reveal delay={300} className={styles.yearsBadge}>
              <span className={styles.yearsIcon}><Icon name="cap" size={26} /></span>
              <strong>20+ Years</strong>
              <small>of alumni network</small>
            </Reveal>
          </div>

          {/* text */}
          <Reveal delay={120} className={styles.aboutText}>
            <span className={styles.tag}><Icon name="cap" size={14} /> ABOUT OUR ALUMNI</span>
            <h1 className={styles.heading}>
              Our Alumni Network <span>Inspires You More.</span>
            </h1>
            <p className={styles.lead}>
              Every Wollo University graduate is part of a growing family. Reconnect with classmates, find mentors and open new career doors, wherever life takes you.
            </p>

            <div className={styles.featureGrid}>
              {ABOUT_FEATURES.map((f) => (
                <div key={f.title} className={styles.feature}>
                  <span className={styles.featureIcon}><Icon name={f.icon} size={24} /></span>
                  <div>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </div>
              ))}
              <blockquote className={styles.aboutQuote}>
                <p>A university gives you a degree. The alumni network gives you a lifelong community.</p>
                <span className={styles.aboutQuoteMark}>99</span>
              </blockquote>
            </div>

            <div className={styles.aboutActions}>
              <a href="#join" className={styles.btnOrange}>Join the network <Icon name="arrow" size={16} /></a>
              <a href="#directory" className={styles.callBox}>
                <span><Icon name="users" size={20} /></span>
                <div>
                  <small>Browse</small>
                  <strong>Alumni directory</strong>
                </div>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================== STATS =============================== */}
      <section className={styles.stats}>
        <Photo src={kiotImg} alt="Wollo University campus" className={styles.statsImg} pos="50% 40%" label="Campus" />
        <div className={styles.statsShade} />
        <div className={styles.statsInner}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 110} className={styles.stat}>
              <span className={styles.statIcon}><Icon name={s.icon} size={32} /></span>
              <strong><CountUp to={s.to} suffix={s.suffix} /></strong>
              <small>{s.label}</small>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================ TESTIMONIALS ========================== */}
      <section className={styles.testimonials}>
        <Reveal className={styles.head}>
          <span className={styles.tag}><Icon name="quote" size={14} /> TESTIMONIALS</span>
          <h2>What Our Alumni <span>Say</span></h2>
          <p>Honest words from graduates who started right here on campus and now work across Ethiopia and beyond.</p>
        </Reveal>

        <div className={styles.testGrid} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90} as="article" className={`${styles.testCard} ${i === active ? styles.testActive : ""}`}>
              <div className={styles.testTop}>
                <span className={styles.stars}><Star /><Star /><Star /><Star /><Star /></span>
                <span className={styles.testMark}>99</span>
              </div>
              <p>{t.text}</p>
              <div className={styles.person}>
                <span className={styles.avatar}>{initials(t.name)}</span>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className={styles.dots} role="tablist" aria-label="Highlighted testimonial">
          {TESTIMONIALS.map((t, i) => (
            <button key={t.name} type="button" role="tab" aria-selected={i === active} aria-label={`Testimonial ${i + 1}`} className={`${styles.dot} ${i === active ? styles.dotActive : ""}`} onClick={() => setActive(i)} />
          ))}
        </div>
      </section>

      {/* ============================= DIRECTORY ============================ */}
      <section className={styles.directory} id="directory">
        <Reveal className={styles.head}>
          <span className={styles.tag}><Icon name="users" size={14} /> OUR ALUMNI</span>
          <h2>Meet Our <span>Graduates</span></h2>
          <p>Filter by faculty to find people who walked your path.</p>
        </Reveal>

        <div className={styles.filters} role="tablist" aria-label="Filter alumni by faculty">
          {FACULTIES.map((f) => (
            <button key={f} type="button" role="tab" aria-selected={filter === f} className={`${styles.chip} ${filter === f ? styles.chipActive : ""}`} onClick={() => setFilter(f)}>
              {f !== "All" && <Icon name={FACULTY_ICON[f]} size={15} />} {f}
            </button>
          ))}
        </div>

        <div className={styles.alumniGrid}>
          {shownAlumni.map((a, i) => (
            <Reveal key={a.name} delay={(i % 4) * 80} as="article" className={styles.alumCard}>
              <div className={styles.portrait}>
                <Photo src={a.img} alt="" className={styles.cover} pos={a.pos} label={a.faculty} />
                <span className={styles.portraitShade} />
                <span className={styles.initials}>{initials(a.name)}</span>
                <span className={styles.facBadge}><Icon name={FACULTY_ICON[a.faculty]} size={16} /></span>
              </div>
              <div className={styles.alumBody}>
                <div>
                  <h3>{a.name}</h3>
                  <strong>{a.role}</strong>
                  <small>{a.faculty} · {a.year}</small>
                </div>
                <button type="button" className={styles.shareBtn} aria-label={`Share ${a.name}'s profile`}>
                  <Icon name="share" size={16} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================== EMPLOYERS =========================== */}
      <section className={styles.employers}>
        <Reveal className={styles.employersHead}>
          <h3>Where our alumni work</h3>
        </Reveal>
        <div className={styles.employersRow}>
          {EMPLOYERS.map((e, i) => (
            <Reveal key={e.label} delay={i * 70} className={styles.employer}>
              <span><Icon name={e.icon} size={26} /></span>
              {e.label}
            </Reveal>
          ))}
        </div>
      </section>

      {/* =============================== JOIN =============================== */}
      <section className={styles.join} id="join">
        <div className={styles.joinInner}>
          <Reveal className={styles.joinText}>
            <h2>Stay Connected With Wollo</h2>
            <p>Join the alumni network to get event invitations, mentoring chances and news from your university.</p>
            <ul>
              <li><Icon name="mail" size={18} /> Monthly alumni newsletter</li>
              <li><Icon name="handshake" size={18} /> Mentor or find a mentor</li>
              <li><Icon name="phone" size={18} /> Reunion and event updates</li>
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <form className={styles.joinForm} onSubmit={onSubmit}>
              <label htmlFor="alumni-email">Your email address</label>
              <div className={styles.joinRow}>
                <input id="alumni-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Join now"}
                </button>
              </div>
              {status === "sent" && <p className={styles.sent} role="status">Welcome aboard! Check your inbox soon.</p>}
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default Almuni;