import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RESET } from 'context/user';
import Logo from 'assets/logos/logo.png';
import DefaultPFP from 'assets/logos/default-pfp.png';
import DdArrow from 'assets/logos/dd-arrow.png';
import styles from './Navbar.module.css';
import { spotifyApi } from 'spotify';
import useToggleState from 'hooks/useToggleState';
import { closeSidebar, toggleSidebar } from 'components/Sidebar/Sidebar';

const Navbar = (props: NavBarProps) => {
  const { displayName, profilePic } = props;
  const [dropdown, toggleDropdown, closeDropdown] = useToggleState(false);
  const dispatch = useDispatch();

  // const createPlaylist = () => {
  //   spotifyApi.createPlaylist(user.id, {name: "monthly wrapped (this month)", public: "false", description: "users top songs for x month"})
  // }

  const toggleBar = () => {
    // modify hambuger icon
    document.querySelector(`.${styles.hamburger}`)!.classList.toggle('active');
    const overlay = document.getElementById(styles.bodyOverlay)!;
    if (toggleSidebar())
      overlay.setAttribute('style', 'width: 0; opacity: 0; left: 0');
    else
      overlay.setAttribute('style', 'width: 100%; opacity: 0.4; left: 300px');
  };

  const closeBar = () => {
    // toggle hambuger active
    document.querySelector(`.${styles.hamburger}`)!.classList.toggle('active');
    closeSidebar();
    // remove overlay
    document
      .getElementById(styles.bodyOverlay)!
      .setAttribute('style', 'width: 0; opacity: 0; left 0');
  };

  // clear state & sessionStorage before logout
  const logoutActions = async () => {
    spotifyApi.setAccessToken(null);
    // reset redux state
    dispatch(RESET());
    // remove tokens from store
    localStorage.removeItem('SpotifyTokens');
    window.location.replace(window.location.origin);
  };

  return (
    <div id={styles.navbar}>
      <div id={styles.bodyOverlay} onClick={closeBar}></div>
      {/* Site Logo */}
      <div className={styles.navbarLhs}>
        <Link to="/">
          <img src={Logo} alt="ber_logo" />
        </Link>
      </div>
      <div className={styles.navbarRhs}>
        {/* User Profile Dropdown */}
        <div
          className={styles.profile}
          onClick={toggleDropdown}
          onMouseLeave={closeDropdown}
        >
          <img
            className={styles.profilePic}
            src={profilePic ? profilePic : DefaultPFP}
            alt={DefaultPFP}
          />
          <img className={styles.ddArrow} src={DdArrow} alt="" />
          {dropdown && (
            <div className={styles.profileDropdown}>
              <div className={styles.dropdownTop}>
                <img src={profilePic ? profilePic : DefaultPFP} alt="" />
                <h3>{displayName ? displayName : 'User'}</h3>
              </div>
              <div className={styles.options}>
                <h4>Send to Playlist</h4>
                <h4>Another Option</h4>
              </div>
              <div className={styles.logout}>
                <h4 onClick={logoutActions}>Logout</h4>
              </div>
            </div>
          )}
        </div>
        <div className={styles.sidebarToggle}>
          <div className={styles.hamburger} onClick={toggleBar}>
            <div className={styles.bar}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
