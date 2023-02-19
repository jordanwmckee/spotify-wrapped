import { Link } from "react-router-dom";
import { logout } from "../../firebase";
import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <Link to="/">
        <img
          className="logo"
          src={require("../../assets/logos/logo.png")}
          alt="ber_logo"
        />
      </Link>
      <div className="profile">
        <button onClick={logout}>LOGOUT</button>
      </div>
    </>
  );
};

export default Navbar;
