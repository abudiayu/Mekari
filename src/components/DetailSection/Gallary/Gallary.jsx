import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";
import styles from "./Gallary.module.css";

const EASE = [0.22, 1, 0.36, 1];
const COLS = 12;
const ROWS = 8;

/* ------------------------------------------------------------------ */
/*  PHOTOS                                                             */
/*  Swap these URLs for your own Wollo University photos, for example  */
/*  "/wollo/kiot-hackathon.jpg" placed in your public folder.          */
/* ------------------------------------------------------------------ */
const PHOTOS = {
  campus:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYUjLur3giz1YGd3IMRTu2Xg6ZNG_ld0cnsm9WbaAGRpgc-krpd9UY7cE&s=10",
  orientation:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbFQhnUBIWj6GsR46QH180xB0uUp5eCTY8SfYv5YIWPCDKJU-T7CpiYq0&s=10",
  outreach:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUXsK2rEoL1tJzwTYS5_GsCil_FALIql1WBLYZW_Ll9A1mbybIuO-BVz2s&s=10",
  culture:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq3awI82jw-hMfFVb8MYSVy2oMOz9ZskSyodSmCKkdVYtpKlboTQczq7A&s=10",
  cisco:
    "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=800",
  hackathon:
    "https://api.appfactoryacademy.edu.et/uploads/announcements/announcement_1789915560756-121302802.jpg",
  sports:
    "https://images.pexels.com/photos/7691249/pexels-photo-7691249.jpeg?auto=compress&cs=tinysrgb&w=800",
  techTalk:
    "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=800",
  workshop:
    "https://images.pexels.com/photos/5428003/pexels-photo-5428003.jpeg?auto=compress&cs=tinysrgb&w=800",
};

const FLOATING_SQUARES = [
  [6, 20, 12],
  [12, 32, 8],
  [8, 44, 6],
  [88, 18, 10],
  [92, 30, 14],
  [85, 42, 7],
  [90, 52, 5],
  [14, 56, 5],
];

/* ---------- Feature cards (top 2-column grid) ---------- */
const CASES = [
  {
    id: "student-dashboard",
    title: "Student Dashboard",
    category: "Library, Opportunities & Union News",
    year: "Phase 6",
    image: PHOTOS.campus,
    squares: [
      [5, 30, 16],
      [10, 42, 10],
      [3, 52, 7],
      [80, 70, 14],
      [85, 82, 9],
      [78, 60, 6],
    ],
  },
  {
    id: "department-head",
    title: "Department Head Page",
    category: "Courses, Graduates & Requirements",
    year: "Phase 3",
    image: PHOTOS.orientation,
    squares: [
      [82, 55, 16],
      [88, 68, 10],
      [78, 72, 7],
      [85, 42, 6],
      [90, 80, 8],
    ],
  },
  {
    id: "unions",
    title: "Union & Club Pages",
    category: "News, Events & Opportunities",
    year: "Phase 4",
    image: PHOTOS.outreach,
    squares: [
      [4, 24, 16],
      [10, 36, 10],
      [2, 44, 7],
      [78, 78, 14],
      [84, 88, 8],
    ],
  },
  {
    id: "admin-panel",
    title: "Admin Panel",
    category: "Users, Departments & Heads",
    year: "Phase 1",
    image: PHOTOS.culture,
    squares: [
      [82, 26, 14],
      [88, 38, 10],
      [78, 44, 7],
      [84, 54, 5],
      [90, 60, 8],
    ],
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbot",
    category: "Step-by-Step Guides in Amharic & English",
    year: "Phase 7",
    image: PHOTOS.cisco,
    squares: [
      [4, 24, 16],
      [10, 36, 10],
      [2, 44, 7],
      [78, 78, 14],
      [84, 88, 8],
    ],
  },
  {
    id: "secure-access",
    title: "Secure Access",
    category: "Login Gate, Roles & Row Level Security",
    year: "Phase 2",
    image: PHOTOS.hackathon,
    squares: [
      [82, 26, 14],
      [88, 38, 10],
      [78, 44, 7],
      [84, 54, 5],
      [90, 60, 8],
    ],
  },
];

