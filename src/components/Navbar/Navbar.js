import { Link } from "react-router-dom";
import { logout } from "../../firebase";
import "./Navbar.css";
//import '../../pics&logos/SW_logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <img
        className="logo"
        src={require("../../assets/logos/logo.png")}
        alt="ber_logo"
      />
      <div className="links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/analytics">Analytics</Link>
        <button onClick={logout}>LOGOUT</button>
      </div>
    </nav>
  );
};

export default Navbar;
