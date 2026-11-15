import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Statics.module.css';

const cx = (...classes) => classes.filter(Boolean).join(' ');

/* Decorative bar heights (index 12 is the highlighted bar) */
const BAR_HEIGHTS = [20, 33, 48, 56, 51, 47, 39, 31, 53, 55, 60, 56, 100, 92, 76, 67, 62, 65, 59, 70, 74, 87, 83, 77];

const QUICK_LINKS = [
  { label: 'Library', to: '/library' },
  { label: 'E-Learning', to: '/e-learning' },
  { label: 'Campus Life', to: '/campus-life' },
  { label: 'Alumni', to: '/alumni' },
  { label: 'Departments', to: '/departments' },
];

const BANDS = [
  [0.08, 0.26, 0.29, 0.32, 'rgba(160,196,235,.60)'],
  [0.23, 0.42, 0.30, 0.335, 'rgba(100,160,218,.70)'],
  [0.50, 0.75, 0.32, 0.355, 'rgba(58,125,200,.82)'],
  [0.69, 0.98, 0.33, 0.365, 'rgba(140,185,230,.54)'],
  [0.39, 0.51, 0.31, 0.345, 'rgba(26,95,168,.96)'],
];
const THREADS = [
  [0.05, 0.30, 0.68],
  [0.20, 0.315, 0.60],
  [0.62, 0.342, 0.84],
  [0.82, 0.352, 0.74],
  [0.97, 0.36, 0.64],
];

function FlowCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (!w || !h) return;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      const x = c.getContext('2d');
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.clearRect(0, 0, w, h);
      const hold = 0.38;
      const approach = 0.74;

      BANDS.forEach(([s0, s1, t0, t1, color]) => {
        x.beginPath();
        x.moveTo(0, h * s0);
        x.bezierCurveTo(w * hold, h * s0, w * approach, h * t0, w, h * t0);
        x.lineTo(w, h * t1);
        x.bezierCurveTo(w * approach, h * t1, w * hold, h * s1, 0, h * s1);
        x.closePath();
        x.fillStyle = color;
        x.fill();
      });

      x.lineWidth = Math.max(0.72, w * 0.00135);
      THREADS.forEach(([s, t, a]) => {
        x.beginPath();
        x.moveTo(0, h * s);
        x.bezierCurveTo(w * hold, h * s, w * approach, h * t, w, h * t);
        x.strokeStyle = `rgba(255,255,255,${a})`;
        x.stroke();
      });
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={ref}
      className={styles['st-flow']}
      aria-label="Research outputs converging into one result"
    />
  );
}

