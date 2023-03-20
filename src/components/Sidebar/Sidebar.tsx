import { Link } from "react-router-dom";
import DashboardIcon from "assets/logos/dashboard.png";
import AnalyticsIcon from "assets/logos/analytics.png";
import CreateIcon from "assets/logos/forYou.png";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div id="sidebar">
      <div className="sidebar-title">
        <h3>Navigation</h3>
      </div>
      <div className="links">
        <div className="sidebar-item">
          <img src={DashboardIcon} alt="" />
          <Link to="/" className="link">
            Dashboard
          </Link>
        </div>
        <div className="sidebar-item">
          <img src={AnalyticsIcon} alt="" />
          <Link to="/analytics" className="link">
            Analytics
          </Link>
        </div>
        <div className="sidebar-item">
          <img src={CreateIcon} alt="" />
          <Link to="/" className="link">
            Create
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
