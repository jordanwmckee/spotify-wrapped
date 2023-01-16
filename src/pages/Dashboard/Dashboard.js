import useGetData from "../../hooks/useGetData";

const Dashboard = () => {
	const params = new URLSearchParams({
		time_range: "short_term",
		limit: "20",
	})

	const { data: user, isPending, error } = useGetData('/me');
	const { data: artists } = useGetData('/me/top/artists?' + params);
	const { data: tracks } = useGetData('/me/top/tracks?' + params);

	return ( 
		<div className="dashboard">
			<h1>Dashboard</h1>
			{ error && <div>{ error }</div> }
			{ isPending && <div className="loader" /> }
			{ user && <p> Hello, { user && user.display_name }. Here are some of your monthly stats..</p> }
			<br /> <br />
			{ artists && tracks && 
				<div className="info">
					<div className="top-artists">
						<h2>Your Top Artists</h2> <br />
						<table>
							<tbody>
								{ artists.items.map((artist) => (
									<tr key={artist.id}>
										<td><h3>{ artist.name }</h3></td>
										<td><img src={artist.images[0].url} width="100px" height="100px" alt="unavailable." /></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="top-tracks">
						<h2>Your Top Tracks</h2> <br />
						<table>
							<tbody>
								{ tracks.items.map((track) => (
									<tr key={track.id}>
										<td><img src={track.album.images[0].url} width="100px" height="100px" alt="unavailable." /></td>
										<td><h3>{ track.name }</h3></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			}
		</div>
	);
}
 
export default Dashboard;