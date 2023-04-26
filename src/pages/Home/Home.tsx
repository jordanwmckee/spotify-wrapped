import { Link } from 'react-router-dom';
import HomeFooter from 'components/HomeFooter/HomeFooter';
import HomeTitle from 'components/HomeTitle/HomeTitle';
import styles from './Home.module.css';
import HeroImage from 'assets/images/hero-image.jpeg';
import ArtistsImage from 'assets/images/artists.jpg';
import TracksImage from 'assets/images/tracks.jpeg';
import HistoryImage from 'assets/images/history.webp';
import { loginUrl } from 'spotify';

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <HomeTitle
          title="Wrapped Monthly"
          description="Your top Spotify analytics every month."
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
      <div className={styles.homepageSection}>
        <div id={styles.homepageAnalytics}>
          <div className={styles.allProjects}>
            <div className={styles.analyticItem}>
              <div className={styles.sectionInfo}>
                <h1>Your Top Artists</h1>
                <p>
                  Gain insights on which artists you binged the most in the last
                  month.
                </p>
              </div>
              <div className={styles.sectionImg}>
                <img src={ArtistsImage} alt="img" />
              </div>
            </div>
            <div className={styles.analyticItem}>
              <div className={styles.sectionInfo}>
                <h1>Your Top Tracks</h1>
                <p>See which songs you've had on repeat this month.</p>
              </div>
              <div className={styles.sectionImg}>
                <img src={TracksImage} alt="img" />
              </div>
            </div>
            <div className={styles.analyticItem}>
              <div className={styles.sectionInfo}>
                <h1>Your Top Genres</h1>
                <p>
                  Your top genres are derrived from all of your top songs and
                  broken down into a colorful pie chart :)
                </p>
              </div>
              <div className={styles.sectionImg}>
                <img src={HistoryImage} alt="img" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default Home;
