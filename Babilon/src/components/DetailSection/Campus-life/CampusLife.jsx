import React, { useEffect, useRef, useState } from "react";
import styles from "./CampusLife.module.css";

/* Images from src/assets/BlogImages
   (adjust the "../../" if your CampusLife folder is at a different depth) */
import kiotImg from "../../../assets/BlogImages/wollo-library.png";
import libraryImg from "../../../assets/BlogImages/wollo-library.png";
import titaImg from "../../../assets/BlogImages/wollo-tita.png";

/* ------------------------------------------------------------------ */
/*  Content – edit freely. Stats and news are sample data.             */
/*  Change which image each slot uses in the IMAGES object below.      */
/* ------------------------------------------------------------------ */
const IMAGES = {
  hero: kiotImg,
  news1: libraryImg,
  news2: titaImg,
  news3: kiotImg,
  event1: libraryImg,
  event2: titaImg,
  event3: kiotImg,
};

const CAMPUSES = ["Main Campus, Dessie", "KIoT, Kombolcha", "Health Sciences", "Social Science"];

const REASONS = [
  {
    n: "01",
    title: "Heritage of Excellence",
    text: "Wollo University has grown into a trusted centre of learning for the Amhara region and beyond, with programs across many faculties.",
    icon: "award",
  },
  {
    n: "02",
    title: "Family of Experts",
    text: "Learn from instructors and researchers who combine classroom teaching with real field and community experience.",
    icon: "users",
  },
  {
    n: "03",
    title: "Impactful Learning",
    text: "Labs, libraries, projects and internships turn lectures into skills you can use from your very first job.",
    icon: "bulb",
  },
  {
    n: "04",
    title: "Vibrant Student Life",
    text: "Clubs, sports, culture and events keep campus lively, so every student finds a place to belong.",
    icon: "spark",
  },
];

const STATS = [
  { to: 5, suffix: "+", title: "Campuses", text: "Learning spaces across Dessie and Kombolcha." },
  { to: 40, suffix: "+", title: "Programs", text: "Undergraduate and postgraduate study paths." },
  { to: 25, suffix: "+", title: "Student Clubs", text: "Tech, culture, sport, service and more." },
  { to: 90, suffix: "%", title: "Library Access", text: "Digital and printed resources for every department." },
];

const NEWS = [
  {
    date: "12 Nov 2026",
    title: "New digital library resources now open to all departments",
    text: "Thousands of PDF notes, slides and textbooks are searchable in the E-Library.",
    image: IMAGES.news1,
  },
  {
    date: "03 Nov 2026",
    title: "Students celebrate together at the annual campus gathering",
    text: "Faculties came together for a day of culture, music and community.",
    image: IMAGES.news2,
  },
  {
    date: "28 Oct 2026",
    title: "Students showcase innovation projects at the KIoT tech fair",
    text: "Teams from Informatics and Engineering presented working prototypes to staff and visitors.",
    image: IMAGES.news3,
  },
];

const EVENTS = [
  { image: IMAGES.event1, label: "Library Week" },
  { image: IMAGES.event2, label: "Cultural Day" },
  { image: IMAGES.event3, label: "Tech Fair" },
];

const LIFE = [
  { icon: "book", title: "Libraries", text: "Fresh, Engineering and Informatics libraries with quiet study spaces." },
  { icon: "ball", title: "Sports", text: "Pitches, courts and tracks for training and friendly competition." },
  { icon: "users", title: "Clubs", text: "Join a club, lead a team and build friendships that last." },
  { icon: "home", title: "Dormitories", text: "Safe, affordable student housing close to your classes." },
  { icon: "cup", title: "Cafeteria", text: "Fresh meals and a social place to meet between lectures." },
  { icon: "chip", title: "Innovation Labs", text: "Computer, electronics and maker labs for hands-on projects." },
];

/* ------------------------------ icons ------------------------------ */
const ICONS = {
  award: <><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><circle cx="17.5" cy="9" r="2.5" /><path d="M17 14.5a5 5 0 0 1 4.5 5" /></>,
  bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.7.6 1 1.3 1 2.1h5c0-.8.3-1.5 1-2.1A6 6 0 0 0 12 3z" /></>,
  spark: <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
  ball: <><circle cx="12" cy="12" r="9" /><path d="m12 7 4 3-1.5 5h-5L8 10z" /></>,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  cup: <><path d="M5 8h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z" /><path d="M17 9h2a2 2 0 0 1 0 4h-2" /><path d="M8 3v2M12 3v2" /></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
  left: <path d="m15 18-6-6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
  pin: <><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-8 8" /></>,
};

