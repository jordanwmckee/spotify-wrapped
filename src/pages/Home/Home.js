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
        <div className="home-button">
          <Link to="/register">Get Started</Link>
        </div>
        <img
          src={require("../../assets/images/hero-image.jpg")}
          alt="not found"
        />
      </div>
      <HomeTitle
        title="Listening analytics for every month."
        description="Information is updated in real time."
        subheading={true}
      />
      <div className="homepage-section">
        <p>some info here</p>
        <br />
        <p>some info here</p>
        <br />
        <p>some info here</p>
        <br />
        <p>some info here</p>
        <br />
      </div>
      <HomeTitle
        title="Delivered to you by email"
        description="With the option to export and share with your friends."
        subheading={true}
      />
      <div className="homepage-section">
        <p>some info here</p>
        <br />
        <p>some info here</p>
        <br />
        <p>some info here</p>
        <br />
        <p>some info here</p>
        <br />
      </div>
    </div>
  );
};

export default Home;