function Statics() {
  const rootRef = useRef(null);

  const [phase, setPhase] = useState(() =>
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    Element.prototype.animate
      ? 'pending'
      : 'done'
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || phase !== 'pending') return undefined;

    let anims = [];
    let timer;
    const finish = () => {
      anims.forEach((a) => a.cancel());
      clearTimeout(timer);
      setPhase('done');
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        try {
          const vw = window.innerWidth;
          const single = vw > 960;
          const compact = vw <= 512;
          const rise = compact ? 11 : 16;
          const place = 'cubic-bezier(.16,1,.3,1)';
          const wipe = 'cubic-bezier(.24,.86,.28,1)';
          const go = (el, from, to, dur, delay, ease) => {
            if (el) anims.push(el.animate([from, to], { duration: dur, delay, easing: ease, fill: 'both' }));
          };

          // Query by the hashed module class name via the ref
          const cards = [...root.querySelectorAll('[class*="st-card"]')];
          const order = single ? [1, 0, 2] : cards.map((_, i) => i);

          order.forEach((idx, i) => {
            const el = cards[idx];
            if (!el) return;
            const primary = single && idx === 1;
            const d = single ? (primary ? 60 : 245 + (i - 1) * 85) : 70 + i * 115;
            const side = idx === 0 ? -1 : idx === 2 ? 1 : 0;
            const drift = single && !primary ? -side * Math.min(vw * 0.018, 7) : 0;

            go(el, { opacity: 0, transform: `translate3d(${drift}px,${rise}px,0) scale(.985)` },
              { opacity: 1, transform: 'none' }, compact ? 780 : primary ? 960 : 900, d, place);
            go(el.querySelector('[class*="st-panel"]'),
              { opacity: 0, transform: 'scale(.994)', clipPath: `inset(0 0 ${compact ? 26 : 34}% 0)` },
              { opacity: 1, transform: 'none', clipPath: 'inset(0 0 0 0)' }, compact ? 620 : 720, d + 200, wipe);
            go(el.querySelector('[class*="st-copy"]'),
              { opacity: 0, transform: `translate3d(0,${compact ? 8 : 11}px,0)` },
              { opacity: 1, transform: 'none' }, compact ? 540 : 620, d + 330, place);
            const a = { opacity: 0, clipPath: 'inset(-30% 0 100% 0)' };
            const b = { opacity: 1, clipPath: 'inset(-30% 0 -30% 0)' };
            go(el.querySelector('h3'), a, b, compact ? 470 : 540, d + 350, wipe);
            go(el.querySelector('[class*="st-copy"] p'), a, b, compact ? 430 : 490, d + 450, wipe);
            go(el.querySelector('[class*="st-corner"]'), { opacity: 0, transform: 'scale(.88)' },
              { opacity: 1, transform: 'none' }, compact ? 340 : 400, d + 540, place);
          });

          go(root.querySelector('[class*="st-head"]'), { opacity: 0 }, { opacity: 1 }, 600, 120, place);
          go(root.querySelector('[class*="st-foot"]'), { opacity: 0 }, { opacity: 1 }, 600, single ? 520 : 300, place);

          setPhase('active');
          timer = setTimeout(finish, 4000);
          Promise.all(anims.map((a) => a.finished)).then(finish, finish);
        } catch {
          finish();
        }
      },
      { threshold: 0.2 }
    );

    io.observe(root);
    return () => {
      io.disconnect();
      anims.forEach((a) => a.cancel());
      clearTimeout(timer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={rootRef}
      className={cx(styles['st-section'], phase === 'pending' && styles['st-pending'])}
      aria-labelledby="st-title"
    >
      <div className={styles['st-inner']}>
        {/* ── Header ── */}
        <header className={styles['st-head']}>
          <div>
            <span className={styles['st-eyebrow']}>BY THE NUMBERS</span>
            <h2 id="st-title">Our Impact in Numbers</h2>
            <div className={styles['st-rule']} aria-hidden="true"><i /><i /></div>
          </div>
          <Link className={styles['st-stats-link']} to="/statistics">View statistics ↗</Link>
        </header>

        {/* ── Triptych ── */}
        <div className={styles['st-cards']}>
          {/* Card 1 — graduates + QS rank */}
          <article className={styles['st-card']}>
            <div className={styles['st-panel']} aria-label="Graduates over time chart">
              <div className={styles['st-timeline']}>
                <span>2007</span><i /><span>2015</span><i /><span>2025</span>
              </div>
              <div className={styles['st-rank']} title="QS World University Rankings">
                #Top 10 in East Africa
              </div>
              <div className={styles['st-bars']} aria-hidden="true">
                {BAR_HEIGHTS.map((h, i) => (
                  <i
                    key={i}
                    className={cx(styles['st-bar'], i === 12 && styles['active'])}
                    style={{ '--h': `${h}%` }}
                  />
                ))}
              </div>
              <div className={styles['st-chip']}>280K+</div>
              <div className={styles['st-axis']}>
                <span>START</span><span>2014</span><span>2020</span><span>TODAY</span>
              </div>
            </div>
            <div className={styles['st-copy']}>
              <h3>All-Time Graduates</h3>
              <p>More than 280K+ graduates<br />and counting.</p>
              <span className={styles['st-corner']}><i className={styles['st-spark']} /></span>
            </div>
          </article>

          {/* Card 2 — notable alumni */}
          <article className={styles['st-card']}>
            <div className={styles['st-panel']}>
              <div className={styles['st-assistant']}>
                <span className={styles['st-badge']}><i className={styles['st-spark']} /></span>
                <span>WOU Alumni</span>
              </div>
              <p className={styles['st-question']}>Who are our notable alumni?</p>
              <div className={styles['st-prompt']}>
                Our university has produced<br />numerous notable alumni who lead<br />across every sector.
              </div>
              <Link className={styles['st-cta']} to="/alumni">
                <span className={styles['st-cta-label']}>View List</span>
                <span aria-hidden="true">↗</span>
              </Link>
              <i className={styles['st-cursor']} aria-hidden="true" />
            </div>
            <div className={styles['st-copy']}>
              <h3>WOU Notable Alumni</h3>
              <p>Our graduates lead across<br />every sector.</p>
              <span className={styles['st-corner']}><i className={styles['st-flow-icon']} /></span>
            </div>
          </article>

          {/* Card 3 — research leaders */}
          <article className={cx(styles['st-card'], styles['c3'])}>
            <div className={styles['st-panel']}>
              <div className={styles['st-metric']}>
                <div className={styles['st-metric-label']}>Leaders in Research</div>
                <div className={styles['st-metric-row']}>
                  <strong>12K+</strong><span>↑ since 2014</span>
                </div>
              </div>
              <FlowCanvas />
              <div className={cx(styles['st-tag'], styles['action'])}>12,293 Outputs</div>
              <div className={cx(styles['st-tag'], styles['confidence'])}>Research Groups &amp; Projects</div>
              <div className={cx(styles['st-tag'], styles['path'])}>Publications Since 2014</div>
            </div>
            <div className={styles['st-copy']}>
              <h3>Research Leaders</h3>
              <p>12,293 scholarly outputs<br />since 2014.</p>
              <span className={styles['st-corner']}><i className={styles['st-speed']} /></span>
            </div>
          </article>
        </div>

        {/* ── Quick links ── */}
        <nav className={styles['st-foot']} aria-label="Quick links">
          <b>QUICK LINKS:</b>
          {QUICK_LINKS.map((l) => (
            <Link key={l.label} to={l.to}>
              {l.label} <em>↗</em>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

export default Statics;
