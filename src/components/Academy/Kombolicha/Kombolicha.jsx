import { useState, useMemo, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Kombolicha.module.css";

/* Put your photo in public/images/kombolcha-hero.jpg */
const HERO_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPAjZIpamhjlpyF6swpSYUldzH0pd8ZD-lAqMcr9FnUmrRpUfqZD9t3EG2&s=10";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Departments", to: { pathname: "/kombolcha", hash: "#departments" } },
  { label: "Scholarships", to: "/scholarships" },
  { label: "Map", to: { pathname: "/kombolcha", hash: "#map" } },
];

/* ---------- Fields (categories) ---------- */
const FIELDS = [
  { id: "informatics", name: "Informatics", hue: "#2563eb", blurb: "Software, data, networks and systems" },
  { id: "civil", name: "Civil and Construction", hue: "#c68a1d", blurb: "Buildings, roads and water" },
  { id: "electrical", name: "Electrical and Biomedical", hue: "#0f9d8a", blurb: "Power, electronics and health tech" },
  { id: "mechanical", name: "Mechanical and Chemical", hue: "#e5533d", blurb: "Machines, industry and processes" },
  { id: "textile", name: "Textile and Fashion", hue: "#8b3fb8", blurb: "Fabric, leather, garments and design" },
  { id: "foundation", name: "Foundation", hue: "#51607f", blurb: "Common courses for engineering students" },
];