/* ---------- Wollo University quick facts ---------- */
const FACTS = [
  {
    icon: "building",
    title: "Dessie Main Campus",
    text: "Natural sciences, agriculture, business, social science, law and veterinary medicine.",
  },
  {
    icon: "chip",
    title: "KIoT, Kombolcha",
    text: "Engineering and informatics, home to AppFactory and the Cisco Academy.",
  },
  {
    icon: "cross",
    title: "Tita Campus",
    text: "College of Medicine and Health Sciences at the Tertiary Care Campus.",
  },
  {
    icon: "calendar",
    title: "Founded 2005",
    text: "A public applied sciences university in Dessie, Amhara, Ethiopia.",
  },
  {
    icon: "book",
    title: "Our motto",
    text: "Knowledge for Sustainable Development.",
  },
];

/* ---------- Campus filters ---------- */
const CAMPUS_TABS = [
  { id: "all", label: "All campuses" },
  { id: "dessie", label: "Dessie" },
  { id: "kiot", label: "KIoT" },
  { id: "tita", label: "Tita" },
];

const CAMPUS_NAME = {
  dessie: "Dessie Main Campus",
  kiot: "Kombolcha Institute of Technology (KIoT)",
  tita: "Tita Campus",
};

const CAMPUS_SHORT = { dessie: "Dessie", kiot: "KIoT", tita: "Tita" };

/* ------------------------------------------------------------------ */
/*  EVENTS                                                             */
/*  These are starter entries by event type. Replace the titles,       */
/*  descriptions and photos with the real events from each campus.     */
/* ------------------------------------------------------------------ */
const EVENTS = [
  {
    id: "hackathon",
    campus: "kiot",
    type: "Hackathon",
    title: "AppFactory Hackathon",
    text: "Student teams turn ideas into working apps in a single weekend, with mentors from the AppFactory community.",
    image: PHOTOS.hackathon,
  },
  {
    id: "orientation",
    campus: "dessie",
    type: "Orientation",
    title: "Freshman Orientation Week",
    text: "New students meet their departments, student unions and the offices that help with registration and housing.",
    image: PHOTOS.orientation,
  },
  {
    id: "outreach",
    campus: "tita",
    type: "Outreach",
    title: "Community Health Outreach",
    text: "Medicine and health sciences students take screening and health education to nearby communities.",
    image: PHOTOS.outreach,
  },
  {
    id: "cisco",
    campus: "kiot",
    type: "Training",
    title: "Cisco Academy Training",
    text: "Hands-on networking sessions that prepare engineering and informatics students for industry certification.",
    image: PHOTOS.cisco,
  },
  {
    id: "culture",
    campus: "dessie",
    type: "Culture",
    title: "Culture and Arts Day",
    text: "Music, dance and exhibitions from the Media Art union, celebrating the traditions of the Wollo region.",
    image: PHOTOS.culture,
  },
  {
    id: "sports",
    campus: "dessie",
    type: "Sport",
    title: "Inter-Department Sports Cup",
    text: "Football, athletics and tryouts organised by the Sport union, with every department fielding a team.",
    image: PHOTOS.sports,
  },
  {
    id: "techtalk",
    campus: "kiot",
    type: "Talk",
    title: "Tech Club Talks",
    text: "Guest speakers, short trainings and friendly competitions run by the Tech Club.",
    image: PHOTOS.techTalk,
  },
  {
    id: "workshop",
    campus: "tita",
    type: "Workshop",
    title: "Clinical Skills Workshop",
    text: "Practice sessions where health sciences students build core clinical skills under faculty guidance.",
    image: PHOTOS.workshop,
  },
];

/* ---------- Photo strip ---------- */
const LIFE = [
  { caption: "Campus life", image: PHOTOS.campus },
  { caption: "Labs and workshops", image: PHOTOS.cisco },
  { caption: "Learning together", image: PHOTOS.workshop },
  { caption: "Clubs and unions", image: PHOTOS.culture },
  { caption: "Sport", image: PHOTOS.sports },
];

