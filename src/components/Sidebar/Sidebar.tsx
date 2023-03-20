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
        <Link to="/" className="link">
          <div className="sidebar-item">
            <img src={DashboardIcon} alt="" />
            <h3>Dashboard</h3>
          </div>
        </Link>
        <Link to="/analytics" className="link">
          <div className="sidebar-item">
            <img src={AnalyticsIcon} alt="" />
            <h3>Analytics</h3>
          </div>
        </Link>
        <Link to="/" className="link">
          <div className="sidebar-item">
            <img src={CreateIcon} alt="" />
            <h3>Create</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
