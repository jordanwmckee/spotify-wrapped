import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db } from "../../Firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import useGetData from "../../hooks/useGetData";
import Navbar from "../../components/Navbar/Navbar";

const Dashboard = () => {
	const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
	const [token, setToken] = useState("");
	const [spotifyLinked, setSpotifyLinked] = useState(true);
  const navigate = useNavigate();
  const CLIENT_ID = "155ce0eabe804923855dd85cbd23329e";
  const REDIRECT_URI = "http://localhost:3000/callback";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

  var auth_query_params = new URLSearchParams({
    show_dialog: true,
    response_type: "code",
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    scope: [
      "user-library-read", 
      "user-read-recently-played", 
      "playlist-read-collaborative", 
      "playlist-read-private", 
      "user-read-currently-playing", 
      "playlist-modify-public", 
      "user-top-read", 
      "user-read-private", 
      "playlist-modify-private"
    ],
    redirect_uri: REDIRECT_URI,
  });

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
			// check if spotify account is linked
			if (data.authToken === "") setSpotifyLinked(false);
			else setToken(data.authToken);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

	useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    fetchUserName();
  }, [user, loading]);

	const params = new URLSearchParams({
		time_range: "short_term",
		limit: "20",
	})

	const { data: account, isPending: accountPending, error: accountError } = useGetData('/me', token);
	const { data: artists, isPending: artistsPending, error: artistsError } = useGetData('/me/top/artists?' + params, token);
	const { data: tracks, isPending: tracksPending, error: tracksError } = useGetData('/me/top/tracks?' + params, token);

	return ( 
		<div className="page">
			<div>
				<Navbar />
			</div>
			<div className="dashboard content">
				<div className="color_grad" ><h1 className="header">Dashboard</h1></div>
				{ accountError && <div>{ accountError }</div> }
				{ accountPending && <div className="loader" /> }
				{ account && <p> Hello, { name }. Here are some of your monthly stats..</p> }
				<br /> <br />
				{ !spotifyLinked && 
					<div className="linked">
							<p>Please connect your Spotify account to view your monthly wrapped.</p>
							<a 
								href={AUTH_ENDPOINT + "?" + auth_query_params.toString()}
								className="button"
							>
								CONNECT
							</a>
					</div>
				}
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
	</div>
	);
}
 
export default Dashboard;