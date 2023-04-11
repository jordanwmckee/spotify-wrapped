import { RootState } from 'context/store';
import { SET_PLAYER_URIS, SET_RECOMMEND_URIS } from 'context/user';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAlltimeListens,
  getMonthlyListens,
  getRecentListens,
  getRecommendedArtists,
  getRecommendedTracks,
  getTopItems,
  getUserPlaylists,
  refreshAuthToken,
  spotifyApi,
} from 'spotify';

interface FetchDataResult {
  displayName?: string;
  profilePic?: string;
  monthlyArtists?: TopItems[];
  monthlySongs?: TopItems[];
  allTimeSongs?: TopItems[];
  allTimeArtists?: TopItems[];
  recentListens?: Listens[];
  recentGenres?: object[];
  monthlyListens?: Listens[];
  monthlyGenres?: object[];
  allTimeListens?: Listens[];
  allTimeGenres?: object[];
  userPlaylists?: Playlists[];
  recommendedArtists?: RecommendedItems[];
  recommendedSongs?: RecommendedItems[];
  getData: () => Promise<void>;
}

const useFetchData = (): FetchDataResult => {
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
  const { playerUris } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

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
    } catch (error) {
      // handle error
      console.error(error);
    }
  };

  return {
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
  };
};

export default useFetchData;
