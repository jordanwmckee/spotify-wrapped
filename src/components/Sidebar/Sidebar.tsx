import { Link } from 'react-router-dom';
import DashboardIcon from 'assets/logos/dashboard.png';
import AnalyticsIcon from 'assets/logos/analytics.png';
import DiscoverIcon from 'assets/logos/discover.png';
import CreateIcon from 'assets/logos/forYou.png';
import styles from './Sidebar.module.css';

export const toggleSidebar = (): boolean => {
  // resize sidebar & add/remove overlay
  let sidebarMenu = document.getElementById(styles.sidebar)!;
  if (window.getComputedStyle(sidebarMenu).getPropertyValue('width') == '0px') {
    sidebarMenu.setAttribute('style', 'width: min(300px, 100%)');
    return false;
  } else {
    sidebarMenu.setAttribute('style', 'width: 0');
    return true;
  }
};

export const closeSidebar = () => {
  // close sidebar
  document.getElementById(styles.sidebar)!.setAttribute('style', 'width: 0');
};

const Sidebar = () => {
  return (
    <div id={styles.sidebar}>
      <div className={styles.sidebarTitle}>
        <h3>Monthly Wrapped</h3>
      </div>
      <h3 className={styles.navMenuText}>NAVIGATION MENU</h3>
      <div className={styles.links}>
        <Link to="/" className={styles.link}>
          <div className={styles.sidebarItem}>
            <img src={DashboardIcon} alt="" />
            <h3>Dashboard</h3>
          </div>
        </Link>
        <Link to="/analytics" className={styles.link}>
          <div className={styles.sidebarItem}>
            <img src={AnalyticsIcon} alt="" />
            <h3>Analytics</h3>
          </div>
        </Link>
        <Link to="/discover" className={styles.link}>
          <div className={styles.sidebarItem}>
            <img src={DiscoverIcon} alt="" />
            <h3>Discover</h3>
          </div>
        </Link>
        <Link to="/create" className={styles.link}>
          <div className={styles.sidebarItem}>
            <img src={CreateIcon} alt="" />
            <h3>Create</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
