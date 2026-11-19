import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Leadership.module.css';

/* =====================================================================
   HOW TO EDIT
   1. Add real names in `name` (empty name shows "Name to be added").
   2. Photos: drop files in  public/images/leaders/<id>.jpg
      (example: public/images/leaders/president.jpg). Or set `photo`.
      Missing photos show a clean badge, nothing breaks.
   3. Change who reports to whom with `reportsTo`.
   4. `solves`, `when`, `bring` are written for students. Keep them plain.
   ===================================================================== */

const MEKAI_URL = '#'; // link to your Mekai system request page

/* Sample photo for anyone who has no photo file yet.
   Paste an image link or a path here, for example '/images/leaders/sample.jpg'.
   Leave '' to show the built-in silhouette instead. */
const SAMPLE_PHOTO = '';

const GROUPS = [
  { id: 'all', label: 'Everyone' },
  { id: 'top', label: 'Top leadership' },
  { id: 'academic', label: 'Academics & campuses' },
  { id: 'students', label: 'Student life' },
  { id: 'support', label: 'Digital & communication' },
];

const QUICK = [
  { label: 'Registration', q: 'registration' },
  { label: 'Grade or transcript', q: 'transcript' },
  { label: 'Exam appeal', q: 'appeal' },
  { label: 'Scholarship or fees', q: 'scholarship' },
  { label: 'Dormitory', q: 'dormitory' },
  { label: 'Feeling sick', q: 'sick' },
  { label: 'Mekai login', q: 'login' },
  { label: 'Library', q: 'library' },
  { label: 'Stress or advice', q: 'counselling' },
];

const STEPS = [
  { title: 'Start at the right office', text: 'Most problems are solved by the office that owns them. Use the finder above to see which one.' },
  { title: 'Bring your proof', text: 'ID card, forms, receipts or screenshots from Mekai. Clear papers mean a faster answer.' },
  { title: 'Ask in Mekai', text: 'Send your request in Mekai so there is a record. Wait for the reply time that office gives.' },
  { title: 'Go one level up', text: 'No answer? Go to the director, then the vice president, and the President last.' },
];

const CAMPUSES = [
  {
    id: 'dessie',
    name: 'Dessie Main Campus',
    place: 'Dessie',
    text: 'The main campus and the home of the President\u2019s office. Eight colleges and schools: Agriculture, Business and Economics, Natural Sciences, Social Sciences and Humanities, Teachers\u2019 Education, Arts, Law and Veterinary Medicine.',
  },
  {
    id: 'kiot',
    name: 'Kombolcha Institute of Technology (KIoT)',
    place: 'Kombolcha',
    text: 'Engineering, informatics, textile and fashion. Laboratories and workshops close to the industrial heart of the region.',
  },
  {
    id: 'tcc',
    name: 'Tertiary Care Campus',
    place: 'Dessie',
    text: 'The health campus: medicine, nursing and midwifery, pharmacy, medical laboratory, public health and environmental health.',
  },
];
const CAMPUS_NAME = Object.fromEntries(CAMPUSES.map((c) => [c.id, c.name]));

/* Office numbers. Fill in the room or block for each campus.
   Leave '' until you have the real number: the page shows "number to be added".
   Remove a campus line if that person has no office on that campus. */
const OFFICES = {
  president: { dessie: '' },
  'vp-academic': { dessie: '' },
  'vp-research': { dessie: '' },
  'vp-admin': { dessie: '' },
  registrar: { dessie: '', kiot: '', tcc: '' },
  library: { dessie: '', kiot: '', tcc: '' },
  'dessie-campus': { dessie: '' },
  kiot: { kiot: '' },
  tcc: { tcc: '' },
  'dean-students': { dessie: '', kiot: '', tcc: '' },
  'student-services': { dessie: '', kiot: '', tcc: '' },
  scholarship: { dessie: '' },
  health: { dessie: '', kiot: '', tcc: '' },
  counselling: { dessie: '', kiot: '', tcc: '' },
  ict: { dessie: '', kiot: '', tcc: '' },
  comms: { dessie: '' },
};

