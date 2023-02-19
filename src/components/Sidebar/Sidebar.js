import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <>
      <div className="sidebar-title">
        <h3>Navigation</h3>
      </div>
      <div className="links">
        <Link to="/" className="link">
          Dashboard
        </Link>
        <br />
        <Link to="/analytics" className="link">
          Analytics
        </Link>
        <br />
        <p className="link">Create (coming soon)</p>
      </div>
    </>
  );
};

export default Sidebar;