/* ---------- Tech stack marquee ---------- */
const LOGOS = [
  ["React + Vite", "code"],
  ["pgvector", "dots"],
  ["Postgres RLS", "circle-ring"],
  ["Express API", "arrow"],
  ["Render", "wave-circle"],
  ["Vercel", "lines"],
  ["Supabase", "bolt"],
  ["Google Sign-in", "plus"],
];

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
function FactIcon({ name }) {
  const p = {
    width: 32,
    height: 32,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "black",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: styles.stripIcon,
  };
  switch (name) {
    case "building":
      return (
        <svg {...p}>
          <rect x="6" y="4" width="20" height="24" />
          <path d="M11 9h2M19 9h2M11 14h2M19 14h2M11 19h2M19 19h2M14 28v-5h4v5" />
        </svg>
      );
    case "chip":
      return (
        <svg {...p}>
          <rect x="8" y="8" width="16" height="16" />
          <path d="M12 4v4M20 4v4M12 24v4M20 24v4M4 12h4M4 20h4M24 12h4M24 20h4" />
        </svg>
      );
    case "cross":
      return (
        <svg {...p}>
          <path d="M13 5h6v8h8v6h-8v8h-6v-8H5v-6h8z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="5" y="7" width="22" height="20" />
          <path d="M5 13h22M11 4v6M21 4v6" />
        </svg>
      );
    case "book":
      return (
        <svg {...p}>
          <path d="M16 8c-3-2-7-3-11-3v19c4 0 8 1 11 3 3-2 7-3 11-3V5c-4 0-8 1-11 3zM16 8v19" />
        </svg>
      );
    default:
      return null;
  }
}

function ArrowIcon({ color = "currentColor" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M18.75 6V15.75C18.75 15.949 18.671 16.14 18.53 16.28C18.39 16.421 18.199 16.5 18 16.5C17.801 16.5 17.61 16.421 17.47 16.28C17.329 16.14 17.25 15.949 17.25 15.75V7.81L6.53 18.53C6.39 18.671 6.199 18.75 6 18.75C5.801 18.75 5.61 18.671 5.47 18.53C5.329 18.39 5.25 18.199 5.25 18C5.25 17.801 5.329 17.61 5.47 17.47L16.19 6.75H8.25C8.051 6.75 7.86 6.671 7.72 6.53C7.579 6.39 7.5 6.199 7.5 6C7.5 5.801 7.579 5.61 7.72 5.47C7.86 5.329 8.051 5.25 8.25 5.25H18C18.199 5.25 18.39 5.329 18.53 5.47C18.671 5.61 18.75 5.801 18.75 6Z" />
    </svg>
  );
}

function LogoIcon({ type }) {
  switch (type) {
    case "code":
      return (
        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6,4 1,9 6,14" />
          <polyline points="16,4 21,9 16,14" />
          <line x1="13" y1="2" x2="9" y2="16" />
        </svg>
      );
    case "dots":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="black">
          {[3, 10, 17].map((cy) =>
            [3, 10, 17].map((cx) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.2" />
            ))
          )}
        </svg>
      );
    case "circle-ring":
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="black" strokeWidth="2">
          <circle cx="11" cy="11" r="9" />
          <circle cx="11" cy="11" r="4" />
        </svg>
      );
    case "arrow":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="16" x2="16" y2="2" />
          <polyline points="7,2 16,2 16,11" />
        </svg>
      );
    case "wave-circle":
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="black" strokeWidth="1.5">
          <circle cx="11" cy="11" r="9" />
          <path d="M5 11Q8 7 11 11Q14 15 17 11" />
        </svg>
      );
    case "lines":
      return (
        <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round">
          <line x1="0" y1="3" x2="24" y2="3" />
          <line x1="6" y1="9" x2="24" y2="9" />
          <line x1="0" y1="15" x2="18" y2="15" />
        </svg>
      );
    case "bolt":
      return (
        <svg width="14" height="20" viewBox="0 0 14 20" fill="black">
          <polygon points="8,0 0,11 6,11 6,20 14,9 8,9" />
        </svg>
      );
    case "plus":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="black">
          <rect x="7.5" y="0" width="3" height="18" />
          <rect x="0" y="7.5" width="18" height="3" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */
