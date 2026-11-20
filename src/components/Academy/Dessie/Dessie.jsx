
import { useState, useMemo, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Dessie.module.css";

/* Put your photo in public/images/dessie-hero.jpg */
const HERO_IMAGE = "https://i.pinimg.com/1200x/34/9a/f2/349af23efa5223d1c9c51ea0f4cfb705.jpg";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Departments", to: { pathname: "/dessie", hash: "#departments" } },
  { label: "Scholarships", to: "/scholarships" },
  { label: "Map", to: { pathname: "/dessie", hash: "#map" } },
];

/* ---------- Fields (colleges) ---------- */
const FIELDS = [
  { id: "natural", name: "Natural Sciences", hue: "#0f9d8a", blurb: "Life, matter, numbers and the Earth" },
  { id: "social", name: "Social Sciences and Humanities", hue: "#8b3fb8", blurb: "People, places, language and history" },
  { id: "business", name: "Business and Economics", hue: "#c68a1d", blurb: "Money, markets and management" },
  { id: "agri", name: "Agriculture and Veterinary", hue: "#4d8f2f", blurb: "Crops, animals and natural resources" },
  { id: "law", name: "Law and Education", hue: "#e5533d", blurb: "Justice, learning and behavior" },
];

/* ---------- Departments ---------- */
const DEPARTMENTS = [
  {
    id: "bio", field: "natural", name: "Biology", degree: "BSc", years: 4,
    about: "Study living things, from cells and genes to ecosystems and public health.",
    courses: ["Genetics", "Zoology", "Botany", "Microbiology"],
    careers: ["Laboratory scientist", "Researcher", "Environmental officer"]
  },
  {
    id: "chem", field: "natural", name: "Chemistry", degree: "BSc", years: 4,
    about: "Explore how substances behave and how to make, test and improve them.",
    courses: ["Organic Chemistry", "Analytical Chemistry", "Physical Chemistry", "Industrial Chemistry"],
    careers: ["Chemist", "Quality controller", "Lab technician"]
  },
  {
    id: "phys", field: "natural", name: "Physics", degree: "BSc", years: 4,
    about: "Understand energy, matter and motion, and use them to solve practical problems.",
    courses: ["Mechanics", "Electromagnetism", "Solid State Physics", "Nuclear Physics"],
    careers: ["Physicist", "Instrument technician", "Science teacher"]
  },
  {
    id: "math", field: "natural", name: "Mathematics", degree: "BSc", years: 4,
    about: "Build strong reasoning with algebra, analysis and statistics that every field needs.",
    courses: ["Calculus", "Linear Algebra", "Probability and Statistics", "Numerical Methods"],
    careers: ["Data analyst", "Statistician", "Mathematics teacher"]
  },
  {
    id: "geo", field: "natural", name: "Geology", degree: "BSc", years: 4,
    about: "Read the Earth's rocks, minerals and water to find resources and manage risk.",
    courses: ["Mineralogy", "Structural Geology", "Hydrogeology", "Field Geology"],
    careers: ["Geologist", "Mining analyst", "Groundwater specialist"]
  },
  {
    id: "sport", field: "natural", name: "Sport Science", degree: "BSc", years: 4,
    about: "Learn how the body performs, trains and recovers, and how to coach others.",
    courses: ["Exercise Physiology", "Sports Coaching", "Biomechanics", "Sports Management"],
    careers: ["Coach", "Fitness trainer", "Physical education teacher"]
  },

  {
    id: "geog", field: "social", name: "Geography and Environmental Studies", degree: "BA", years: 4,
    about: "Study landscapes, climate and communities, and how people shape the land.",
    courses: ["Physical Geography", "GIS and Remote Sensing", "Environmental Management", "Population Studies"],
    careers: ["GIS analyst", "Environmental planner", "Development officer"]
  },
  {
    id: "hist", field: "social", name: "History and Heritage Management", degree: "BA", years: 4,
    about: "Explore Ethiopia's past and learn how to protect its sites, objects and stories.",
    courses: ["History of Ethiopia", "Heritage Conservation", "Archaeology", "Museum Studies"],
    careers: ["Heritage officer", "Museum curator", "Tourism planner"]
  },
  {
    id: "pol", field: "social", name: "Political Science and International Studies", degree: "BA", years: 4,
    about: "Understand governments, public policy and how countries work together.",
    courses: ["Political Theory", "International Relations", "Public Policy", "Comparative Politics"],
    careers: ["Policy analyst", "Diplomat", "Civil servant"]
  },
  {
    id: "soc", field: "social", name: "Sociology", degree: "BA", years: 4,
    about: "Learn why societies change and how to research the issues communities face.",
    courses: ["Social Research Methods", "Social Change", "Gender and Society", "Community Development"],
    careers: ["Social researcher", "NGO program officer", "Community worker"]
  },
  {
    id: "eng", field: "social", name: "English Language and Literature", degree: "BA", years: 4,
    about: "Master written and spoken English and read the stories that shape cultures.",
    courses: ["Linguistics", "Literature", "Academic Writing", "Translation"],
    careers: ["Teacher", "Editor", "Communications officer"]
  },
  {
    id: "amh", field: "social", name: "Amharic Language and Literature", degree: "BA", years: 4,
    about: "Study Amharic language, folklore and writing in depth.",
    courses: ["Amharic Grammar", "Folklore", "Creative Writing", "Literary Criticism"],
    careers: ["Writer", "Journalist", "Language teacher"]
  },

  {
    id: "acc", field: "business", name: "Accounting and Finance", degree: "BA", years: 4,
    about: "Record, check and plan money for companies, banks and public offices.",
    courses: ["Financial Accounting", "Auditing", "Taxation", "Corporate Finance"],
    careers: ["Accountant", "Auditor", "Finance officer"]
  },
  {
    id: "mgt", field: "business", name: "Management", degree: "BA", years: 4,
    about: "Learn to lead people, run organizations and make decisions that last.",
    courses: ["Organizational Behavior", "Human Resource Management", "Operations Management", "Entrepreneurship"],
    careers: ["Manager", "HR officer", "Business owner"]
  },
  {
    id: "econ", field: "business", name: "Economics", degree: "BA", years: 4,
    about: "See how markets, prices and policies shape jobs, growth and living standards.",
    courses: ["Microeconomics", "Macroeconomics", "Econometrics", "Development Economics"],
    careers: ["Economist", "Policy analyst", "Bank analyst"]
  },
  {
    id: "mkt", field: "business", name: "Marketing Management", degree: "BA", years: 4,
    about: "Find what customers need and build brands and services that meet it.",
    courses: ["Consumer Behavior", "Marketing Research", "Sales Management", "Digital Marketing"],
    careers: ["Marketing officer", "Sales manager", "Brand manager"]
  },

  {
    id: "plant", field: "agri", name: "Plant Science", degree: "BSc", years: 4,
    about: "Grow healthier crops with better seeds, soil care and pest control.",
    courses: ["Crop Production", "Soil Science", "Plant Protection", "Horticulture"],
    careers: ["Agronomist", "Seed specialist", "Farm manager"]
  },
  {
    id: "animal", field: "agri", name: "Animal Science", degree: "BSc", years: 4,
    about: "Improve livestock, dairy and poultry through better feeding and breeding.",
    courses: ["Animal Nutrition", "Animal Breeding", "Dairy Production", "Poultry Science"],
    careers: ["Livestock expert", "Dairy manager", "Feed specialist"]
  },
  {
    id: "nrm", field: "agri", name: "Natural Resource Management", degree: "BSc", years: 4,
    about: "Protect forests, soil and water while helping communities earn a living.",
    courses: ["Forestry", "Watershed Management", "Soil Conservation", "Agroforestry"],
    careers: ["Forestry officer", "Conservation planner", "Watershed expert"]
  },
  {
    id: "vet", field: "agri", name: "Veterinary Medicine", degree: "DVM", years: 6,
    about: "Train to diagnose and treat animals and protect the health of herds and people.",
    courses: ["Animal Anatomy", "Veterinary Pathology", "Clinical Medicine", "Public Health"],
    careers: ["Veterinarian", "Livestock health officer", "Researcher"]
  },

  {
    id: "law", field: "law", name: "Law", degree: "LLB", years: 4,
    about: "Learn the law, argue a case and prepare to serve justice.",
    courses: ["Constitutional Law", "Criminal Law", "Contract Law", "Moot Court"],
    careers: ["Lawyer", "Judge or prosecutor", "Legal advisor"]
  },
  {
    id: "psy", field: "law", name: "Psychology", degree: "BA", years: 4,
    about: "Understand how people think, learn and feel, and how to support them.",
    courses: ["Developmental Psychology", "Counseling Skills", "Learning and Behavior", "Research Methods"],
    careers: ["Counselor", "School psychologist", "HR specialist"]
  },
];

