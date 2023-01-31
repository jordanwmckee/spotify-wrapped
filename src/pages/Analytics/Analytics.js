import Navbar from "../../components/Navbar/Navbar";

const Analytics = () => {
	return ( 
		<div className="page">
			<div>
				<Navbar />
			</div>
			<div className="analytics content">
				<h1>Analytics</h1>
				<p className="test" style={styles.test}>Testing 1 2 3</p>
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