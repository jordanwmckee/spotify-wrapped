import { Link } from 'react-router-dom';
import './HomeFooter.css';
import { loginUrl } from 'spotify';

const HomeFooter = () => {
  return (
    <div className="home-footer">
      <div className="home-footer-links">
        <div className="home-footer-left">
          <h3>Navigation</h3>
          <Link to="/">Home</Link>
          <Link to={loginUrl}>Login</Link>
        </div>
        <div className="home-footer-right">
          <h3>Other</h3>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <a
            target="_blank"
            href="https://github.com/jordanwmckee/spotify-wrapped"
          >
            Source Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeFooter;
