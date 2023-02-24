import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../firebase";
import { RESET } from "../../context/user";
import "./Navbar.css";
import { spotifyApi } from "../../spotify";

const Navbar = () => {
  const { account } = useSelector((state) => state.user);
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
        <img
          className="logo"
          src={require("../../assets/logos/logo.png")}
          alt="ber_logo"
        />
      </Link>
      {/* User Profile Dropdown */}
      <div
        className="profile"
        onClick={toggleDropdown}
        onMouseLeave={closeDropdown}
      >
        <img
          className="profile-pic"
          src={
            account && account.images[0].url
              ? account.images[0].url
              : require("../../assets/images/default-pfp.png")
          }
          alt={require("../../assets/images/default-pfp.png")}
        />
        <img
          className="dd-arrow"
          src={require("../../assets/images/dd-arrow.png")}
          alt=""
        />
        {open ? (
          <div className="profile-dropdown">
            <div className="dropdown-top">
              <img
                src={
                  account && account.images[0].url
                    ? account.images[0].url
                    : require("../../assets/images/default-pfp.png")
                }
                alt=""
              />
              <h3>{account ? account.display_name : "User"}</h3>
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
