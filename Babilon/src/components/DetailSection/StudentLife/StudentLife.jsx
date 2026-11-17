import React, { useEffect, useRef, useState } from "react";
import styles from "./StudentLife.module.css";

/* Images from src/assets/BlogImages
   (adjust the "../../" if your StudentLife folder is at a different depth) */
import kiotImg from "../../../assets/BlogImages/kiot.png";
import libraryImg from "../../../assets/BlogImages/wollo-library.png";
import titaImg from "../../../assets/BlogImages/wollo-tita.png";

/* ------------------------------------------------------------------ */
/*  Content – edit freely. Numbers, names and dates are sample data.   */
/*  Only 3 photos exist, so each slot picks one and a focus point      */
/*  (pos) so the crops look different.                                 */
/* ------------------------------------------------------------------ */
const HERO_FEATURES = [
  { icon: "book", label: "Quality Education" },
  { icon: "users", label: "Expert Instructors" },
  { icon: "globe", label: "Digital E-Library" },
  { icon: "shield", label: "Safe Campus" },
  { icon: "chip", label: "Modern Labs" },
];

const WELCOME_STATS = [
  { icon: "award", to: 15, suffix: "+", label: "Years of Learning" },
  { icon: "users", to: 500, suffix: "+", label: "Dedicated Staff" },
  { icon: "cap", to: 20, suffix: "K+", label: "Happy Students" },
  { icon: "user", to: 25, suffix: ":1", label: "Student–Teacher Ratio" },
  { icon: "ball", to: 25, suffix: "+", label: "Clubs & Activities" },
  { icon: "shield", to: 100, suffix: "%", label: "Safe & Secure Campus" },
];

const FACULTIES = [
  { icon: "chip", title: "Informatics", tag: "Code. Build. Innovate.", text: "Computer Science, IT, Information Systems and Software Engineering.", img: kiotImg, pos: "15% 50%" },
  { icon: "gear", title: "Engineering", tag: "Design. Test. Create.", text: "Civil, Electrical and Mechanical Engineering with hands-on labs.", img: kiotImg, pos: "85% 40%" },
  { icon: "heart", title: "Medicine & Health", tag: "Care. Heal. Lead.", text: "Medicine, Anesthesia, Nursing and Pharmacy for future health workers.", img: titaImg, pos: "50% 50%" },
  { icon: "scale", title: "Social Science", tag: "Think. Debate. Serve.", text: "Law and Economics that prepare students to shape society.", img: libraryImg, pos: "50% 30%" },
  { icon: "leaf", title: "Agriculture", tag: "Grow. Sustain. Feed.", text: "Plant and Animal Science for modern, sustainable farming.", img: titaImg, pos: "15% 60%" },
];

const BAND = [
  { icon: "building", to: 5, suffix: "+", label: "Campuses" },
  { icon: "monitor", to: 50, suffix: "+", label: "Smart Classrooms" },
  { icon: "flask", to: 30, suffix: "+", label: "Science & Computer Labs" },
  { icon: "book", to: 3, suffix: "", label: "Campus Libraries" },
  { icon: "globe", to: 100, suffix: "%", label: "Digital Library Access" },
];

const ACTIVITIES = [
  { icon: "ball", label: "Sports", img: titaImg, pos: "20% 50%" },
  { icon: "music", label: "Music & Culture", img: libraryImg, pos: "70% 40%" },
  { icon: "users", label: "Clubs & Societies", img: kiotImg, pos: "30% 55%" },
  { icon: "book", label: "Reading & Library", img: libraryImg, pos: "30% 60%" },
  { icon: "hands", label: "Community Service", img: titaImg, pos: "80% 50%" },
  { icon: "chip", label: "Innovation & Tech", img: kiotImg, pos: "75% 45%" },
];

const TESTIMONIALS = [
  { name: "Selam A.", role: "Informatics, Year 3", text: "The labs and the E-Library gave me everything I needed. I found slides, notes and past exams in one place, and the tech club pushed me to build real projects." },
  { name: "Dawit M.", role: "Engineering, Year 4", text: "Campus life here is more than lectures. Sports week, club projects and friendly instructors made it feel like a second home." },
  { name: "Hana B.", role: "Health Sciences, Year 2", text: "I felt supported from the first week. Study groups at the library and mentoring from senior students helped me stay confident." },
];

const ANNOUNCEMENTS = [
  { month: "NOV", day: "20", title: "Club Registration Open", sub: "Join a club for the new semester" },
  { month: "NOV", day: "28", title: "Inter-Faculty Sports Week", sub: "Football, volleyball and athletics" },
  { month: "DEC", day: "05", title: "Tech Innovation Fair", sub: "Showcase your project at KIoT" },
];

