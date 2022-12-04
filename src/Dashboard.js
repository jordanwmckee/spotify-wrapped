import useFetch from "./useFetch";

const Dashboard = () => {
	const { data: user, isPending, error } = useFetch('/me');
	const { data: top, isPending: isPending2, error: error2 } = useFetch('/me/top/artists');

	return ( 
		<div className="title">
			<h2>Dashboard</h2>
			{ error && <div>{ error }</div> }
			{ isPending && <p>Fetching User Info...</p> }
			{ user && <p> Hello, { user && user.display_name }</p> }
			{ top &&
				<div className="top-artists">
					{ top.items.map((t) => (
						<div className="artist" key={t.id}>
							<h2>{ t.name }</h2>
							<img src={t.images[0].url} width="100px" height="100px" alt="No image available." />
						</div>
					))}
				</div>
			}
		</div>
	);
}
 
export default Dashboard;