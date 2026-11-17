import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

/* ------------------------------------------------------------------ */
/*  Settings you may want to change                                    */
/* ------------------------------------------------------------------ */

/* Background still for the left panel (and the two bands on phones).
   A dark, moody picture works best because white text sits on top. */
const BRAND_IMG =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/d889cba6-535c-450f-9b74-7270c0e01e9a.webp";

/* Height of your navbar in px. The page is sized to fit between the
   navbar and the footer so nothing is cut off or double-scrolls. */
const NAV_HEIGHT = 72;

/* true  -> your navbar is position: fixed (the page adds top padding)
   false -> your navbar is static/sticky and already takes up space */
const NAV_IS_FIXED = true;

/* Google sign-in without any backend (Google Identity Services).
   1. Google Cloud Console -> APIs & Services -> Credentials ->
      Create credentials -> OAuth client ID -> "Web application".
   2. Add http://localhost:5173 under "Authorized JavaScript origins"
      (and your live site URL later).
   3. Put the Client ID in your .env file as:
        VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
      then restart `npm run dev`. */
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID || "";

/* The signed-in user is kept here for now (no backend yet). */
const USER_KEY = "wollo-user";

/* Routes used by the links on this page. */
const ROUTES = {
  home: "/",
  afterLogin: "/", // used when the user did not come from a protected page
  register: "/register",
  departments: "/departments",
  unions: "/unions",
  resetPassword: "/reset-password",
};

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const REEL_ITEMS = [
  {
    text: "See courses, prerequisites and graduates for every department once you sign in.",
    name: "Department details",
    role: "For students",
    badge: "D",
    tone: "avatarA",
  },
  {
    text: "Follow your unions and clubs so news, trainings and opportunities find you first.",
    name: "Unions and clubs",
    role: "Tech Club, Sport, Media Art",
    badge: "U",
    tone: "avatarB",
  },
  {
    text: "Ask the chatbot how to fix a registration problem and get the steps, office and room.",
    name: "AI chatbot",
    role: "Amharic and English",
    badge: "AI",
    tone: "avatarC",
  },
];

const REEL = [0, 1, 2].flatMap((set) =>
  REEL_ITEMS.map((item) => ({ ...item, set }))
);

/* Sets the animation delay used by the CSS entrance. */
const t = (ms) => ({ "--d": `${ms}ms` });

/* Turns error text into something a student understands. */
function friendlyError(err, fallback) {
  const msg = (err?.message || "").toLowerCase();
  if (msg.includes("failed to fetch") || msg.includes("network"))
    return "No internet connection. Check your network and try again.";
  return err?.message || fallback;
}

/* ---------------- Local session helpers (no backend) ---------------- */
function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user, remember = true) {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
  (remember ? localStorage : sessionStorage).setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("wollo-auth-change"));
}

