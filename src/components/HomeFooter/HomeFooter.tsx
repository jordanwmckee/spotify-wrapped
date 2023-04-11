import { Link } from 'react-router-dom';
import styles from './HomeFooter.module.css';
import { loginUrl } from 'spotify';

const HomeFooter = () => {
  return (
    <div className={styles.homeFooter}>
      <div className={styles.homeFooterLinks}>
        <div className={styles.homeFooterLeft}>
          <h3>Navigation</h3>
          <Link to="/">Home</Link>
          <Link to={loginUrl}>Login</Link>
        </div>
        <div className={styles.homeFooterRight}>
          <h3>Other</h3>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <a
            target="_blank"
            href="https://github.com/jordanwmckee/spotify-wrapped"
          >
            Source Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeFooter;
