import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

const STARS = [
  { top: "12%", left: "18%", delay: "0s", size: 4 },
  { top: "22%", left: "72%", delay: "0.6s", size: 3 },
  { top: "35%", left: "8%", delay: "1.2s", size: 3 },
  { top: "60%", left: "88%", delay: "0.3s", size: 5 },
  { top: "72%", left: "14%", delay: "1.8s", size: 4 },
  { top: "18%", left: "46%", delay: "2.1s", size: 3 },
  { top: "80%", left: "62%", delay: "0.9s", size: 3 },
  { top: "48%", left: "93%", delay: "1.5s", size: 4 },
];

function NotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <main className={styles.page}>
      {/* Twinkling stars */}
      {STARS.map((s, i) => (
        <span
          key={i}
          className={styles.star}
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Floating planets */}
      <div className={`${styles.planet} ${styles.moon}`} aria-hidden="true" />
      <div className={`${styles.planet} ${styles.ringed}`} aria-hidden="true">
        <span className={styles.ring} />
      </div>
      <span className={`${styles.bubble} ${styles.bubbleOne}`} aria-hidden="true" />
      <span className={`${styles.bubble} ${styles.bubbleTwo}`} aria-hidden="true" />
      <span className={`${styles.bubble} ${styles.bubbleThree}`} aria-hidden="true" />

      <section className={styles.content}>
        <div className={styles.code} role="img" aria-label="Error 404">
          <span className={styles.digit}>4</span>

          <span className={styles.zero}>
            <span className={styles.portal}>
              <span className={styles.portalStars} />
              <span className={styles.orbit}>
                <span className={styles.orbitPlanet} />
              </span>
            </span>
          </span>

          <span className={styles.digit}>4</span>
        </div>

        <div className={styles.floor} />

        <h1 className={styles.title}>Lost in space?</h1>
        <p className={styles.text}>
          The page you are looking for can not be found
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={handleBack}>
            Go Back
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>
      </section>
    </main>
  );
}

export default NotFound;