/*
  22 departments. Informatics, Civil, Architecture, Construction Management, Electrical and Computer,
  Mechanical, Chemical, Textile, Leather, Garment, Fashion Design and Pre-Engineering are listed on the
  KIoT website. Check the others, plus all durations, courses and careers, with each department head.
*/
const DEPARTMENTS = [
  // Informatics
  { id: "cs", field: "informatics", name: "Computer Science", degree: "BSc", years: 4,
    about: "Learn how software and computer systems work, from algorithms to artificial intelligence.",
    courses: ["Algorithms and Data Structures", "Operating Systems", "Artificial Intelligence", "Databases"],
    careers: ["Software developer", "Data scientist", "Systems analyst"] },
  { id: "it", field: "informatics", name: "Information Technology", degree: "BSc", years: 4,
    about: "Design, run and secure the networks and systems that organizations depend on.",
    courses: ["Computer Networks", "System Administration", "Cybersecurity", "Web Technologies"],
    careers: ["Network engineer", "IT manager", "Security analyst"] },
  { id: "is", field: "informatics", name: "Information Systems", degree: "BSc", years: 4,
    about: "Connect business needs with technology through analysis and system design.",
    courses: ["Systems Analysis", "Enterprise Systems", "Database Management", "Business Intelligence"],
    careers: ["Business analyst", "Database administrator", "ERP consultant"] },
  { id: "se", field: "informatics", name: "Software Engineering", degree: "BSc", years: 4,
    about: "Plan, build, test and maintain reliable software as part of a team.",
    courses: ["Software Design", "Testing and Quality Assurance", "Mobile Development", "DevOps"],
    careers: ["Software engineer", "QA engineer", "Mobile developer"] },

  // Civil and Construction
  { id: "civil", field: "civil", name: "Civil Engineering", degree: "BSc", years: 5,
    about: "Plan and build the roads, bridges and structures that communities use every day.",
    courses: ["Structural Analysis", "Highway Engineering", "Soil Mechanics", "Surveying"],
    careers: ["Site engineer", "Structural designer", "Road engineer"] },
  { id: "arch", field: "civil", name: "Architecture Engineering", degree: "BSc", years: 5,
    about: "Design buildings that are safe, useful and a good fit for their place.",
    courses: ["Architectural Design", "Building Technology", "Urban Planning", "History of Architecture"],
    careers: ["Architect", "Urban designer", "Interior planner"] },
  { id: "ctm", field: "civil", name: "Construction Technology and Management", degree: "BSc", years: 5,
    about: "Manage budgets, schedules and teams to deliver construction projects well.",
    courses: ["Construction Methods", "Cost Estimation", "Project Management", "Contract Administration"],
    careers: ["Project manager", "Quantity surveyor", "Site manager"] },
  { id: "hwre", field: "civil", name: "Hydraulic and Water Resources Engineering", degree: "BSc", years: 5,
    about: "Study how to supply, store and protect water for towns, farms and industry.",
    courses: ["Hydrology", "Irrigation Engineering", "Water Supply Systems", "Dam Engineering"],
    careers: ["Water engineer", "Irrigation designer", "Hydrologist"] },

  // Electrical and Biomedical
  { id: "ece", field: "electrical", name: "Electrical and Computer Engineering", degree: "BSc", years: 5,
    about: "Work with circuits, control and computing to build smart electrical systems.",
    courses: ["Circuit Analysis", "Digital Systems", "Control Systems", "Embedded Systems"],
    careers: ["Electrical engineer", "Embedded developer", "Automation engineer"] },
  { id: "bme", field: "electrical", name: "Biomedical Engineering", degree: "BSc", years: 5,
    about: "Apply engineering to hospital equipment, medical devices and patient care.",
    courses: ["Medical Instrumentation", "Biomechanics", "Medical Imaging", "Hospital Equipment Maintenance"],
    careers: ["Biomedical engineer", "Equipment technician", "Medical device specialist"] },
  { id: "power", field: "electrical", name: "Power and Control Engineering", degree: "BSc", years: 5,
    about: "Generate, distribute and control electric power for homes and industry.",
    courses: ["Power Systems", "Electrical Machines", "Renewable Energy", "Industrial Automation"],
    careers: ["Power engineer", "Utility planner", "Plant controller"] },
  { id: "comm", field: "electrical", name: "Electronics and Communication Engineering", degree: "BSc", years: 5,
    about: "Design the electronics and networks that carry voice, data and signals.",
    courses: ["Analog Electronics", "Signals and Systems", "Wireless Communication", "Telecom Networks"],
    careers: ["Telecom engineer", "RF engineer", "Electronics designer"] },

  // Mechanical and Chemical
  { id: "mech", field: "mechanical", name: "Mechanical Engineering", degree: "BSc", years: 5,
    about: "Design, build and maintain machines, engines and manufacturing systems.",
    courses: ["Thermodynamics", "Machine Design", "Fluid Mechanics", "Manufacturing Processes"],
    careers: ["Mechanical engineer", "Maintenance engineer", "Design engineer"] },
  { id: "chem", field: "mechanical", name: "Chemical Engineering", degree: "BSc", years: 5,
    about: "Turn raw materials into useful products through safe, efficient processes.",
    courses: ["Process Design", "Mass Transfer", "Reaction Engineering", "Process Control"],
    careers: ["Process engineer", "Quality manager", "Plant supervisor"] },
  { id: "ind", field: "mechanical", name: "Industrial Engineering", degree: "BSc", years: 5,
    about: "Make factories and services faster, safer and less wasteful.",
    courses: ["Operations Research", "Quality Engineering", "Production Planning", "Work Study"],
    careers: ["Industrial engineer", "Operations manager", "Quality analyst"] },
  { id: "manu", field: "mechanical", name: "Manufacturing Engineering", degree: "BSc", years: 5,
    about: "Plan and run the workshops and machines that turn designs into products.",
    courses: ["Machining Technology", "CAD and CAM", "Welding Technology", "Production Systems"],
    careers: ["Manufacturing engineer", "CNC programmer", "Workshop manager"] },

  // Textile and Fashion
  { id: "tex", field: "textile", name: "Textile Engineering", degree: "BSc", years: 5,
    about: "Study fibers, yarn and fabric production for Ethiopia's growing textile industry.",
    courses: ["Spinning Technology", "Weaving Technology", "Knitting", "Textile Testing"],
    careers: ["Textile engineer", "Mill manager", "Quality controller"] },
  { id: "texchem", field: "textile", name: "Textile Chemistry and Processing", degree: "BSc", years: 5,
    about: "Learn dyeing, printing and finishing that give fabric its color and feel.",
    courses: ["Dyeing Technology", "Textile Printing", "Finishing Processes", "Effluent Treatment"],
    careers: ["Dyeing technologist", "Process chemist", "Environmental officer"] },
  { id: "leather", field: "textile", name: "Leather Engineering", degree: "BSc", years: 5,
    about: "Turn hides and skins into leather goods and footwear for local and export markets.",
    courses: ["Leather Processing", "Footwear Technology", "Leather Chemistry", "Product Design"],
    careers: ["Tannery engineer", "Footwear designer", "Production manager"] },
  { id: "garment", field: "textile", name: "Garment Engineering", degree: "BSc", years: 5,
    about: "Plan and manage how clothing is cut, sewn and delivered at industrial scale.",
    courses: ["Pattern Making", "Apparel Production", "Industrial Sewing", "Garment Quality"],
    careers: ["Garment engineer", "Production planner", "Merchandiser"] },
  { id: "fashion", field: "textile", name: "Fashion Design", degree: "BSc", years: 4,
    about: "Create clothing and accessories that mix creativity with strong technical skills.",
    courses: ["Fashion Illustration", "Garment Construction", "Textile Design", "Fashion Marketing"],
    careers: ["Fashion designer", "Stylist", "Brand founder"] },

  // Foundation
  { id: "pre", field: "foundation", name: "Pre-Engineering and Allied Fields", degree: "Foundation", years: null,
    about: "Teaches the shared mathematics, communication and civics courses that engineering and science students take.",
    courses: ["Applied Mathematics and Statistics", "Numerical Analysis", "Differential Equations", "Civics and Ethical Studies"],
    careers: ["Supports every KIoT program", "Prepares you for your chosen department"] },
];