const Icon = ({ name, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

/* ----------------------------- helpers ----------------------------- */

/* Photo with designed fallback if an image fails to load */
function Photo({ src, alt, className = "", label }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div className={`${styles.photoFallback} ${className}`} role="img" aria-label={alt}>
        <Icon name="image" size={34} />
        <span>{label || alt}</span>
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

/* fade-up when scrolled into view */
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

/* number that counts up once visible */
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

/* decorative flowing lines */
function WaveLines({ className = "" }) {
  return (
    <svg className={`${styles.waves} ${className}`} viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => (
        <path
          key={i}
          d={`M0 ${90 + i * 7} C 260 ${10 + i * 9}, 520 ${260 - i * 8}, 1000 ${70 + i * 6}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.25 + i * 0.03}
        />
      ))}
    </svg>
  );
}

/* ----------------------------- component --------------------------- */
function CampusLife() {
  const trackRef = useRef(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "", agree: false });
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  /* auto-advance news */
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setSlide((s) => (s + 1) % NEWS.length), 5500);
    return () => clearInterval(id);
  }, [paused]);

  const scrollReasons = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(340, el.clientWidth), behavior: "smooth" });
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.agree || status === "sending") return;
    setStatus("sending");
    /* TODO: send to your backend / Supabase here */
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", message: "", agree: false });
    }, 900);
  };

  const current = NEWS[slide];

  return (
    <div className={styles.page}>
      {/* =============================== HERO =============================== */}
      <header className={styles.hero}>
        <Photo src={IMAGES.hero} alt="Wollo University campus" className={styles.heroImg} label="Wollo University Campus" />
        <div className={styles.heroShade} />
        <div className={styles.heroCorner} aria-hidden="true" />

        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Wollo University</span>
          <h1 className={styles.heroTitle}>Campus Life</h1>
          <p className={styles.heroText}>
            Learn, live and grow in a welcoming community. Discover our campuses, student clubs, libraries and events.
          </p>
          <div className={styles.heroChips}>
            {CAMPUSES.map((c) => (
              <span key={c} className={styles.chip}>
                <Icon name="pin" size={14} /> {c}
              </span>
            ))}
          </div>
          <div className={styles.heroActions}>
            <a href="/studentLife" className={styles.btnPrimary}>Explore student life</a>
            <a href="#events" className={styles.btnGlass}>See events</a>
          </div>
        </div>

        <svg className={styles.heroWave} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 70 C 240 130, 480 0, 760 40 S 1240 120, 1440 30 V120 H0z" fill="#f4f8ff" />
        </svg>
      </header>

      {/* ============================= REASONS ============================== */}
      <section className={styles.reasons}>
        <Reveal className={styles.head}>
          <span className={styles.kicker}>Reasons to choose</span>
          <h2 className={styles.title}>WOLLO UNIVERSITY</h2>
        </Reveal>

        <div className={styles.carousel}>
          <button type="button" className={styles.arrow} onClick={() => scrollReasons(-1)} aria-label="Previous reasons">
            <Icon name="left" />
          </button>

          <div className={styles.track} ref={trackRef}>
            {REASONS.map((r, i) => (
              <Reveal key={r.n} delay={i * 90} as="article" className={styles.reason}>
                <span className={styles.reasonNum}>{r.n}</span>
                <span className={styles.reasonIcon}><Icon name={r.icon} size={30} /></span>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </Reveal>
            ))}
          </div>

          <button type="button" className={styles.arrow} onClick={() => scrollReasons(1)} aria-label="Next reasons">
            <Icon name="right" />
          </button>
        </div>
      </section>

      {/* ============================== STATS =============================== */}
      <section className={styles.stats}>
        <WaveLines className={styles.statsWaves} />
        <div className={styles.statsInner}>
          <div className={styles.statGrid}>
            {STATS.map((s, i) => (
              <Reveal key={s.title} delay={i * 110} className={styles.statCard}>
                <strong className={styles.statNum}><CountUp to={s.to} suffix={s.suffix} /></strong>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className={styles.statSide}>
            <span className={styles.kicker}>Thrive to maintain</span>
            <h2 className={styles.titleOrange}>BEST RESULTS</h2>
            <p>
              Wollo University gives every student the tools, teachers and community to succeed, in class and far beyond it.
            </p>
            <a href="#contact" className={styles.btnOrange}>Get in touch <Icon name="arrow" size={18} /></a>
          </Reveal>
        </div>
      </section>

      {/* ============================== NEWS ================================ */}
      <section className={styles.news}>
        <Reveal className={styles.head}>
          <span className={styles.kicker}>Catch up with</span>
          <h2 className={styles.title}>OUR LATEST NEWS</h2>
        </Reveal>

        <div className={styles.newsGrid} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className={styles.newsMain}>
            <Photo key={slide} src={current.image} alt={current.title} className={styles.newsImg} label="News photo" />
            <div className={styles.newsCard} key={`c-${slide}`}>
              <span className={styles.newsDate}>{current.date}</span>
              <h3>{current.title}</h3>
              <p>{current.text}</p>
              <a href="#news" className={styles.btnOrangeSm}>Read more</a>
            </div>
          </div>

          <ul className={styles.newsList}>
            {NEWS.map((n, i) => (
              <li key={n.title}>
                <button type="button" className={`${styles.newsItem} ${i === slide ? styles.newsItemActive : ""}`} onClick={() => setSlide(i)}>
                  <span className={styles.newsDate}>{n.date}</span>
                  <span className={styles.newsItemTitle}>{n.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.dots} role="tablist" aria-label="News slides">
          {NEWS.map((n, i) => (
            <button key={n.title} type="button" role="tab" aria-selected={i === slide} aria-label={`Slide ${i + 1}`} className={`${styles.dot} ${i === slide ? styles.dotActive : ""}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </section>

      {/* ============================== EVENTS ============================== */}
      <section className={styles.events} id="events">
        <div className={styles.eventsInner}>
          <Reveal className={styles.eventsText}>
            <span className={styles.kicker}>Never miss joining</span>
            <h2 className={styles.title}>OUR EXCITING EVENTS</h2>
            <p>Cultural days, tech fairs, sports weeks and graduation. See what is coming up and be part of the story.</p>
            <a href="#contact" className={styles.btnPrimary}>View upcoming events</a>
          </Reveal>

          <div className={styles.collage}>
            {EVENTS.map((e, i) => (
              <Reveal key={e.label} delay={i * 120} className={`${styles.collageItem} ${styles[`collage${i + 1}`]}`}>
                <Photo src={e.image} alt={e.label} className={styles.collageImg} label={e.label} />
                <span className={styles.collageTag}>{e.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ STUDENT LIFE ========================== */}
      <section className={styles.life} id="life">
        <Reveal className={styles.head}>
          <span className={styles.kicker}>Beyond the classroom</span>
          <h2 className={styles.title}>STUDENT LIFE</h2>
        </Reveal>

        <div className={styles.lifeGrid}>
          {LIFE.map((l, i) => (
            <Reveal key={l.title} delay={(i % 3) * 90} as="article" className={styles.lifeCard}>
              <span className={styles.lifeIcon}><Icon name={l.icon} size={26} /></span>
              <h3>{l.title}</h3>
              <p>{l.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================== CONTACT ============================= */}
      <section className={styles.contact} id="contact">
        <div className={styles.contactInner}>
          <Reveal className={styles.contactInfo}>
            <h2>CONTACT US</h2>
            <p>Questions about campus life, clubs or events? Send us a message and we will get back to you.</p>
            <ul>
              <li><Icon name="pin" size={20} /> Wollo University, Dessie, Amhara, Ethiopia</li>
              <li><Icon name="mail" size={20} /> info@wollo.edu.et</li>
              <li><Icon name="phone" size={20} /> +251 000 000 000</li>
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <form className={styles.form} onSubmit={onSubmit}>
              <label>
                <span>Name</span>
                <input name="name" type="text" value={form.name} onChange={onChange} required placeholder="Your full name" />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" value={form.email} onChange={onChange} required placeholder="you@example.com" />
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" rows="4" value={form.message} onChange={onChange} required placeholder="How can we help?" />
              </label>
              <label className={styles.check}>
                <input name="agree" type="checkbox" checked={form.agree} onChange={onChange} />
                <span>I agree to be contacted about my enquiry.</span>
              </label>

              <button type="submit" className={styles.submit} disabled={!form.agree || status === "sending"}>
                {status === "sending" ? "Sending..." : "Submit"}
              </button>
              {status === "sent" && <p className={styles.sent} role="status">Thank you! Your message has been sent.</p>}
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default CampusLife;