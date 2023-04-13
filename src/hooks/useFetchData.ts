import { RootState } from 'context/store';
import { SET_PLAYER_URIS, SET_RECOMMEND_URIS } from 'context/user';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRecommendedArtists,
  getRecommendedTracks,
  getTopItems,
  getUserPlaylists,
  refreshAuthToken,
  // setRefreshTimer,
  spotifyApi,
} from 'spotify';

interface FetchDataResult {
  displayName?: string;
  profilePic?: string;
  monthlyArtists?: TopItems[];
  monthlySongs?: TopItems[];
  allTimeSongs?: TopItems[];
  allTimeArtists?: TopItems[];
  monthlyListens?: Listens[];
  monthlyGenres?: string[][];
  allTimeListens?: Listens[];
  allTimeGenres?: string[][];
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
  const [monthlyGenres, setMonthlyGenres] = useState<string[][]>();
  const [allTimeGenres, setAllTimeGenres] = useState<string[][]>();
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
        userPlaylistsResult,
      ] = await Promise.allSettled([
        getRecommendedTracks(),
        getRecommendedArtists(),
        spotifyApi.getMe(),
        getTopItems({ time_range: 'short_term', limit: '16' }),
        getTopItems({ time_range: 'long_term', limit: '16' }),
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
      topMonthlyResult.status === 'fulfilled' &&
        setMonthlyGenres(topMonthlyResult.value.topGenres);

      recommendedArtistsResult.status === 'fulfilled' &&
        setRecommendedArtists(recommendedArtistsResult.value);

      topAllTimeResult.status === 'fulfilled' &&
        setAllTimeSongs(topAllTimeResult.value.topTracks);
      topAllTimeResult.status === 'fulfilled' &&
        setAllTimeArtists(topAllTimeResult.value.topArtists);
      topAllTimeResult.status === 'fulfilled' &&
        setAllTimeGenres(topAllTimeResult.value.topGenres);

      userPlaylistsResult.status === 'fulfilled' &&
        setUserPlaylists(userPlaylistsResult.value);

      recommendedTracksResult.status === 'fulfilled' &&
        !playerUris &&
        dispatch(SET_PLAYER_URIS(recommendedTracksResult.value.urisArr));

      // setRefreshTimer();
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
    monthlyGenres,
    allTimeGenres,
    userPlaylists,
    recommendedArtists,
    recommendedSongs,
    getData,
  };
};

export default useFetchData;