/* ---------- Map and directions ---------- */
const DESTINATION = "Wollo University, Dessie, Ethiopia";

const ORIGINS = [
  { id: "kombolcha", label: "Kombolcha (KIoT)", value: "Kombolcha Institute of Technology, Kombolcha, Ethiopia", note: "About 26 km away" },
  { id: "addis", label: "Addis Ababa", value: "Addis Ababa, Ethiopia", note: "About 400 km away" },
  { id: "airport", label: "Kombolcha Airport", value: "Kombolcha Airport, Ethiopia", note: "Nearest airport" },
  { id: "town", label: "Dessie town center", value: "Dessie, Ethiopia", note: "In town" },
];

const MODES = [
  { id: "d", api: "driving", label: "Drive" },
  { id: "r", api: "transit", label: "Transit" },
  { id: "w", api: "walking", label: "Walk" },
  { id: "b", api: "bicycling", label: "Cycle" },
];

const WHY = [
  { title: "Main campus", text: "The heart of Wollo University, with the widest range of programs." },
  { title: "Applied research", text: "Projects that tackle real challenges in the region." },
  { title: "Community service", text: "Students give back to towns and farms across South Wollo." },
  { title: "Highland setting", text: "Study at about 2,500 m above sea level in a cool, green city." },
];

const enc = encodeURIComponent;

