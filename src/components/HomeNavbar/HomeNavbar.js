import { Link } from "react-router-dom";
import "./HomeNavbar.css";

const Navbar = () => {
  return (
    <div id="home-navbar">
      <div className="logo">
        <Link to="/">
          <img src={require("../../assets/logos/logo.png")} alt="ber_logo" />
        </Link>
      </div>
      <div className="links">
        <Link to="/login">Login</Link>
        <div className="register-button home-button">
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
