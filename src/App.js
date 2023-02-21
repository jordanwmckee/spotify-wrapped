import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpotifyPlayer from "react-spotify-web-playback";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Reset from "./pages/Reset/Reset";
import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Analytics/Analytics";
import NotFound from "./pages/NotFound/NotFound";
import { useAuthState } from "react-firebase-hooks/auth";
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import HomeNavbar from "./components/HomeNavbar/HomeNavbar";
import { useEffect, useState } from "react";
import { auth, checkForToken } from "./firebase";
import {
  fetchTokensFromCode,
  loginUrl,
  refreshCycle,
  refreshAuthToken,
  spotifyApi,
} from "./spotify";

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [accessToken, setAccessToken] = useState(null);
  const [spotifyLinked, setSpotifyLinked] = useState(true);
  const [recommendUris, setrecommendUris] = useState(null);

  // fetch new access token using refresh token & get user data for return
  const getData = async () => {
    await refreshAuthToken(user);
    refreshCycle(user);
    if (recommendUris) return;

    // Get seed tracks for recommendations
    const top5Tracks = await spotifyApi.getMyTopTracks({
      time_range: "short_term",
      limit: "5",
    });
    let seeds = "";
    top5Tracks.items.forEach((track) => {
      seeds += track.id + ",";
    });
    seeds = seeds.slice(0, -1);

    // Get recommendations using seeds
    let tracksArr = [];
    const recommendations = await spotifyApi.getRecommendations({
      seed_tracks: seeds,
      limit: 100,
    });
    recommendations.tracks.forEach((track) => {
      tracksArr.push(track.uri);
    });
    setrecommendUris(tracksArr);
  };

  // check for valid access token and update spotifyLinked bool
  const checkToken = async () => {
    const linked = await checkForToken(user);
    setSpotifyLinked(linked);
  };

  useEffect(() => {
    if (loading || !user) return;
    checkToken()
      .then(() => {
        /* if spotify is not linked & code from callback is in the url, 
        then parse the code and use it to request access and refresh tokens. 
        Else redirect to spotify authentication */
        if (
          spotifyLinked === false &&
          window.location.search.includes("code=")
        ) {
          fetchTokensFromCode(user).then(() => setSpotifyLinked(true));
        } else if (spotifyLinked === false) window.location = loginUrl;
      })
      .then(() => {
        // save access token and attempt to retrieve data from web api
        if (spotifyLinked === true) {
          setAccessToken(spotifyApi.getAccessToken());
          getData();
        }
      })
      .catch((err) => {
        console.error("error: ", err);
      });
  }, [
    user,
    loading,
    spotifyLinked,
    spotifyApi.getAccessToken(),
    recommendUris,
  ]);

  return (
    <div className="App">
      {loading ? (
        <div className="loader" />
      ) : user ? (
        // Routes rendered if user account detected
        <Router>
          <Navbar spotifyLinked={spotifyLinked} />
          <div className="page">
            <Sidebar />
            {spotifyLinked && accessToken && recommendUris && (
              <div className="player">
                <SpotifyPlayer
                  token={accessToken}
                  uris={recommendUris}
                  className="player"
                />
              </div>
            )}
            <div className="page-space">
              <Routes>
                <Route
                  exact
                  path="/"
                  element={<Dashboard spotifyLinked={spotifyLinked} />}
                />
                <Route exact path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
              <Footer />
            </div>
          </div>
        </Router>
      ) : (
        // Routes rendered if no user account detected
        <div id="home-content">
          <Router>
            <HomeNavbar />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/reset" element={<Reset />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
