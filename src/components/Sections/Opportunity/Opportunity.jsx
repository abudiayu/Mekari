import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Opportunity.module.css';

/* Image links (no local imports needed).
   Replace each URL with a Wollo University photo address:
   open the photo in your browser, right-click it, choose "Copy image address",
   then paste it between the quotes below. */
const kiotImg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRT4lZ-ycFXW2Vnh6MsFCFYoxMh7KPBS-sAQMT7TpuPUNVF-MvGSTvi_U&s=10';     // KIoT, Kombolcha
const libraryImg = 'https://static.wixstatic.com/media/118341_b124faf4e2b8400a8ebfca993a20ad44~mv2.jpg/v1/fill/w_1000,h_666,al_c,q_85,usm_0.66_1.00_0.01/118341_b124faf4e2b8400a8ebfca993a20ad44~mv2.jpg';  // Library / Dessie campus
const titaImg = 'https://i.pinimg.com/1200x/34/9a/f2/349af23efa5223d1c9c51ea0f4cfb705.jpg';     // Tita campus
const titaImgss = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQU0C610iOLKA26Y-iGorzpSnjoB6oH7wh_ps1n_YJcHfdGbuFbxLg_Q4&s=10'; 
const titaImgs = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOjImlQp2elV2t7HqseUvUw82PTpJac8htfylL_e71qLIDMwDxf7saZ2Y&s=10'; 
const sport = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQioCZpGDvi79E6QkdtXHNt1IKszT2XYWCDBLzmrp8oTZ4U74VR0hxhcpc&s=10";
const muday = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk8nnxdHqhlQMpY8_0zbcZCfc8Bn0qpR1Puf0yXwy9JLOQoVt_Y96Q9g&s=10";


const IMAGES = [kiotImg, libraryImg, titaImg,titaImgs,titaImgss,sport,muday];

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
          Opportunities Built at<br />Wollo University
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