import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { logout, unlinkSpotify } from "../../firebase";
import { spotifyApi } from "../../spotify";
import "./Navbar.css";

const Navbar = (spotifyLinked, user) => {
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

  // unlink user's spotify account
  const unlink = async () => {
    const response = window.confirm(
      "Are you sure you want to unlink your current spotify account? You will have to re-login to access your Spotify account analytics."
    );
    if (!response) return;
    await unlinkSpotify(user);
    logout();
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
      <Link to="/">
        <img
          className="logo"
          src={require("../../assets/logos/logo.png")}
          alt="ber_logo"
        />
      </Link>
      <div
        className="profile"
        onClick={toggleDropdown}
        onMouseLeave={closeDropdown}
      >
        {profilePic && (
          <>
            <img className="profile-pic" src={profilePic} alt="" />
            <img
              className="dd-arrow"
              src={require("../../assets/images/dd-arrow.png")}
              alt=""
            />
            <div className="profile-dropdown">
              <div className="dropdown-top">
                <img src={profilePic} alt="" />
                {name && <h3>{name}</h3>}
              </div>
              <div className="options">
                <h4 onClick={unlink}>Unlink Spotify</h4>
                <h4>Delete Account</h4>
              </div>
              <div className="logout">
                <h4 onClick={logout}>Logout</h4>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
