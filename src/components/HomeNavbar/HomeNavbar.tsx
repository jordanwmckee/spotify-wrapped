import { Link } from "react-router-dom";
import Logo from "../../assets/logos/logo.png";
import "./HomeNavbar.css";
import { loginUrl } from "spotify";

const Navbar = () => {
  return (
    <div id="home-navbar">
      <div className="logo">
        <Link to="/">
          <img src={Logo} alt="ber_logo" />
        </Link>
      </div>
      <div className="links">
        <div className="register-button home-button">
          <Link to={loginUrl}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
