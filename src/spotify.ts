/**
 * This file contians the functionality for creating the Spotify Web API
 * and for handling deconstruction of API request results
 */

import SpotifyWebApi from 'spotify-web-api-js';
import { Buffer } from 'buffer';

// Spotify App Config
const authEndpoint: string = import.meta.env.VITE_AUTH_ENDPOINT!;
const redirectUri: string = import.meta.env.VITE_REDIRECT_URI!;
const clientId: string = import.meta.env.VITE_CLIENT_ID!;
const clientSecret: string = import.meta.env.VITE_CLIENT_SECRET!;

var spotifyApi = new SpotifyWebApi();

// query parameters for spotify auth
const auth_query_params = new URLSearchParams({
  show_dialog: 'true',
  response_type: 'code',
  grant_type: 'authorization_code',
  client_id: clientId,
  scope:
    'streaming user-read-email user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-read-recently-played playlist-read-collaborative playlist-read-private user-read-currently-playing playlist-modify-public user-top-read user-read-private playlist-modify-private user-follow-modify user-follow-read',
  redirect_uri: redirectUri,
});

// Spotify authenication portal
const loginUrl = `${authEndpoint}?${auth_query_params.toString()}`;

/**
 * Adds a token and the time it was created to session storage in browser
 *
 * @param {string} token The access token for the logged in user
 * @param {number} timeCreated The time the token was requested
 */
const addTokensToStore = (
  refToken: string,
  token: string,
  timeCreated: number
) => {
  const currentToken: Token = {
    refresh_token: refToken,
    access_token: token,
    time_created: timeCreated,
  };
  if (refToken)
    localStorage.setItem('SpotifyTokens', JSON.stringify(currentToken));
};

/**
 * Check for accessTokens in LocalStorage
 *
 * @returns {boolean} True if tokens are found in localStorage, false otherwise
 */
const checkForTokens = (): boolean => {
  const tokenStore = localStorage.getItem('SpotifyTokens');
  if (tokenStore) return true;
  else return false;
};

/**
 * Get currentToken object from loacl storage
 *
 * @returns {Token | null}
 */
const getTokensFromStore = (): Token | null => {
  const auth: string = localStorage.getItem('SpotifyTokens')!;
  if (!auth) return null;
  else return JSON.parse(auth);
};

/**
 * Check tokenStore to verify validity of spotify access token
 *
 * @returns {boolean} True if access token is still valid, False if not
 */
const isValidAccessToken = (): boolean => {
  const auth = getTokensFromStore();
  if (!auth) return false;
  const timeDiff = Date.now() - auth.time_created!;
  if (timeDiff > 3550000) return false;
  return true;
};

/**
 * Assumes the code from Spotify's callback is in the url
 * Use code from url to request an access_token and refresh_token from web api
 */
const fetchTokensFromCode = async () => {
  // get response code from url
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  // execute fetch to get tokens from code
  if (typeof code === 'string') {
    const body = new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'post',
      body: body,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
    });

    const data = await response.json();
    // add response tokens to stores
    addTokensToStore(data.refresh_token, data.access_token, Date.now());
    spotifyApi.setAccessToken(data.access_token);
    // clear query params from url
    window.location.replace(window.location.origin + window.location.pathname);
  }
};

/**
 * Get refresh token from firebase, and use it to generate a new access token
 */
const refreshAuthToken = async () => {
  // check if access token is still valid first
  const auth = getTokensFromStore();
  if (isValidAccessToken() === true) {
    spotifyApi.setAccessToken(auth!.access_token!);
    return;
  } else {
    console.log('No valid token detected.');
  }

  if (!auth?.refresh_token) return;

  var body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: auth.refresh_token,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'post',
    body: body,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
  });

  const data = await response.json();
  console.log('New access token generated.');
  addTokensToStore(auth.refresh_token, data.access_token, Date.now());
  spotifyApi.setAccessToken(data.access_token);
  // refreshCycle(user);
};

/**
 * Run refreshAuthToken every hour to generate new token
 *
 * @param {User} user Returned from useAuthState
 */
// const refreshCycle = (user: User) => {
//   setInterval(refreshAuthToken, 1000 * 59 * 59, user);
// };

/**
 * Get array of URIs to use for Spotify Playback SDK
 *
 * @returns {string[], RecommendedItems[]} The URIS for the Player to use
 */
