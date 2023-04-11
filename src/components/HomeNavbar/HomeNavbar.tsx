import { Link } from 'react-router-dom';
import Logo from '../../assets/logos/logo.png';
import styles from './HomeNavbar.module.css';
import { loginUrl } from 'spotify';

const Navbar = () => {
  return (
    <div id={styles.homeNavbar}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={Logo} alt="ber_logo" />
        </Link>
      </div>
      <div className="home-button">
        <Link to={loginUrl}>Login</Link>
      </div>
    </div>
  );
};

export default Navbar;
