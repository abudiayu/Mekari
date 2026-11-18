import { useEffect, useState } from "react";
import styles from "./Loding.module.css";

/**
 * Props
 * - ready:        set to false while you are still fetching data (default true)
 * - minDuration:  minimum time (ms) the loader stays visible (default 600)
 * - waitForLoad:  wait for all images/fonts to finish loading (default true).
 *                 Set to false to only wait for the minimum time.
 * - onFinish:     called after the fade-out finishes
 */
export default function Loding({
  ready = true,
  minDuration = 600,
  waitForLoad = true,
  onFinish,
}) {
  const [progress, setProgress] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(
    !waitForLoad ||
      (typeof document !== "undefined" && document.readyState === "complete")
  );
  const [minPassed, setMinPassed] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Wait for the browser "load" event (images, fonts, scripts, ...).
  useEffect(() => {
    if (pageLoaded) return;
    const handleLoad = () => setPageLoaded(true);
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, [pageLoaded]);

  // Minimum display time so the animation never just flashes.
  useEffect(() => {
    const t = setTimeout(() => setMinPassed(true), minDuration);
    return () => clearTimeout(t);
  }, [minDuration]);

  // Fake progress: climbs quickly, then waits at 90% until everything is ready.
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : Math.min(90, p + (90 - p) * 0.2 + 1)));
    }, 60);
    return () => clearInterval(id);
  }, []);

  const allReady = pageLoaded && minPassed && ready;

  // Finish: fill the bar to 100%, fade out, then notify the parent.
  useEffect(() => {
    if (!allReady) return;
    setProgress(100);
    const fadeTimer = setTimeout(() => setLeaving(true), 250);
    const doneTimer = setTimeout(() => onFinish && onFinish(), 700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [allReady, onFinish]);

  // Lock page scroll while the loader is visible.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className={`${styles.loader} ${leaving ? styles.leaving : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.scene}>
        <div className={styles.ball}>
          <span className={styles.shine} />
        </div>

        <div className={styles.hole}>
          <span className={styles.holeInner} />
          <span className={styles.ripple} />
        </div>
      </div>

      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>

      <p className={styles.text}>
        Loading
        <span className={styles.dot}>.</span>
        <span className={styles.dot}>.</span>
        <span className={styles.dot}>.</span>
      </p>
    </div>
  );
}