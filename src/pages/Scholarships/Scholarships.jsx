import { useState, useMemo, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Scholarships.module.css";

const NAV = [
  { label: "About", to: "/about" },
  { label: "Campuses", to: "/campuses" },
  { label: "Scholarships", to: "/scholarships" },
  { label: "Events", to: "/events" },
  { label: "Resources", to: "/resources" },
  { label: "Contact", to: "/contact" },
];

/* Put your image in the public folder: public/images/wollo-hero.jpg */
const HERO_IMAGE = "https://i.pinimg.com/736x/51/46/2b/51462bff02c31d97324d43de3928996d.jpg";

/* Wollo University has three campuses */
const CAMPUSES = ["Dessie Campus", "Kombolcha Institute of Technology", "Tertiary Care Campus"];
const CAMPUS_FILTERS = ["All campuses", ...CAMPUSES];

const TYPES = ["All types", "AppFactory", "Hackathon", "Academic merit", "Need-based", "Events"];

/* NOTE: numbers below are sample content. Replace them with your real figures. */
const STATS = [
  { value: "3", label: "Campuses with open awards" },
  { value: "12+", label: "Scholarship events a year" },
  { value: "200+", label: "Students supported" },
  { value: "40+", label: "Hackathon and AppFactory teams" },
];

/* NOTE: scholarships, amounts and dates are sample content. Replace with real data. */
const SCHOLARSHIPS = [
  {
    id: 1,
    campus: "Kombolcha Institute of Technology",
    type: "AppFactory",
    title: "AppFactory Builders Scholarship",
    open: "Informatics students",
    amount: "Monthly stipend + laptop support",
    deadline: "15 Jan 2027",
    tag: "AppFactory",
    note: "Join a team that designs, builds and launches real apps for the university and the community.",
  },
  {
    id: 2,
    campus: "Kombolcha Institute of Technology",
    type: "Hackathon",
    title: "WU Hackathon Champions Award",
    open: "All students",
    amount: "Cash prize + tuition support",
    deadline: "28 Feb 2027",
    tag: "Hackathon",
    note: "Solve a real problem in 48 hours. Winning teams receive scholarships and mentoring.",
  },
  {
    id: 3,
    campus: "Dessie Campus",
    type: "Academic merit",
    title: "Top Scholar Award",
    open: "Year 2 to Year 5",
    amount: "Semester fee waiver",
    deadline: "01 Mar 2027",
    tag: "Merit",
    note: "For students with the highest results in their college each academic year.",
  },
  {
    id: 4,
    campus: "Dessie Campus",
    type: "Events",
    title: "Innovation and Research Week Prize",
    open: "All students",
    amount: "Research grant up to ETB 20,000",
    deadline: "30 Apr 2027",
    tag: "Event",
    note: "Present a research or community project and compete for funding to take it further.",
  },
  {
    id: 5,
    campus: "Tertiary Care Campus",
    type: "Need-based",
    title: "Health Sciences Support Fund",
    open: "Health sciences students",
    amount: "Living allowance",
    deadline: "20 May 2027",
    tag: "Need-based",
    note: "Helps medical and health students who need financial support to finish their studies.",
  },
  {
    id: 6,
    campus: "Tertiary Care Campus",
    type: "Hackathon",
    title: "HealthTech Hackathon Prize",
    open: "Health and informatics teams",
    amount: "Prize + incubation place",
    deadline: "05 Jun 2027",
    tag: "Hackathon",
    note: "Build digital tools for hospitals and clinics with students from other campuses.",
  },
];

const STEPS = [
  { title: "Pick your award", text: "Choose a campus and a scholarship or event that fits you." },
  { title: "Register", text: "Send your details and join a team if the event needs one." },
  { title: "Prepare", text: "Get mentoring on your idea, project or application." },
  { title: "Present or submit", text: "Share your work with the judges before the deadline." },
  { title: "Win and grow", text: "Receive your award and join the next AppFactory cohort." },
];

const ELIGIBILITY = [
  "Be a registered Wollo University student on any of the three campuses",
  "Good academic standing in your latest semester",
  "A short statement about your goals or your project idea",
  "One recommendation from an instructor or department head",
  "Team members confirmed (for AppFactory and Hackathon events)",
];

const FAQS = [
  { q: "Can students from every campus apply?", a: "Yes. Dessie Campus, Kombolcha Institute of Technology and the Tertiary Care Campus can all join. Some events are open to mixed teams from several campuses." },
  { q: "Do I need to know how to code to join a hackathon?", a: "No. Teams also need designers, researchers, presenters and subject experts. Tell us your skills and we will help you find a team." },
  { q: "What is AppFactory?", a: "AppFactory is a student team that builds real apps and digital tools. Members learn by shipping products, and selected members receive scholarship support." },
  { q: "Can I apply for more than one scholarship?", a: "Yes. You can apply for several awards, but you can only receive one full fee waiver at a time." },
];

function Icon({ name }) {
  const paths = {
    cap: "M12 3 1 9l11 6 9-4.9V17h2V9L12 3zm-6 9.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3.3-6-3.3z",
    globe: "M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 9h-3a15 15 0 00-1.2-5.2A8 8 0 0118.9 11zM12 4c.8 1 1.9 3.3 2 7h-4c.1-3.7 1.2-6 2-7zM4.1 13h3a15 15 0 001.2 5.2A8 8 0 014.1 13zm3-2h-3a8 8 0 014.2-5.2A15 15 0 007.1 11zM12 20c-.8-1-1.9-3.3-2-7h4c-.1 3.7-1.2 6-2 7zm2.7-1.8A15 15 0 0015.9 13h3a8 8 0 01-4.2 5.2z",
    cal: "M7 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm12 8v10H5V10h14z",
    check: "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z",
  };
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
      <path d={paths[name]} />
    </svg>
  );
}