const PEOPLE = [
  {
    id: 'president',
    group: 'top',
    short: 'PR',
    title: 'University President',
    name: 'Dr. Awol Seid',
    summary:
      'Leads the whole university. Makes the final decision on university rules, budget direction and the biggest academic matters.',
    solves: [
      'Final decision on rules that apply to the whole university',
      'Decides serious appeals that no other office could settle',
      'Speaks for the university to the Ministry and to partners',
    ],
    when: [
      'You already went through the office, the director and the vice president',
      'Your matter affects many students, not only you',
    ],
    bring: ['A written appeal letter', 'Copies of every earlier reply'],
    tags: 'president final decision policy appeal complaint rules',
  },
  {
    id: 'vp-academic',
    group: 'top',
    reportsTo: 'president',
    short: 'VA',
    title: 'Vice President, Academic Affairs',
    name: '',
    summary:
      'Responsible for teaching, exams, programs and the quality of every course. Colleges, the Registrar and the Library work under this office.',
    solves: [
      'Serious problems with a course, a teacher or an exam result that the college could not fix',
      'Approves changes to academic programs and the academic calendar',
      'Handles second-level appeals about grades and academic rules',
    ],
    when: [
      'The college dean and the Registrar could not solve your academic problem',
      'You want to appeal an academic decision',
    ],
    bring: ['Your Mekai request number', 'Reply letters from the dean or Registrar'],
    tags: 'academic exam appeal grade complaint course teacher program calendar',
  },
  {
    id: 'vp-research',
    group: 'top',
    reportsTo: 'president',
    short: 'VR',
    title: 'Vice President, Research & Community Service',
    name: '',
    summary:
      'Leads research, innovation and the work the university does for the community. Also guides technology and digital projects such as Mekai.',
    solves: [
      'Approves student research projects, thesis support and research funding',
      'Organizes community service and technology transfer programs',
      'Guides new digital services for students and staff',
    ],
    when: [
      'You need support or permission for a research project',
      'You want to bring a community or innovation idea to the university',
    ],
    bring: ['A short project summary', 'Your advisor\u2019s name'],
    tags: 'research thesis project innovation community service funding technology',
  },
  {
    id: 'vp-admin',
    group: 'top',
    reportsTo: 'president',
    short: 'VD',
    title: 'Vice President, Administration & Development',
    name: '',
    summary:
      'Looks after staff, buildings, budget and everything that keeps the campuses running. Student services such as dormitories, cafeteria and health report here.',
    solves: [
      'Decides problems with dormitories, cafeteria, transport and campus buildings that the service office could not fix',
      'Manages the budget and facilities of all campuses',
      'Handles staff and student service complaints at the highest level',
    ],
    when: [
      'A student service has failed and the director did not solve it',
      'A building, water, power or safety problem is not being fixed',
    ],
    bring: ['Photos or a short written description', 'Dates when you reported it before'],
    tags: 'administration budget building dormitory cafeteria transport facility safety complaint',
  },
  {
    id: 'registrar',
    group: 'academic',
    reportsTo: 'vp-academic',
    short: 'RG',
    title: 'Registrar Head',
    name: 'Abdul Kadi',
    summary:
      'Keeps all official student academic records. Every registration, grade, transcript and certificate passes through this office.',
    solves: [
      'Course registration, add and drop, and fixing registration errors',
      'Grade reports, grade corrections and result questions',
      'Transcript, student ID letter, temporary and final degree certificate',
      'Readmission, withdrawal and changing your department',
    ],
    when: [
      'Your name or courses are missing or wrong in Mekai',
      'You see a wrong grade or a missing grade',
      'You need an official letter or transcript',
    ],
    bring: ['Student ID', 'Screenshot of the problem in Mekai', 'Payment receipt if you request a document'],
    tags: 'registrar registration add drop course grade result mark transcript certificate id readmission withdrawal department change record',
  },
  {
    id: 'library',
    group: 'academic',
    reportsTo: 'vp-academic',
    short: 'LB',
    title: 'Library Director',
    name: '',
    summary:
      'Runs the libraries, reading rooms and digital resources of all campuses.',
    solves: [
      'Borrowing and returning books, and fixing late fines',
      'Access to e-journals, e-books and research databases',
      'Help finding sources for your assignment or thesis',
    ],
    when: [
      'You cannot get into the digital library',
      'Your library card is blocked or a fine looks wrong',
    ],
    bring: ['Student ID', 'Book or card number'],
    tags: 'library book borrow return fine journal ebook database reading room research sources',
  },
  {
    id: 'dessie-campus',
    group: 'academic',
    reportsTo: 'vp-academic',
    short: 'DC',
    title: 'Director, Dessie Main Campus',
    name: '',
    summary:
      'Leads the main campus in Dessie: the colleges, classrooms, grounds and day-to-day campus life.',
    solves: [
      'Campus problems at Dessie: classrooms, grounds, security, transport',
      'Coordinates the college deans on the main campus',
      'First contact for Dessie students whose issue needs the campus leader',
    ],
    when: [
      'You study at Dessie and your college dean could not help',
      'A campus facility is not working or not safe',
    ],
    bring: ['The dean\u2019s reply, if any', 'Student ID'],
    tags: 'dessie main campus college classroom grounds security transport',
  },
  {
    id: 'kiot',
    group: 'academic',
    reportsTo: 'vp-academic',
    short: 'KT',
    title: 'Director, Kombolcha Institute of Technology',
    name: '',
    summary:
      'Leads the Kombolcha campus: engineering, informatics and textile programs, laboratories and workshops.',
    solves: [
      'Campus problems at Kombolcha: classrooms, labs, workshops, transport',
      'Coordinates the deans and heads of the schools in the institute',
      'First contact for Kombolcha students whose issue needs the campus leader',
    ],
    when: [
      'You study at Kombolcha and the department head could not help',
      'A lab or workshop you need is not available',
    ],
    bring: ['Department head\u2019s reply, if any', 'Student ID'],
    tags: 'kombolcha kiot engineering informatics textile laboratory workshop campus',
  },
  {
    id: 'tcc',
    group: 'academic',
    reportsTo: 'vp-academic',
    short: 'TC',
    title: 'Director, Tertiary Care Campus',
    name: '',
    summary:
      'Leads the health campus: medicine, nursing, pharmacy, public health and the training hospital placements.',
    solves: [
      'Campus problems at the Tertiary Care Campus',
      'Clinical placement and hospital attachment questions',
      'Coordinates the college of medicine and health sciences with the hospital',
    ],
    when: [
      'Your clinical rotation or placement has a problem',
      'You study health sciences and need the campus leader',
    ],
    bring: ['Placement letter', 'Student ID'],
    tags: 'tertiary care tcc medicine nursing pharmacy health clinical placement hospital campus',
  },
  {
    id: 'dean-students',
    group: 'students',
    reportsTo: 'vp-admin',
    short: 'DS',
    title: 'Dean of Students',
    name: '',
    summary:
      'Protects student rights and student life. Works with the student union and handles discipline fairly.',
    solves: [
      'Complaints between students, or between a student and staff',
      'Discipline cases and the right to be heard',
      'Student union and student clubs support',
      'Clearance forms when you leave or graduate',
    ],
    when: [
      'You feel treated unfairly or unsafe on campus',
      'You were called to a discipline committee',
      'You need clearance',
    ],
    bring: ['A short written account of what happened', 'Names of witnesses, if any'],
    tags: 'dean students discipline conflict complaint rights union club clearance harassment safety unfair',
  },
  {
    id: 'student-services',
    group: 'students',
    reportsTo: 'vp-admin',
    short: 'SS',
    title: 'Director, Student Services',
    name: '',
    summary:
      'Runs dormitories, cafeterias and day-to-day living on campus.',
    solves: [
      'Dormitory room placement and room changes',
      'Cafeteria problems: meal card, food quality, queue',
      'Broken beds, water, power or cleaning in the dormitory',
    ],
    when: [
      'You do not have a room, or your room has a serious problem',
      'Your meal card is not working',
    ],
    bring: ['Student ID', 'Dormitory block and room number', 'Photo of the problem'],
    tags: 'dormitory dorm room bed cafeteria food meal card water power cleaning laundry',
  },
  {
    id: 'scholarship',
    group: 'students',
    reportsTo: 'vp-admin',
    short: 'SF',
    title: 'Head, Student Finance & Cost Sharing',
    name: '',
    summary:
      'Manages cost sharing, payments, scholarships and monthly student allowances.',
    solves: [
      'Questions about cost sharing and what you owe',
      'Payment receipts that do not show in Mekai',
      'Scholarship and allowance questions',
    ],
    when: [
      'You paid but the system still shows a balance',
      'Your scholarship or allowance did not arrive',
    ],
    bring: ['Payment receipt or bank slip', 'Student ID', 'Date and amount paid'],
    tags: 'scholarship fee fees payment cost sharing tuition receipt bank allowance money balance',
  },
  {
    id: 'health',
    group: 'students',
    reportsTo: 'vp-admin',
    short: 'HS',
    title: 'Head, University Health Service',
    name: '',
    summary:
      'Runs the student clinic and referral to hospitals.',
    solves: [
      'Treatment and medicine at the student clinic',
      'Referral letters to a hospital',
      'Medical letters for missed classes or exams',
    ],
    when: [
      'You are sick and need care or a referral',
      'You missed an exam because of illness and need proof',
    ],
    bring: ['Student ID', 'Any earlier medical papers'],
    tags: 'health clinic sick illness medicine hospital referral doctor medical letter missed exam',
  },
  {
    id: 'counselling',
    group: 'students',
    reportsTo: 'vp-admin',
    short: 'GC',
    title: 'Head, Guidance & Counselling',
    name: '',
    summary:
      'Free, private support for study stress, personal problems and choices about your future.',
    solves: [
      'Private talks about stress, family or personal worries',
      'Study skills and help if your grades are falling',
      'Advice about career and next steps after graduation',
    ],
    when: [
      'You feel overwhelmed and want someone to listen',
      'You are on academic warning and want a plan',
    ],
    bring: ['Nothing. You can simply walk in or book through Mekai'],
    tags: 'counselling counseling guidance stress mental advice career study skills warning worry family',
  },
  {
    id: 'ict',
    group: 'support',
    reportsTo: 'vp-research',
    short: 'IT',
    title: 'ICT Director (Mekai System)',
    name: '',
    summary:
      'Keeps Mekai, campus Wi-Fi and student email running. Fixes accounts and system errors.',
    solves: [
      'Mekai login problems and forgotten passwords',
      'Errors, wrong data display or a page that does not open',
      'Campus Wi-Fi and student email problems',
    ],
    when: [
      'You cannot log in to Mekai',
      'Mekai shows an error or something that looks wrong',
    ],
    bring: ['Screenshot of the error', 'Your student ID', 'Time it happened'],
    tags: 'ict mekai login password account wifi internet email system error bug website technical',
  },
  {
    id: 'comms',
    group: 'support',
    reportsTo: 'vp-research',
    short: 'PC',
    title: 'Director, Public Relations & Communication',
    name: '',
    summary:
      'Publishes official news, announcements and the university\u2019s social media. Connects the university with the public.',
    solves: [
      'Confirms which announcements and dates are official',
      'Shares student news and events',
      'Handles media and visitor requests',
    ],
    when: [
      'You saw a rumor and want the official answer',
      'You want your event or news shared',
    ],
    bring: ['A short description', 'Photos, if you have them'],
    tags: 'communication news announcement rumor event media social press public relations',
  },
];

