import Navbar from "../../components/Navbar/Navbar";
import './Analytics.css';

const Analytics = () => {
	return ( 
		<div className="page">
			<div>
				<Navbar />
			</div>
			<div>
				<div className="background">
					<h1 className= "Header">Analytics</h1>
				</div>

				<div className="analytics_win_border">
					<h2>Test Analytics Model</h2>
					<div className="graph"></div>
					<p1 className="p1">this is a place holder for what the graphs will look like<br></br></p1>
					<p2>This will be more stylized as I automate graph generation</p2>

				</div>
			</div>
		</div>
		
	);
}

const styles = {
	test: {
		fontSize: "50px"
	}
}
 
export default Analytics;