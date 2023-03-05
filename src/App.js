import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  refreshAuthToken,
  spotifyApi,
  getRecommendUris,
  getTopItems,
  getUserPlaylists,
} from "./spotify";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_ACCOUNT,
  SET_ALL_TIME_ARTISTS,
  SET_ALL_TIME_SONGS,
  SET_MONTHLY_ARTISTS,
  SET_MONTHLY_SONGS,
  SET_PLAYER_URIS,
  SET_RECOMMEND_URIS,
  SET_USER_PLAYLISTS,
} from "./context/user";
import Player from "./components/Player/Player";

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [linked, setLinked] = useState(false);
  const {
    recommendUris,
    account,
    monthlySongs,
    monthlyArtists,
    allTimeSongs,
    allTimeArtists,
    playerUris,
    userPlaylists,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading || !user) return;

    // get & update all spotify info to be store in the app
    const getData = async () => {
      // validate access token
      await refreshAuthToken(user);
      if (!recommendUris) {
        // get recommended song uris
        const uris = await getRecommendUris();
        dispatch(SET_RECOMMEND_URIS(uris));
      }
      if (!account) {
        // get user spotify account
        const account = await spotifyApi.getMe();
        dispatch(SET_ACCOUNT(account));
      }
      if (!monthlySongs || !monthlyArtists) {
        // get top monthly user items
        const { topTracks: monthlySongs, topArtists: monthlyArtists } =
          await getTopItems({ time_range: "short_term", limit: "8" });
        dispatch(SET_MONTHLY_SONGS(monthlySongs));
        dispatch(SET_MONTHLY_ARTISTS(monthlyArtists));
      }
      if (!allTimeSongs || !allTimeArtists) {
        // get top all time items
        const { topTracks: allTimeSongs, topArtists: allTimeArtists } =
          await getTopItems({ time_range: "long_term", limit: "8" });
        dispatch(SET_ALL_TIME_SONGS(allTimeSongs));
        dispatch(SET_ALL_TIME_ARTISTS(allTimeArtists));
      }
      if (!userPlaylists) {
        // get array of user playlists
        const playlists = await getUserPlaylists();
        dispatch(SET_USER_PLAYLISTS(playlists));
      }
    };

    // check for valid access token and update linked bool
    const checkToken = async () => {
      try {
        const isLinked = await checkForToken(user);
        setLinked(isLinked);
        // try to get tokens if spotify is not linked to user
        if (isLinked === false && window.location.search.includes("code")) {
          await fetchTokensFromCode(user);
          setLinked(true);
        } else if (isLinked === false) window.location = loginUrl;
        // attempt to retrieve data from web api
        await getData();
      } catch (err) {
        console.error(err);
      }
    };

    checkToken();
    if (!playerUris && recommendUris) dispatch(SET_PLAYER_URIS(recommendUris));
  }, [user, loading, recommendUris]);

  return (
    <div className="App">
      {loading ? (
        <div className="loader" />
      ) : user ? (
        // Routes rendered if user account detected
        <Router>
          {linked && (
            <>
              <Navbar />
              <div className="page">
                <Sidebar />
                {spotifyApi.getAccessToken() && recommendUris && <Player />}
                <div className="page-space">
                  <Routes>
                    <Route exact path="/" element={<Dashboard />} />
                    <Route exact path="/analytics" element={<Analytics />} />
                    <Route path="*" element={<Dashboard />} />
                  </Routes>
                  <Footer />
                </div>
              </div>
            </>
          )}
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
