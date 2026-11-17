import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
// import ChatWidget from '../ChatWidget/ChatWidget';
import styles from './Layout.module.css';

/**
 * Global Layout: Navbar on top, the current page in the middle,
 * Footer at the bottom. Auth and 404 routes are kept outside it.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function Layout() {
  return (
    <div className={styles.shell}>
      <ScrollToTop />

      <header className={styles.top}>
        <Navbar />
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      {/* <ChatWidget /> */}

      <footer className={styles.bottom}>
        <Footer />
      </footer>
    </div>
  );
}