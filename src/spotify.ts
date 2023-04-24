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
  scope: `streaming 
     user-read-email 
     user-library-read 
     user-library-modify 
     user-read-playback-state 
     user-modify-playback-state 
     user-read-recently-played 
     playlist-read-collaborative 
     playlist-read-private 
     user-read-currently-playing 
     playlist-modify-public 
     user-top-read 
     user-read-private 
     playlist-modify-private 
     user-follow-modify 
     user-follow-read
     ugc-image-upload`,
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
 * Get currentToken object from local storage
 *
 * @returns {Token | null} Token retrieved or null
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
 * Use a given fetch body, make the request and return the json result
 *
 * @param {BodyInit} body The body of the fetch request
 * @returns {Promise<any>} The json result of the request
 */
const tokenFetch = async (body: BodyInit): Promise<any> => {
  return fetch('https://accounts.spotify.com/api/token', {
    method: 'post',
    body: body,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
  }).then((res) => {
    return res.json();
  });
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
  if (code) {
    const body = new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const data = await tokenFetch(body);
    // add response tokens to stores
    addTokensToStore(data.refresh_token, data.access_token, Date.now());
    spotifyApi.setAccessToken(data.access_token);
    // clear query params from url
    window.location.replace(window.location.origin + window.location.pathname);
  }
};

/**
 * Get refresh token from store, and use it to generate a new access token
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

  const data = await tokenFetch(body);
  console.log('New access token generated.');
  addTokensToStore(auth.refresh_token, data.access_token, Date.now());
  spotifyApi.setAccessToken(data.access_token);
};

// /**
//  * Refresh user's access token every hour before expiration
//  */
// const setRefreshTimer = () => {
//   refreshAuthToken();
//   setInterval(setRefreshTimer, 1000 * 60 * 60);
// };

/**
 * Get array of URIs to use for Spotify Playback SDK
 *
 * @returns {object} {urisArr: string[]; tracksArr: RecommendedItems[]} The URIS for the Player to use
 */
const getRecommendedTracks = async (
  seedTracks: string
): Promise<{
  urisArr: string[];
  tracksArr: RecommendedItems[];
}> => {
  try {
    // Get recommendations using seeds
    const recommendations = await spotifyApi.getRecommendations({
      seed_tracks: seedTracks,
      limit: 50,
    });

    var urisArr: string[] = [];
    var tracksArr: RecommendedItems[] = [];
    // Use Promise.all() to wait for all of the promises inside the map function to resolve
    await Promise.all(
      recommendations.tracks.map(async (track) => {
        // get album image for track (RecommendationsFromSeedsResponse does not contain all required info)
        const album = (await spotifyApi.getTrack(track.id)).album;
        const image = album.images[0].url;

        const recommendedTrack: RecommendedItems = {
          name: track.name,
          image,
          uri: track.uri,
          id: track.id,
        };

        tracksArr.push(recommendedTrack);
        urisArr.push(track.uri);
      })
    );
    return { urisArr, tracksArr };
  } catch (err) {
    console.error(err);
    return { urisArr: [], tracksArr: [] };
  }
};

/**
 * Get similar artists to user's top artists for the month
 *
 * @returns {RecommendedItems[]} Array of recommended artists for user
 */
const getRecommendedArtists = async (
  seedArtist: string
): Promise<RecommendedItems[]> => {
  try {
    const relatedArtistsRes = await spotifyApi.getArtistRelatedArtists(
      seedArtist,
      {
        limit: 20,
      }
    );

    const artistIds = relatedArtistsRes.artists.map((artist) => artist.id);
    const followingArtists = await spotifyApi.isFollowingArtists(artistIds);

    const recommendedArtists = relatedArtistsRes.artists.map(
      (artist, index) => ({
        name: artist.name,
        image: artist.images[0].url,
        uri: artist.uri,
        id: artist.id,
        following: followingArtists[index],
      })
    );

    return recommendedArtists;
  } catch (err) {
    console.error(err);
    return [];
  }
};

/**
 * Make api call to get top songs, artists, and genres based on parameter seeds
 *
 * @param {object} params The parameters to use in the api call
 * @returns {object} {topTracks: TopItems[]; topArtists: TopItems[]; topGenres: string[][]}
 * Arrays for the top artists and songs based on given params
 */
const getTopItems = async (
  params: object
): Promise<{
  topTracks: TopItems[];
  topArtists: TopItems[];
  topGenres: string[][];
}> => {
  try {
    const [topTracksRes, topArtistsRes] = await Promise.all([
      spotifyApi.getMyTopTracks(params),
      spotifyApi.getMyTopArtists(params),
    ]);
    console.log('toptracks: ', topTracksRes);
    const topTracks: TopItems[] = topTracksRes.items.map((track) => ({
      name: track.name,
      image: track.album.images[0]?.url || '',
      uri: track.uri,
      id: track.id,
      artist: track.artists,
    }));

    const topArtists: TopItems[] = topArtistsRes.items.map((artist) => ({
      name: artist.name,
      image: artist.images[0].url,
      uri: artist.uri,
      id: artist.id,
    }));

    // get genres for top artists
    const artistIds = topTracksRes.items.flatMap((track) =>
      track.artists.map((artist) => artist.id)
    );
    if (artistIds.length > 50) artistIds.length = 50; // trim down to 50 if longer
    const topGenres = (await spotifyApi.getArtists(artistIds)).artists.map(
      (artist) => artist.genres
    );

    return {
      topTracks,
      topArtists,
      topGenres,
    };
  } catch (err) {
    console.error(err);
    return {
      topTracks: [],
      topArtists: [],
      topGenres: [],
    };
  }
};

/**
 *  Get user playlists with spotify web api
 *
 * @returns {Playlists[]} An array of objects for each user playlist
 */
const getUserPlaylists = async (): Promise<Playlist[]> => {
  try {
    const res = await spotifyApi.getUserPlaylists();
    const playlists = res.items.map((playlist) => ({
      name: playlist.name,
      uri: playlist.uri,
      id: playlist.id,
    }));
    return playlists;
  } catch (err) {
    console.error(err);
    return []; // return an empty array on error
  }
};

export {
  spotifyApi,
  loginUrl,
  fetchTokensFromCode,
  checkForTokens,
  getTokensFromStore,
  refreshAuthToken,
  // setRefreshTimer,
  getRecommendedTracks,
  getRecommendedArtists,
  getTopItems,
  getUserPlaylists,
};
