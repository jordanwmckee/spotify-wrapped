import useFetch from "./useFetch";

const Dashboard = () => {
	const { data: user, isPending, error } = useFetch('/me');
	const { data: top } = useFetch('/me/top/artists');

	return ( 
		<div className="title">
			<h2>Dashboard</h2>
			{ error && <div>{ error }</div> }
			{ isPending && <div className="loader" /> }
			{ user && <p> Hello, { user && user.display_name }</p> }
			{ top &&
				<div className="top-artists">
					{ top.items.map((t) => (
						<div className="artist" key={t.id}>
							<h2>{ t.name }</h2>
							<img src={t.images[0].url} width="100px" height="100px" alt="unavailable." />
						</div>
					))}
				</div>
			}
		</div>
	);
}
 
export default Dashboard;