function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function FloatingSquare({ x, y, size, index, scrollYProgress }) {
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(80 + index * 30)]
  );
  const springY = useSpring(rawY, { stiffness: 40, damping: 20 });

  return (
    <motion.div
      className={styles.floatSquare}
      style={{ left: `${x}%`, top: `${y}%`, y: springY }}
    >
      <motion.div
        className={styles.floatInner}
        style={{ width: size, height: size }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3 + index * 0.4,
          ease: "easeInOut",
          repeat: Infinity,
          delay: index * 0.3,
        }}
      />
    </motion.div>
  );
}

function MagneticSquare({ x, y, size, px, py }) {
  const dx = useTransform(px, (v) => (v - x / 100) * 40);
  const dy = useTransform(py, (v) => (v - y / 100) * 40);
  const sx = useSpring(dx, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(dy, { stiffness: 80, damping: 18, mass: 0.6 });

  return (
    <motion.div
      className={styles.magSquare}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        x: sx,
        y: sy,
      }}
    />
  );
}

function PixelOverlay({ hovered }) {
  const blocks = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const delayIn = (row + col) * 0.018;
      const delayOut = (ROWS - row + (COLS - col)) * 0.012;
      blocks.push(
        <motion.div
          key={`${row}-${col}`}
          className={styles.pixel}
          style={{
            left: `${(col * 100) / COLS}%`,
            top: `${(row * 100) / ROWS}%`,
            width: `${100 / COLS}%`,
            height: `${100 / ROWS}%`,
          }}
          initial={false}
          animate={
            hovered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
          }
          transition={{
            duration: 0.25,
            ease: EASE,
            delay: hovered ? delayIn : delayOut,
          }}
        />
      );
    }
  }
  return <div className={styles.pixelLayer}>{blocks}</div>;
}

/* ------------------------------------------------------------------ */
/*  Feature card                                                       */
/* ------------------------------------------------------------------ */
function CaseCard({ study, index }) {
  const [hovered, setHovered] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const handleMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      px.set((e.clientX - rect.left) / rect.width);
      py.set((e.clientY - rect.top) / rect.height);
    },
    [px, py]
  );

  const handleLeave = useCallback(() => {
    setHovered(false);
    px.set(0.5);
    py.set(0.5);
  }, [px, py]);

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 2) * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <img src={study.image} alt={study.title} className={styles.cardImg} />

      <PixelOverlay hovered={hovered} />

      {study.squares.map(([x, y, size], i) => (
        <MagneticSquare key={i} x={x} y={y} size={size} px={px} py={py} />
      ))}

      <div className={styles.cardPlus}>+</div>

      <div className={styles.plate}>
        <h3 className={styles.title}>{study.title}</h3>
        <div className={styles.meta}>
          <span className={styles.category}>{study.category}</span>
          <span className={styles.year}>{study.year}</span>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Event lightbox                                                     */
