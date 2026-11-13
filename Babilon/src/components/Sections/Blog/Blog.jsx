import { useCallback, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

/* Images from src/assets/BlogImages  (adjust ../../ if your Blog folder is nested differently) */
import kiotImg from '../../../assets/BlogImages/kiot.png';
import libraryImg from '../../../assets/BlogImages/wollo-library.png';
import titaImg from '../../../assets/BlogImages/wollo-tita.png';

const SLIDES = [
  {
    id: 'kiot',
    label: 'KIOT Students Life',
    alt: 'Students walking between dormitory blocks and green courtyards at KIOT',
    image: kiotImg,
    tone: '#2a6fb0',
    hotspot: { x: 9, y: 50 },
    card: {
      image: kiotImg,
      tag: 'KIOT, Kombolcha Campus',
      title: 'Student Life at KIOT',
      text: 'Modern dormitories, green courtyards and shared study spaces where engineering and technology students live, learn and build together.',
      to: '/gallery/kiot',
    },
  },
  {
    id: 'library',
    label: 'Libraries & Learning',
    alt: 'The Wollo University library building',
    image: libraryImg,
    tone: '#1a5fa8',
    hotspot: { x: 24, y: 62 },
    card: {
      image: libraryImg,
      tag: 'Central Library',
      title: 'A Place to Think',
      text: 'Quiet reading halls, digital resources and group rooms open to every student, with extended hours during exam weeks.',
      to: '/gallery/library',
    },
  },
  {
    id: 'tita',
    label: 'Tita Campus Life',
    alt: 'Wollo University Tita campus',
    image: titaImg,
    tone: '#154f8e',
    hotspot: { x: 14, y: 40 },
    card: {
      image: titaImg,
      tag: 'Tita Campus',
      title: 'Life at Tita',
      text: 'Lecture halls, open green spaces and a lively student community in one of our campuses.',
      to: '/gallery/tita',
    },
  },
];


/* ── Icons ── */
const Arrow = ({ dir = 'right' }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);
const Plus = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const Close = () => (
  <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M2 2l10 10M12 2 2 12" />
  </svg>
);
const UpRight = () => (
  <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11 11 3M4.5 3H11v6.5" />
  </svg>
);
const PauseIcon = ({ playing }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    {playing ? (<><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>)
             : <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5z" />}
  </svg>
);

/* Title split into words > letters so each letter can rise in */
function SplitTitle({ text }) {
  let n = 0;
  return text.split(' ').map((word, wi) => (
    <span className="bg-word" aria-hidden="true" key={wi}>
      {[...word].map((ch) => {
        n += 1;
        return <span className="bg-char" style={{ '--i': n }} key={n}>{ch}</span>;
      })}
    </span>
  ));
}

const pad2 = (n) => String(n).padStart(2, '0');

function Blog() {
  const [index, setIndex] = useState(0);
  const [cardOpen, setCardOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const swipeStart = useRef(null);

  const count = SLIDES.length;
  const slide = SLIDES[index];
  const upNext = SLIDES[(index + 1) % count];
  const paused = hover || userPaused || cardOpen;

  const go = useCallback((i) => {
    setIndex((i + count) % count);
    setCardOpen(false);
  }, [count]);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'Escape') setCardOpen(false);
  };

  /* Swipe (touch + mouse drag) */
  const onPointerDown = (e) => {
    if (e.target.closest('button, a, aside')) return;
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (swipeStart.current == null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };

  return (
    <section
      className={`bg-section ${paused ? 'is-paused' : ''} ${cardOpen ? 'has-card' : ''}`}
      aria-roledescription="carousel"
      aria-label="Life at Wollo University"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* ── Photo stack ── */}
      <div
        className="bg-stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { swipeStart.current = null; }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`bg-slide ${i === index ? 'is-active' : ''}`}
            style={{ '--tone': s.tone }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
          >
            <img
              src={s.image}
              alt={s.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable="false"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        ))}
        <div className="bg-shade" aria-hidden="true" />
      </div>

      {/* ── Top row ── */}
      <div className="bg-top">
        <Link to="/campus-life" className="bg-chip">Explore life at WOU</Link>
        <div className="bg-count" aria-hidden="true">
          <b>{pad2(index + 1)}</b><i /><span>{pad2(count)}</span>
        </div>
      </div>

      {/* ── Big title ── */}
      <div className="bg-title-wrap">
        <h2 className="bg-title" key={slide.id} aria-label={slide.label}>
          <SplitTitle text={slide.label} />
        </h2>
      </div>

      {/* ── "+" hotspot ── */}
      <button
        type="button"
        className={`bg-hotspot ${cardOpen ? 'is-open' : ''}`}
        style={{ '--hx': slide.hotspot.x, '--hy': slide.hotspot.y }}
        aria-expanded={cardOpen}
        aria-controls="bg-card"
        aria-label={cardOpen ? 'Close details' : `More about ${slide.label}`}
        onClick={() => setCardOpen((v) => !v)}
      >
        <Plus />
      </button>

      {/* ── Info card ── */}
      <aside id="bg-card" className={`bg-card ${cardOpen ? 'is-open' : ''}`} aria-label={slide.card.title} aria-hidden={!cardOpen}>
        <div className="bg-card-media">
          <img
            src={slide.card.image}
            alt=""
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <button type="button" className="bg-card-close" aria-label="Close details" onClick={() => setCardOpen(false)}>
            <Close />
          </button>
        </div>
        <div className="bg-card-body">
          <span className="bg-card-tag">{slide.card.tag}</span>
          <h3>{slide.card.title}</h3>
          <p>{slide.card.text}</p>
          <Link className="bg-card-link" to={slide.card.to}>
            View Gallery <UpRight />
          </Link>
        </div>
      </aside>

      {/* ── Up next (desktop) ── */}
      <button type="button" className="bg-next" onClick={next} aria-label={`Next slide: ${upNext.label}`}>
        <span className="bg-next-thumb" style={{ '--tone': upNext.tone, backgroundImage: `url(${upNext.image})` }} aria-hidden="true" />
        <span className="bg-next-text"><small>Up next</small>{upNext.label}</span>
      </button>

      {/* ── Controls ── */}
      <div className="bg-controls">
        <button type="button" className="bg-arrow" onClick={prev} aria-label="Previous slide"><Arrow dir="left" /></button>

        <div className="bg-dots" role="tablist" aria-label="Choose slide">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${s.label}`}
              className={`bg-dot ${i === index ? 'is-on' : ''}`}
              onClick={() => go(i)}
            >
              {i === index && <span className="bg-fill" onAnimationEnd={next} />}
            </button>
          ))}
        </div>

        <button type="button" className="bg-arrow" onClick={next} aria-label="Next slide"><Arrow /></button>

        <button
          type="button"
          className="bg-pause"
          aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
          onClick={() => setUserPaused((v) => !v)}
        >
          <PauseIcon playing={!userPaused} />
        </button>
      </div>
    </section>
  );
}

export default Blog;