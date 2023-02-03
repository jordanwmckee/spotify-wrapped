import SpotifyWebApi from "spotify-web-api-js";
import { addTokenToDb, getRefreshToken } from "./firebase";
import { Buffer } from "buffer";

var timeTokenCreated = null;

/**
 * Sets the value for timeTokenCreated variable in files where imported
 *
 * @param {Date} time
 */
const setTimeCreated = (time) => {
  timeTokenCreated = time;
};

// Spotify App Config
const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "http://localhost:3000/dashboard";
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
    "user-library-read",
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
 * Check tokenStore to verify validity of spotify access token
 *
 * @returns {bool} True if access token is still valid, False if not
 */
const isValidAccessToken = () => {
  if (timeTokenCreated === null) return false;
  const now = Date.now();
  const timeDiff = (Math.abs(now - timeTokenCreated) / 1000) % 60;
  if (timeDiff > 3550) return false;
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
  await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
  })
    .then(async (res) => {
      const data = await res.json();
      timeTokenCreated = Date.now();
      spotifyApi.setAccessToken(data.access_token);
      await addTokenToDb(data.refresh_token, user);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
  window.location.search = "";
};

/**
 * Get refresh token from firebase, and use it to generate a new access token
 *
 * @param {Object} user Returned from useAuthState
 */
const refreshAuthToken = async (user) => {
  // check if access token is still valid first
  if (isValidAccessToken() === true) return;

  const refToken = await getRefreshToken(user);
  if (!refToken) return;

  var body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refToken,
  });
  await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    json: true,
  })
    .then(async (res) => {
      const data = await res.json();
      console.log("new access token generated.");
      timeTokenCreated = Date.now();
      spotifyApi.setAccessToken(data.access_token);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
};

const refreshCycle = (user) => {
  setInterval(refreshAuthToken, 1000 * 59 * 59, user);
};

export {
  setTimeCreated,
  spotifyApi,
  loginUrl,
  fetchTokensFromCode,
  refreshAuthToken,
  refreshCycle,
};