const INTERESTS = ["Clubs & Societies", "Sports", "Dormitories", "Library & E-Library", "Admissions", "Something else"];

/* ------------------------------ icons ------------------------------ */
const ICONS = {
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><circle cx="17.5" cy="9" r="2.5" /><path d="M17 14.5a5 5 0 0 1 4.5 5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
  award: <><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8" /></>,
  cap: <><path d="m2 9 10-5 10 5-10 5z" /><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" /></>,
  ball: <><circle cx="12" cy="12" r="9" /><path d="m12 7 4 3-1.5 5h-5L8 10z" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  heart: <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />,
  scale: <><path d="M12 3v18M5 21h14M5 7h14" /><path d="m5 7-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z" /></>,
  leaf: <><path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15" /><path d="M5 19c3-5 6-8 10-10" /></>,
  building: <><path d="M4 21V8l8-5 8 5v13" /><path d="M2 21h20M9 21v-6h6v6M9 11h.01M15 11h.01" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  flask: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />,
  music: <><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>,
  hands: <><path d="M12 21s-8-5-8-11a4 4 0 0 1 8-2 4 4 0 0 1 8 2c0 6-8 11-8 11z" /><path d="M8 11h8" /></>,
  megaphone: <><path d="M3 11v3l12 5V6z" /><path d="M15 9a4 4 0 0 1 0 6M6 14l1 5h3l-1-4" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  quote: <path d="M7 7h4v5a4 4 0 0 1-4 4M15 7h4v5a4 4 0 0 1-4 4" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  pin: <><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-8 8" /></>,
};