/* ---------- Helpers ---------- */
const BY_ID = Object.fromEntries(
  PEOPLE.map((p, i) => [p.id, { ...p, tone: i % 3, office: OFFICES[p.id] || {} }])
);
const LIST = PEOPLE.map((p) => BY_ID[p.id]);
const VPS = LIST.filter((p) => p.reportsTo === 'president');
const childrenOf = (id) => LIST.filter((p) => p.reportsTo === id);
const photoOf = (p) => (p.photo !== undefined ? p.photo : `/images/leaders/${p.id}.jpg`);
const nameOf = (p) => p.name || 'Name to be added';
const officeRows = (p, only) =>
  Object.entries(p.office).filter(([c]) => !only || only === 'all' || c === only);

function Offices({ p, only, className = '' }) {
  const rows = officeRows(p, only);
  if (!rows.length) return null;
  return (
    <ul className={`${styles.offices} ${className}`}>
      {rows.map(([c, num]) => (
        <li key={c}>
          <svg viewBox="0 0 24 24" className={styles.pin} aria-hidden="true">
            <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="12" cy="9.5" r="2.4" fill="currentColor" />
          </svg>
          <span>
            <b>{CAMPUS_NAME[c]}</b>
            {num ? <> &middot; Office {num}</> : <i> &middot; office number to be added</i>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* Tries the person's photo, then SAMPLE_PHOTO. If both fail, the silhouette behind shows. */
function Photo({ src, className }) {
  const list = [src, SAMPLE_PHOTO].filter(Boolean);
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [src]);
  if (i >= list.length) return null;
  return (
    <img
      key={list[i]}
      className={className}
      src={list[i]}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setI((n) => n + 1)}
    />
  );
}

function Silhouette({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={`${styles.sil} ${className}`} aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      <circle cx="50" cy="34" r="17" fill="currentColor" />
      <path d="M14 100c0-22 16-38 36-38s36 16 36 38z" fill="currentColor" />
    </svg>
  );
}

function Avatar({ p, className = '' }) {
  return (
    <span className={`${styles.avatar} ${className}`}>
      <span className={styles.avatarFallback}>
        <Silhouette />
      </span>
      <Photo className={styles.avatarImg} src={photoOf(p)} />
    </span>
  );
}

function Check() {
  return (
    <svg className={styles.check} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Node({ p, active, onSelect, size = '' }) {
  return (
    <button
      type="button"
      className={`${styles.node} ${size ? styles[size] : ''} ${active ? styles.nodeOn : ''}`}
      onClick={() => onSelect(p.id)}
      aria-pressed={active}
    >
      <Avatar p={p} className={styles.nodeAvatar} />
      <span className={styles.nodeText}>
        <strong>{p.title}</strong>
        <em>{nameOf(p)}</em>
      </span>
    </button>
  );
}

/* ---------- Component ---------- */
function Leadership() {
  const [selectedId, setSelectedId] = useState('president');
  const [group, setGroup] = useState('all');
  const [campus, setCampus] = useState('all');
  const dirRef = useRef(null);
  const [query, setQuery] = useState('');
  const spotRef = useRef(null);

  const selected = BY_ID[selectedId];
  const boss = selected.reportsTo ? BY_ID[selected.reportsTo] : null;
  const team = childrenOf(selected.id);

  const matches = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
    if (!words.length) return [];
    return LIST.filter((p) => {
      const hay = [p.title, p.name, p.summary, p.solves.join(' '), p.tags].join(' ').toLowerCase();
      return words.every((w) => hay.includes(w));
    }).slice(0, 4);
  }, [query]);

  const shown = LIST.filter(
    (p) =>
      (group === 'all' || p.group === group) &&
      (campus === 'all' || Object.prototype.hasOwnProperty.call(p.office, campus))
  );

  const openCampus = (id) => {
    setCampus(id);
    setGroup('all');
    if (dirRef.current) dirRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const select = (id, scroll = true) => {
    setSelectedId(id);
    if (scroll && spotRef.current) {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      spotRef.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <section className={styles.page}>
      {/* ===== HERO + FINDER ===== */}
      <header className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <p className={styles.eyebrow}>Wollo University leadership</p>
              <h1>Know who to go to, and why</h1>
              <p className={styles.lead}>
                Every leader here solves specific problems for students. Find the right person
                in seconds, see what they handle, and know what to bring with you.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.btnPrimary} href="#structure">See the structure</a>
                <a className={styles.btnGhost} href="#people">Meet everyone</a>
              </div>
            </div>

            <div className={styles.finder}>
              <label htmlFor="finderInput" className={styles.finderLabel}>
                What do you need help with?
              </label>
              <input
                id="finderInput"
                className={styles.finderInput}
                type="search"
                placeholder="Try: transcript, dormitory, password…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              <div className={styles.quick}>
                {QUICK.map((c) => (
                  <button
                    key={c.q}
                    type="button"
                    className={`${styles.quickChip} ${query === c.q ? styles.quickOn : ''}`}
                    onClick={() => setQuery(c.q)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className={styles.results} aria-live="polite">
                {query.trim() && matches.length === 0 && (
                  <p className={styles.noMatch}>
                    No exact match. Start with the Registrar, or send your question through Mekai.
                  </p>
                )}
                {matches.map((p) => (
                  <button key={p.id} type="button" className={styles.result} onClick={() => select(p.id)}>
                    <Avatar p={p} className={styles.resultAvatar} />
                    <span>
                      <strong>{p.title}</strong>
                      <em>{p.solves[0]}</em>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== SPOTLIGHT ===== */}
      <div className={styles.spotWrap} id="profile" ref={spotRef}>
        <div className={styles.container}>
          <div className={styles.spot} key={selected.id}>
            <div className={`${styles.spotPhoto} ${styles[`tone${selected.tone}`]}`}>
              <span className={styles.spotChip}>{selected.title}</span>
              <div className={styles.spotBadge}>
                <Silhouette className={styles.silBig} />
              </div>
              <Photo className={styles.spotImg} src={photoOf(selected)} />
            </div>

            <div className={styles.spotBody}>
              <p className={styles.kicker}>Leader profile</p>
              <h2 className={styles.spotName}>{nameOf(selected)}</h2>
              <p className={styles.spotRole}>{selected.title}</p>
              <p className={styles.spotSummary}>{selected.summary}</p>

              <h3 className={styles.subHead}>What they solve for you</h3>
              <ul className={styles.checks}>
                {selected.solves.map((s) => (
                  <li key={s}><Check /> <span>{s}</span></li>
                ))}
              </ul>

              <div className={styles.twoCol}>
                <div>
                  <h3 className={styles.subHead}>Go to them when</h3>
                  <ul className={styles.dots}>
                    {selected.when.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className={styles.subHead}>Bring with you</h3>
                  <ul className={styles.dots}>
                    {selected.bring.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </div>

              <h3 className={styles.subHead}>Where to find them</h3>
              <Offices p={selected} className={styles.officesBig} />

              <div className={styles.spotFoot}>
                <a className={styles.btnPrimary} href={MEKAI_URL}>Ask through Mekai</a>
                {boss && (
                  <button type="button" className={styles.linkBtn} onClick={() => select(boss.id, false)}>
                    Reports to: {boss.title}
                  </button>
                )}
              </div>

              {team.length > 0 && (
                <div className={styles.under}>
                  <span>Offices under this leader:</span>
                  {team.map((t) => (
                    <button key={t.id} type="button" className={styles.underChip} onClick={() => select(t.id, false)}>
                      {t.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== STRUCTURE ===== */}
      <div className={styles.structure} id="structure">
        <div className={styles.container}>
          <p className={styles.kicker}>How we are organized</p>
          <h2 className={styles.heading}>Leadership structure</h2>
          <p className={styles.sectionLead}>
            Select any person to read about them above. Problems move up the chart one step at a time.
          </p>

          <div className={styles.chart}>
            <div className={styles.top}>
              <Node p={BY_ID.president} active={selectedId === 'president'} onSelect={select} size="nodeLg" />
            </div>

            <div className={styles.branches}>
              {VPS.map((vp) => (
                <div className={styles.branch} key={vp.id}>
                  <Node p={vp} active={selectedId === vp.id} onSelect={select} size="nodeMd" />
                  <ul className={styles.rail}>
                    {childrenOf(vp.id).map((c) => (
                      <li key={c.id}>
                        <Node p={c} active={selectedId === c.id} onSelect={select} size="nodeSm" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== THREE CAMPUSES ===== */}
      <div className={styles.container}>
        <div className={styles.stepsHead}>
          <p className={styles.kicker}>Three campuses</p>
          <h2 className={styles.heading}>One university, three places to be</h2>
        </div>
        <div className={styles.campusRow}>
          {CAMPUSES.map((c) => {
            const lead = BY_ID[c.id === 'dessie' ? 'dessie-campus' : c.id];
            const count = LIST.filter((p) => Object.prototype.hasOwnProperty.call(p.office, c.id)).length;
            return (
              <article className={styles.campusCard} key={c.id}>
                <span className={styles.campusPlace}>{c.place}</span>
                <h3>{c.name}</h3>
                <p>{c.text}</p>
                <div className={styles.campusFoot}>
                  <button type="button" className={styles.linkBtn} onClick={() => select(lead.id)}>
                    Campus director
                  </button>
                  <button type="button" className={styles.cardBtn} onClick={() => openCampus(c.id)}>
                    {count} offices here
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ===== ESCALATION STEPS ===== */}
      <div className={styles.container}>
        <div className={styles.stepsHead}>
          <p className={styles.kicker}>Before you visit</p>
          <h2 className={styles.heading}>Four steps to get answers fast</h2>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.title} className={styles.stepCard}>
              <span className={styles.stepNum}>{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ===== DIRECTORY ===== */}
      <div className={styles.directory} id="people" ref={dirRef}>
        <div className={styles.container}>
          <div className={styles.dirHead}>
            <div>
              <p className={styles.kicker}>Meet the team</p>
              <h2 className={styles.heading}>Who does what</h2>
            </div>
            <div className={styles.tabs} role="tablist" aria-label="Filter leaders">
              {GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={group === g.id}
                  className={`${styles.tab} ${group === g.id ? styles.tabOn : ''}`}
                  onClick={() => setGroup(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Filter by campus">
            {[{ id: 'all', name: 'All campuses' }, ...CAMPUSES].map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={campus === c.id}
                className={`${styles.tab} ${campus === c.id ? styles.tabOn : ''}`}
                onClick={() => setCampus(c.id)}
              >
                {c.id === 'all' ? c.name : c.name.replace(/ \(KIoT\)/, '')}
              </button>
            ))}
          </div>

          <div className={styles.cards}>
            {shown.map((p) => (
              <article className={styles.card} key={p.id}>
                <div className={`${styles.cardTop} ${styles[`tone${p.tone}`]}`}>
                  <span className={styles.cardChip}>{p.title}</span>
                  <Avatar p={p} className={styles.cardAvatar} />
                </div>
                <div className={styles.cardBody}>
                  <h3>{nameOf(p)}</h3>
                  <p className={styles.cardRole}>{p.title}</p>
                  <p className={styles.solveLabel}>Solves</p>
                  <ul className={styles.dots}>
                    {p.solves.slice(0, 3).map((s) => <li key={s}>{s}</li>)}
                  </ul>
                  <Offices p={p} only={campus} />
                  <button type="button" className={styles.cardBtn} onClick={() => select(p.id)}>
                    Full profile
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Leadership;