/* ------------------------------------------------------------------ */
function EventLightbox({ list, activeId, onChange, onClose }) {
  const closeRef = useRef(null);
  const index = list.findIndex((e) => e.id === activeId);
  const event = list[index];

  const go = useCallback(
    (step) => {
      if (!list.length) return;
      const next = (index + step + list.length) % list.length;
      onChange(list[next].id);
    },
    [index, list, onChange]
  );

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  if (!event) return null;

  return (
    <motion.div
      className={styles.lightbox}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
    >
      <motion.div
        className={styles.lightboxPanel}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.lightboxClose}
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <img
          key={event.id}
          src={event.image}
          alt={event.title}
          className={styles.lightboxImg}
        />

        <div className={styles.lightboxInfo}>
          <span className={styles.lightboxCampus}>
            {CAMPUS_NAME[event.campus]} &middot; {event.type}
          </span>
          <h3 className={styles.lightboxTitle}>{event.title}</h3>
          <p className={styles.lightboxText}>{event.text}</p>

          <div className={styles.lightboxNav}>
            <button
              type="button"
              className={styles.lightboxBtn}
              onClick={() => go(-1)}
              aria-label="Previous event"
            >
              &larr;
            </button>
            <button
              type="button"
              className={styles.lightboxBtn}
              onClick={() => go(1)}
              aria-label="Next event"
            >
              &rarr;
            </button>
            <span className={styles.lightboxCount}>
              {index + 1} / {list.length}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Events section                                                     */
/* ------------------------------------------------------------------ */
function EventsSection() {
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(null);

  const visible =
    filter === "all" ? EVENTS : EVENTS.filter((e) => e.campus === filter);

  const countFor = (id) =>
    id === "all" ? EVENTS.length : EVENTS.filter((e) => e.campus === id).length;

  const closeLightbox = useCallback(() => setActiveId(null), []);

  return (
    <div className={styles.wrap} id="campus-events">
      <Reveal>
        <div className={styles.eventsHead}>
          <div>
            <span className={styles.label}>Events and programs</span>
            <h2 className={styles.h2}>Moments from Dessie, KIoT and Tita</h2>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Filter by campus">
            {CAMPUS_TABS.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`${styles.tab} ${active ? styles.tabActive : ""}`}
                  onClick={() => setFilter(tab.id)}
                >
                  {active && (
                    <motion.span
                      layoutId="campusTabPill"
                      className={styles.tabPill}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                  <span className={styles.tabLabel}>
                    {tab.label}
                    <span className={styles.tabCount}>{countFor(tab.id)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      <motion.div layout className={styles.events}>
        <AnimatePresence mode="popLayout">
          {visible.map((event, i) => {
            const featured = filter === "all" && i === 0;
            return (
              <motion.button
                key={event.id}
                layout
                type="button"
                className={`${styles.event} ${
                  featured ? styles.eventFeatured : ""
                }`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: EASE }}
                onClick={() => setActiveId(event.id)}
                aria-label={`Open ${event.title}`}
              >
                <img
                  src={event.image}
                  alt=""
                  className={styles.eventImg}
                  loading="lazy"
                />
                <span className={styles.eventShade} />
                <span className={styles.eventTags}>
                  <span className={styles.tag}>{CAMPUS_SHORT[event.campus]}</span>
                  <span className={styles.tagLight}>{event.type}</span>
                </span>
                <span className={styles.eventBody}>
                  <span className={styles.eventTitle}>{event.title}</span>
                  <span className={styles.eventText}>{event.text}</span>
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {activeId && (
          <EventLightbox
            list={visible}
            activeId={activeId}
            onChange={setActiveId}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
function Gallary() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <MotionConfig reducedMotion="user">
      <section ref={sectionRef} className={styles.section}>
        {/* ---------- Top area ---------- */}
        <div className={styles.top}>
          <div className={styles.floatLayer}>
            {FLOATING_SQUARES.map(([x, y, size], i) => (
              <FloatingSquare
                key={i}
                x={x}
                y={y}
                size={size}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>

          <motion.div
            ref={headerRef}
            className={styles.headerWrap}
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className={styles.badge}>Features</span>
            <h2 className={styles.heading}>
              <span className={styles.textBlack}>What's inside </span>
              <span className={styles.textDim}>the</span>
              <br />
              <span className={styles.textDim}>Wollo-Info Hub</span>
            </h2>
          </motion.div>
        </div>

        {/* ---------- Feature cards ---------- */}
        <div className={styles.gridWrap}>
          <div className={styles.grid}>
            {CASES.map((study, i) => (
              <CaseCard key={study.id} study={study} index={i} />
            ))}
          </div>
        </div>

        {/* ---------- Quick facts strip ---------- */}
        <div className={styles.wrap}>
          <Reveal>
            <div className={styles.strip}>
              {FACTS.map((fact) => (
                <div key={fact.title} className={styles.stripItem}>
                  <FactIcon name={fact.icon} />
                  <div>
                    <div className={styles.stripTitle}>{fact.title}</div>
                    <div className={styles.stripText}>{fact.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ---------- Welcome ---------- */}
        <div className={styles.wrap}>
          <div className={styles.welcome}>
            <Reveal>
              <div className={styles.welcomeMedia}>
                <img
                  src={PHOTOS.campus}
                  alt="Wollo University campus"
                  className={styles.welcomeImg}
                />
                <div className={styles.welcomeBadge}>
                  <span className={styles.welcomeBadgeSmall}>
                    Wollo University
                  </span>
                  <span className={styles.welcomeBadgeMain}>
                    Knowledge for Sustainable Development
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <span className={styles.label}>Welcome to</span>
              <h2 className={styles.h2}>Wollo University</h2>
              <p className={styles.welcomeText}>
                Wollo University is a public university in Dessie, in the
                Amhara region of Ethiopia. Its three campuses bring together
                sciences, engineering, informatics and health, and its students
                take part in clubs, unions, trainings and community programs
                all year round.
              </p>
              <div className={styles.facts}>
                <div>
                  <span className={styles.factNum}>2005</span>
                  <span className={styles.factLabel}>Established</span>
                </div>
                <div>
                  <span className={styles.factNum}>3</span>
                  <span className={styles.factLabel}>Campuses</span>
                </div>
                <div>
                  <span className={styles.factNum}>400 km</span>
                  <span className={styles.factLabel}>From Addis Ababa</span>
                </div>
              </div>
              <a
                className={styles.btnGreen}
                href="https://wu.edu.et/about-us/"
                target="_blank"
                rel="noreferrer"
              >
                Read more about the university
                <ArrowIcon />
              </a>
            </Reveal>
          </div>
        </div>

        {/* ---------- Events and programs ---------- */}
        <EventsSection />

        {/* ---------- Photo strip ---------- */}
        <div className={styles.wrap}>
          <Reveal>
            <div style={{ marginBottom: "1.5rem" }}>
              <span className={styles.label}>Student life</span>
              <h2 className={styles.h2}>Learning beyond the classroom</h2>
            </div>
            <div className={styles.life}>
              {LIFE.map((item) => (
                <div key={item.caption} className={styles.lifeItem} tabIndex={0}>
                  <img
                    src={item.image}
                    alt={item.caption}
                    className={styles.lifeImg}
                    loading="lazy"
                  />
                  <span className={styles.lifeCaption}>{item.caption}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ---------- Banner ---------- */}
        <div className={styles.wrap}>
          <Reveal>
            <div className={styles.banner}>
              <h2 className={styles.bannerTitle}>
                Every campus,
                <br />
                every event, one hub.
              </h2>
              <span className={styles.bannerDivider} />
              <p className={styles.bannerText}>
                Sign in to see full department details, follow your unions and
                get step-by-step help from the chatbot.
              </p>
              <a className={styles.bannerBtn} href="#campus-events">
                Browse events
                <ArrowIcon color="#000" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* ---------- Footer area ---------- */}
        <div className={styles.footerWrap}>
          <div className={styles.footerRow}>
            <div className={styles.footerLeft}>
              <div className={styles.footerPlus}>+</div>
              <p className={styles.para}>
                Wollo-Info Hub gives students trustworthy information about
                Wollo University in one place: departments, courses,
                graduates, opportunities, unions and clubs, all backed by an AI
                chatbot that explains what you can do and how, in Amharic or
                English.
              </p>
              <button type="button" className={styles.cta}>
                <span className={styles.ctaLabel}>Join the Hub</span>
                <span className={styles.ctaBadge}>
                  <ArrowIcon color="white" />
                </span>
              </button>
            </div>

            <div className={styles.footerRight}>
              <div className={styles.marqueeWrap}>
                <div className={styles.marquee}>
                  {[...LOGOS, ...LOGOS].map(([name, icon], i) => (
                    <div key={`${name}-${i}`} className={styles.logo}>
                      <LogoIcon type={icon} />
                      <span className={styles.logoName}>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.spacer} />
      </section>
    </MotionConfig>
  );
}

export default Gallary;