function Waves({ className }) {
  return (
    <svg className={className} viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => (
        <path
          key={i}
          d={`M0 ${70 + i * 5} C 260 ${-20 + i * 9}, 520 ${200 - i * 4}, 820 ${100 + i * 3} S 1260 ${10 + i * 6}, 1440 ${90 + i * 4}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.9 - i * 0.05}
        />
      ))}
    </svg>
  );
}

export default function Scholarships() {
  const [campus, setCampus] = useState("All campuses");
  const [type, setType] = useState("All types");
  const [openFaq, setOpenFaq] = useState(0);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", campus: "", interest: "" });

  const list = useMemo(
    () =>
      SCHOLARSHIPS.filter(
        (s) =>
          (campus === "All campuses" || s.campus === campus) &&
          (type === "All types" || s.type === type)
      ),
    [campus, type]
  );

  /* Smooth scroll to #find / #apply when the hash changes */
  const { hash, key } = useLocation();
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, key]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // Replace with your API call
    console.log("Scholarship enquiry:", form);
    setSent(true);
  };

  return (
    <div className={styles.page}>

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <Waves className={styles.heroWaves} />
        <div className={styles.heroText}>
          <p className={styles.kicker}>For students on all three Wollo University campuses</p>
          <h1>Build something great. Earn your scholarship.</h1>
          <p className={styles.lead}>
            Join AppFactory, win a hackathon or take part in a scholarship event. Wollo University rewards
            students who learn by doing.
          </p>
          <div className={styles.heroActions}>
            <Link to={{ hash: "#find" }} className={styles.btnPrimary}>See open scholarships</Link>
            <Link to={{ hash: "#apply" }} className={styles.btnGhost}>Register your interest</Link>
          </div>
          <ul className={styles.trust}>
            <li><Icon name="cap" /> Open to all campuses</li>
            <li><Icon name="globe" /> Real projects</li>
            <li><Icon name="check" /> Mentoring included</li>
          </ul>
        </div>

        <div className={styles.heroMedia}>
          <img
            className={styles.heroImage}
            src={HERO_IMAGE}
            alt="Wollo University students working together on campus"
            loading="eager"
          />
          <aside className={styles.heroCard} aria-label="Next closing deadline">
            <span className={styles.heroCardLabel}>Closing soon</span>
            <h2>AppFactory Builders Scholarship</h2>
            <p>Kombolcha Institute of Technology · Informatics</p>
            <div className={styles.heroCardAmount}>Stipend + laptop support</div>
            <div className={styles.heroCardMeta}>
              <Icon name="cal" /> Deadline 15 Jan 2027
            </div>
            <Link to={{ hash: "#find" }} className={styles.btnGold}>View details</Link>
          </aside>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className={styles.stats} aria-label="Scholarship statistics">
        {STATS.map((s) => (
          <div key={s.label} className={styles.stat}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ---------- Scholarship list ---------- */}
      <section id="find" className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Scholarships and events open this year</h2>
          <p>Filter by campus and by the kind of award you want.</p>
        </div>

        <div className={styles.filters} role="tablist" aria-label="Filter by campus">
          {CAMPUS_FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={campus === f}
              className={campus === f ? styles.chipActive : styles.chip}
              onClick={() => setCampus(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={styles.filters} role="tablist" aria-label="Filter by type">
          {TYPES.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={type === f}
              className={type === f ? styles.chipActive : styles.chip}
              onClick={() => setType(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {list.map((s) => (
            <article key={s.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.country}>{s.campus}</span>
                <span className={styles.tag}>{s.tag}</span>
              </div>
              <h3>{s.title}</h3>
              <p className={styles.cardNote}>{s.note}</p>
              <dl className={styles.cardMeta}>
                <div><dt>Open to</dt><dd>{s.open}</dd></div>
                <div><dt>Award</dt><dd>{s.amount}</dd></div>
                <div><dt>Deadline</dt><dd>{s.deadline}</dd></div>
              </dl>
              <Link to={{ hash: "#apply" }} className={styles.cardLink}>Register interest</Link>
            </article>
          ))}
          {list.length === 0 && (
            <p className={styles.empty}>No awards match these filters yet. Try another campus or type.</p>
          )}
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className={styles.processWrap}>
        <div className={styles.sectionHead}>
          <h2>How you go from idea to award</h2>
        </div>
        <ol className={styles.process}>
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className={styles.stepNum}>{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Eligibility + Story ---------- */}
      <section className={styles.split}>
        <div className={styles.panel}>
          <h2>What you need to apply</h2>
          <ul className={styles.checks}>
            {ELIGIBILITY.map((e) => (
              <li key={e}><Icon name="check" /> {e}</li>
            ))}
          </ul>
        </div>
        <figure className={styles.story}>
          {/* Sample story. Replace with a real student quote. */}
          <blockquote>
            “I joined AppFactory in my second year with only basic skills. Our hackathon team won, and the prize
            paid for my next semester.”
          </blockquote>
          <figcaption>
            <span className={styles.avatar} aria-hidden="true">WU</span>
            <div>
              <strong>Sample student</strong>
              <span>AppFactory member, Kombolcha Institute of Technology</span>
            </div>
          </figcaption>
        </figure>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Questions students ask us</h2>
        </div>
        <div className={styles.faq}>
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className={open ? styles.faqOpen : styles.faqItem}>
                <button aria-expanded={open} onClick={() => setOpenFaq(open ? -1 : i)}>
                  {f.q}
                  <span aria-hidden="true">{open ? "−" : "+"}</span>
                </button>
                {open && <p>{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Apply / Contact ---------- */}
      <section id="apply" className={styles.contact}>
        <Waves className={styles.contactWaves} />
        <div className={styles.contactText}>
          <h2>Tell us what you want to build or win.</h2>
          <p>The scholarship office replies within one working day with the next steps.</p>
          <ul>
            {/* Replace with the office's real contact details */}
            <li>Scholarship Office, Dessie Campus</li>
            <li>scholarships@wu.edu.et</li>
            <li>www.wu.edu.et</li>
          </ul>
        </div>

        {sent ? (
          <div className={styles.thanks} role="status">
            <h3>Thank you, {form.name || "friend"}.</h3>
            <p>We received your details and will email you the next steps soon.</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            <label>
              Full name
              <input name="name" value={form.name} onChange={onChange} required />
            </label>
            <label>
              Email address
              <input type="email" name="email" value={form.email} onChange={onChange} required />
            </label>
            <label>
              Your campus
              <select name="campus" value={form.campus} onChange={onChange} required>
                <option value="">Select a campus</option>
                {CAMPUSES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              I am interested in
              <select name="interest" value={form.interest} onChange={onChange} required>
                <option value="">Select an option</option>
                {TYPES.slice(1).map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <button type="submit" className={styles.btnGold}>Send my details</button>
          </form>
        )}
      </section>

      <footer className={styles.footer}>
        <p>Learn by building. Grow by winning.</p>
        <small>© {new Date().getFullYear()} Wollo University. All rights reserved.</small>
      </footer>
    </div>
  );
}