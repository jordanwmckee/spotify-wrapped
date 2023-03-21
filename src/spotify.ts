/**
 * This file contians the functionality for creating the Spotify Web API
 * and for handling deconstruction of API request results
 */

import SpotifyWebApi from "spotify-web-api-js";
import { addTokenToDb, getRefreshToken } from "./firebase";
import { Buffer } from "buffer";
import { User } from "firebase/auth";

// Spotify App Config
const authEndpoint: string = import.meta.env.VITE_AUTH_ENDPOINT!;
const redirectUri: string = import.meta.env.VITE_REDIRECT_URI!;
const clientId: string = import.meta.env.VITE_CLIENT_ID!;
const clientSecret: string = import.meta.env.VITE_CLIENT_SECRET!;

var spotifyApi = new SpotifyWebApi();

// query parameters for spotify auth
const auth_query_params = new URLSearchParams({
  show_dialog: "true",
  response_type: "code",
  grant_type: "authorization_code",
  client_id: clientId,
  scope:
    "streaming user-read-email user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-read-recently-played playlist-read-collaborative playlist-read-private user-read-currently-playing playlist-modify-public user-top-read user-read-private playlist-modify-private",
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
const addTokenToSession = (token: string, timeCreated: number) => {
  const currentToken: Token = {
    access_token: token,
    time_created: timeCreated,
  };
  sessionStorage.setItem("currentToken", JSON.stringify(currentToken));
};

/**
 * Get currentToken object from session storage
 *
 * @returns {Token | null}
 */
const getTokenFromSession = (): Token | null => {
  const token: string = sessionStorage.currentToken;
  if (!token) return null;
  else return JSON.parse(token);
};

/**
 * Check tokenStore to verify validity of spotify access token
 *
 * @returns {boolean} True if access token is still valid, False if not
 */
const isValidAccessToken = (): boolean => {
  const token = getTokenFromSession();
  if (!token) return false;
  const timeDiff = Date.now() - token.time_created!;
  if (timeDiff > 3550000) return false;
  return true;
};

/**
 * Assumes the code from Spotify's callback is in the url
 * Use code from url to request an access_token and refresh_token from web api
 *
 * @param {User} user Returned from useAuthState
 */
const fetchTokensFromCode = async (user: User) => {
  // get response code from url
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  // execute fetch to get tokens from code
  if (typeof code === "string") {
    const body = new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "post",
      body: body,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
    });

    const data = await response.json();
    addTokenToSession(data.access_token, Date.now());
    spotifyApi.setAccessToken(data.access_token);
    await addTokenToDb(data.refresh_token, user);
    window.location.hash = "";
  }
};

/**
 * Get refresh token from firebase, and use it to generate a new access token
 *
 * @param {User} user Returned from useAuthState
 */
const refreshAuthToken = async (user: User) => {
  // check if access token is still valid first
  if (isValidAccessToken() === true) {
    const token = getTokenFromSession();
    spotifyApi.setAccessToken(token!.access_token!);
    return;
  } else {
    console.log("No valid token detected.");
  }

  const refToken = await getRefreshToken(user);
  if (!refToken) return;

  var body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refToken,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    // json: true,
  });

  const data = await response.json();
  console.log("New access token generated.");
  addTokenToSession(data.access_token, Date.now());
  spotifyApi.setAccessToken(data.access_token);
  refreshCycle(user);
};

/**
 * Run refreshAuthToken every hour to generate new token
 *
 * @param {User} user Returned from useAuthState
 */
const refreshCycle = (user: User) => {
  setInterval(refreshAuthToken, 1000 * 59 * 59, user);
};

/**
 * Get array of URIs to use for Spotify Playback SDK
 *
 * @returns {string[]} The URIS for the Player to use
 */
const getRecommendUris = async (): Promise<string[]> => {
  var tracksArr: string[] = [];
  try {
    // Get seed tracks for recommendations
    const top5Tracks = await spotifyApi.getMyTopTracks({
      time_range: "short_term",
      limit: "5",
    });
    let seeds = "";
    top5Tracks.items.forEach((track) => {
      seeds += track.id + ",";
    });
    seeds = seeds.slice(0, -1);

    // Get recommendations using seeds
    const recommendations = await spotifyApi.getRecommendations({
      seed_tracks: seeds,
      limit: 100,
    });
    recommendations.tracks.forEach((track) => {
      tracksArr.push(track.uri);
    });
  } catch (err) {
    console.error(err);
  }
  return Promise.resolve(tracksArr);
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
  refreshAuthToken,
  refreshCycle,
  getRecommendUris,
  getTopItems,
  getRecentListens,
  getMonthlyListens,
  getAlltimeListens,
  getUserPlaylists,
};
