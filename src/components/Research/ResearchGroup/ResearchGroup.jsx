import { useState, useEffect, useRef } from "react";
import styles from "./ResearchGroup.module.css";

/* Optional: put a photo in public/images/research-hero.jpg and set the path here.
   If empty, the hero shows a contour-map illustration of the Wollo highlands. */
const HERO_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQzElvWJJRbQaxLcfVEmmg0Dlbu3UscjzXSVFxs0E0BJ4NfbWkaYaO6-eO&s=10";

const RESEARCH_OFFICE_URL = "https://wu.edu.et/?p=177";
const NEWS_URL = "https://wu.edu.et/author/admin/page/7";

/* ---------- Tiny icon set ---------- */
const ICONS = {
  onehealth: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  water: <path d="M12 2.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.3 6-10.5 6-10.5z" />,
  culture: <><path d="M9 18V5l11-2v13" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="17.5" cy="16" r="2.5" /></>,
  health: <path d="M3 12h4l2-5 4 10 2-5h6" />,
  tech: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>,
  agri: <><path d="M5 19c0-8 5-13 14-14 0 9-5 14-14 14z" /><path d="M5 19l8-8" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  pin: <><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.2.7 3.5 2.7 3.5 5.5" /></>,
  flask: <><path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3" /><path d="M7.5 15h9" /></>,
  close: <path d="M6 6l12 12M18 6L6 18" />,
};

