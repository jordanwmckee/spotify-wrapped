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
        userAccountResult,
        topMonthlyResult,
        topAllTimeResult,
        userPlaylistsResult,
      ] = await Promise.allSettled([
        spotifyApi.getMe(),
        getTopItems({ time_range: 'short_term', limit: '16' }),
        getTopItems({ time_range: 'long_term', limit: '16' }),
        getUserPlaylists(),
      ]);

      // handle errors and update state with the results
      if (userAccountResult.status === 'fulfilled') {
        setDisplayName(userAccountResult.value.display_name || '');
        setProfilePic(userAccountResult.value.images![0].url || '');
      }

      if (topMonthlyResult.status === 'fulfilled') {
        setMonthlySongs(topMonthlyResult.value.topTracks);
        setMonthlyArtists(topMonthlyResult.value.topArtists);
        setMonthlyGenres(topMonthlyResult.value.topGenres);

        // get recommended artists/tracks/uris from top monthly items
        const seedArtist = topMonthlyResult.value.topArtists[0].id;
        const seedTracks = topMonthlyResult.value.topTracks
          .flatMap((track) => track.id)
          .slice(0, 5)
          .join(',');

        const [recommendedArtistsResult, recommendedTracksResult] =
          await Promise.allSettled([
            getRecommendedArtists(seedArtist),
            getRecommendedTracks(seedTracks),
          ]);

        recommendedArtistsResult.status === 'fulfilled' &&
          setRecommendedArtists(recommendedArtistsResult.value);

        if (recommendedTracksResult.status === 'fulfilled') {
          setRecommendedSongs(recommendedTracksResult.value.tracksArr);
          dispatch(SET_RECOMMEND_URIS(recommendedTracksResult.value.urisArr));
          !playerUris &&
            dispatch(SET_PLAYER_URIS(recommendedTracksResult.value.urisArr));
        }
      }

      if (topAllTimeResult.status === 'fulfilled') {
        setAllTimeSongs(topAllTimeResult.value.topTracks);
        setAllTimeArtists(topAllTimeResult.value.topArtists);
        setAllTimeGenres(topAllTimeResult.value.topGenres);
      }

      userPlaylistsResult.status === 'fulfilled' &&
        setUserPlaylists(userPlaylistsResult.value);

      // setRefreshTimer();
    } catch (error) {
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
