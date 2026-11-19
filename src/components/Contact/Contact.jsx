import { cloneElement, useEffect, useState } from "react";
import styles from "./Conact.module.css";

/* ---------- Edit these to your real details ---------- */
const CONTACT = {
  phone: "+251 33 551 0000",
  email: "registrar@wollouniversity.edu.et",
  hours: "Mon – Fri: 8:30 AM – 5:30 PM",
  address: "Registrar Office, Kombolcha Campus, Wollo University",
};

const MAP_QUERY = "Wollo University Kombolcha Campus Registrar, Kombolcha, Ethiopia";
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=16&output=embed`;
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`;

const SERVICES = [
  "Admission & enrollment",
  "Transcripts & certificates",
  "Student ID & records",
  "Grade reports & appeals",
  "Graduation & clearance",
  "Something else",
];

/* ---------- Small inline icons ---------- */
const Icon = {
  phone: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3.5 11 8.5-7 8.5 7M6 9.5V20h12V9.5" />
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  ),
};

/* Is the registrar open right now? (Ethiopia time, Mon–Fri 8:30–17:30) */
function useOpenNow() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Addis_Ababa",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t)?.value;
      const day = get("weekday");
      const minutes = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
      const weekday = !["Sat", "Sun"].includes(day);
      setOpen(weekday && minutes >= 8 * 60 + 30 && minutes < 17 * 60 + 30);
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, []);

  return open;
}

export default function ContactPage() {
  const openNow = useOpenNow();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!values.name.trim()) er.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) er.email = "Enter a valid email address.";
    if (!values.service) er.service = "Choose what you need help with.";
    if (values.message.trim().length < 10) er.message = "Tell us a little more (10+ characters).";
    return er;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    // TODO: send `values` to your API / email service here.
    setSent(true);
  };

  const reset = () => {
    setValues({ name: "", email: "", phone: "", service: "", message: "" });
    setSent(false);
  };

  const info = [
    { icon: Icon.phone, title: "Phone number", text: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
    { icon: Icon.mail, title: "Email address", text: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Icon.clock, title: "Opening hours", text: CONTACT.hours },
    { icon: Icon.pin, title: "Our location", text: CONTACT.address, href: DIRECTIONS },
  ];

  return (
    <main className={styles.page}>
      {/* ---------------- Hero ---------------- */}
      <header className={styles.hero}>
        <div className={styles.blobA} aria-hidden="true" />
        <div className={styles.blobB} aria-hidden="true" />
        <h1 className={styles.heroTitle}>Contact Us</h1>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <a href="/">
            <span className={styles.crumbIcon}>{Icon.home}</span>Home
          </a>
          <span className={styles.crumbSep}>{Icon.chevron}</span>
          <span aria-current="page">Contact Us</span>
        </nav>
      </header>

      {/* ---------------- Info + Form ---------------- */}
      <section className={styles.main}>
        <aside className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Contact Information</h2>
          <p className={styles.lead}>
            Need a transcript, a record check, or help with enrollment? The Registrar team at
            Kombolcha Campus is ready to help. Call, write, or visit us during office hours.
          </p>

          <div className={styles.status} data-open={openNow}>
            <span className={styles.dot} />
            {openNow ? "The Registrar is open right now" : "The Registrar is closed right now"}
          </div>

          <ul className={styles.infoList}>
            {info.map((item) => (
              <li key={item.title} className={styles.infoItem}>
                <span className={styles.infoIcon}>{item.icon}</span>
                <div>
                  <h3>{item.title}</h3>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                      {item.text}
                    </a>
                  ) : (
                    <p>{item.text}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.formCard}>
          <span className={styles.pill}>
            <span className={styles.pillStar}>✱</span> Get in touch
          </span>
          <h2 className={styles.formTitle}>Send us a message</h2>
          <p className={styles.lead}>
            Fill out the form and a Registrar officer will reply within one working day. Please
            include your student ID if you have one.
          </p>

          {sent ? (
            <div className={styles.success} role="status">
              <span className={styles.successIcon}>{Icon.check}</span>
              <h3>Message sent</h3>
              <p>Thank you, {values.name.split(" ")[0] || "friend"}. We will reply to {values.email}.</p>
              <button type="button" className={styles.btnGhost} onClick={reset}>
                Send another message
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <Field label="Full name" name="name" error={errors.name}>
                <input name="name" value={values.name} onChange={onChange} autoComplete="name" />
              </Field>
              <Field label="Email address" name="email" error={errors.email}>
                <input name="email" type="email" value={values.email} onChange={onChange} autoComplete="email" />
              </Field>
              <Field label="Phone number (optional)" name="phone">
                <input name="phone" type="tel" value={values.phone} onChange={onChange} autoComplete="tel" />
              </Field>
              <Field label="What do you need?" name="service" error={errors.service}>
                <select name="service" value={values.service} onChange={onChange}>
                  <option value="" disabled>
                    Choose a service
                  </option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Message" name="message" error={errors.message} wide>
                <textarea name="message" rows={5} value={values.message} onChange={onChange} />
              </Field>

              <div className={styles.wide}>
                <button type="submit" className={styles.btn}>
                  Send message
                  <span className={styles.btnIcon}>{Icon.arrow}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ---------------- Map ---------------- */}
      <section className={styles.locationSection}>
        <span className={styles.pill}>
          <span className={styles.pillStar}>✱</span> Our location
        </span>
        <h2 className={styles.locationTitle}>Visit the Registrar at Kombolcha Campus</h2>

        <div className={styles.mapWrap}>
          <iframe
            className={styles.map}
            title="Wollo University Kombolcha Campus Registrar on Google Maps"
            src={MAP_SRC}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className={styles.mapCard}>
            <span className={styles.mapPin}>{Icon.pin}</span>
            <div>
              <strong>Wollo University</strong>
              <span>Kombolcha Campus · Registrar</span>
            </div>
            <a className={styles.mapBtn} href={DIRECTIONS} target="_blank" rel="noreferrer">
              Get directions
              <span className={styles.btnIcon}>{Icon.arrow}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- Closing band ---------------- */}
      <section className={styles.band}>
        <h2 className={styles.bandTitle}>Still have a question?</h2>
        <p>Call us or walk in. We would rather answer it in person.</p>
        <div className={styles.bandActions}>
          <a className={styles.btn} href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
            Call the Registrar
            <span className={styles.btnIcon}>{Icon.arrow}</span>
          </a>
          <a className={styles.btnLight} href={`mailto:${CONTACT.email}`}>
            Email us
          </a>
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, error, wide, children }) {
  return (
    <div className={`${styles.field} ${wide ? styles.wide : ""} ${error ? styles.hasError : ""}`}>
      <label htmlFor={name}>{label}</label>
      {/* clone to attach id + aria */}
      {cloneWithId(children, name, error)}
      {error && (
        <span id={`${name}-err`} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}

function cloneWithId(child, name, error) {
  return cloneElement(child, {
    id: name,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": error ? `${name}-err` : undefined,
  });
}