function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* ---------- Research groups (real institutes and colleges of Wollo University) ---------- */
const GROUPS = [
  {
    id: "onehealth", icon: "onehealth", tone: "mint", campus: "Dessie",
    name: "Ethiopian One Health Research and Training Institute",
    short: "EOHRTI",
    blurb: "Links human, animal, plant and environmental health in one research and postgraduate training institute.",
    about:
      "EOHRTI is a newly established institute at Wollo University. It sits close to the Afar pastoral region, where people live closely with animals, water and grazing land, which raises the risk of foodborne and zoonotic disease. The institute is funded by the university and works on research and postgraduate training.",
    themes: [
      "Ecosystem conservation and biodiversity loss",
      "Drug discovery",
      "Social health, policy and food security",
      "Agricultural productivity",
      "Water safety and security",
    ],
    facts: [["Focus", "One Health"], ["Based in", "Dessie"], ["Funding", "Wollo University"]],
    href: "https://wu.edu.et/?p=423",
  },
  {
    id: "abay", icon: "water", tone: "blue", campus: "Dessie",
    name: "Abay-Awash Basins Research Institute",
    short: "AABRI",
    blurb: "Studies the Abay and Awash river basins and works to improve livelihoods in the Wollo sub-basins.",
    about:
      "AABRI was set up by a Wollo University senate decision in 2012 E.C. It examines how knowledge about the Abay River is produced, builds new discussion on the Abay-Awash basins, and works with partners to protect and use natural resources well.",
    themes: [
      "Water and environmental issues taught at school level",
      "Restoration and protection of natural resources",
      "Research, community service and consultancy",
      "National and international conferences and symposiums",
    ],
    facts: [["Focus", "River basins"], ["Based in", "Dessie"], ["Founded", "2012 E.C."]],
    href: "https://wu.edu.et/?p=405",
  },
  {
    id: "culture", icon: "culture", tone: "purple", campus: "Dessie",
    name: "Institute of Culture, Art and Indigenous Knowledge",
    short: "Culture and Art",
    blurb: "Finds, documents and promotes the heritage of Wollo, including the Tezeta, Bati and Ambasel musical modes.",
    about:
      "Founded in 2015, the institute collects and preserves culture and heritage and runs research and training on art, indigenous knowledge and archives. It studies the three qegnit modes of Tezeta, Bati and Ambasel, and uses music and theater to share the culture and tourism potential of the area. It also houses an archival center.",
    themes: [
      "Indigenous knowledge and social development",
      "Performing arts",
      "Cultural heritage management",
      "Folk culture",
      "Traditional medicine",
    ],
    facts: [["Focus", "Heritage"], ["Based in", "Dessie"], ["Founded", "2015"]],
    href: "https://wu.edu.et/?p=617",
  },
  {
    id: "health", icon: "health", tone: "coral", campus: "Tita",
    name: "College of Medicine and Health Sciences",
    short: "Health Sciences",
    blurb: "Clinical and public health research at the Tertiary Care Campus and Wollo Tertiary Care and Teaching Hospital.",
    about:
      "The college began in 2007 with four programs and now runs 16 undergraduate and 10 postgraduate programs. Staff and students do research in medicine, nursing, midwifery, pharmacy, laboratory science and public health. The college hosted its first International Health Research Conference at the Tertiary Care Campus.",
    themes: [
      "Public health and epidemiology",
      "Maternal and child health",
      "Environmental health",
      "Nursing and clinical care",
      "Research methods and scientific writing",
    ],
    facts: [["Programs", "16 UG, 10 PG"], ["Based in", "Tita"], ["Started", "2007"]],
    href: "https://wu.edu.et/?p=869",
  },
  {
    id: "tech", icon: "tech", tone: "amber", campus: "Kombolcha",
    name: "Kombolcha Institute of Technology",
    short: "Science and Technology",
    blurb: "Engineering, informatics and textile research, with its own annual research conference.",
    about:
      "KIoT is Wollo University's technology campus. It includes the College of Engineering and Technology, the College of Informatics and the School of Textile and Fashion Design, and it hosts the 7th Annual Research Conference of Wollo University.",
    themes: [
      "Engineering and technology",
      "Informatics and software",
      "Textile and fashion design",
      "Technology transfer to industry",
    ],
    facts: [["Focus", "Technology"], ["Based in", "Kombolcha"], ["Role", "Center of excellence"]],
    href: "https://wu.edu.et/author/admin/page/7",
  },
  {
    id: "agri", icon: "agri", tone: "aqua", campus: "Dessie",
    name: "College of Agriculture and School of Veterinary Medicine",
    short: "Agriculture",
    blurb: "Crops, livestock, forests and value chains that support farming families across South Wollo.",
    about:
      "The College of Agriculture and the School of Veterinary Medicine work on problems that matter to farmers in the region. Departments include Agricultural Economics, Agri-business and Value Chain Management, Animal Science and Forestry.",
    themes: [
      "Agricultural economics",
      "Agri-business and value chains",
      "Animal science and veterinary care",
      "Forestry and natural resources",
    ],
    facts: [["Focus", "Agriculture"], ["Based in", "Dessie"], ["Extension", "Community service"]],
    href: "https://wu.edu.et/about-us/",
  },
];

const CAMPUS_FILTERS = ["All", "Dessie", "Kombolcha", "Tita"];

const THEMATIC_AREAS = [
  "Agriculture",
  "Science and Technology",
  "Health",
  "Education",
  "Business and Economics",
  "Culture and Art",
  "Indigenous Knowledge",
];

const HOW = [
  { icon: "book", title: "Research in every course", text: "Teaching staff spend 40% of their time on research, so students learn alongside active researchers." },
  { icon: "flask", title: "Dedicated researchers", text: "Research staff give 60% of their time to research." },
  { icon: "users", title: "Shared with the community", text: "Academic staff must set aside part of their time for community service." },
];

