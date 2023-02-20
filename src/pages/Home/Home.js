import { Link } from "react-router-dom";
import HomeTitle from "../../components/HomeTitle/HomeTitle";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <HomeTitle
          title="Monthly Wrapped"
          description="this is a subheading subscribe and follow for more"
        />
        <Link to="/register">Get Started</Link>
        <br />
        <img src="../../assets/logos/logo.png" alt="not found" />
      </div>
    </div>
  );
};

export default Home;