/* ---------- Map and directions ---------- */
const DESTINATION = "Kombolcha Institute of Technology, Wollo University, Kombolcha, Ethiopia";

const ORIGINS = [
  { id: "dessie", label: "Dessie Campus", value: "Wollo University, Dessie, Ethiopia", note: "About 26 km away" },
  { id: "addis", label: "Addis Ababa", value: "Addis Ababa, Ethiopia", note: "About 380 km away" },
  { id: "airport", label: "Kombolcha Airport", value: "Kombolcha Airport, Ethiopia", note: "Closest airport" },
  { id: "town", label: "Kombolcha town center", value: "Kombolcha, Ethiopia", note: "In town" },
];

const MODES = [
  { id: "d", api: "driving", label: "Drive" },
  { id: "r", api: "transit", label: "Transit" },
  { id: "w", api: "walking", label: "Walk" },
  { id: "b", api: "bicycling", label: "Cycle" },
];

const WHY = [
  { title: "Industry-ready", text: "Workshops, labs and factory visits sit next to the lecture hall." },
  { title: "AppFactory", text: "Informatics students build real apps with mentors." },
  { title: "Hackathons", text: "Compete in events that carry scholarships and prizes." },
  { title: "Textile hub", text: "One of Ethiopia's earliest textile engineering programs." },
];

const enc = encodeURIComponent;

