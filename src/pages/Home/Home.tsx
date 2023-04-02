import { Link } from "react-router-dom";
import HomeFooter from "components/HomeFooter/HomeFooter";
import HomeTitle from "components/HomeTitle/HomeTitle";
import "./Home.css";
import HeroImage from "assets/images/hero-image.jpeg";
import ArtistsImage from "assets/images/artists.jpg";
import TracksImage from "assets/images/tracks.jpeg";
import HistoryImage from "assets/images/history.webp";
import { loginUrl } from "spotify";

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <HomeTitle
          title="Monthly Wrapped"
          description="this is a subheading subscribe and follow for more"
        />
        <div className="home-button">
          <Link to={loginUrl}>Get Started</Link>
        </div>
        <img src={HeroImage} alt="not found" />
      </div>
      <HomeTitle
        title="Listening analytics for every month."
        description="Straight from your Spotify account."
        subheading={true}
      />
      <div className="homepage-section">
        <div id="homepage-analytics">
          <div className="all-projects">
            <div className="analytic-item">
              <div className="section-info">
                <h1>Your top artists</h1>
                <p>
                  Gain insights on which artists you binged the most in the last
                  month.
                </p>
              </div>
              <div className="section-img">
                <img src={ArtistsImage} alt="img" />
              </div>
            </div>
            <div className="analytic-item">
              <div className="section-info">
                <h1>Your top tracks</h1>
                <p>
                  See your top songs and which ones you've had on repeat the
                  longest.
                </p>
              </div>
              <div className="section-img">
                <img src={TracksImage} alt="img" />
              </div>
            </div>
            <div className="analytic-item">
              <div className="section-info">
                <h1>Listening history</h1>
                <p>
                  Through the retrieval of your listening history, information
                  about your listening habits, time, etc are retrieved for your
                  viewing pleasure.
                </p>
              </div>
              <div className="section-img">
                <img src={HistoryImage} alt="img" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeTitle
        title="Delivered to your email."
        description="For you to save & share with your friends."
        subheading={true}
      />
      <div className="homepage-section">
        <div className="home-button start-now">
          <Link to={loginUrl}>Start Now</Link>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Home;