const STORIES = [
  {
    tag: "Health", tone: "coral", title: "First International Health Research Conference",
    text: "Hosted at the Tertiary Care Campus under the theme “Global Health Threats and Resilience through Collaborative Research and Innovative Solutions.”",
    href: "https://wu.edu.et/?p=2868",
  },
  {
    tag: "Training", tone: "mint", title: "Grant hunting and scientific writing",
    text: "A training for College of Medicine and Health Sciences staff to strengthen proposals, funding and publishing.",
    href: "https://wu.edu.et/?p=2270",
  },
  {
    tag: "Postgraduate", tone: "blue", title: "Two-week research methods workshop",
    text: "About 30 postgraduate students from nursing, midwifery and environmental health trained together in February 2024.",
    href: "https://wu.edu.et/?p=1438",
  },
  {
    tag: "Technology", tone: "amber", title: "7th Annual Research Conference at KIoT",
    text: "Kombolcha Institute of Technology hosted the university's annual research conference.",
    href: NEWS_URL,
  },
  {
    tag: "Natural Sciences", tone: "purple", title: "Biology reviews its curriculum for a PhD",
    text: "The Department of Biology reviewed its curriculum to launch a PhD program, in line with Wollo's applied-science mission.",
    href: NEWS_URL,
  },
];

const GOALS = [
  "Solve priority problems for the community and the region",
  "Make research part of teaching through group projects",
  "Fund research and publishing from internal sources",
  "Reward the best researchers",
  "Work with local and international partners",
  "Share results through conferences and workshops",
];

/* ====================== New sections (stats, people, journey, FAQ) ====================== */
/* Drop real photos in public/images/ and put the path here to replace an illustration.
   Keys match the scene ids below. Example: { lab: "/images/eohrti-lab.jpg" } */
const PHOTOS = {};

/* ---------- Stats (counts up once when scrolled into view) ---------- */
const STATS = [
  { n: 2005, label: "Year Wollo University was founded", plain: true },
  { n: 3, label: "Campuses: Dessie, Kombolcha, Tita" },
  { n: 6, label: "Research institutes and colleges featured here" },
  { n: 40, suffix: "%", label: "Of teaching staff time set aside for research" },
];

function Count({ to, suffix = "", plain }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) { setV(to); return undefined; }
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 1100, 1);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{plain ? v : v.toLocaleString()}{suffix}</span>;
}

function Stats() {
  return (
    <section className={styles.stats} aria-label="Wollo University research at a glance">
      {STATS.map((s) => (
        <div key={s.label}>
          <strong><Count to={s.n} suffix={s.suffix} plain={s.plain} /></strong>
          <span>{s.label}</span>
        </div>
      ))}
    </section>
  );
}

/* ---------- Illustrated people ---------- */
function Person({ x, y = 0, skin, hair, cloth, style = "short", scale = 1, coat }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-62 150 C-62 100 -34 82 0 82 C34 82 62 100 62 150Z" fill={cloth} />
      {coat && <path d="M-62 150 C-62 100 -34 82 0 82 L0 150Z" fill={coat} opacity=".55" />}
      <rect x="-9" y="66" width="18" height="22" rx="8" fill={skin} />
      {style === "long" && <path d="M-34 40 C-40 90 -34 100 -22 104 L22 104 C34 100 40 90 34 40Z" fill={hair} />}
      <ellipse cx="0" cy="42" rx="27" ry="31" fill={skin} />
      {style === "short" && <path d="M-28 38 C-30 8 30 8 28 38 C20 24 -20 24 -28 38Z" fill={hair} />}
      {style === "long" && <path d="M-29 40 C-34 6 34 6 29 40 C22 22 -20 20 -29 40Z" fill={hair} />}
      {style === "scarf" && <path d="M-31 36 C-34 4 34 4 31 36 C34 66 20 76 0 76 C-20 76 -34 66 -31 36Z" fill={hair} />}
      {style === "scarf" && <ellipse cx="0" cy="44" rx="19" ry="23" fill={skin} />}
      <circle cx="-9" cy="44" r="2.4" fill="#12302a" /><circle cx="9" cy="44" r="2.4" fill="#12302a" />
      <path d="M-8 56 Q0 63 8 56" stroke="#12302a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </g>
  );
}

