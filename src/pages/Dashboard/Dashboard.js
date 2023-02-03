import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, checkForToken } from "../../firebase";
import {
  fetchTokensFromCode,
  loginUrl,
  refreshCycle,
  refreshAuthToken,
  spotifyApi,
} from "../../spotify";
import Navbar from "../../components/Navbar/Navbar";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const [spotifyLinked, setSpotifyLinked] = useState(true);
  const [account, setAccount] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [artists, setArtists] = useState(null);
  const navigate = useNavigate();

  const params = new URLSearchParams({
    time_range: "short_term",
    limit: "20",
  });

  // fetch new access token using refresh token & get user data for return
  const getData = async () => {
    await refreshAuthToken(user);
    refreshCycle(user);
    // fetch spotify data
    setAccount(await spotifyApi.getMe(params));
    setTracks(await spotifyApi.getMyTopTracks(params));
    setArtists(await spotifyApi.getMyTopArtists(params));
  };

  const checkToken = async () => {
    const linked = await checkForToken(user);
    setSpotifyLinked(linked);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    checkToken()
      .then(() => {
        if (
          spotifyLinked === false &&
          window.location.search.includes("code=")
        ) {
          fetchTokensFromCode(user).then(() => setSpotifyLinked(true));
        } else if (spotifyLinked === false) window.location = loginUrl;
      })
      .then(() => {
        if (spotifyLinked === true) getData();
      })
      .catch((err) => {
        console.error("error: ", err);
      });
  }, [user, loading, spotifyLinked]);

  return (
    <div className="page">
      <div>
        <Navbar />
      </div>
      <div className="dashboard content">
        <div className="color_grad">
          <h1 className="header">Dashboard</h1>
        </div>
        {loading && <div className="loader" />}
        {account && (
          <p>
            Hello, {account.display_name}. Here are some of your monthly stats..
          </p>
        )}
        <br /> <br />
        {artists && tracks && (
          <div className="info">
            <div className="top-artists">
              <h2>Your Top Artists</h2> <br />
              <table>
                <tbody>
                  {artists.items.map((artist) => (
                    <tr key={artist.id}>
                      <td>
                        <h3>{artist.name}</h3>
                      </td>
                      <td>
                        <img
                          src={artist.images[0].url}
                          width="100px"
                          height="100px"
                          alt="unavailable."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="top-tracks">
              <h2>Your Top Tracks</h2> <br />
              <table>
                <tbody>
                  {tracks.items.map((track) => (
                    <tr key={track.id}>
                      <td>
                        <img
                          src={track.album.images[0].url}
                          width="100px"
                          height="100px"
                          alt="unavailable."
                        />
                      </td>
                      <td>
                        <h3>{track.name}</h3>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

/*
        {!spotifyLinked && (
          <div className="linked">
            <p>
              Please connect your Spotify account to view your monthly wrapped.
            </p>
            <a href={loginUrl} className="button">
              CONNECT
            </a>
          </div>
        )}
*/