const Icon = ({ name, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

const Star = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
);

/* ----------------------------- helpers ----------------------------- */
function Photo({ src, alt, className = "", pos = "50% 50%", label }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div className={`${styles.photoFallback} ${className}`} role="img" aria-label={alt}>
        <Icon name="image" size={32} />
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

/* ----------------------------- component --------------------------- */
function StudentLife() {
  const [quote, setQuote] = useState(0);
  const [paused, setPaused] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setQuote((q) => (q + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    /* TODO: send to your backend / Supabase here */
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", interest: "" });
    }, 900);
  };

  const t = TESTIMONIALS[quote];

  return (
    <div className={styles.page}>
      {/* =============================== HERO =============================== */}
      <header className={styles.hero}>
        <div className={styles.heroBlob} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <span className={styles.kicker}>STUDENT LIFE AT WOLLO UNIVERSITY</span>
            <h1 className={styles.heroTitle}>
              Study. Belong.
              <span> Thrive.</span>
            </h1>
            <p>
              Empowering students with knowledge, friendships and skills to shape a brighter future for Wollo and beyond.
            </p>
            <div className={styles.heroActions}>
              <a href="#activities" className={styles.btnPrimary}>Explore activities</a>
              <a href="#tour" className={styles.btnOutline}>Take a campus tour</a>
            </div>

            <ul className={styles.features}>
              {HERO_FEATURES.map((f) => (
                <li key={f.label}>
                  <span><Icon name={f.icon} size={22} /></span>
                  {f.label}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroFrame}>
              <Photo src={kiotImg} alt="Wollo University KIoT campus" className={styles.heroImg} pos="50% 50%" label="Wollo University" />
            </div>
            <div className={`${styles.badge} ${styles.badgeOne}`}>
              <Icon name="users" size={18} /> 25+ clubs
            </div>
            <div className={`${styles.badge} ${styles.badgeTwo}`}>
              <Icon name="book" size={18} /> Open E-Library
            </div>
          </div>

          <aside className={styles.enquiry}>
            <h2>Ask about student life</h2>
            <p>We will get in touch with you!</p>
            <form onSubmit={onSubmit}>
              <input name="name" type="text" placeholder="Your name" value={form.name} onChange={onChange} required aria-label="Your name" />
              <input name="email" type="email" placeholder="Email address" value={form.email} onChange={onChange} required aria-label="Email address" />
              <input name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={onChange} aria-label="Phone number" />
              <select name="interest" value={form.interest} onChange={onChange} required aria-label="What are you interested in">
                <option value="" disabled>I am interested in</option>
                {INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Submit"}</button>
              {status === "sent" && <span className={styles.sent} role="status">Thank you! We will contact you soon.</span>}
            </form>
          </aside>
        </div>
      </header>

      {/* ============================== WELCOME ============================= */}
      <section className={styles.welcome}>
        <div className={styles.welcomeInner}>
          <Reveal className={styles.welcomePhoto}>
            <Photo src={libraryImg} alt="Wollo University library" className={styles.cover} pos="50% 50%" label="Library" />
          </Reveal>

          <Reveal delay={100} className={styles.welcomeText}>
            <span className={styles.kickerOrange}>WELCOME TO WOU</span>
            <h2>A Place Where Every Student Can Shine</h2>
            <p>
              At Wollo University we focus on academic excellence, character building and all-round development, so every graduate is ready to lead in a changing world.
            </p>
            <a href="#faculties" className={styles.btnOutline}>Know more about us</a>
          </Reveal>

          <Reveal delay={180} className={styles.welcomeStats}>
            {WELCOME_STATS.map((s) => (
              <div key={s.label} className={styles.wStat}>
                <span className={styles.wIcon}><Icon name={s.icon} size={24} /></span>
                <strong><CountUp to={s.to} suffix={s.suffix} /></strong>
                <small>{s.label}</small>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============================= FACULTIES ============================ */}
      <section className={styles.faculties} id="faculties">
        <Reveal className={styles.head}>
          <span className={styles.kickerOrange}>OUR ACADEMIC FACULTIES</span>
          <h2>Programs Designed for Every Dream</h2>
        </Reveal>

        <div className={styles.facGrid}>
          {FACULTIES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90} as="article" className={styles.facCard}>
              <div className={styles.facPhoto}>
                <Photo src={f.img} alt={f.title} className={styles.cover} pos={f.pos} label={f.title} />
                <span className={styles.facIcon}><Icon name={f.icon} size={20} /></span>
              </div>
              <div className={styles.facBody}>
                <h3>{f.title}</h3>
                <strong>{f.tag}</strong>
                <p>{f.text}</p>
                <a href="#contact">READ MORE <Icon name="arrow" size={14} /></a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================== BAND ================================ */}
      <section className={styles.band}>
        <div className={styles.bandInner}>
          {BAND.map((b) => (
            <div key={b.label} className={styles.bandItem}>
              <span className={styles.bandIcon}><Icon name={b.icon} size={34} /></span>
              <div>
                <strong><CountUp to={b.to} suffix={b.suffix} /></strong>
                <small>{b.label}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ ACTIVITIES ============================ */}
      <section className={styles.activities} id="activities">
        <Reveal className={styles.head}>
          <span className={styles.kickerOrange}>BEYOND CLASSROOMS</span>
          <h2>Holistic Development Through Activities</h2>
        </Reveal>

        <div className={styles.actGrid}>
          {ACTIVITIES.map((a, i) => (
            <Reveal key={a.label} delay={i * 80} as="article" className={styles.actCard}>
              <Photo src={a.img} alt={a.label} className={styles.cover} pos={a.pos} label={a.label} />
              <span className={styles.actShade} />
              <span className={styles.actIcon}><Icon name={a.icon} size={20} /></span>
              <strong>{a.label}</strong>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================== TRIO ================================ */}
      <section className={styles.trio}>
        <div className={styles.trioInner}>
          {/* testimonials */}
          <Reveal className={styles.panel}>
            <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <h3 className={styles.panelTitle}>WHAT STUDENTS SAY</h3>
              <div className={styles.quote} key={quote}>
                <span className={styles.quoteMark}><Icon name="quote" size={30} /></span>
                <p>{t.text}</p>
              </div>
              <div className={styles.person}>
                <span className={styles.avatar}>{t.name.charAt(0)}</span>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                  <span className={styles.stars}><Star /><Star /><Star /><Star /><Star /></span>
                </div>
              </div>
              <div className={styles.dots} role="tablist" aria-label="Testimonials">
                {TESTIMONIALS.map((x, i) => (
                  <button key={x.name} type="button" role="tab" aria-selected={i === quote} aria-label={`Testimonial ${i + 1}`} className={`${styles.dot} ${i === quote ? styles.dotActive : ""}`} onClick={() => setQuote(i)} />
                ))}
              </div>
            </div>
          </Reveal>

          {/* announcements */}
          <Reveal delay={100} className={styles.panel}>
            <h3 className={styles.panelTitle}>LATEST ANNOUNCEMENTS</h3>
            <ul className={styles.news}>
              {ANNOUNCEMENTS.map((n) => (
                <li key={n.title}>
                  <span className={styles.date}><small>{n.month}</small><strong>{n.day}</strong></span>
                  <div>
                    <strong>{n.title}</strong>
                    <small>{n.sub}</small>
                  </div>
                </li>
              ))}
            </ul>
            <span className={styles.megaphone}><Icon name="megaphone" size={44} /></span>
          </Reveal>

          {/* tour CTA */}
          <Reveal delay={200} className={styles.tour}>
            <div id="tour">
              <h3>Schedule a Campus Tour</h3>
              <p>Visit our campuses and experience student life at Wollo University in person.</p>
              <a href="#contact" className={styles.btnWhite}>
                <Icon name="calendar" size={18} /> Book your tour
              </a>
            </div>
            <span className={styles.tourArt} aria-hidden="true"><Icon name="building" size={150} /></span>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default StudentLife;