const SKIN = ["#8a5a3c", "#6e4430", "#a8704a", "#5a3626"];
const SCENES = [
  { id: "lab", title: "One Health laboratory", sub: "EOHRTI, Dessie", bg: ["#d8f0e4", "#8fc9b4"], extra: "flask",
    people: [[110, SKIN[0], "#1c1c1c", "short", "#ffffff", "#d4eadf"], [250, SKIN[2], "#2a1a12", "long", "#ffffff", "#d4eadf"]] },
  { id: "field", title: "Basin field work", sub: "Abay-Awash Basins, South Wollo", bg: ["#fdeccb", "#9bc9a8"], extra: "hills",
    people: [[120, SKIN[1], "#1c1c1c", "short", "#c8452f"], [260, SKIN[0], "#241812", "short", "#2870b8"]] },
  { id: "grads", title: "Postgraduate research methods", sub: "Nursing, midwifery, environmental health", bg: ["#dfeefb", "#a9c9ee"], extra: "board",
    people: [[80, SKIN[2], "#1c1c1c", "long", "#6c4bc2"], [190, SKIN[0], "#1c1c1c", "short", "#0d3b2e"], [300, SKIN[3], "#3a2418", "scarf", "#14604a"]] },
  { id: "culture", title: "Tezeta, Bati and Ambasel", sub: "Institute of Culture and Art, Dessie", bg: ["#ece6fb", "#c3b2ee"], extra: "music",
    people: [[130, SKIN[1], "#1c1c1c", "short", "#f2c14e"], [260, SKIN[2], "#2a1a12", "scarf", "#c8452f"]] },
  { id: "tech", title: "Engineering and informatics", sub: "Kombolcha Institute of Technology", bg: ["#d6f2f1", "#7fc7c9"], extra: "chip",
    people: [[120, SKIN[0], "#1c1c1c", "short", "#0d3b2e"], [260, SKIN[3], "#241812", "long", "#a56a05"]] },
  { id: "clinic", title: "Clinical and public health", sub: "Tertiary Care Campus, Tita", bg: ["#fde1dc", "#f0a99c"], extra: "cross",
    people: [[110, SKIN[2], "#1c1c1c", "short", "#ffffff", "#2f9a78"], [250, SKIN[1], "#2a1a12", "scarf", "#ffffff", "#2f9a78"]] },
];

function Extra({ kind }) {
  const c = "#12302a";
  if (kind === "flask") return <g fill="none" stroke={c} strokeWidth="3" opacity=".35"><path d="M300 30h30M308 30v34l-22 40a8 8 0 0 0 7 12h46a8 8 0 0 0 7-12l-22-40V30" /></g>;
  if (kind === "hills") return <g opacity=".5"><path d="M0 150L70 90 130 130 210 70 300 140 360 100V170H0Z" fill="#2f7d63" /><circle cx="310" cy="40" r="20" fill="#fff6dc" /></g>;
  if (kind === "board") return <g opacity=".35"><rect x="20" y="22" width="110" height="60" rx="6" fill="none" stroke={c} strokeWidth="3" /><path d="M34 44h60M34 60h80" stroke={c} strokeWidth="3" /></g>;
  if (kind === "music") return <g fill="none" stroke={c} strokeWidth="3" opacity=".35"><path d="M300 90V30l34-8v60" /><circle cx="290" cy="92" r="10" fill={c} /><circle cx="324" cy="84" r="10" fill={c} /></g>;
  if (kind === "chip") return <g fill="none" stroke={c} strokeWidth="3" opacity=".35"><rect x="300" y="28" width="44" height="44" rx="6" /><path d="M312 16v12M332 16v12M312 72v12M332 72v12M288 40h12M288 60h12M344 40h12M344 60h12" /></g>;
  return <g fill={c} opacity=".28"><rect x="310" y="26" width="16" height="52" rx="3" /><rect x="292" y="44" width="52" height="16" rx="3" /></g>;
}

