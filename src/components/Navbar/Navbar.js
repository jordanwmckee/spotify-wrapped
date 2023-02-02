import { Link } from 'react-router-dom';
import { logout } from '../../firebase';
import './Navbar.css';

const Navbar = () => {
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