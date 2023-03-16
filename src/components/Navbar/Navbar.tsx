import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../firebase";
import { RESET } from "../../context/user";
import { RootState } from "../../context/store";
import Logo from "../../assets/logos/logo.png";
import DefaultPFP from "../../assets/images/default-pfp.png";
import DdArrow from "../../assets/images/dd-arrow.png";
import "./Navbar.css";
import { spotifyApi } from "../../spotify";

const Navbar = (props: { displayName?: string; profilePic?: string }) => {
  const { displayName, profilePic } = props;
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const closeDropdown = () => {
    setOpen(false);
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
    </div>
  );
};

export default Navbar;