function Scene({ s, big }) {
  const photo = PHOTOS[s.id];
  return (
    <figure className={`${styles.scene} ${big ? styles.sceneBig : ""}`}>
      {photo ? (
        <img src={photo} alt={s.title} loading="lazy" />
      ) : (
        <svg viewBox="0 0 380 240" preserveAspectRatio="xMidYMax slice" role="img" aria-label={`${s.title}: illustration of Wollo University students and researchers`}>
          <defs>
            <linearGradient id={`g-${s.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={s.bg[0]} /><stop offset="1" stopColor={s.bg[1]} />
            </linearGradient>
          </defs>
          <rect width="380" height="240" fill={`url(#g-${s.id})`} />
          <Extra kind={s.extra} />
          {s.people.map(([x, skin, hair, style, cloth, coat], i) => (
            <Person key={i} x={x} y={92} skin={skin} hair={hair} style={style} cloth={cloth} coat={coat} scale={1.05} />
          ))}
        </svg>
      )}
      <figcaption><strong>{s.title}</strong><span>{s.sub}</span></figcaption>
    </figure>
  );
}

function Faces() {
  return (
    <section className={styles.faces} aria-labelledby="faces-title">
      <div className={styles.facesHead}>
        <h2 id="faces-title">The people behind the research</h2>
        <p>Students, lab teams, field researchers and artists across Dessie, Kombolcha and Tita.</p>
      </div>
      <div className={styles.mosaic}>
        {SCENES.map((s, i) => <Scene key={s.id} s={s} big={i === 2} />)}
      </div>
    </section>
  );
}

/* ---------- How to partner (a real sequence) ---------- */
const STEPS = [
  ["Reach the research office", "Send a short note on your topic, your organization and what you hope to learn."],
  ["Meet the right group", "The office points you to the institute or college that works on your question."],
  ["Agree the plan", "Set the question, timeline, ethics approval and who does what."],
  ["Work in the field and lab", "Staff and students carry out the study with your team."],
  ["Share what we find", "Results go back to the community and out through conferences and workshops."],
];

function Journey() {
  return (
    <section className={styles.journey} aria-labelledby="journey-title">
      <h2 id="journey-title">How a partnership works</h2>
      <ol>
        {STEPS.map(([t, d], i) => (
          <li key={t}><span>{i + 1}</span><strong>{t}</strong><p>{d}</p></li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- FAQ ---------- */
const FAQ = [
  ["Who can work with Wollo University researchers?", "Universities, hospitals, NGOs, government offices and companies can all propose projects in research, training or community service."],
  ["Which campus should I contact?", "Most institutes are in Dessie. Technology work is at Kombolcha Institute of Technology and health research is at the Tertiary Care Campus in Tita."],
  ["Can students take part in research?", "Yes. Research is built into courses through group projects, and postgraduate students train in methods, writing and fieldwork."],
  ["How do I find a specific institute?", "Use the campus filter above, open a group card, then follow the link to its page on wu.edu.et."],
];

function Faq() {
  return (
    <section className={styles.faq} aria-labelledby="faq-title">
      <h2 id="faq-title">Questions we hear often</h2>
      <div>
        {FAQ.map(([q, a]) => (
          <details key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </div>
    </section>
  );
}

export default function ResearchGroup() {
  const [campus, setCampus] = useState("All");
  const [active, setActive] = useState(null);

  const visible = GROUPS.filter((g) => campus === "All" || g.campus === campus);

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

  return (
    <main className={styles.page}>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Research and technology transfer</p>
          <h1>
            Research rooted in Wollo.
            <br />
            Useful across Ethiopia.
          </h1>
          <p className={styles.lead}>
            Wollo University’s research groups study health, water, farming, technology
            and culture, and take what they learn back to the communities of South Wollo.
          </p>

          <div className={styles.heroActions}>
            <a href="#groups" className={styles.btnDark}>
              Explore research groups <Icon name="arrow" size={16} />
            </a>
            <a href="#stories" className={styles.btnLight}>See research in action</a>
          </div>

          <div className={styles.campusRow}>
            <span className={styles.campusLabel}>Three campuses</span>
            <ul>
              <li>Dessie</li>
              <li>Kombolcha</li>
              <li>Tita</li>
            </ul>
          </div>
        </div>

        <div className={styles.heroArt}>
          {HERO_IMAGE ? (
            <img src={HERO_IMAGE} alt="" />
          ) : (
            <svg viewBox="0 0 600 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="600" height="520" fill="#0d3b2e" />
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <path
                  key={i}
                  d={`M${-40 + i * 6} ${300 - i * 22} C ${120 + i * 14} ${170 - i * 16}, ${260 - i * 8} ${400 - i * 30}, ${380 + i * 8} ${260 - i * 14} S ${560 - i * 6} ${150 + i * 10}, 660 ${210 - i * 6}`}
                  fill="none" stroke="#7fd1b0" strokeOpacity={0.14 + i * 0.05} strokeWidth="1.4"
                />
              ))}
              <circle cx="330" cy="250" r="9" fill="#f2c14e" />
              <circle cx="330" cy="250" r="22" fill="none" stroke="#f2c14e" strokeOpacity=".5" />
              <circle cx="330" cy="250" r="40" fill="none" stroke="#f2c14e" strokeOpacity=".22" />
            </svg>
          )}

          <span className={styles.script}>
            Rooted in Wollo,
            <br />
            working for Ethiopia
          </span>

          <div className={`${styles.floatCard} ${styles.floatA}`}>
            <Icon name="pin" size={18} />
            <div>
              <strong>2,470–2,550 m</strong>
              <span>Highland campus in Dessie</span>
            </div>
          </div>
          <div className={`${styles.floatCard} ${styles.floatB}`}>
            <Icon name="flask" size={18} />
            <div>
              <strong>3 centers of excellence</strong>
              <span>Health, technology, art and culture</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Stats band ---------- */}
      <Stats />

      {/* ---------- Research groups ---------- */}
      <section id="groups" className={styles.groups}>
        <div className={styles.groupsIntro}>
          <p className={styles.eyebrow}>Research groups</p>
          <h2>Institutes and colleges that lead our research</h2>
          <p>
            Choose a campus to see who works where. Select a group to read what it studies.
          </p>

          <div className={styles.filters} role="tablist" aria-label="Filter by campus">
            {CAMPUS_FILTERS.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={campus === c}
                className={campus === c ? styles.filterOn : styles.filter}
                onClick={() => setCampus(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <a href={RESEARCH_OFFICE_URL} target="_blank" rel="noreferrer" className={styles.btnDark}>
            Visit the research office <Icon name="arrow" size={16} />
          </a>
        </div>

        <div className={styles.cards}>
          {visible.map((g) => (
            <button key={g.id} className={styles.card} onClick={() => setActive(g)}>
              <span className={`${styles.bubble} ${styles[g.tone]}`}>
                <Icon name={g.icon} />
              </span>
              <strong>{g.short}</strong>
              <span className={styles.cardBlurb}>{g.blurb}</span>
              <span className={styles.cardFoot}>
                <span>{g.campus}</span>
                <Icon name="arrow" size={16} />
              </span>
            </button>
          ))}
          {visible.length === 0 && (
            <p className={styles.empty}>No research groups listed for this campus yet.</p>
          )}
        </div>
      </section>

      {/* ---------- Thematic areas ---------- */}
      <section className={styles.themes} aria-label="University research thematic areas">
        <p>University-wide thematic areas</p>
        <ul>
          {THEMATIC_AREAS.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </section>

      {/* ---------- About band ---------- */}
      <section className={styles.about}>
        <div className={styles.aboutVisual}>
          <svg viewBox="0 0 520 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f6d9a8" />
                <stop offset="1" stopColor="#8fc9b4" />
              </linearGradient>
            </defs>
            <rect width="520" height="380" fill="url(#sky)" />
            <path d="M0 270 L90 190 L170 250 L270 140 L370 240 L450 180 L520 230 V380 H0Z" fill="#2f7d63" />
            <path d="M0 320 L110 250 L210 305 L320 220 L430 300 L520 260 V380 H0Z" fill="#0d3b2e" />
            <circle cx="400" cy="90" r="34" fill="#fff6dc" opacity=".9" />
          </svg>
          <div className={styles.badge}>
            <strong>14</strong>
            <span>colleges, institutes and schools across 3 campuses</span>
          </div>
        </div>

        <div className={styles.aboutText}>
          <p className={styles.eyebrow}>About our research</p>
          <h2>We research with the community, not just about it.</h2>
          <p>
            Wollo University is an applied-sciences university in Dessie, founded in 2005.
            Its research aims to solve community problems and support the social, economic
            and cultural growth of the region and the country.
          </p>

          <ul className={styles.how}>
            {HOW.map((h) => (
              <li key={h.title}>
                <span className={styles.miniBubble}><Icon name={h.icon} size={18} /></span>
                <div>
                  <strong>{h.title}</strong>
                  <span>{h.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Stories ---------- */}
      <section id="stories" className={styles.stories}>
        <div className={styles.storiesIntro}>
          <p className={styles.eyebrow}>Research in action</p>
          <h2>Conferences, trainings and new programs</h2>
          <p>Recent work from the Wollo University research community.</p>
          <a href={NEWS_URL} target="_blank" rel="noreferrer" className={styles.textLink}>
            Read more news <Icon name="arrow" size={15} />
          </a>
        </div>

        <div className={styles.storyGrid}>
          {STORIES.map((s) => (
            <a key={s.title} href={s.href} target="_blank" rel="noreferrer" className={styles.story}>
              <span className={`${styles.tag} ${styles[s.tone]}`}>{s.tag}</span>
              <strong>{s.title}</strong>
              <span>{s.text}</span>
              <span className={styles.storyMore}>Read more <Icon name="arrow" size={14} /></span>
            </a>
          ))}
        </div>
      </section>

      {/* ---------- Goals ---------- */}
      <section className={styles.goals}>
        <h2>What our research office works toward</h2>
        <ul>
          {GOALS.map((g) => (
            <li key={g}>
              <span className={styles.tick}><Icon name="check" size={16} /></span>
              {g}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- People, partnership steps, FAQ ---------- */}
      <Faces />
      <Journey />
      <Faq />

      {/* ---------- CTA ---------- */}
      <section className={styles.cta}>
        <div>
          <h2>Ready to research with Wollo University?</h2>
          <p>
            Universities, hospitals, NGOs and companies are welcome to partner on research,
            training and community projects.
          </p>
        </div>
        <a href={RESEARCH_OFFICE_URL} target="_blank" rel="noreferrer" className={styles.btnWhite}>
          Get in touch <Icon name="arrow" size={16} />
        </a>
      </section>

      {/* ---------- Detail panel ---------- */}
      {active && (
        <div className={styles.overlay} onClick={() => setActive(null)}>
          <aside
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="group-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.close} onClick={() => setActive(null)} aria-label="Close details">
              <Icon name="close" size={20} />
            </button>

            <span className={`${styles.bubble} ${styles[active.tone]}`}>
              <Icon name={active.icon} />
            </span>
            <h2 id="group-title">{active.name}</h2>
            <p className={styles.panelAbout}>{active.about}</p>

            <dl className={styles.panelFacts}>
              {active.facts.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>

            <h3>What this group studies</h3>
            <ul className={styles.panelList}>
              {active.themes.map((t) => (
                <li key={t}><span className={styles.tick}><Icon name="check" size={14} /></span>{t}</li>
              ))}
            </ul>

            <div className={styles.panelActions}>
              <a href={active.href} target="_blank" rel="noreferrer" className={styles.btnDark}>
                Open on wu.edu.et <Icon name="arrow" size={16} />
              </a>
              <button className={styles.btnLight} onClick={() => setActive(null)}>Close</button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}