import useFetch from "./useFetch";

const Dashboard = () => {
	const { data: user, isPending, error } = useFetch('/me');

	return ( 
		<div className="title">
			<h2>Dashboard</h2>
			{ error && <div>{ error }</div> }
			{ isPending && <p>Fetching User Info...</p> }
			{ user && <p> Hello, { user && user.display_name }</p> }
		</div>
	);
}
 
export default Dashboard;