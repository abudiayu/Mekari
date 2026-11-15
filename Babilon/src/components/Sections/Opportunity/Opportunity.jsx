import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Opportunity.module.css';

/* Same images as the Blog slider (adjust ../../../ if your folder is nested differently) */
import kiotImg from '../../../assets/BlogImages/kiot.png';
import libraryImg from '../../../assets/BlogImages/wollo-library.png';
import titaImg from '../../../assets/BlogImages/wollo-tita.png';

const IMAGES = [kiotImg, libraryImg, titaImg];

/* One "half" of the strip must be wider than the screen, so the 3 photos are
   repeated 3 times; the half is then duplicated once for the seamless loop. */
const HALF = [...IMAGES, ...IMAGES, ...IMAGES];
const SLIDES = [...HALF, ...HALF];

const SPEED = 0.8; // px per frame (auto-scroll to the left)

function Opportunity() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [grabbing, setGrabbing] = useState(false);

  /* physics state lives in a ref so it never triggers a re-render */
  const s = useRef({
    offset: 0,
    velocity: 0,
    dragging: false,
    startX: 0,
    startOffset: 0,
    lastX: 0,
    lastT: 0,
  });

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = reduce ? 0 : SPEED;

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(section);

    const tick = () => {
      const st = s.current;

      if (visible) {
        if (!st.dragging) {
          if (Math.abs(st.velocity) > 0.1) {
            st.offset += st.velocity;       // momentum
            st.velocity *= 0.95;            // decay
          } else {
            st.velocity = 0;
            st.offset -= speed;             // resume auto-scroll
          }
        }

        /* seamless wrap: one loop = distance between slide 0 and slide HALF.length */
        const loopStart = track.children[HALF.length];
        const period = loopStart ? loopStart.offsetLeft - track.children[0].offsetLeft : 0;
        if (period > 0) {
          while (st.offset <= -period) { st.offset += period; st.startOffset += period; }
          while (st.offset > 0)        { st.offset -= period; st.startOffset -= period; }
        }

        track.style.transform = `translate3d(${st.offset}px, 0, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const onPointerDown = (e) => {
    const st = s.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    st.dragging = true;
    st.velocity = 0;
    st.startX = e.clientX;
    st.startOffset = st.offset;
    st.lastX = e.clientX;
    st.lastT = performance.now();
    setGrabbing(true);
  };

  const onPointerMove = (e) => {
    const st = s.current;
    if (!st.dragging) return;
    const now = performance.now();
    const dt = Math.max(now - st.lastT, 1);
    st.velocity = ((e.clientX - st.lastX) / dt) * 16;   // normalised to ~60fps
    st.offset = st.startOffset + (e.clientX - st.startX);
    st.lastX = e.clientX;
    st.lastT = now;
  };

  const endDrag = (e) => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    /* held still before letting go → no fling */
    if (performance.now() - st.lastT > 80) st.velocity = 0;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setGrabbing(false);
  };

  return (
    <section className={styles.section} ref={sectionRef} aria-labelledby="opportunity-title">
      {/* ── Hero text ── */}
      <div className={styles.hero}>
        <h2 id="opportunity-title" className={styles.title}>
          Opportunities Built for<br />Wollo University
        </h2>
        <p className={styles.lead}>
          Scholarships, internships, jobs and research calls, gathered in one place
          for students, staff and alumni.
        </p>
      </div>

      {/* ── Image marquee ── */}
      <div className={styles.marquee}>
        <div className={`${styles.mask} ${styles.maskTop}`} aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0 0H1440V50C1440 50 1200 100 720 100C240 100 0 50 0 50V0Z" fill="#fff" />
          </svg>
        </div>

        <div
          ref={trackRef}
          className={`${styles.track} ${grabbing ? styles.grabbing : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {SLIDES.map((src, i) => (
            <div className={styles.slide} key={i}>
              <img
                className={styles.img}
                src={src}
                alt=""
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className={`${styles.mask} ${styles.maskBottom}`} aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0 100H1440V50C1440 50 1200 0 720 0C240 0 0 50 0 50V100Z" fill="#fff" />
          </svg>
        </div>
      </div>

      {/* ── Bottom ── */}
      <div className={styles.bottom}>
        <p className={styles.copy}>
          Wollo-Info brings scholarships, internships, jobs and research calls from
          across the Wollo region into one hub, so you can see what is open and
          apply with confidence.
        </p>

        <div className={styles.links}>
          <Link to="/opportunities" className={styles.link}>Browse Opportunities</Link>
          <Link to="/auth" className={styles.link}>Create an Account</Link>
        </div>
      </div>
    </section>
  );
}

export default Opportunity;