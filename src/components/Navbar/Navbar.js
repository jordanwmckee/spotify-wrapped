import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../firebase";
import "./Navbar.css";

const Navbar = () => {
  const { account } = useSelector((state) => state.user);
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    const dropdownElement = document.querySelector(".profile-dropdown");
    dropdownElement.classList.toggle("active-dropdown");
    dropdown === true ? setDropdown(false) : setDropdown(true);
  };

  // close dropdown if clicking outside it
  const closeDropdown = () => {
    if (dropdown === false) return;
    document
      .querySelector(".profile-dropdown")
      .classList.toggle("active-dropdown");
    setDropdown(false);
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
            <h4 onClick={logout}>Logout</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
