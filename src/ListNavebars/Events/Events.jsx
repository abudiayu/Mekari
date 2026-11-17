import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Events.module.css";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import ScienceIcon from "@mui/icons-material/Science";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import CampaignIcon from "@mui/icons-material/Campaign";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

/* ----------------------------- IMAGES ----------------------------- */
const U = "https://images.unsplash.com/";
const IMAGES = {
  hero: `${U}photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80`,
  featured: `${U}photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80`,
  activities: [
    "photo-1517486808906-6ca8b3f04846",
    "photo-1511578314322-379afb476865",
    "photo-1523240795612-9a054b0db644",
    "photo-1529070538774-1843cb3265df",
    "photo-1522202176988-66273c2fd55f",
    "photo-1531482615713-2afd69097998",
  ].map((id) => `${U}${id}?auto=format&fit=crop&w=500&q=80`),
  events: [
    "photo-1519452575417-564c1401ecc0",
    "photo-1524178232363-1fb2b075b655",
    "photo-1434030216411-0b793f4b4173",
    "photo-1498243691581-b145c3f54a5a",
    "photo-1427504494785-3a9ca7044f45",
    "photo-1541339907198-e08756dedf3f",
  ].map((id) => `${U}${id}?auto=format&fit=crop&w=600&q=80`),
};

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#1a5fa8"/><stop offset="1" stop-color="#12305a"/></linearGradient></defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <text x="50%" y="50%" fill="white" font-family="Arial" font-size="42"
    text-anchor="middle" dominant-baseline="middle">Wollo University</text></svg>`);

function Img({ src, alt = "", ...rest }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = FALLBACK_IMG;
      }}
      {...rest}
    />
  );
}

/* ------------------------------ DATA ------------------------------ */
const CATEGORIES = [
  { key: "all", label: "All Events" },
  { key: "academic", label: "Academic" },
  { key: "student", label: "Student Life" },
  { key: "sports", label: "Sports & Culture" },
  { key: "ceremony", label: "Ceremonies" },
];

const CATEGORY_ICON = {
  academic: SchoolIcon,
  student: GroupsIcon,
  sports: SportsSoccerIcon,
  ceremony: WorkspacePremiumIcon,
};

const HIGHLIGHTS = [
  { icon: SchoolIcon, label: "Academic Events" },
  { icon: GroupsIcon, label: "Student Life" },
  { icon: SportsSoccerIcon, label: "Sports & Culture" },
  { icon: WorkspacePremiumIcon, label: "Ceremonies" },
  { icon: ScienceIcon, label: "Research Days" },
];

const EVENTS = [
  { id: 1, category: "academic", title: "Semester Registration Deadline", date: "2026-12-05", time: "All day", place: "Registrar Office, Dessie Campus", text: "Complete your semester registration before the deadline to avoid late fees.", image: IMAGES.events[0], to: "/studentLife" },
  { id: 2, category: "academic", title: "First Day of Classes", date: "2027-01-12", time: "8:00 AM", place: "All Colleges", text: "A new semester begins. Check your schedule and e-learning access beforehand.", image: IMAGES.events[1], to: "/e-learning" },
  { id: 3, category: "academic", title: "Faculty Workshop on AI in Education", date: "2027-02-18", time: "10:00 AM", place: "Main Conference Hall", text: "Practical sessions for lecturers on using AI tools in teaching and research.", image: IMAGES.events[2], to: "/departments" },
  { id: 4, category: "student", title: "Student Innovation Expo", date: "2027-03-14", time: "9:00 AM", place: "KIoT Campus", text: "Students present projects across engineering, health, science and social sciences.", image: IMAGES.events[3], to: "/campus-life" },
  { id: 5, category: "sports", title: "Inter-College Sports Day", date: "2027-04-14", time: "8:30 AM", place: "University Stadium", text: "Football, athletics and traditional games between all colleges.", image: IMAGES.events[4], to: "/campus-life" },
  { id: 6, category: "ceremony", title: "Graduation Rehearsal", date: "2027-06-20", time: "2:00 PM", place: "Graduation Square", text: "Final rehearsal for the graduating class ahead of commencement.", image: IMAGES.events[5], to: "/alumni" },
];

const ANNOUNCEMENTS = [
  { id: 1, date: "2026-12-05", title: "Registration Closes", sub: "Final day for all students", to: "/studentLife" },
  { id: 2, date: "2027-01-12", title: "Classes Resume", sub: "Orientation for new students", to: "/e-learning" },
  { id: 3, date: "2027-02-18", title: "AI in Education Workshop", sub: "Open to all faculty", to: "/departments" },
];

const ACTIVITIES = [
  { id: 1, label: "Sports", icon: SportsSoccerIcon, image: IMAGES.activities[0] },
  { id: 2, label: "Culture & Arts", icon: TheaterComedyIcon, image: IMAGES.activities[1] },
  { id: 3, label: "Clubs", icon: GroupsIcon, image: IMAGES.activities[2] },
  { id: 4, label: "Community Service", icon: CampaignIcon, image: IMAGES.activities[3] },
  { id: 5, label: "Science & Research", icon: ScienceIcon, image: IMAGES.activities[4] },
  { id: 6, label: "Graduation", icon: WorkspacePremiumIcon, image: IMAGES.activities[5] },
];

const STATS = [
  { id: 1, value: 40, suffix: "+", label: "Events Every Year", icon: EventAvailableIcon },
  { id: 2, value: 12, suffix: "+", label: "Student Clubs", icon: GroupsIcon },
  { id: 3, value: 5, suffix: "", label: "Colleges Taking Part", icon: SchoolIcon },
  { id: 4, value: 10000, suffix: "+", label: "Yearly Attendees", icon: WorkspacePremiumIcon },
];

const PER_PAGE = 3;

/* ----------------------------- HELPERS ---------------------------- */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parts(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return { d, month: MONTHS[d.getMonth()], day: d.getDate(), weekday: DAYS[d.getDay()], year: d.getFullYear() };
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((parts(dateStr).d.getTime() - today.getTime()) / 86400000);
}

/* ------------------------- ANIMATED COUNTER ----------------------- */
function Counter({ value, suffix = "" }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf;
    const run = () => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / 1400, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (typeof IntersectionObserver === "undefined") {
      setN(value);
      return;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        run();
        obs.disconnect();
      }
    });
    obs.observe(node);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------------------------- COMPONENT --------------------------- */
function Events() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const sorted = useMemo(
    () => [...EVENTS].sort((a, b) => parts(a.date).d - parts(b.date).d),
    []
  );

  const upcoming = sorted.filter((e) => daysUntil(e.date) >= 0);
  const featured = upcoming[0] || sorted[sorted.length - 1];
  const fp = parts(featured.date);
  const featuredDays = Math.max(0, daysUntil(featured.date));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((e) => {
      const okCat = category === "all" || e.category === category;
      const okQ =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.place.toLowerCase().includes(q) ||
        e.text.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [sorted, category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);

  const changeCategory = (key) => {
    setCategory(key);
    setPage(0);
  };

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <main className={styles.page}>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <Img src={IMAGES.hero} alt="Wollo University events" className={styles.heroImg} />

        <div className={`${styles.container} ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <span className={styles.kicker}>Wollo University Events</span>
            <h1>
              Gather. Learn.
              <br />
              <em>Celebrate.</em>
            </h1>
            <p>
              From academic workshops to sports days and graduation, see what is
              happening across every campus and never miss a moment.
            </p>

            <div className={styles.heroBtns}>
              <a href="#upcoming" className={styles.btnPrimary}>Browse Events</a>
              <Link to="/gallary" className={styles.btnOutline}>View Gallery</Link>
            </div>

            <ul className={styles.highlights}>
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className={styles.nextCard}>
            <header>
              <NotificationsActiveIcon fontSize="small" />
              <div>
                <h3>Next Up</h3>
                <small>Your next campus event</small>
              </div>
            </header>
            <div className={styles.nextBody}>
              <div className={styles.dateBadge}>
                <small>{fp.month}</small>
                <strong>{fp.day}</strong>
              </div>
              <h4>{featured.title}</h4>
              <p><AccessTimeIcon /> {fp.weekday}, {featured.time}</p>
              <p><LocationOnIcon /> {featured.place}</p>
              <div className={styles.nextCount}>
                <strong>{featuredDays}</strong>
                <span>{featuredDays === 1 ? "day to go" : "days to go"}</span>
              </div>
              <Link to={featured.to} className={styles.btnPrimaryBlock}>View details</Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ============ FEATURED + DETAILS ============ */}
      <section className={styles.container}>
        <div className={styles.welcome}>
          <Img src={IMAGES.featured} alt={featured.title} className={styles.welcomeImg} />

          <div className={styles.welcomeText}>
            <span className={styles.eyebrow}>Featured event</span>
            <h2>{featured.title}</h2>
            <p>{featured.text}</p>
            <Link to={featured.to} className={styles.btnOutline}>
              Learn more <NorthEastIcon style={{ fontSize: 15 }} />
            </Link>
          </div>

          <div className={styles.factsCard}>
            <div className={styles.fact}>
              <CalendarMonthIcon />
              <div>
                <strong>{fp.month} {fp.day}, {fp.year}</strong>
                <span>{fp.weekday}</span>
              </div>
            </div>
            <div className={styles.fact}>
              <AccessTimeIcon />
              <div>
                <strong>{featured.time}</strong>
                <span>Start time</span>
              </div>
            </div>
            <div className={styles.fact}>
              <LocationOnIcon />
              <div>
                <strong>{featured.place}</strong>
                <span>Venue</span>
              </div>
            </div>
            <div className={styles.fact}>
              <EventAvailableIcon />
              <div>
                <strong>{featuredDays} {featuredDays === 1 ? "day" : "days"}</strong>
                <span>Until the event</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ UPCOMING EVENTS ============ */}
      <section id="upcoming" className={`${styles.container} ${styles.upcoming}`}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Mark your calendar</span>
          <h2>Upcoming Events</h2>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.tabs} role="tablist">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={category === c.key}
                className={`${styles.tab} ${category === c.key ? styles.tabActive : ""}`}
                onClick={() => changeCategory(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <label className={styles.search}>
            <SearchIcon fontSize="small" />
            <input
              type="search"
              placeholder="Search events..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
            />
          </label>
        </div>

        {visible.length === 0 ? (
          <p className={styles.empty}>No events match your search. Try another category or keyword.</p>
        ) : (
          <div className={styles.cardGrid}>
            {visible.map((e) => {
              const p = parts(e.date);
              const Icon = CATEGORY_ICON[e.category] || EventAvailableIcon;
              const left = daysUntil(e.date);
              return (
                <article key={e.id} className={styles.card}>
                  <div className={styles.cardImg}>
                    <Img src={e.image} alt={e.title} />
                    <span className={styles.cardBadge}><Icon style={{ fontSize: 20 }} /></span>
                    {left >= 0 && left <= 30 && (
                      <span className={styles.soon}>{left === 0 ? "Today" : `In ${left} days`}</span>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardDate}>{p.weekday}, {p.month} {p.day}, {p.year}</div>
                    <h3>{e.title}</h3>
                    <p className={styles.cardText}>{e.text}</p>
                    <ul>
                      <li><AccessTimeIcon /> {e.time}</li>
                      <li><LocationOnIcon /> {e.place}</li>
                    </ul>
                    <Link to={e.to} className={styles.readMore}>
                      Read more <NorthEastIcon style={{ fontSize: 13 }} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className={styles.pager}>
          <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={safePage === 0}>
            <ChevronLeftIcon fontSize="small" /> Previous
          </button>
          <span>Page {safePage + 1} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
          >
            Next <ChevronRightIcon fontSize="small" />
          </button>
        </div>
      </section>

      {/* ============ STATS BAND ============ */}
      <section className={styles.band}>
        <div className={`${styles.container} ${styles.bandGrid}`}>
          {STATS.map(({ id, value, suffix, label, icon: Icon }) => (
            <div key={id} className={styles.bandItem}>
              <Icon />
              <div>
                <strong><Counter value={value} suffix={suffix} /></strong>
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ ACTIVITIES ============ */}
      <section className={`${styles.container} ${styles.activities}`}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Beyond the classroom</span>
          <h2>Life at Wollo University</h2>
        </div>

        <div className={styles.activityGrid}>
          {ACTIVITIES.map(({ id, label, icon: Icon, image }) => (
            <Link key={id} to="/campus-life" className={styles.activity}>
              <div className={styles.activityImg}>
                <Img src={image} alt={label} />
                <span className={styles.activityIcon}><Icon style={{ fontSize: 18 }} /></span>
              </div>
              <strong>{label}</strong>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ ANNOUNCEMENTS + REMINDERS + CTA ============ */}
      <section className={`${styles.container} ${styles.bottom}`}>
        <div className={styles.panel}>
          <h3><MailIcon /> Event Reminders</h3>
          <p>Get upcoming events and important dates straight to your inbox.</p>
          {subscribed ? (
            <div className={styles.thanks}>Thank you! You are on the list.</div>
          ) : (
            <form onSubmit={onSubscribe} className={styles.form}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className={styles.btnPrimaryBlock}>Subscribe</button>
            </form>
          )}
        </div>

        <div className={styles.panel}>
          <h3><CampaignIcon /> Latest Announcements</h3>
          <ul className={styles.annList}>
            {ANNOUNCEMENTS.map((a) => {
              const p = parts(a.date);
              return (
                <li key={a.id}>
                  <div className={styles.annDate}>
                    <small>{p.month}</small>
                    <strong>{p.day}</strong>
                  </div>
                  <div>
                    <h4>{a.title}</h4>
                    <p>{a.sub}</p>
                    <Link to={a.to}>Know more</Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.cta}>
          <h3>Host or Join an Event</h3>
          <p>
            Want to organize a workshop, club activity or competition? Reach out
            and be part of campus life.
          </p>
          <Link to="/auth" className={styles.ctaBtn}>
            <EventAvailableIcon fontSize="small" /> Get Started
          </Link>
          <CalendarMonthIcon className={styles.ctaWatermark} />
        </div>
      </section>
    </main>
  );
}

export default Events;