export default function Dessie() {
  const [field, setField] = useState("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const [originId, setOriginId] = useState("town");
  const [myLocation, setMyLocation] = useState(null);
  const [mode, setMode] = useState("d");
  const [routeOn, setRouteOn] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [heroOk, setHeroOk] = useState(true);

  const { hash, key } = useLocation();

  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [hash, key]);

  useEffect(() => {
    if (!active) return undefined;

    const onKey = (e) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  const fieldById = useMemo(
    () => Object.fromEntries(FIELDS.map((f) => [f.id, f])),
    []
  );

  const counts = useMemo(() => {
    const c = { all: DEPARTMENTS.length };
    DEPARTMENTS.forEach((d) => {
      c[d.field] = (c[d.field] || 0) + 1;
    });
    return c;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return DEPARTMENTS.filter(
      (d) =>
        (field === "all" || d.field === field) &&
        (!q || d.name.toLowerCase().includes(q))
    );
  }, [field, query]);

  const groups = useMemo(
    () =>
      FIELDS.map((f) => ({
        ...f,
        items: visible.filter((d) => d.field === f.id),
      })).filter((g) => g.items.length),
    [visible]
  );

  /* ---------- Safe map origin ---------- */
  const origin = myLocation
    ? {
        label: "My location",
        value: `${myLocation.lat},${myLocation.lng}`,
      }
    : ORIGINS.find((o) => o.id === originId) ||
      ORIGINS.find((o) => o.id === "town");

  const modeInfo = MODES.find((m) => m.id === mode) || MODES[0];

  const embedSrc = routeOn
    ? `https://www.google.com/maps?saddr=${enc(origin.value)}&daddr=${enc(DESTINATION)}&dirflg=${mode}&output=embed`
    : `https://www.google.com/maps?q=${enc(DESTINATION)}&z=15&output=embed`;

  const openUrl = `https://www.google.com/maps/dir/?api=1&origin=${enc(
    origin.value
  )}&destination=${enc(DESTINATION)}&travelmode=${modeInfo.api}`;

  const useMyLocation = () => {
    setGeoError("");

    if (!navigator.geolocation) {
      setGeoError("Your browser cannot share your location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (p) => {
        setMyLocation({
          lat: p.coords.latitude.toFixed(5),
          lng: p.coords.longitude.toFixed(5),
        });
        setRouteOn(true);
      },
      () => setGeoError("We could not get your location. Choose a starting point instead.")
    );
  };

  const chooseOrigin = (id) => {
    setMyLocation(null);
    setOriginId(id);
    setRouteOn(true);
  };

  const activeField = active
    ? fieldById[active.field] || FIELDS[0]
    : null;

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Wollo University
          <span>Dessie Campus</span>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.label} to={n.to} end>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/scholarships" className={styles.headerBtn}>
          Apply for a scholarship
        </Link>
      </header>

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        {heroOk && (
          <img
            className={styles.heroImg}
            src={HERO_IMAGE}
            alt=""
            onError={() => setHeroOk(false)}
          />
        )}

        <div className={styles.heroShade} />

        <div className={styles.heroInner}>
          <p className={styles.kicker}>Dessie Campus · Main campus</p>
          <h1>Find your department on our main campus.</h1>
          <p className={styles.lead}>
            Explore {DEPARTMENTS.length} departments across {FIELDS.length} fields,
            from biology to business to law, then get directions to our campus.
          </p>

          <div className={styles.heroActions}>
            <Link to={{ hash: "#departments" }} className={styles.btnGold}>
              Explore departments
            </Link>
            <Link to={{ hash: "#map" }} className={styles.btnGhost}>
              Get directions
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Facts ---------- */}
      <section className={styles.facts} aria-label="Campus facts">
        <div><strong>{DEPARTMENTS.length}</strong><span>Departments</span></div>
        <div><strong>{FIELDS.length}</strong><span>Fields of study</span></div>
        <div><strong>26 km</strong><span>From Kombolcha campus</span></div>
        <div><strong>2,500 m</strong><span>Above sea level</span></div>
      </section>

      {/* ---------- Why ---------- */}
      <section className={styles.why}>
        <h2>Why study at Dessie</h2>
        <ul>
          {WHY.map((w) => (
            <li key={w.title}>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Departments ---------- */}
      <section id="departments" className={styles.departments}>
        <div className={styles.sectionHead}>
          <h2>Explore our departments</h2>
          <p>
            Pick a field, or search by name. Select a department to see what you
            will study.
          </p>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.tabs} role="tablist" aria-label="Filter by field">
            <button
              role="tab"
              aria-selected={field === "all"}
              className={field === "all" ? styles.tabActive : styles.tab}
              onClick={() => setField("all")}
            >
              All fields <span>{counts.all}</span>
            </button>

            {FIELDS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={field === f.id}
                className={field === f.id ? styles.tabActive : styles.tab}
                style={{ "--hue": f.hue }}
                onClick={() => setField(f.id)}
              >
                {f.name} <span>{counts[f.id] || 0}</span>
              </button>
            ))}
          </div>

          <label className={styles.search}>
            <span className={styles.srOnly}>Search departments</span>
            <input
              type="search"
              placeholder="Search departments"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        {groups.map((g) => (
          <div key={g.id} className={styles.group} style={{ "--hue": g.hue }}>
            <div className={styles.groupHead}>
              <h3>{g.name}</h3>
              <p>{g.blurb}</p>
            </div>

            <div className={styles.grid}>
              {g.items.map((d) => (
                <button
                  key={d.id}
                  className={styles.card}
                  onClick={() => setActive(d)}
                >
                  <span className={styles.cardMeta}>
                    {d.degree}{d.years ? ` · ${d.years} years` : ""}
                  </span>
                  <strong>{d.name}</strong>
                  <span className={styles.cardAbout}>{d.about}</span>
                  <span className={styles.cardMore}>See details</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <p className={styles.empty}>
            No department matches “{query}”. Try a shorter name or choose All fields.
          </p>
        )}
      </section>

      {/* ---------- Map ---------- */}
      <section id="map" className={styles.mapSection}>
        <div className={styles.sectionHead}>
          <h2>Find us in Dessie</h2>
          <p>Choose where you are starting from and we will show the route.</p>
        </div>

        <div className={styles.mapWrap}>
          <div className={styles.mapPanel}>
            <h3>Start from</h3>

            <div className={styles.origins}>
              {ORIGINS.map((o) => (
                <button
                  key={o.id}
                  className={
                    !myLocation && originId === o.id && routeOn
                      ? styles.originActive
                      : styles.origin
                  }
                  onClick={() => chooseOrigin(o.id)}
                >
                  <strong>{o.label}</strong>
                  <span>{o.note}</span>
                </button>
              ))}

              <button
                className={myLocation ? styles.originActive : styles.origin}
                onClick={useMyLocation}
              >
                <strong>My location</strong>
                <span>Use my device</span>
              </button>
            </div>

            {geoError && (
              <p className={styles.geoError} role="alert">{geoError}</p>
            )}

            <h3>Travel by</h3>

            <div className={styles.modes} role="radiogroup" aria-label="Travel mode">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  role="radio"
                  aria-checked={mode === m.id}
                  className={mode === m.id ? styles.modeActive : styles.modeBtn}
                  onClick={() => setMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className={styles.mapActions}>
              <button
                className={styles.btnGold}
                onClick={() => setRouteOn(true)}
              >
                Show route on map
              </button>

              <a
                className={styles.btnOutline}
                href={openUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
            </div>

            {routeOn && (
              <p className={styles.routeNote}>
                Route from <strong>{origin.label}</strong> to{" "}
                <strong>Dessie Campus</strong>.
              </p>
            )}
          </div>

          <div className={styles.mapFrame}>
            <iframe
              key={embedSrc}
              title="Map and directions to Wollo University Dessie Campus"
              src={embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ---------- Department detail panel ---------- */}
      {active && (
        <div
          className={styles.overlay}
          onClick={() => setActive(null)}
        >
          <aside
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dept-title"
            style={{ "--hue": activeField.hue }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.close}
              onClick={() => setActive(null)}
              aria-label="Close details"
            >
              ×
            </button>

            <span className={styles.badge}>{activeField.name}</span>
            <h2 id="dept-title">{active.name}</h2>
            <p className={styles.panelAbout}>{active.about}</p>

            <dl className={styles.facts2}>
              <div><dt>Degree</dt><dd>{active.degree}</dd></div>
              <div>
                <dt>Length</dt>
                <dd>{active.years ? `${active.years} years` : "Shared courses"}</dd>
              </div>
              <div><dt>Campus</dt><dd>Dessie</dd></div>
            </dl>

            <h3>What you will study</h3>
            <ul className={styles.tags}>
              {active.courses.map((c) => <li key={c}>{c}</li>)}
            </ul>

            <h3>Where it can take you</h3>
            <ul className={styles.list}>
              {active.careers.map((c) => <li key={c}>{c}</li>)}
            </ul>

            <div className={styles.panelActions}>
              <Link to="/scholarships" className={styles.btnGold}>
                See scholarships
              </Link>

              <Link
                to={{ hash: "#map" }}
                className={styles.btnOutline}
                onClick={() => setActive(null)}
              >
                Get directions
              </Link>
            </div>

            <p className={styles.panelNote}>
              Contact the college office for the latest curriculum.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
