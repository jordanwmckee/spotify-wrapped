import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../firebase";
import { spotifyApi } from "../../spotify";
import "./Navbar.css";

const Navbar = (spotifyLinked) => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState(null);
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    const dropdown = document.querySelector(".profile-dropdown");
    if (dropdown === true) {
      // close dropdown
      dropdown.classList.toggle("active-dropdown");
      setDropdown(false);
    } else {
      // open dropdown
      dropdown.classList.toggle("active-dropdown");
      setDropdown(true);
    }
  };

  // close dropdown if clicking outside it
  const closeDropdown = () => {
    if (dropdown === false) return;
    document
      .querySelector(".profile-dropdown")
      .classList.toggle("active-dropdown");
    setDropdown(false);
  };

  const getData = async () => {
    // get user's profile picture
    if (!spotifyLinked || profilePic) return;
    try {
      const account = await spotifyApi.getMe();
      setName(account.display_name);
      setProfilePic(account.images[0].url);
    } catch (err) {
      //console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [spotifyLinked]);

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
        {profilePic ? (
          <img
            className="profile-pic"
            src={profilePic}
            alt={require("../../assets/images/default-pfp.png")}
          />
        ) : (
          <img
            className="profile-pic"
            src={require("../../assets/images/default-pfp.png")}
            alt=""
          />
        )}
        <img
          className="dd-arrow"
          src={require("../../assets/images/dd-arrow.png")}
          alt=""
        />
        <div className="profile-dropdown">
          <div className="dropdown-top">
            {profilePic && name ? (
              <>
                <img src={profilePic} alt="" />
                <h3>{name}</h3>
              </>
            ) : (
              <>
                <img
                  src={require("../../assets/images/default-pfp.png")}
                  alt=""
                />
                <h3>User</h3>
              </>
            )}
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
