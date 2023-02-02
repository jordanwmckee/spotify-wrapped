import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h2>
        Display home page content here for new users & add login button in
        navbar
      </h2>
      <Link to="/login">Login Here</Link>
      <Link to="/register">Rester Here</Link>
    </div>
  );
};

export default Home;
