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
import {
  fetchTokensFromCode,
  refreshAuthToken,
  spotifyApi,
  getRecommendedTracks,
  getTopItems,
  getRecentListens,
  getMonthlyListens,
  getAlltimeListens,
  getUserPlaylists,
  checkForTokens,
  getRecommendedArtists,
} from './spotify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'context/store';
import { SET_PLAYER_URIS, SET_RECOMMEND_URIS } from 'context/user';
import Player from 'components/Player/Player';
import Discover from 'pages/Discover/Discover';
import Create from 'pages/Create/Create';
import LoadScreen from 'components/LoadScreen/LoadScreen';

function App() {
  // used for auth
  const [loading, setLoading] = useState<boolean>(true);
  const [linked, setLinked] = useState(false);
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
  const [recommendedArtists, setRecommendedArtists] =
    useState<RecommendedItems[]>();
  const [recommendedSongs, setRecommendedSongs] =
    useState<RecommendedItems[]>();
  const { recommendUris, playerUris } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

  const clearLoadingScreen = () => {
    setLoading(false);
    // shrink loading screen div
    const loadScreenDiv = document.getElementById('load-screen');
    // set the display property of the img and h1 elements to none
    if (loadScreenDiv) {
      loadScreenDiv
        .querySelector('.load-screen-items')
        ?.setAttribute('style', 'display: none');
      loadScreenDiv.setAttribute('style', 'height: 55px;');
      setTimeout(() => {
        loadScreenDiv.style.display = 'none';
      }, 300);
    }
  };

  useEffect(() => {
    // create a variable to store a cleanup function
    let unmounted = false;
    let tokenDetected: boolean = false;

    // wrap the async code inside a function
    const getData = async () => {
      try {
        // refresh auth token before making requests
        await refreshAuthToken();
        // perform all the async operations in parallel
        const [
          recommendedTracksResult,
          recommendedArtistsResult,
          userAccountResult,
          topMonthlyResult,
          topAllTimeResult,
          listenHistoryResult,
          topMonthlyGenresResult,
          topAllTimeGenresResult,
          userPlaylistsResult,
        ] = await Promise.allSettled([
          getRecommendedTracks(),
          getRecommendedArtists(),
          spotifyApi.getMe(),
          getTopItems({ time_range: 'short_term', limit: '16' }),
          getTopItems({ time_range: 'long_term', limit: '16' }),
          getRecentListens({ limit: 50 }),
          getMonthlyListens({ time_range: 'short_term', limit: 50 }),
          getAlltimeListens({ time_range: 'long_term', limit: 50 }),
          getUserPlaylists(),
        ]);

        if (!unmounted) {
          // handle errors and update state with the results
          recommendedTracksResult.status === 'fulfilled' &&
            dispatch(SET_RECOMMEND_URIS(recommendedTracksResult.value.urisArr));
          recommendedTracksResult.status === 'fulfilled' &&
            setRecommendedSongs(recommendedTracksResult.value.tracksArr);

          userAccountResult.status === 'fulfilled' &&
            setDisplayName(userAccountResult.value.display_name || '');
          userAccountResult.status === 'fulfilled' &&
            setProfilePic(userAccountResult.value.images![0].url || '');

          topMonthlyResult.status === 'fulfilled' &&
            setMonthlySongs(topMonthlyResult.value.topTracks);
          topMonthlyResult.status === 'fulfilled' &&
            setMonthlyArtists(topMonthlyResult.value.topArtists);
          recommendedArtistsResult.status === 'fulfilled' &&
            setRecommendedArtists(recommendedArtistsResult.value);

          topAllTimeResult.status === 'fulfilled' &&
            setAllTimeSongs(topAllTimeResult.value.topTracks);
          topAllTimeResult.status === 'fulfilled' &&
            setAllTimeArtists(topAllTimeResult.value.topArtists);

          listenHistoryResult.status === 'fulfilled' &&
            setRecentListens(listenHistoryResult.value.listenHistory);
          listenHistoryResult.status === 'fulfilled' &&
            setRecentGenres(listenHistoryResult.value.genresArr);

          topMonthlyGenresResult.status === 'fulfilled' &&
            setMonthlyListens(topMonthlyGenresResult.value.topMonthly);
          topMonthlyGenresResult.status === 'fulfilled' &&
            setMonthlyGenres(topMonthlyGenresResult.value.TopMonthGenres);

          topAllTimeGenresResult.status === 'fulfilled' &&
            setAllTimeListens(topAllTimeGenresResult.value.allTListens);
          topAllTimeGenresResult.status === 'fulfilled' &&
            setAllTimeGenres(topAllTimeGenresResult.value.allTGenres);

          userPlaylistsResult.status === 'fulfilled' &&
            setUserPlaylists(userPlaylistsResult.value);

          if (!playerUris)
            recommendedTracksResult.status === 'fulfilled' &&
              !playerUris &&
              dispatch(SET_PLAYER_URIS(recommendedTracksResult.value.urisArr));
        }
        clearLoadingScreen();
      } catch (error) {
        // handle error
        console.error(error);
      }
    };

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

    setLoading(true);
    checkToken();
    if (tokenDetected) getData();
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
