import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "firebase";
import { RESET } from "context/user";
import Logo from "assets/logos/logo.png";
import DefaultPFP from "assets/logos/default-pfp.png";
import DdArrow from "assets/logos/dd-arrow.png";
import HamburgerButton from "assets/logos/hamburgerButton.png";
import HamburgerActive from "assets/logos/hamburgerActive.png";
import "./Navbar.css";
import { spotifyApi } from "spotify";

const Navbar = (props: NavBarProps) => {
  const { displayName, profilePic } = props;
  const [open, setOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const closeDropdown = () => {
    setOpen(false);
  };

  const toggleSidebar = () => {
    let sidebarMenu = document.getElementById("sidebar")!;
    if (!sidebar) sidebarMenu.setAttribute("style", "width: min(300px, 100%)");
    else sidebarMenu.setAttribute("style", "width: 0");
    setSidebar(!sidebar);
  };

  // clear state & sessionStorage before logout
  const logoutActions = async () => {
    // remove user access tokens
    spotifyApi.setAccessToken(null);
    // reset redux state
    dispatch(RESET());
    // logout user
    logout();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div id="navbar">
      {/* Site Logo */}
      <Link to="/">
        <img className="logo" src={Logo} alt="ber_logo" />
      </Link>
      <div className="navbar-rhs">
        {/* User Profile Dropdown */}
        <div
          className="profile"
          onClick={toggleDropdown}
          onMouseLeave={closeDropdown}
        >
          <img
            className="profile-pic"
            src={profilePic ? profilePic : DefaultPFP}
            alt={DefaultPFP}
          />
          <img className="dd-arrow" src={DdArrow} alt="" />
          {open ? (
            <div className="profile-dropdown">
              <div className="dropdown-top">
                <img src={profilePic ? profilePic : DefaultPFP} alt="" />
                <h3>{displayName ? displayName : "User"}</h3>
              </div>
              <div className="options">
                <h4>Some Option</h4>
                <h4>Another Option</h4>
              </div>
              <div className="logout">
                <h4 onClick={logoutActions}>Logout</h4>
              </div>
            </div>
          ) : null}
        </div>
        <div className="sidebar-toggle">
          {sidebar ? (
            <img src={HamburgerActive} alt="" onClick={toggleSidebar} />
          ) : (
            <img src={HamburgerButton} alt="" onClick={toggleSidebar} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
