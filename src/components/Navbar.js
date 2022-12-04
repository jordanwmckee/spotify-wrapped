import { Link } from 'react-router-dom';

const Navbar = ({setToken}) => {

	const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  }

	return ( 
		<nav className="navbar">
			<h1>Wrapped Monthly</h1>
			<div className="links">
				<Link to="/dashboard">Dashboard</Link>
				<Link to="/analytics">Analytics</Link>
				<button onClick={logout}>LOGOUT</button>
			</div>
		</nav>
	);
}
 
export default Navbar;