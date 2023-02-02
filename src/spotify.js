import SpotifyWebApi from "spotify-web-api-js";
import { addTokenToDb, getRefreshToken } from "./firebase";
import { Buffer } from "buffer";

const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "http://localhost:3000/dashboard";
const clientId = "155ce0eabe804923855dd85cbd23329e";
const clientSecret = "40498951b9224388b01a2a0920b5289e";

var spotifyApi = new SpotifyWebApi();

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

const fetchTokens = async (user) => {
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
      spotifyApi.setAccessToken(data.access_token);
      await addTokenToDb(data.refresh_token, user);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
  // window.location.search = "";
};

const refreshAuthToken = async (user) => {
  //if (spotifyApi.getAccessToken()) return;

  const refToken = await getRefreshToken(user);

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
      spotifyApi.setAccessToken(data.access_token);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
};

const refreshCycle = (user) => {
  setInterval(refreshAuthToken, 1000 * 59 * 59, user);
};

export { spotifyApi, loginUrl, fetchTokens, refreshAuthToken, refreshCycle };
