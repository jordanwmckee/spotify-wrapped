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
    userId,
    monthlyArtists,
    monthlySongs,
    allTimeArtists,
    allTimeSongs,
    monthlyGenres,
    allTimeGenres,
    userPlaylists,
    recommendedArtists,
    recommendedSongs,
    getData,
  } = useFetchData();

  const handleAuth = async () => {
    // validate token
    let isLinked = checkForTokens();
    if (isLinked === false && window.location.search.includes('code')) {
      await fetchTokensFromCode();
      isLinked = true;
    }
    setLinked(isLinked);

    // fetch data from web api if valid token
    if (isLinked) await getData();
    clearLoadingScreen();
  };

  useEffect(() => {
    handleAuth();
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
                      userId={userId}
                      playlists={userPlaylists}
                    />
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <Analytics
                      monthlySongs={monthlySongs}
                      monthlyGenres={monthlyGenres}
                      allTimeSongs={allTimeSongs}
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