/* Loads Google's sign-in script once. */
let googleScript;
function loadGoogleScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (!googleScript) {
    googleScript = new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = "https://accounts.google.com/gsi/client";
      el.async = true;
      el.onload = resolve;
      el.onerror = () => {
        googleScript = undefined;
        reject(new Error("Could not load Google. Check your internet connection."));
      };
      document.head.appendChild(el);
    });
  }
  return googleScript;
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
function GoogleIcon() {
  return (
    <svg className={styles.googleIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3a7.2 7.2 0 0 1-10.7-3.78H1.4v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.36 14.31a7.2 7.2 0 0 1 0-4.62V6.6H1.4a12 12 0 0 0 0 10.8l3.96-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.8l3.43-3.43A11.9 11.9 0 0 0 12 0 12 12 0 0 0 1.4 6.6l3.96 3.09A7.16 7.16 0 0 1 12 4.75z"
      />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg
      className={styles.providerMark}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className={styles.controlIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogInIcon() {
  return (
    <svg className={styles.providerMark} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="m10 17 5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className={styles.msgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg className={styles.msgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/*                                                                     */
/*  Works without a backend: Google sign-in is real, email sign-in is   */
/*  a temporary local demo until your server is ready.                 */
/*  Optional props override the built-in behaviour:                    */
/*    onSignIn({ email, password, remember })  -> Promise              */
/*    onSignUp({ name, email, password })      -> Promise              */
/*    onGoogleSignIn()                         -> Promise              */
/*    onForgotPassword(email)                  -> Promise              */
/* ------------------------------------------------------------------ */
function Auth({ onSignIn, onSignUp, onGoogleSignIn, onForgotPassword }) {
  const navigate = useNavigate();
  const location = useLocation();

  /* After login, go back to the page the visitor came from. */
  const from = location.state?.from;
  const backTo =
    typeof from === "string" ? from : from?.pathname || ROUTES.afterLogin;

  /* "signin" or "signup". Opening /register starts on the sign-up form. */
  const [mode, setMode] = useState(
    location.pathname === ROUTES.register ? "signup" : "signin"
  );
  const isSignup = mode === "signup";

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [confirm, setConfirm] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const anyBusy = busy || googleBusy;

  /* If the visitor is already signed in, send them where they were going. */
  useEffect(() => {
    if (readUser()) navigate(backTo, { replace: true });
  }, [navigate, backTo]);

  /* ---------------- Default actions (no backend yet) ---------------- */

  /* TEMPORARY: accepts any email + password and remembers the user in
     this browser. Replace with a real API call when your backend is ready,
     or pass your own onSignIn prop. */
  const defaultSignIn = async ({ email: e, password: p, remember: r }) => {
    await new Promise((res) => setTimeout(res, 500));
    if (p.length < 6) throw new Error("Password must be at least 6 characters.");
    saveUser(
      { email: e, name: e.split("@")[0], provider: "email" },
      r
    );
  };

  /* Real Google sign-in: opens Google's account chooser, then reads the
     person's name, email and photo. */
  const defaultGoogle = async () => {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error(
        "Google is not set up yet. Add VITE_GOOGLE_CLIENT_ID to your .env file and restart the dev server."
      );
    }
    await loadGoogleScript();

    const accessToken = await new Promise((resolve, reject) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        prompt: "select_account",
        callback: (resp) =>
          resp?.access_token
            ? resolve(resp.access_token)
            : reject(new Error("Google sign-in did not finish. Please try again.")),
        error_callback: () =>
          reject(new Error("Google sign-in was closed before it finished.")),
      });
      client.requestAccessToken();
    });

    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("Could not read your Google account.");
    const g = await res.json();

    saveUser(
      { email: g.email, name: g.name, picture: g.picture, provider: "google" },
      true
    );
  };

  /* TEMPORARY: creates the account in this browser only. Replace with a
     real API call when your backend is ready, or pass your own onSignUp. */
  const defaultSignUp = async ({ name, email: e }) => {
    await new Promise((res) => setTimeout(res, 600));
    saveUser({ email: e, name, provider: "email" }, true);
  };

  /* TEMPORARY: pretends to send a reset email. */
  const defaultForgot = async () => {
    await new Promise((res) => setTimeout(res, 400));
  };

  /* ---------------- Handlers ---------------- */
  const switchMode = (next) => {
    setMode(next);
    setError("");
    setInfo("");
    setPassword("");
    setConfirm("");
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfo("");

    if (isSignup && !fullName.trim()) {
      setError("Enter your full name.");
      nameRef.current?.focus();
      return;
    }
    if (!email.trim()) {
      setError("Enter your email address.");
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      setError(isSignup ? "Create a password." : "Enter your password.");
      passwordRef.current?.focus();
      return;
    }
    if (isSignup) {
      if (password.length < 8) {
        setError("Your password must be at least 8 characters.");
        passwordRef.current?.focus();
        return;
      }
      if (password !== confirm) {
        setError("The two passwords do not match.");
        confirmRef.current?.focus();
        return;
      }
    }

    setError("");
    setBusy(true);
    try {
      if (isSignup) {
        await (onSignUp || defaultSignUp)({
          name: fullName.trim(),
          email: email.trim(),
          password,
        });
      } else {
        await (onSignIn || defaultSignIn)({
          email: email.trim(),
          password,
          remember,
        });
      }
      navigate(backTo, { replace: true });
    } catch (err) {
      setError(
        friendlyError(
          err,
          isSignup
            ? "We could not create your account. Please try again."
            : "We could not sign you in. Please try again."
        )
      );
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setInfo("");
    setGoogleBusy(true);
    try {
      await (onGoogleSignIn || defaultGoogle)();
      navigate(backTo, { replace: true });
    } catch (err) {
      setError(friendlyError(err, "Google sign-in did not finish. Please try again."));
    } finally {
      setGoogleBusy(false);
    }
  };

  const handleForgot = async () => {
    setInfo("");
    if (!email.trim()) {
      setError('Enter your email first, then press "Forgot password?".');
      emailRef.current?.focus();
      return;
    }
    setError("");
    try {
      await (onForgotPassword || defaultForgot)(email.trim());
      setInfo("If this email has an account, a reset link is on its way.");
    } catch (err) {
      setError(friendlyError(err, "We could not send the reset email."));
    }
  };

  return (
    <div
      className={`${styles.shell} ${NAV_IS_FIXED ? styles.navFixed : ""}`}
      style={{
        "--brand-img": `url(${BRAND_IMG})`,
        "--nav-h": `${NAV_HEIGHT}px`,
      }}
    >
      {/* ============================ BRAND PANEL ============================ */}
      <aside className={styles.brand} aria-label="About Wollo-Info Hub">
        <div className={`${styles.brandInset} ${styles.brandTop}`}>
          <Link className={styles.logo} to={ROUTES.home} aria-label="Wollo-Info home">
            <span
              className={`${styles.logoMark} ${styles.logoMarkAnim}`}
              style={t(0)}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9.5" r="5" stroke="#030712" strokeWidth="2.6" />
                <rect x="10.7" y="13" width="2.6" height="8" rx="1.3" fill="#030712" />
              </svg>
            </span>
            <span className={`${styles.logoWord} ${styles.logoWordAnim}`} style={t(90)}>
              wollo-info.
            </span>
          </Link>
        </div>

        <div className={styles.brandMid}>
          <div className={`${styles.brandInset} ${styles.hero}`}>
            <h2 className={styles.heroTitle}>
              <span className={styles.eLine}>
                <span className={styles.eIn} style={t(160)}>Explore Wollo.</span>
              </span>{" "}
              <span className={styles.eLine}>
                <span className={styles.eIn} style={t(250)}>Plan your future.</span>
              </span>
            </h2>
            <p className={`${styles.heroCopy} ${styles.settle}`} style={t(470)}>
              Sign in to see full department details, follow your unions and
              clubs, and get step-by-step help from the chatbot.
            </p>
          </div>

          <div className={styles.reel} aria-label="What you get with an account">
            <div className={styles.reelTrack}>
              {REEL.map((item, i) => (
                <figure
                  key={`${item.set}-${item.name}`}
                  className={`${styles.card} ${item.set === 0 ? styles.lift : ""}`}
                  style={item.set === 0 ? t(620 + i * 90) : undefined}
                  aria-hidden={item.set > 0 ? "true" : undefined}
                >
                  <blockquote className={styles.cardQuote}>{item.text}</blockquote>
                  <figcaption className={styles.cardWho}>
                    <span className={styles.cardId}>
                      <span className={styles.cardName}>{item.name}</span>
                      <span className={styles.cardRole}>{item.role}</span>
                    </span>
                    <span
                      className={`${styles.avatar} ${styles[item.tone]}`}
                      aria-hidden="true"
                    >
                      {item.badge}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className={`${styles.brandInset} ${styles.trust}`}>
            <div className={styles.trustRule} style={t(1000)}>
              <span className={`${styles.trustLabel} ${styles.presence}`} style={t(1060)}>
                Built for Wollo University
              </span>
            </div>
            <div className={styles.marks} aria-label="Campuses and student groups">
              <div className={`${styles.marksRow} ${styles.presence}`} style={t(1140)}>
                <span className={styles.mark}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 1.5c.6 5.2 3.3 7.9 8.5 8.5v0c-5.2.6-7.9 3.3-8.5 8.5c-.6-5.2-3.3-7.9-8.5-8.5c5.2-.6 7.9-3.3 8.5-8.5Z" transform="translate(0 2)" />
                  </svg>
                  Dessie
                </span>
                <span className={styles.mark}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 13l8-7 8 7" />
                    <path d="M4 19l8-7 8 7" />
                  </svg>
                  KIoT
                </span>
                <span className={styles.mark}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                    <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
                  </svg>
                  Tita
                </span>
                <span className={`${styles.mark} ${styles.markWord}`}>AppFactory</span>
              </div>
              <div className={`${styles.marksRow} ${styles.presence}`} style={t(1220)}>
                <span className={styles.mark}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                    <path d="M2.5 9c2.4-2.4 4.8-2.4 7.2 0s4.8 2.4 7.2 0 3.4-1.6 4.6-1.2" />
                    <path d="M2.5 16c2.4-2.4 4.8-2.4 7.2 0s4.8 2.4 7.2 0 3.4-1.6 4.6-1.2" />
                  </svg>
                  Tech Club
                </span>
                <span className={styles.mark}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true">
                    <circle cx="11" cy="13" r="7" />
                    <circle cx="19.5" cy="4.5" r="2.5" fill="currentColor" stroke="none" />
                  </svg>
                  Media Art
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.brandInset} ${styles.brandBottom}`}>
          <p className={`${styles.legal} ${styles.presence}`} style={t(1280)}>
            &copy; 2026 Wollo-Info Hub. All rights reserved.
          </p>
        </div>
      </aside>

      {/* ============================ AUTH PANEL ============================ */}
      <main className={styles.auth}>
        <div className={styles.authMain}>
          <section
            key={mode}
            className={styles.panel}
            aria-labelledby="auth-title"
          >
            <h1 className={styles.panelTitle} id="auth-title">
              <span className={styles.eLine}>
                <span className={styles.eIn} style={t(120)}>
                  {isSignup ? "Create your account" : "Welcome back!"}
                </span>
              </span>
            </h1>
            <p className={`${styles.panelSub} ${styles.settle}`} style={t(220)}>
              {isSignup
                ? "Join Wollo-Info as a student in a minute."
                : "Sign in to your Wollo-Info account."}
            </p>

            <div className={`${styles.quickSlot} ${styles.settleScale}`} style={t(300)}>
              <button
                className={styles.googleBtn}
                type="button"
                onClick={handleGoogle}
                disabled={anyBusy}
                aria-busy={googleBusy}
              >
                {googleBusy ? (
                  <span className={styles.spinner} aria-hidden="true" />
                ) : (
                  <GoogleIcon />
                )}
                <span className={styles.googleLabel}>
                  {googleBusy
                    ? "Opening Google..."
                    : isSignup
                    ? "Sign up with Google"
                    : "Continue with Google"}
                </span>
                {!googleBusy && <span className={styles.pill}>Fastest</span>}
              </button>
            </div>

            <div className={`${styles.or} ${styles.orTop}`} style={t(360)} role="separator">
              <span className={styles.presence} style={t(400)}>
                {isSignup ? "Or sign up with email" : "Or use your email"}
              </span>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {isSignup && (
                <div className={`${styles.field} ${styles.settle}`} style={t(420)}>
                  <label className={styles.label} htmlFor="name">Full name</label>
                  <div className={styles.control}>
                    <UserIcon />
                    <input
                      ref={nameRef}
                      className={styles.input}
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className={`${styles.field} ${styles.settle}`} style={t(470)}>
                <label className={styles.label} htmlFor="email">Email address</label>
                <div className={styles.control}>
                  <svg className={styles.controlIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    ref={emailRef}
                    className={styles.input}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={`${styles.field} ${styles.settle}`} style={t(520)}>
                <label className={styles.label} htmlFor="password">Password</label>
                <div className={styles.control}>
                  <svg className={styles.controlIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    ref={passwordRef}
                    className={styles.input}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    placeholder={isSignup ? "Create a password" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className={styles.reveal}
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    aria-controls="password"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {isSignup && (
                <div className={`${styles.field} ${styles.settle}`} style={t(570)}>
                  <label className={styles.label} htmlFor="confirm">Confirm password</label>
                  <div className={styles.control}>
                    <svg className={styles.controlIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      ref={confirmRef}
                      className={styles.input}
                      id="confirm"
                      name="confirm"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Type the password again"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                  </div>
                  <p className={styles.hint}>Use at least 8 characters.</p>
                </div>
              )}

              {!isSignup && (
                <div className={`${styles.row} ${styles.settle}`} style={t(600)}>
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      name="remember"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span className={styles.checkBox} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <span className={styles.checkText}>Remember me</span>
                  </label>
                  <button className={styles.linkStrong} type="button" onClick={handleForgot}>
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <p className={styles.msg} role="alert">
                  <AlertIcon />
                  <span>{error}</span>
                </p>
              )}
              {info && (
                <p className={`${styles.msg} ${styles.msgInfo}`} role="status">
                  <CheckCircleIcon />
                  <span>{info}</span>
                </p>
              )}

              <div className={`${styles.ctaSlot} ${styles.settleScale}`} style={t(650)}>
                <button className={styles.cta} type="submit" disabled={anyBusy}>
                  {busy ? (
                    <>
                      <span className={`${styles.spinner} ${styles.spinnerSm}`} aria-hidden="true" />
                      {isSignup ? "Creating account..." : "Signing in..."}
                    </>
                  ) : isSignup ? (
                    "Create account"
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className={styles.or} style={t(700)} role="separator">
              <span className={styles.presence} style={t(740)}>
                {isSignup ? "Already registered?" : "New to Wollo-Info?"}
              </span>
            </div>

            <div className={styles.providers}>
              {isSignup ? (
                <button
                  className={`${styles.provider} ${styles.settle}`}
                  style={t(760)}
                  type="button"
                  onClick={() => switchMode("signin")}
                >
                  <LogInIcon />
                  <span>I already have an account</span>
                </button>
              ) : (
                <button
                  className={`${styles.provider} ${styles.settle}`}
                  style={t(760)}
                  type="button"
                  onClick={() => switchMode("signup")}
                >
                  <UserPlusIcon />
                  <span>Create a student account</span>
                </button>
              )}
              <Link
                className={`${styles.provider} ${styles.settle}`}
                style={t(820)}
                to={ROUTES.home}
              >
                <svg className={styles.providerMark} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 10.5 12 3l9 7.5" />
                  <path d="M5 9.5V21h14V9.5" />
                </svg>
                <span>Continue as a visitor</span>
              </Link>
            </div>

            <p className={`${styles.switch} ${styles.presence}`} style={t(880)}>
              Department head or union account?{" "}
              <strong>Ask the admin to create yours.</strong>
            </p>
          </section>
        </div>

        <nav className={styles.authFoot} aria-label="Site links">
          <Link className={styles.presence} style={t(1160)} to={ROUTES.home}>Home</Link>
          <Link className={styles.presence} style={t(1200)} to={ROUTES.departments}>Departments</Link>
          <Link className={styles.presence} style={t(1240)} to={ROUTES.unions}>Unions</Link>
        </nav>
      </main>
    </div>
  );
}

export default Auth;