import { useState, useMemo, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Tita.module.css";

/* Optional: put your photo in public/images/tita-hero.jpg and set the path here.
   If this is empty or fails to load, the hero uses a navy gradient. */
const HERO_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAvvo84cds-Y0sTyPJTEJkTPbVONUM9DjaX616zWaN2chYvlE0JiPFah2c&s=10";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Dessie Campus", to: "/dessie" },
  { label: "Departments", to: { pathname: "/tita", hash: "#departments" } },
  { label: "Scholarships", to: "/scholarships" },
  { label: "Map", to: { pathname: "/tita", hash: "#map" } },
];

/* ---------- Fields (groups inside the College of Medicine and Health Sciences) ---------- */
const FIELDS = [
  { id: "clinical", name: "Medicine and Anesthesia", hue: "#c2410c", blurb: "Diagnosis, surgery and safe patient care" },
  { id: "nursing", name: "Nursing and Midwifery", hue: "#0f9d8a", blurb: "Hands-on care for patients, mothers and children" },
  { id: "lab", name: "Laboratory and Pharmacy", hue: "#8b3fb8", blurb: "Tests, medicines and the science behind treatment" },
  { id: "public", name: "Public and Environmental Health", hue: "#2f7d4f", blurb: "Keeping whole communities healthy and safe" },
];

/* ---------- Departments (programs of the College of Medicine and Health Sciences) ---------- */
const DEPARTMENTS = [
  {
    id: "med", field: "clinical", name: "Medicine", degree: "MD", years: 6,
    about: "Train as a doctor in a teaching hospital, from basic science to clinical practice.",
    courses: ["Human Anatomy", "Physiology", "Internal Medicine", "Surgery", "Pediatrics", "Obstetrics and Gynecology"],
    careers: ["General practitioner", "Specialist (after residency)", "Medical researcher"]
  },
  {
    id: "anes", field: "clinical", name: "Anesthesia", degree: "BSc", years: 4.5,
    about: "Learn to keep patients safe and pain-free before, during and after surgery.",
    courses: ["Pharmacology", "Airway Management", "Regional Anesthesia", "Critical Care"],
    careers: ["Anesthetist", "Operating room specialist", "Intensive care team member"]
  },

  {
    id: "nurs", field: "nursing", name: "Comprehensive Nursing", degree: "BSc", years: 4,
    about: "Build broad nursing skills for wards, clinics and communities.",
    courses: ["Fundamentals of Nursing", "Adult Health Nursing", "Community Health Nursing", "Nursing Leadership"],
    careers: ["Staff nurse", "Ward supervisor", "Nurse educator"]
  },
  {
    id: "ecc", field: "nursing", name: "Emergency and Critical Care Nursing", degree: "BSc", years: 4,
    about: "Care for patients with life-threatening conditions in emergency rooms and intensive care units.",
    courses: ["Emergency Nursing", "Critical Care Nursing", "Trauma Care", "Life Support"],
    careers: ["Emergency nurse", "ICU nurse", "Trauma team member"]
  },
  {
    id: "surg", field: "nursing", name: "Surgical Nursing", degree: "BSc", years: 4,
    about: "Prepare, assist and care for patients before, during and after operations.",
    courses: ["Perioperative Nursing", "Wound Care", "Surgical Conditions", "Infection Prevention"],
    careers: ["Operating room nurse", "Surgical ward nurse", "Sterilization lead"]
  },
  {
    id: "psy", field: "nursing", name: "Psychiatry Nursing", degree: "BSc", years: 4,
    about: "Support people living with mental illness through care, counseling and follow-up.",
    courses: ["Mental Health Nursing", "Psychopharmacology", "Counseling Skills", "Community Mental Health"],
    careers: ["Psychiatric nurse", "Mental health officer", "Rehabilitation worker"]
  },
  {
    id: "ped", field: "nursing", name: "Pediatrics and Child Health Nursing", degree: "BSc", years: 4,
    about: "Specialize in the health of newborns, children and adolescents.",
    courses: ["Child Growth and Development", "Neonatal Care", "Childhood Illnesses", "Child Nutrition"],
    careers: ["Pediatric nurse", "Neonatal unit nurse", "Child health program officer"]
  },
  {
    id: "mid", field: "nursing", name: "Midwifery", degree: "BSc", years: 4,
    about: "Guide women safely through pregnancy, birth and the weeks after.",
    courses: ["Antenatal Care", "Labor and Delivery", "Newborn Care", "Family Planning"],
    careers: ["Midwife", "Maternity ward lead", "Maternal health officer"]
  },

  {
    id: "mls", field: "lab", name: "Medical Laboratory Sciences", degree: "BSc", years: 4,
    about: "Run the tests that help doctors find and confirm disease.",
    courses: ["Clinical Chemistry", "Hematology", "Medical Microbiology", "Parasitology"],
    careers: ["Medical laboratory scientist", "Blood bank officer", "Diagnostic researcher"]
  },
  {
    id: "pharm", field: "lab", name: "Pharmacy", degree: "BPharm", years: 5,
    about: "Learn how medicines are made, checked, supplied and used safely.",
    courses: ["Pharmaceutics", "Pharmacology", "Pharmaceutical Chemistry", "Clinical Pharmacy"],
    careers: ["Hospital pharmacist", "Drug supply manager", "Drug quality inspector"]
  },

  {
    id: "ph", field: "public", name: "Public Health", degree: "BSc", years: 4,
    about: "Prevent disease and improve health for whole communities and regions.",
    courses: ["Epidemiology", "Health Promotion", "Biostatistics", "Health Program Management"],
    careers: ["Public health officer", "Program coordinator", "Health researcher"]
  },
  {
    id: "ehs", field: "public", name: "Environmental Health Science", degree: "BSc", years: 4,
    about: "Make water, food, housing and waste safe so people stay well.",
    courses: ["Water Supply and Sanitation", "Food Hygiene", "Solid Waste Management", "Vector Control"],
    careers: ["Environmental health officer", "Sanitation specialist", "Food safety inspector"]
  },
  {
    id: "ohs", field: "public", name: "Occupational Health and Safety", degree: "BSc", years: 4,
    about: "Protect workers from injury and illness in factories, farms and offices.",
    courses: ["Industrial Hygiene", "Workplace Safety", "Ergonomics", "Occupational Diseases"],
    careers: ["Safety officer", "Workplace health inspector", "Risk assessor"]
  },
  {
    id: "hi", field: "public", name: "Health Informatics", degree: "BSc", years: 4,
    about: "Manage health records and data so hospitals can plan and decide better.",
    courses: ["Health Information Systems", "Database Management", "Health Data Analysis", "Medical Coding"],
    careers: ["Health informatics officer", "Records manager", "Health data analyst"]
  },
];

