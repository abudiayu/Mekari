import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className={styles['nx-hero']}>
      {/* Background video */}
      <div className={styles['nx-bg']}>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/693205bf-8048-456a-879e-4e0a1b85a098.webp"
          aria-label="Painted alpine panorama: a lone hiker with a pink backpack faces a snow-capped peak above a sea of clouds"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_123836_11a3c5e0-713f-4bef-a8e9-7dd93bdea3b0.mp4"
            type="video/mp4"
          />
        </video>
        <div className={styles['nx-scrim']} aria-hidden="true" />
        <div className={styles['nx-shade']} aria-hidden="true" />
      </div>

      {/* Hero copy */}
      <div className={styles['nx-copy']}>
        <span className={styles['nx-eyebrow']}>{t('hero.eyebrow')}</span>

        <div className={styles['nx-headline-mask']}>
          <h1 className={styles['nx-headline']}>
            Knowledge, <span className={styles['nx-headline-gold']} style={{ color: '#1a5fa8' }}>Innovation</span>, <br /> Excellence
          </h1>
        </div>

        <p className={styles['nx-lede']}>{t('hero.lede')}</p>

        <div className={styles['nx-cta-group']}>
          <Link className={`${styles['nx-cta']} ${styles['nx-cta-primary']}`} to="/departments">
            <span>{t('hero.cta')}</span>
          </Link>
          <Link className={`${styles['nx-cta']} ${styles['nx-cta-ghost']}`} to="/login">
            <span>Student Portal &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles['nx-stats-bar']}>
        <span>25K+ Students</span>
        <span className={styles['nx-stat-dot']}>•</span>
        <span>80+ Programs</span>
        <span className={styles['nx-stat-dot']}>•</span>
        <span>40 Years</span>
      </div>

      {/* Wave divider */}
      <div className={styles['nx-hero-wave']} aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={styles['nx-hero-wave-svg']}>
          <path
            d="M0,50 C240,10 480,90 720,50 C960,20 1200,90 1440,40 L1440,120 L0,120 Z"
            className={styles['nx-hero-wave-path']}
          />
        </svg>
      </div>
    </section>
  );
}
