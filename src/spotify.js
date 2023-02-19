import SpotifyWebApi from "spotify-web-api-js";
import { addTokenToDb, getRefreshToken } from "./firebase";
import { Buffer } from "buffer";

// Spotify App Config
const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "http://localhost:3000/";
const clientId = "155ce0eabe804923855dd85cbd23329e";
const clientSecret = "40498951b9224388b01a2a0920b5289e";

var spotifyApi = new SpotifyWebApi();

// query parameters for spotify auth
const auth_query_params = new URLSearchParams({
  show_dialog: true,
  response_type: "code",
  grant_type: "authorization_code",
  client_id: clientId,
  scope: [
    "streaming",
    "user-read-email",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-recently-played",
    "playlist-read-collaborative",
    "playlist-read-private",
    "user-read-currently-playing",
    "playlist-modify-public",
    "user-top-read",
    "user-read-private",
    "playlist-modify-private",
  ],
  redirect_uri: redirectUri,
});

const loginUrl = `${authEndpoint}?${auth_query_params.toString()}`;

/**
 * Adds a token and the time it was created to session storage in browser
 *
 * @param {string} token The access token for the logged in user
 * @param {Date} timeCreated The time the token was requested
 */
const addTokenToSession = (token, timeCreated) => {
  const currentToken = {
    access_token: token,
    time_created: timeCreated,
  };
  sessionStorage.setItem("currentToken", JSON.stringify(currentToken));
};

/**
 * Get currentToken object from session storage
 *
 * @returns {Object}
 */
const getTokenFromSession = () => {
  const token = sessionStorage.currentToken;
  if (!token) return null;
  else return JSON.parse(token);
};

/**
 * Check tokenStore to verify validity of spotify access token
 *
 * @returns {bool} True if access token is still valid, False if not
 */
const isValidAccessToken = () => {
  const token = getTokenFromSession();
  if (!token) return false;
  const timeDiff = Date.now() - token.time_created;
  if (timeDiff > 3550000) return false;
  return true;
};

/**
 * Assumes the code from Spotify's callback is in the url
 * Use code from url to request an access_token and refresh_token from web api
 *
 * @param {Object} user Returned from useAuthState
 */
const fetchTokensFromCode = async (user) => {
  // get response code from url
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  // execute fetch to get tokens from code
  var body = new URLSearchParams({
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
  window.location.search = "";
};

/**
 * Get refresh token from firebase, and use it to generate a new access token
 *
 * @param {Object} user Returned from useAuthState
 */
const refreshAuthToken = async (user) => {
  // check if access token is still valid first
  if (isValidAccessToken() === true) {
    const token = getTokenFromSession();
    spotifyApi.setAccessToken(token.access_token);
    return;
  } else {
    console.log("Token expired.");
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
    json: true,
  });

  const data = await response.json();
  console.log("New access token generated.");
  addTokenToSession(data.access_token, Date.now());
  spotifyApi.setAccessToken(data.access_token);
};

/**
 * Run refreshAuthToken every hour to generate new token
 *
 * @param {Object} user Returned from useAuthState
 */
const refreshCycle = (user) => {
  setInterval(refreshAuthToken, 1000 * 59 * 59, user);
};

export {
  spotifyApi,
  loginUrl,
  fetchTokensFromCode,
  refreshAuthToken,
  refreshCycle,
};