/* ---------- Map and directions ---------- */
const DESTINATION = "Wollo Tertiary Care and Teaching Hospital, Tita, Dessie, Ethiopia";

const ORIGINS = [
  { id: "main", label: "Wollo University main campus", value: "Wollo University, Dessie, Ethiopia", note: "Dessie Campus" },
  { id: "town", label: "Dessie town center", value: "Dessie, Ethiopia", note: "In town" },
  { id: "kombolcha", label: "Kombolcha (KIoT)", value: "Kombolcha Institute of Technology, Kombolcha, Ethiopia", note: "Kombolcha campus" },
  { id: "airport", label: "Kombolcha Airport", value: "Kombolcha Airport, Ethiopia", note: "Nearest airport" },
  { id: "addis", label: "Addis Ababa", value: "Addis Ababa, Ethiopia", note: "About 400 km away" },
];

const MODES = [
  { id: "d", api: "driving", label: "Drive" },
  { id: "r", api: "transit", label: "Transit" },
  { id: "w", api: "walking", label: "Walk" },
  { id: "b", api: "bicycling", label: "Cycle" },
];

const WHY = [
  { title: "Teaching hospital", text: "Learn at Wollo Tertiary Care and Teaching Hospital, right where patients are treated." },
  { title: "Health-only campus", text: "The College of Medicine and Health Sciences has its own campus, set up for clinical training." },
  { title: "Growing since 2007", text: "From four programs at the start to 16 undergraduate and 10 postgraduate programs today." },
  { title: "Care for the region", text: "Students and staff serve patients and communities across South Wollo." },
];

const enc = encodeURIComponent;

export default function Tita() {
  const [field, setField] = useState("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const [originId, setOriginId] = useState("main");
  const [myLocation, setMyLocation] = useState(null);
  const [mode, setMode] = useState("d");
  const [routeOn, setRouteOn] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [heroOk, setHeroOk] = useState(Boolean(HERO_IMAGE));

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
    : ORIGINS.find((o) => o.id === originId) || ORIGINS[0];

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

  const activeField = active ? fieldById[active.field] || FIELDS[0] : null;

  return (
    <div className={styles.page}>

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
          <p className={styles.kicker}>Tertiary Care Campus · College of Medicine and Health Sciences</p>
          <h1>Train to care for people at our teaching hospital campus.</h1>
          <p className={styles.lead}>
            Explore {DEPARTMENTS.length} health programs across {FIELDS.length} fields,
            from medicine and nursing to pharmacy and public health, then get directions to Tita.
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
        <div><strong>{DEPARTMENTS.length}</strong><span>Programs listed</span></div>
        <div><strong>{FIELDS.length}</strong><span>Fields of study</span></div>
        <div><strong>10</strong><span>Postgraduate programs</span></div>
        <div><strong>2007</strong><span>College established</span></div>
      </section>

      {/* ---------- Why ---------- */}
      <section className={styles.why}>
        <h2>Why study at Tita</h2>
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
                    {d.degree} · {d.years} years
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
          <h2>Find us in Tita, Dessie</h2>
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
              <button className={styles.btnGold} onClick={() => setRouteOn(true)}>
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
                <strong>Tita Campus</strong>.
              </p>
            )}
          </div>

          <div className={styles.mapFrame}>
            <iframe
              key={embedSrc}
              title="Map and directions to Wollo University Tita Campus"
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
        <div className={styles.overlay} onClick={() => setActive(null)}>
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
              <div><dt>Length</dt><dd>{active.years} years</dd></div>
              <div><dt>Campus</dt><dd>Tita</dd></div>
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
              Contact the College of Medicine and Health Sciences office for the latest curriculum.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}