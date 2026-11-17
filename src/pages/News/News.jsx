import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./News.module.css";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupsIcon from "@mui/icons-material/Groups";
import DiversityIcon from "@mui/icons-material/Diversity3";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ApartmentIcon from "@mui/icons-material/Apartment";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

/* ------------------------------------------------------------------ */
/*  IMAGES: paste your real Wollo University, student and event photo  */
/*  URLs here (wu.edu.et -> right click image -> Copy image address).  */
/* ------------------------------------------------------------------ */
const IMAGES = {
  campusBanner:
    "https://i.ytimg.com/vi/AHDrh_ZX20Q/maxresdefault.jpg",
  featureResearch:
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",
  featureSemester:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
  featureMessage:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
  news: [
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
  ],
  events: [
    "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=200&q=80",
  ],
  commencement:
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80",
  studentSpotlight:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
  campusSpotlight:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
};

/* Shown if any image URL fails to load */
const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#e12d46'/><stop offset='1' stop-color='#7a1020'/>
      </linearGradient></defs>
      <rect width='800' height='600' fill='url(#g)'/>
      <text x='50%' y='50%' fill='white' font-family='Arial' font-size='42'
        text-anchor='middle' dominant-baseline='middle'>Wollo University</text>
    </svg>`
  );

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
const FEATURES = [
  {
    id: 1,
    image: IMAGES.featureResearch,
    title: "Explore Our Colleges & Departments",
    text: "Discover programs, research opportunities, and faculty-led projects across Wollo University.",
    cta: "View Departments",
    to: "/departments",
  },
  {
    id: 2,
    image: IMAGES.featureSemester,
    title: "New Semester Begins Soon",
    text: "Get ready! Access e-learning materials, update your info, and find orientation resources.",
    cta: "Go to E-Learning",
    to: "/e-learning",
  },
];

const NEWS = [
  {
    id: 1,
    image: IMAGES.news[0],
    title: "Registration Renewal Open",
    text: "Students must complete their semester registration before the deadline to avoid late fees. Visit the registrar for details.",
    to: "/studentLife",
  },
  {
    id: 2,
    image: IMAGES.news[1],
    title: "Research Grant Applications Now Open",
    text: "Faculty and research staff are invited to apply for this year's Research and Innovation Grant program.",
    to: "/departments",
  },
  {
    id: 3,
    image: IMAGES.news[2],
    title: "E-Library Resources Expanded",
    text: "New digital journals, books, and learning materials are now available to students and staff in the library.",
    to: "/library",
  },
  {
    id: 4,
    image: IMAGES.news[3],
    title: "New Student Services Updates",
    text: "The university has finalized updates to student support and counseling services for the new semester.",
    to: "/studentLife",
  },
];

const RESOURCES = [
  { id: 1, label: "University Statistics", icon: AccountBalanceIcon, to: "/staticsdetail" },
  { id: 2, label: "Library", icon: MenuBookIcon, to: "/library" },
  { id: 3, label: "E-Learning", icon: LaptopMacIcon, to: "/e-learning" },
  { id: 4, label: "Departments", icon: ApartmentIcon, to: "/departments" },
  { id: 5, label: "Campus Life", icon: SchoolIcon, to: "/campus-life" },
  { id: 6, label: "Student Life", icon: GroupsIcon, to: "/studentLife" },
  { id: 7, label: "Alumni", icon: DiversityIcon, to: "/alumni" },
  { id: 8, label: "Gallery", icon: PhotoLibraryIcon, to: "/gallary" },
];

const EVENTS = [
  { id: 1, image: IMAGES.events[0], month: "Dec", day: 5, title: "Semester Registration Deadline", meta: "Fri, Dec 5, All day" },
  { id: 2, image: IMAGES.events[1], month: "Jan", day: 12, title: "First Day of Classes", meta: "Mon, Jan 12, All day" },
  { id: 3, image: IMAGES.events[2], month: "Feb", day: 18, title: "Faculty Workshop on AI in Education", meta: "Wed, Feb 18, 10:00 AM" },
  { id: 4, image: IMAGES.events[3], month: "Apr", day: 14, title: "Staff Wellness Day", meta: "Tue, Apr 14, 8:00 AM" },
  { id: 5, image: IMAGES.events[4], month: "May", day: 9, title: "Student Innovation Expo", meta: "Sat, May 9, 9:00 AM" },
  { id: 6, image: IMAGES.events[5], month: "Jun", day: 20, title: "Graduation Rehearsal", meta: "Sat, Jun 20, 2:00 PM" },
];

const QUICK_LINKS = [
  { id: 1, title: "Course Portal (LMS)", sub: "Access learning materials", icon: LaptopMacIcon, to: "/e-learning" },
  { id: 2, title: "Student Services", sub: "Advising, support, activities", icon: SchoolIcon, to: "/studentLife" },
  { id: 3, title: "Library Resources", sub: "Books, journals, research", icon: DescriptionIcon, to: "/library" },
  { id: 4, title: "Alumni", sub: "Stay connected, give back", icon: DiversityIcon, to: "/alumni" },
  { id: 5, title: "Department Sites", sub: "Browse by college or unit", icon: ApartmentIcon, to: "/departments" },
  { id: 6, title: "Photo Gallery", sub: "Moments from our campus", icon: PhotoLibraryIcon, to: "/gallary" },
];

/* Change this to your real commencement date */
const COMMENCEMENT_DATE = new Date("2027-06-27T09:00:00");
const EVENTS_PER_PAGE = 4;

/* ------------------------- Reveal-on-scroll ------------------------ */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealed : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ----------------------------- Component --------------------------- */
function News() {
  const [eventPage, setEventPage] = useState(0);

  const daysLeft = useMemo(() => {
    const diff = COMMENCEMENT_DATE.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  const totalPages = Math.ceil(EVENTS.length / EVENTS_PER_PAGE);
  const visibleEvents = EVENTS.slice(
    eventPage * EVENTS_PER_PAGE,
    eventPage * EVENTS_PER_PAGE + EVENTS_PER_PAGE
  );

  return (
    <main className={styles.page}>
      {/* ================= HERO ================= */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <Reveal>
            <h1 className={styles.heroTitle}>
              Welcome to the Wollo University News &amp; Updates Hub
            </h1>
            <p className={styles.heroSub}>
              Your central hub for campus updates, academic resources, and
              student tools.
            </p>
          </Reveal>
        </div>

        <div className={styles.banner}>
          <Img
            src={IMAGES.campusBanner}
            alt="Wollo University campus"
            className={styles.bannerImg}
          />
          <div className={styles.bannerOverlay} />
          <div className={styles.container}>
            <aside className={styles.alertCard}>
              <span className={styles.alertIcon}>
                <NotificationsActiveIcon fontSize="inherit" />
              </span>
              <h3>Campus Alert:</h3>
              <p>
                Routine safety drills are scheduled for next week. Please review
                the evacuation procedures posted in your building.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* ================= FEATURE CARDS ================= */}
        <section className={styles.featureGrid}>
          {FEATURES.map((item, i) => (
            <Reveal key={item.id} delay={i * 120}>
              <article className={styles.featureCard}>
                <Img src={item.image} alt={item.title} />
                <div className={styles.featureBody}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link to={item.to} className={styles.featureLink}>
                    {item.cta} <NorthEastIcon style={{ fontSize: 14 }} />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal delay={240}>
            <article className={`${styles.featureCard} ${styles.messageCard}`}>
              <Img src={IMAGES.featureMessage} alt="Message from the president" />
              <div className={styles.messageBody}>
                <span className={styles.messageKicker}>
                  Message from the University President
                </span>
                <h3>Welcome Message</h3>
                <p>
                  We're excited to share the university's academic and
                  operational priorities for the upcoming semester.
                </p>
                <Link to="/staticsdetail" className={styles.pillBtn}>
                  Read the full message
                </Link>
              </div>
            </article>
          </Reveal>
        </section>

        {/* ================= NEWS / RESOURCES / EVENTS ================= */}
        <section className={styles.threeCol}>
          {/* ---- News ---- */}
          <Reveal>
            <h2 className={styles.sectionTitle}>University News</h2>
            <ul className={styles.newsList}>
              {NEWS.map((n) => (
                <li key={n.id} className={styles.newsItem}>
                  <Link to={n.to} className={styles.newsLink}>
                    <Img src={n.image} alt={n.title} />
                    <div>
                      <h4>{n.title}</h4>
                      <p>{n.text}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* ---- Resources ---- */}
          <Reveal delay={120}>
            <h2 className={styles.sectionTitle}>University Resources</h2>
            <div className={styles.resourceGrid}>
              {RESOURCES.map(({ id, label, icon: Icon, to }) => (
                <Link key={id} to={to} className={styles.resourceTile}>
                  <Icon className={styles.resourceIcon} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </Reveal>

          {/* ---- Events ---- */}
          <Reveal delay={240}>
            <div className={styles.eventsHead}>
              <h2 className={styles.sectionTitle}>Events</h2>
              <Link to="/campus-life" className={styles.seeAll}>
                See all
              </Link>
            </div>

            <ul className={styles.eventList}>
              {visibleEvents.map((e) => (
                <li key={e.id} className={styles.eventItem}>
                  <div className={styles.eventThumb}>
                    <Img src={e.image} alt={e.title} />
                    <div className={styles.eventDate}>
                      <small>{e.month}</small>
                      <strong>{e.day}</strong>
                    </div>
                  </div>
                  <div>
                    <h4>{e.title}</h4>
                    <p>{e.meta}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.pager}>
              <button
                type="button"
                onClick={() => setEventPage((p) => Math.max(0, p - 1))}
                disabled={eventPage === 0}
              >
                <ChevronLeftIcon fontSize="small" /> Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setEventPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={eventPage === totalPages - 1}
              >
                Next <ChevronRightIcon fontSize="small" />
              </button>
            </div>
          </Reveal>
        </section>
      </div>

      {/* ================= QUICK LINKS ================= */}
      <section className={styles.quickSection}>
        <div className={styles.container}>
          <Reveal>
            <h2 className={styles.sectionTitle}>Quick Links</h2>
          </Reveal>

          <div className={styles.quickLayout}>
            <div className={styles.quickGrid}>
              {QUICK_LINKS.map(({ id, title, sub, icon: Icon, to }, i) => (
                <Reveal key={id} delay={i * 70}>
                  <Link to={to} className={styles.quickCard}>
                    <span className={styles.quickIcon}>
                      <Icon fontSize="small" />
                    </span>
                    <h4>{title}</h4>
                    <p>{sub}</p>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal delay={150}>
              <div
                className={styles.countdown}
                style={{ backgroundImage: `url(${IMAGES.commencement})` }}
              >
                <div className={styles.countdownOverlay} />
                <div className={styles.countdownContent}>
                  <h3>Commencement in</h3>
                  <strong>{daysLeft}</strong>
                  <span>days</span>
                  <p>Find out more details</p>
                  <Link to="/alumni" className={styles.smallBtn}>
                    Learn more
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ---------- Spotlights + Quote ---------- */}
          <div className={styles.spotlightRow}>
            <Reveal>
              <Link to="/studentLife" className={styles.spotlightLink}>
                <article className={styles.spotlight}>
                  <header>Student Spotlight</header>
                  <div className={styles.spotlightImg}>
                    <Img src={IMAGES.studentSpotlight} alt="Student spotlight" />
                  </div>
                  <div className={styles.spotlightCaption}>
                    <h3>Student Name</h3>
                    <span>(Class of 2026)</span>
                    <p>
                      Led the university innovation team to first place in a
                      national student competition.
                    </p>
                  </div>
                </article>
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <Link to="/campus-life" className={styles.spotlightLink}>
                <article className={styles.spotlight}>
                  <header>Campus Life</header>
                  <div className={styles.spotlightImg}>
                    <Img src={IMAGES.campusSpotlight} alt="Campus life" />
                  </div>
                  <div className={styles.spotlightCaption}>
                    <h3>Life at Wollo University</h3>
                    <span>(Campus Highlights)</span>
                    <p>
                      From clubs to community events, see what makes our campus
                      vibrant every day.
                    </p>
                  </div>
                </article>
              </Link>
            </Reveal>

            <Reveal delay={240}>
              <aside className={styles.quote}>
                <FormatQuoteIcon className={styles.quoteIcon} />
                <h3>Quote of the Day</h3>
                <p>
                  “Education is not the learning of facts, but the training of
                  the mind to think.”
                </p>
                <hr />
                <cite>Albert Einstein</cite>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}

export default News;