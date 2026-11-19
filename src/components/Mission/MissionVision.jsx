import React, { useEffect, useRef, useState } from 'react';
import styles from './MissionVision.module.css';

/* ---------- Content (edit here) ---------- */
const TOP_PHOTO = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_Rx9aNwKwIisWrjRkynAkfleq_nrjXSmjuzOEM1H_cZXFQoPkkdGAT8wE&s=10';
const BOTTOM_PHOTO = 'https://static.wixstatic.com/media/118341_b124faf4e2b8400a8ebfca993a20ad44~mv2.jpg/v1/fill/w_1000,h_666,al_c,q_85,usm_0.66_1.00_0.01/118341_b124faf4e2b8400a8ebfca993a20ad44~mv2.jpg';

const MISSION =
  'To provide quality education and conduct problem-solving research that contributes to the industrial and social development of Ethiopia, preparing graduates with practical, industry-ready skills and serving our communities through knowledge and innovation.';

const VISION =
  'To be a leading university in Ethiopia and in East Africa, recognized for outstanding quality education, research, technology transfer and community development services.';

const MOTTO = ['Knowledge', 'for Sustainable', 'Development'];

/* ---------- Helpers ---------- */
function Photo({ src, className, alt = '' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [src]);
  if (!src || failed) return null;
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* Torn-paper photo: white ragged backing + photo cut with a ragged edge */
function TornPhoto({ src, alt, label, className = '' }) {
  return (
    <div className={`${styles.torn} ${className}`}>
      <div className={styles.tornPaper} />
      <div className={styles.tornInner}>
        <div className={styles.tornFallback}>
          <span>{label}</span>
        </div>
        <Photo className={styles.tornImg} src={src} alt={alt} />
      </div>
    </div>
  );
}

/* Round seal with text running around the edge */
function Seal() {
  return (
    <div className={styles.seal}>
      <svg viewBox="0 0 200 200" className={styles.sealRing} aria-hidden="true">
        <defs>
          <path id="wuSealPath" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="#fff" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="#1a5fa8" strokeWidth="6" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="#c62f3b" strokeWidth="2" />
        <text className={styles.sealText}>
          <textPath href="#wuSealPath" startOffset="0">
            WOLLO UNIVERSITY · DESSIE · ETHIOPIA · EST. 2005 ·
          </textPath>
        </text>
      </svg>
      <div className={styles.sealCore}>
        <span>WU</span>
      </div>
    </div>
  );
}

function Label({ children, id }) {
  return (
    <span className={styles.pill} id={id}>
      <span className={styles.pillText}>{children}</span>
      <span className={styles.pillCap} aria-hidden="true" />
    </span>
  );
}

/* ---------- Component ---------- */
function MissionVision() {
  const [ref, inView] = useInView(0.2);

  return (
    <section
      ref={ref}
      className={`${styles.section} ${inView ? styles.in : ''}`}
      aria-label="Mission and vision"
    >
      {/* big faded watermark */}
      <div className={styles.watermark} aria-hidden="true">
        <span>WU</span>
        <span>WU</span>
        <span>WU</span>
      </div>

      {/* vertical colour bars */}
      <div className={`${styles.bars} ${styles.barsTop}`} aria-hidden="true">
        <i /><i /><i />
      </div>
      <div className={`${styles.bars} ${styles.barsMid}`} aria-hidden="true">
        <i /><i /><i />
      </div>
      <div className={`${styles.bars} ${styles.barsEnd}`} aria-hidden="true">
        <i /><i />
      </div>

      <div className={styles.inner}>
        {/* ----- top: seal + photo ----- */}
        <div className={styles.top}>
          <Seal />
          <TornPhoto
            className={styles.photoTop}
            src={TOP_PHOTO}
            alt="Wollo University students"
            label="Students"
          />
        </div>

        {/* ----- mission ----- */}
        <div className={styles.block}>
          <Label>Mission</Label>
          <p className={styles.text}>{MISSION}</p>
        </div>

        {/* ----- vision ----- */}
        <div className={styles.block}>
          <Label>Vision</Label>
          <p className={styles.text}>{VISION}</p>
        </div>

        {/* ----- bottom: photo + motto ----- */}
        <div className={styles.bottom}>
          <TornPhoto
            className={styles.photoBottom}
            src={BOTTOM_PHOTO}
            alt="Dessie and the Wollo highlands"
            label="Dessie"
          />

          <div className={styles.mottoWrap}>
            <p className={styles.mottoSolid} aria-label="Knowledge for Sustainable Development">
              {MOTTO.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className={styles.mottoOutline} aria-hidden="true">
              {MOTTO.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className={styles.tag}>
              <span className={styles.tagDot} />
              Wollo University &middot; Since 2005
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MissionVision;