const getRecommendedTracks = async (): Promise<{
  urisArr: string[];
  tracksArr: RecommendedItems[];
}> => {
  var urisArr: string[] = [];
  var tracksArr: RecommendedItems[] = [];
  try {
    // Get seed tracks for recommendations
    const top5Tracks = await spotifyApi.getMyTopTracks({
      time_range: 'short_term',
      limit: '5',
    });
    let seeds = '';
    top5Tracks.items.forEach((track) => {
      seeds += track.id + ',';
    });
    seeds = seeds.slice(0, -1);

    // Get recommendations using seeds
    const recommendations = await spotifyApi.getRecommendations({
      seed_tracks: seeds,
      limit: 100,
    });

    if (recommendations) {
      // Use Promise.all() to wait for all of the promises inside the forEach loop to resolve
      await Promise.all(
        recommendations.tracks.map(async (track) => {
          // get album image for track (RecommendationsFromSeedsResponse does not contain all required info)
          let currentImage = (await spotifyApi.getTrack(track.id)).album
            .images[0].url;
          let data: RecommendedItems = {
            name: track.name,
            image: currentImage,
            uri: track.uri,
          };
          tracksArr.push(data);
          urisArr.push(track.uri);
        })
      );
    }
  } catch (err) {
    console.error(err);
  }
  return Promise.resolve({ urisArr, tracksArr });
};

/**
 * Get similar artists to user's top artists for the month
 *
 * @param {string} seedArtist Array of user's top artists for the month
 * @returns {RecommendedItems[]} Array of recommended artists for user
 */
const getRecommendedArtists = async (
  seedArtist: string
): Promise<RecommendedItems[]> => {
  var recommendedArtists: RecommendedItems[] = [];
  try {
    const relatedArtistsRes = await spotifyApi.getArtistRelatedArtists(
      seedArtist
    );
    if (relatedArtistsRes) {
      for (const artist of relatedArtistsRes.artists) {
        let data: RecommendedItems = {
          name: artist.name,
          image: artist.images[0].url,
          uri: artist.uri,
          id: artist.id,
          following: (await spotifyApi.isFollowingArtists([artist.id]))[0]
            ? true
            : false,
        };
        recommendedArtists.push(data);
      }
    }
  } catch (err) {
    console.error(err);
  }
  return Promise.resolve(recommendedArtists);
};

/**
 * Make api call to get top songs and artists based on parameters passed
 *
 * @param {object} params The parameters to use in the api call
 * @returns {TopItems[], TopItems[]} Arrays for the top artists and songs based on given params
 */
const getTopItems = async (
  params: object
): Promise<{
  topTracks: TopItems[];
  topArtists: TopItems[];
}> => {
  var topTracksArr: TopItems[] = [];
  var topArtistsArr: TopItems[] = [];
  try {
    // get top items
    const topTracksRes = await spotifyApi.getMyTopTracks(params);
    const topArtistsRes = await spotifyApi.getMyTopArtists(params);
    // convert requests into objects for TopCard component
    if (topTracksRes) {
      topTracksRes.items.forEach((track) => {
        let data = {
          name: track.name,
          image: track.album.images[0].url,
          uri: track.uri,
        };
        topTracksArr.push(data);
      });
    }
    if (topArtistsRes) {
      topArtistsRes.items.forEach((artist) => {
        let data = {
          name: artist.name,
          image: artist.images[0].url,
          id: artist.id,
        };
        topArtistsArr.push(data);
      });
    }
  } catch (err) {
    console.error(err);
  }
  return Promise.resolve({
    topTracks: topTracksArr,
    topArtists: topArtistsArr,
  });
};

/**
 * make api call to get the last 50 listened to tracks and associate genres
 *
 * @param {object} params
 * @returns {Listens[], object[]} Arrays for the recently listened and song data
 */