export default function Kombolcha() {
  const [field, setField] = useState("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const [originId, setOriginId] = useState("dessie");
  const [myLocation, setMyLocation] = useState(null);
  const [mode, setMode] = useState("d");
  const [routeOn, setRouteOn] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [heroOk, setHeroOk] = useState(true);

  /* Scroll to #departments or #map */
  const { hash, key } = useLocation();
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, key]);

  /* Close the detail panel with Escape and stop the page scrolling behind it */
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

  const fieldById = useMemo(() => Object.fromEntries(FIELDS.map((f) => [f.id, f])), []);

  const counts = useMemo(() => {
    const c = { all: DEPARTMENTS.length };
    DEPARTMENTS.forEach((d) => { c[d.field] = (c[d.field] || 0) + 1; });
    return c;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEPARTMENTS.filter(
      (d) => (field === "all" || d.field === field) && (!q || d.name.toLowerCase().includes(q))
    );
  }, [field, query]);

  /* Group the visible departments by field so each field gets its own heading */
  const groups = useMemo(
    () =>
      FIELDS.map((f) => ({ ...f, items: visible.filter((d) => d.field === f.id) })).filter((g) => g.items.length),
    [visible]
  );

  /* Map urls */
  const origin = myLocation
    ? { label: "My location", value: `${myLocation.lat},${myLocation.lng}` }
    : ORIGINS.find((o) => o.id === originId);
  const modeInfo = MODES.find((m) => m.id === mode);
  const embedSrc = routeOn
    ? `https://www.google.com/maps?saddr=${enc(origin.value)}&daddr=${enc(DESTINATION)}&dirflg=${mode}&output=embed`
    : `https://www.google.com/maps?q=${enc(DESTINATION)}&z=15&output=embed`;
  const openUrl = `https://www.google.com/maps/dir/?api=1&origin=${enc(origin.value)}&destination=${enc(
    DESTINATION
  )}&travelmode=${modeInfo.api}`;

  const useMyLocation = () => {
    setGeoError("");
    if (!navigator.geolocation) return setGeoError("Your browser cannot share your location.");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setMyLocation({ lat: p.coords.latitude.toFixed(5), lng: p.coords.longitude.toFixed(5) });
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

  const activeField = active ? fieldById[active.field] : null;

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Wollo University
          <span>Kombolcha Institute of Technology</span>
        </Link>
        <nav className={styles.nav} aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.label} to={n.to} end>{n.label}</NavLink>
          ))}
        </nav>
        <Link to="/scholarships" className={styles.headerBtn}>Apply for a scholarship</Link>
      </header>

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        {heroOk && (
          <img className={styles.heroImg} src={HERO_IMAGE} alt="" onError={() => setHeroOk(false)} />
        )}
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <p className={styles.kicker}>Kombolcha Institute of Technology</p>
          <h1>Find the department that builds your future.</h1>
          <p className={styles.lead}>
            Explore {DEPARTMENTS.length} departments across {FIELDS.length} fields, from software to textiles,
            then get directions to our campus.
          </p>
          <div className={styles.heroActions}>
            <Link to={{ hash: "#departments" }} className={styles.btnGold}>Explore departments</Link>
            <Link to={{ hash: "#map" }} className={styles.btnGhost}>Get directions</Link>
          </div>
        </div>
      </section>

      {/* ---------- Facts ---------- */}
      <section className={styles.facts} aria-label="Campus facts">
        <div><strong>{DEPARTMENTS.length}</strong><span>Departments</span></div>
        <div><strong>{FIELDS.length}</strong><span>Fields of study</span></div>
        <div><strong>26 km</strong><span>From Dessie Campus</span></div>
        <div><strong>380 km</strong><span>From Addis Ababa</span></div>
      </section>

      {/* ---------- Why ---------- */}
      <section className={styles.why}>
        <h2>Why study at KIoT</h2>
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
          <p>Pick a field, or search by name. Select a department to see what you will study.</p>
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
                {f.name} <span>{counts[f.id]}</span>
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
                <button key={d.id} className={styles.card} onClick={() => setActive(d)}>
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
          <p className={styles.empty}>No department matches “{query}”. Try a shorter name or choose All fields.</p>
        )}
      </section>

      {/* ---------- Map ---------- */}
      <section id="map" className={styles.mapSection}>
        <div className={styles.sectionHead}>
          <h2>Find us in Kombolcha</h2>
          <p>Choose where you are starting from and we will show the route.</p>
        </div>

        <div className={styles.mapWrap}>
          <div className={styles.mapPanel}>
            <h3>Start from</h3>
            <div className={styles.origins}>
              {ORIGINS.map((o) => (
                <button
                  key={o.id}
                  className={!myLocation && originId === o.id && routeOn ? styles.originActive : styles.origin}
                  onClick={() => chooseOrigin(o.id)}
                >
                  <strong>{o.label}</strong>
                  <span>{o.note}</span>
                </button>
              ))}
              <button className={myLocation ? styles.originActive : styles.origin} onClick={useMyLocation}>
                <strong>My location</strong>
                <span>Use my device</span>
              </button>
            </div>
            {geoError && <p className={styles.geoError} role="alert">{geoError}</p>}

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
              <button className={styles.btnGold} onClick={() => setRouteOn(true)}>Show route on map</button>
              <a className={styles.btnOutline} href={openUrl} target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            </div>
            {routeOn && (
              <p className={styles.routeNote}>
                Route from <strong>{origin.label}</strong> to <strong>Kombolcha Institute of Technology</strong>.
              </p>
            )}
          </div>

          <div className={styles.mapFrame}>
            <iframe
              key={embedSrc}
              title="Map and directions to Kombolcha Institute of Technology"
              src={embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className={styles.footer}>
        <div>
          <strong>Wollo University · Kombolcha Institute of Technology</strong>
          <p>P.O. Box 208, Kombolcha, Ethiopia</p>
        </div>
        <Link to="/scholarships">Scholarships and events</Link>
        <small>© {new Date().getFullYear()} Wollo University. All rights reserved.</small>
      </footer>

      {/* ---------- Department detail panel ---------- */}
      {active && (
        <div className={styles.overlay} onClick={() => setActive(null)}>
          <aside
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dept-title"
            style={{ "--hue": activeField.hue }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.close} onClick={() => setActive(null)} aria-label="Close details">×</button>
            <span className={styles.badge}>{activeField.name}</span>
            <h2 id="dept-title">{active.name}</h2>
            <p className={styles.panelAbout}>{active.about}</p>

            <dl className={styles.facts2}>
              <div><dt>Degree</dt><dd>{active.degree}</dd></div>
              <div><dt>Length</dt><dd>{active.years ? `${active.years} years` : "Shared courses"}</dd></div>
              <div><dt>Campus</dt><dd>Kombolcha</dd></div>
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
              <Link to="/scholarships" className={styles.btnGold}>See scholarships</Link>
              <Link
                to={{ hash: "#map" }}
                className={styles.btnOutline}
                onClick={() => setActive(null)}
              >
                Get directions
              </Link>
            </div>
            <p className={styles.panelNote}>Contact the department head at KIoT for the latest curriculum.</p>
          </aside>
        </div>
      )}
    </div>
  );
}