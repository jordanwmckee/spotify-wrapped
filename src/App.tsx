import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "pages/Home/Home";
import Login from "pages/Login/Login";
import Register from "pages/Register/Register";
import Reset from "pages/Reset/Reset";
import Dashboard from "pages/Dashboard/Dashboard";
import Analytics from "pages/Analytics/Analytics";
import NotFound from "pages/NotFound/NotFound";
import { useAuthState } from "react-firebase-hooks/auth";
import Sidebar from "components/Sidebar/Sidebar";
import Footer from "components/Footer/Footer";
import Navbar from "components/Navbar/Navbar";
import HomeNavbar from "components/HomeNavbar/HomeNavbar";
import { useEffect, useState } from "react";
import { auth, checkForToken } from "firebase";
import {
  fetchTokensFromCode,
  loginUrl,
  refreshAuthToken,
  spotifyApi,
  getRecommendUris,
  getTopItems,
  getRecentListens,
  getMonthlyListens,
  getAlltimeListens,
  getUserPlaylists,
} from "./spotify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "context/store";
import { SET_PLAYER_URIS, SET_RECOMMEND_URIS } from "context/user";
import Player from "components/Player/Player";

function App() {
  const [user, loading, error] = useAuthState(auth);
  // vars collected from web api
  const [displayName, setDisplayName] = useState<string>();
  const [profilePic, setProfilePic] = useState<string>();
  const [monthlyArtists, setMonthlyArtists] = useState<TopItems[]>();
  const [monthlySongs, setMonthlySongs] = useState<TopItems[]>();
  const [allTimeSongs, setAllTimeSongs] = useState<TopItems[]>();
  const [allTimeArtists, setAllTimeArtists] = useState<TopItems[]>();
  const [recentListens, setRecentListens] = useState<Listens[]>();
  const [recentGenres, setRecentGenres] = useState<object[]>();
  const [monthlyListens, setMonthlyListens] = useState<Listens[]>();
  const [monthlyGenres, setMonthlyGenres] = useState<object[]>();
  const [allTimeListens, setAllTimeListens] = useState<Listens[]>();
  const [allTimeGenres, setAllTimeGenres] = useState<object[]>();
  const [userPlaylists, setUserPlaylists] = useState<Playlists[]>();

  const [linked, setLinked] = useState(false);
  const { recommendUris, playerUris } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading || !user) return;

    // get & update all spotify info to be store in the app
    const getData = async () => {
      // validate access token
      await refreshAuthToken(user);
      // get recommend uris for player
      !recommendUris && dispatch(SET_RECOMMEND_URIS(await getRecommendUris()));
      if (!displayName || !profilePic) {
        // get user spotify account
        const userAccount = await spotifyApi.getMe();
        setDisplayName(userAccount.display_name || "");
        setProfilePic(userAccount.images![0].url || "");
      }
      if (!monthlySongs || !monthlyArtists) {
        // get top monthly user items
        const { topTracks: monthlySongs, topArtists: monthlyArtists } =
          await getTopItems({ time_range: "short_term", limit: "16" });
        setMonthlySongs(monthlySongs);
        setMonthlyArtists(monthlyArtists);
      }
      if (!allTimeSongs || !allTimeArtists) {
        // get top all time items
        const { topTracks: allTimeSongs, topArtists: allTimeArtists } =
          await getTopItems({ time_range: "long_term", limit: "16" });
        setAllTimeSongs(allTimeSongs);
        setAllTimeArtists(allTimeArtists);
      }
      if (!recentListens || !recentGenres) {
        //get listen history
        const { listenHistory: recentListens, genresArr: genresList } =
          await getRecentListens({ limit: 50 });
        setRecentListens(recentListens);
        setRecentGenres(genresList);
      }
      if (!monthlyListens || !monthlyGenres) {
        //get top monthly tracks & genres
        const { topMonthly: monthlyListens, TopMonthGenres: monthlyGenres } =
          await getMonthlyListens({ time_range: "short_term", limit: 50 });
        setMonthlyListens(monthlyListens);
        setMonthlyGenres(monthlyGenres);
      }
      if (!allTimeListens || !allTimeGenres) {
        //get top Alltime tracks & genres
        const { allTListens: allTimeListens, allTGenres: allTimeGenres } =
          await getAlltimeListens({ time_range: "long_term", limit: 50 });
        setAllTimeListens(allTimeListens);
        setAllTimeGenres(allTimeGenres);
      }
      // get user playlists for sidebar popup
      !userPlaylists && setUserPlaylists(await getUserPlaylists());
    };

    // check for valid access token and update linked bool
    const checkToken = async () => {
      const win: Window = window;
      try {
        const isLinked = await checkForToken(user);
        setLinked(isLinked);
        // try to get tokens if spotify is not linked to user
        if (isLinked === false && window.location.search.includes("code")) {
          await fetchTokensFromCode(user);
          setLinked(true);
        } else if (isLinked === false) win.location = loginUrl;
        // attempt to retrieve data from web api
        await getData();
      } catch (err: any) {
        console.error(err);
      }
    };

    checkToken();
    if (!playerUris && recommendUris) dispatch(SET_PLAYER_URIS(recommendUris));
  }, [
    user,
    loading,
    recommendUris,
    playerUris,
    displayName,
    profilePic,
    monthlyArtists,
    monthlySongs,
    allTimeArtists,
    allTimeSongs,
    recentListens,
    recentGenres,
    allTimeListens,
    allTimeGenres,
    monthlyListens,
    monthlyGenres,
    userPlaylists,
  ]);

  return (
    <div className="App">
      {loading ? (
        <div className="loader" />
      ) : user ? (
        // Routes rendered if user account detected
        <Router>
          {linked && (
            <>
              <Navbar displayName={displayName} profilePic={profilePic} />
              <Sidebar />
              {recommendUris && playerUris && (
                <Player userPlaylists={userPlaylists} />
              )}
              <div className="page-space">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Dashboard
                        displayName={displayName}
                        monthlyArtists={monthlyArtists}
                        monthlySongs={monthlySongs}
                        allTimeArtists={allTimeArtists}
                        allTimeSongs={allTimeSongs}
                      />
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <Analytics
                        recentListens={recentListens}
                        recentGenres={recentGenres}
                        monthlyListens={monthlyListens}
                        monthlyGenres={monthlyGenres}
                        allTimeListens={allTimeListens}
                        allTimeGenres={allTimeGenres}
                      />
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <Dashboard
                        displayName={displayName}
                        monthlyArtists={monthlyArtists}
                        monthlySongs={monthlySongs}
                        allTimeArtists={allTimeArtists}
                        allTimeSongs={allTimeSongs}
                      />
                    }
                  />
                </Routes>
                <Footer />
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
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}
export default App;