const getRecentListens = async (
  params: object
): Promise<{
  listenHistory: Listens[];
  genresArr: object[];
}> => {
  var listenHistoryArr: Listens[] = [];
  var genresList: object[] = [];
  var holder: string[] = [];
  try {
    // get last 50 listened tracks
    const recentListensRes = await spotifyApi.getMyRecentlyPlayedTracks(params);
    if (recentListensRes) {
      recentListensRes.items.forEach((track) => {
        let data = {
          id: track.track.id,
          name: track.track.name,
          artist: track.track.artists,
        };
        listenHistoryArr.push(data);
      });
      listenHistoryArr.forEach((object) => {
        let junk = object.artist;
        junk.forEach((artist) => {
          holder.push(artist.id);
        });
      });
      for (let index = 0; index < holder.length; index++) {
        let junkVar = await spotifyApi.getArtist(holder[index]);
        genresList.push(junkVar.genres);
      }
    }
  } catch (err) {
    console.log(err);
  }
  return Promise.resolve({
    listenHistory: listenHistoryArr,
    genresArr: genresList,
  });
};

/**
 * make api call to get the top 50 listened to tracks in the last month
 * and associate genres
 *
 * @param {object} params
 * @returns {Listens[], object[]} Arrays for the recently listened and song data
 */
const getMonthlyListens = async (
  params: object
): Promise<{
  topMonthly: Listens[];
  TopMonthGenres: object[];
}> => {
  var monthlyListensArr: Listens[] = [];
  var monthlyGenresList: object[] = [];
  var holder: string[] = [];
  try {
    // get last 50 listened tracks
    const monthlyListensRes = await spotifyApi.getMyTopTracks(params);
    if (monthlyListensRes) {
      monthlyListensRes.items.forEach((track) => {
        let data = {
          id: track.id,
          name: track.name,
          artist: track.artists,
        };
        monthlyListensArr.push(data);
      });
      monthlyListensArr.forEach((object) => {
        let junk = object.artist;
        junk.forEach((artist) => {
          holder.push(artist.id);
        });
      });
      for (let index = 0; index < holder.length; index++) {
        let junkVar = await spotifyApi.getArtist(holder[index]);
        monthlyGenresList.push(junkVar.genres);
      }
    }
  } catch (err) {
    console.log(err);
  }
  return Promise.resolve({
    topMonthly: monthlyListensArr,
    TopMonthGenres: monthlyGenresList,
  });
};

/**
 * make api call to get the top 50 listened to tracks in the last several years
 * and associate genres
 *
 * @param {object} params
 * @returns {Listens[], object[]} Arrays for the recently listened and song data
 */
const getAlltimeListens = async (
  params: object
): Promise<{
  allTListens: Listens[];
  allTGenres: object[];
}> => {
  var allTimeListensArr: Listens[] = [];
  var allTimeGenresList: object[] = [];
  var holder: string[] = [];
  try {
    // get last 50 listened tracks
    const recentListensRes = await spotifyApi.getMyTopTracks(params);
    if (recentListensRes) {
      recentListensRes.items.forEach((track) => {
        let data = {
          id: track.id,
          name: track.name,
          artist: track.artists,
        };
        allTimeListensArr.push(data);
      });
      allTimeListensArr.forEach((object) => {
        let junk = object.artist;
        junk.forEach((artist) => {
          holder.push(artist.id);
        });
      });
      for (let index = 0; index < holder.length; index++) {
        let junkVar = await spotifyApi.getArtist(holder[index]);
        allTimeGenresList.push(junkVar.genres);
      }
    }
  } catch (err) {
    console.log(err);
  }
  return Promise.resolve({
    allTListens: allTimeListensArr,
    allTGenres: allTimeGenresList,
  });
};

/**
 *  Get user playlists with spotify web api
 *
 * @returns {Playlists[]} An array of objects for each user playlist
 */
const getUserPlaylists = async (): Promise<Playlists[]> => {
  var playlists: Playlists[] = [];
  try {
    const res = await spotifyApi.getUserPlaylists();
    if (playlists) {
      res.items.forEach((playlist) => {
        let data = {
          name: playlist.name,
          uri: playlist.uri,
          id: playlist.id,
        };
        playlists.push(data);
      });
    }
  } catch (err) {
    console.error(err);
  }
  return Promise.resolve(playlists);
};

export {
  spotifyApi,
  loginUrl,
  fetchTokensFromCode,
  checkForTokens,
  getTokensFromStore,
  refreshAuthToken,
  // refreshCycle,
  getRecommendedTracks,
  getRecommendedArtists,
  getTopItems,
  getRecentListens,
  getMonthlyListens,
  getAlltimeListens,
  getUserPlaylists,
};
