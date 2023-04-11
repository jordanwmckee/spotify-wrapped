import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from 'pages/Home/Home';
import Dashboard from 'pages/Dashboard/Dashboard';
import Analytics from 'pages/Analytics/Analytics';
import NotFound from 'pages/NotFound/NotFound';
import Sidebar from 'components/Sidebar/Sidebar';
import Footer from 'components/Footer/Footer';
import Navbar from 'components/Navbar/Navbar';
import HomeNavbar from 'components/HomeNavbar/HomeNavbar';
import { useEffect, useState } from 'react';
import { fetchTokensFromCode, checkForTokens } from './spotify';
import { useSelector } from 'react-redux';
import { RootState } from 'context/store';
import Player from 'components/Player/Player';
import Discover from 'pages/Discover/Discover';
import Create from 'pages/Create/Create';
import LoadScreen, {
  clearLoadingScreen,
} from 'components/LoadScreen/LoadScreen';
import useFetchData from 'hooks/useFetchData';
import PrivacyPolicy from 'pages/PrivacyPolicy/PrivacyPolicy';

function App() {
  // used for auth
  const [linked, setLinked] = useState(false);
  // redux vars
  const { recommendUris, playerUris } = useSelector(
    (state: RootState) => state.user
  );
  // vars collected from web api
  const {
    displayName,
    profilePic,
    monthlyArtists,
    monthlySongs,
    allTimeArtists,
    allTimeSongs,
    recentListens,
    recentGenres,
    monthlyListens,
    monthlyGenres,
    allTimeListens,
    allTimeGenres,
    userPlaylists,
    recommendedArtists,
    recommendedSongs,
    getData,
  } = useFetchData();

  useEffect(() => {
    // create a variable to store a cleanup function
    let unmounted = false;
    let tokenDetected: boolean = false;

    // try to fetch data from web api
    const tryFetchData = async () => {
      if (!unmounted) await getData();
      clearLoadingScreen();
    };

    // check for valid Spotify tokens
    const checkToken = async () => {
      let isLinked = checkForTokens();
      if (isLinked === false && window.location.search.includes('code')) {
        await fetchTokensFromCode();
        isLinked = true;
      }
      if (isLinked) tokenDetected = true;
      if (!unmounted) {
        setLinked(isLinked);
      }
    };

    checkToken();
    if (tokenDetected) tryFetchData();
    else clearLoadingScreen();

    // cleanup function to set unmounted flag
    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <div className="App">
      {linked ? (
        // Routes rendered if user account detected
        <>
          <LoadScreen />
          <Router>
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
                  path="/discover"
                  element={
                    <Discover
                      recommendedArtists={recommendedArtists}
                      recommendedSongs={recommendedSongs}
                      userPlaylists={userPlaylists}
                    />
                  }
                />
                <Route path="/create" element={<Create />} />
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
          </Router>
        </>
      ) : (
        //Routes rendered if no user account detected
        <>
          <LoadScreen />
          <div id="home-content">
            <Router>
              <HomeNavbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </div>
        </>
      )}
    </div>
  );
}
export default App;
