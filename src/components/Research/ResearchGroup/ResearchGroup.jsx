import { useState, useEffect, useRef } from "react";
import styles from "./ResearchGroup.module.css";

/* ---------- Images ----------
   Put your photos in public/images/ and use the paths below.
   Every picture on the page is a real image file (no SVG or CSS drawings). */
const HERO_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQzElvWJJRbQaxLcfVEmmg0Dlbu3UscjzXSVFxs0E0BJ4NfbWkaYaO6-eO&s=10";

/* "About our research" picture (left side of the green band) */
const ABOUT_IMAGE = "https://i.pinimg.com/1200x/34/9a/f2/349af23efa5223d1c9c51ea0f4cfb705.jpg";
const ABOUT_ALT = "Wollo University campus in the highlands of Dessie";

/* "The people behind the research" pictures, one per tile */
const PHOTOS = {
  lab: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTST91ZvXIrnjBQ3Twbx8GfbFmGaiwVH0-XCNIljhZgCKp0pVF2Do3z_c&s=10",
  field: "https://wu.edu.et/wp-content/uploads/2025/06/505501757_1129125229258911_4963964905524207028_n.jpg",
  grads: "https://wu.edu.et/kiot/wp-content/uploads/slider/cache/906dc666f0ef065310e1e12775a526bc/314371399_3341247012784421_4376461732623549299_n-min.jpg",
  culture: "https://www.aum.edu.kw/azure/files/ContentPhotos/Photos/Cover_052014..JPG?w=780&h=520&scale=both&mode=crop",
  tech: "https://static.wixstatic.com/media/118341_b124faf4e2b8400a8ebfca993a20ad44~mv2.jpg/v1/fill/w_1280,h_853,al_c,q_85,enc_auto/118341_b124faf4e2b8400a8ebfca993a20ad44~mv2.jpg",
  clinic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv6a-VvKUM790gzPuEEzhn4oiCpZpg1zxu1QqtEpQXBRjqUnvmOm4Buew&s=10",
};

const RESEARCH_OFFICE_URL = "/contact";
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

/* ---------- People photos ---------- */
const SCENES = [
  { id: "lab", title: "One Health laboratory", sub: "EOHRTI, Dessie", alt: "Researchers working in the One Health laboratory in Dessie" },
  { id: "field", title: "Basin field work", sub: "Abay-Awash Basins, South Wollo", alt: "Field researchers working in the Abay-Awash basins of South Wollo" },
  { id: "grads", title: "Postgraduate research methods", sub: "Nursing, midwifery, environmental health", alt: "Postgraduate students in a research methods workshop" },
  { id: "culture", title: "Tezeta, Bati and Ambasel", sub: "Institute of Culture and Art, Dessie", alt: "Artists performing at the Institute of Culture and Art in Dessie" },
  { id: "tech", title: "Engineering and informatics", sub: "Kombolcha Institute of Technology", alt: "Students and staff at Kombolcha Institute of Technology" },
  { id: "clinic", title: "Clinical and public health", sub: "Tertiary Care Campus, Tita", alt: "Clinicians and students at the Tertiary Care Campus in Tita" },
];

function Scene({ s }) {
  return (
    <figure className={styles.scene}>
      <img
        src={PHOTOS[s.id]}
        alt={s.alt}
        loading="lazy"
        onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
      />
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
        {SCENES.map((s) => <Scene key={s.id} s={s} />)}
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
  const closeRef = useRef(null);
  const lastFocus = useRef(null);

  const visible = GROUPS.filter((g) => campus === "All" || g.campus === campus);

  const openGroup = (g, e) => {
    lastFocus.current = e.currentTarget;
    setActive(g);
  };

  useEffect(() => {
    if (!active) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lastFocus.current?.focus?.();
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
          <img src={HERO_IMAGE} alt="Aerial view of the Wollo University campus in Dessie" />

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

          <div className={styles.filters} role="group" aria-label="Filter by campus">
            {CAMPUS_FILTERS.map((c) => (
              <button
                key={c}
                aria-pressed={campus === c}
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
            <button key={g.id} className={styles.card} onClick={(e) => openGroup(g, e)}>
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
          <img
            src={ABOUT_IMAGE}
            alt={ABOUT_ALT}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
          />
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
        <a href={RESEARCH_OFFICE_URL}   className={styles.btnWhite}>
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
            <button ref={closeRef} className={styles.close} onClick={() => setActive(null)} aria-label="Close details">
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