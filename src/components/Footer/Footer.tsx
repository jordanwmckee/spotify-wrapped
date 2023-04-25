import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <h4>Navigation</h4>
        <ul>
          <Link to="/">Dashboard</Link>
          <Link to="/analytics">Analytics</Link>
          <Link to="/discover">Discover</Link>
        </ul>
      </div>
      <div className={styles.footerRight}>
        <h4>Other</h4>
        <ul>
          <a
            href="https://github.com/jordanwmckee/spotify-wrapped"
            target="_blank"
          >
            Source Code
          </a>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
