import express, {
  json
} from "express";
import fetch from "node-fetch";
import {
  conn
} from "./database.js"; // init db connection
import cron from "node-cron";

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

const redirect_uri = "http://localhost:3000/callback";
const client_id = "9d8af94533ce40bda08ac5760e77ff9c";
const client_secret = "2f8a8c128b2d4e06af100ca69167570a";

global.access_token;

// set root directory of site to be index & render it
app.get("/", function (req, res) {
  res.render("index");
});

// set /authorize to redirect user to spotify login
app.get("/authorize", (req, res) => {
  var auth_query_parameters = new URLSearchParams({
    show_dialog: true,
    response_type: "code",
    client_id: "9d8af94533ce40bda08ac5760e77ff9c",
    scope: ["user-library-read", "user-read-recently-played", "playlist-read-collaborative", "playlist-read-private", "user-read-currently-playing", "playlist-modify-public", "user-top-read", "user-read-private", "playlist-modify-private"],
    redirect_uri: redirect_uri,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize?" + auth_query_parameters.toString()
  );
});

// fetch user credentials and redirect to /dashboard
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  var body = new URLSearchParams({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  });

  const data = await response.json();
  global.access_token = data.access_token;

  res.redirect("/dashboard");
});

// pre : function called to check status of db connection
// post : returns true if connection is open, else returns false
function dbStatus() {
  var status = true;
  conn.ping((err) => {
    if (err) {
      console.log(err)
      status = false;
    }
  });
  return status;
}

// pre : function called with results from /me/player/recently-played api endpoint passed
// post : inserts all history into database that doesn't already exist in the db
function updateHistory(recents, userInfo) {
  // get each track id of and name of all recents
  let user_id = userInfo.id,
    song_id, song_name, played_at, album_url;
  let recent = recents.items;
  for (let song in recent) {
    song_id = recent[song].track.id;
    song_name = recent[song].track.name;
    played_at = recent[song].played_at.replace("T", " ").replace("Z", "");
    album_url = recent[song].track.album.images[0].url;
    try {
      conn.query(`INSERT IGNORE INTO history VALUES(${conn.escape(user_id)}, ${conn.escape(song_id)}, ${conn.escape(song_name)}, ${conn.escape(played_at)}, ${conn.escape(album_url)})`);
    } catch (e) {
      console.log("Error", e.stack);
      console.log("Error", e.name);
      console.log("Error", e.message);
    }
  }
  console.log("Listening history updated.");
}

// pre : function called with an api endpoint value passed
// post : authenticates and fetches json endpoint to return
async function getData(endpoint) {
  const response = await fetch("https://api.spotify.com/v1" + endpoint, {
    method: "get",
    headers: {
      Authorization: "Bearer " + global.access_token,
    },
  });

  const data = await response.json();
  return data;
}

//--------------
// render pages

app.get("/sqlStatus", (req, res) => {
  conn.ping((err) => {
    if (err) return res.status(500).send("MySQL Server is Down");
    res.send("MySQL Server is Active");
  })
});

app.get("/dashboard", async (req, res) => {
  const userInfo = await getData("/me");
  const recents = await getData("/me/player/recently-played");

  const track_id = recents['items'][0]['track']['id'];
  //console.log(track_id);

  const params = new URLSearchParams({
    seed_tracks: track_id,
  });

  const recs = await getData("/recommendations?" + params);

  //console.log(recs.tracks);

  // add recent songs to db if db connection is open
  if (dbStatus() === true) updateHistory(recents, userInfo);

  res.render("dashboard", {
    user: userInfo,
    tracks: recs.tracks,
    recents: recents.items
  });
});

app.get("/recent", async (req, res) => {
  const userInfo = await getData("/me");
  const recents = await getData("/me/player/recently-played");

  //console.log(recents);

  res.render("recent", {
    user: userInfo,
    recents: recents.items
  });
});

app.get("/help", async (req, res) => {
  res.render("help", {});
});

app.get("/recommendations", async (req, res) => {
  const artist_id = req.query.artist;
  const track_id = req.query.track;

  const params = new URLSearchParams({
    seed_artist: artist_id,
    seed_tracks: track_id,
  });

  const data = await getData("/recommendations?" + params);
  //console.log(data);
  res.render("recommendation", {
    tracks: data.tracks
  });
});

//TOP TRACK FUNCTIONS

app.get("/top-tracks-short", async (req, res) => {

  const params = new URLSearchParams({
    time_range: "short_term",
  });

  const data = await getData("/me/top/tracks?"+ params);
  //console.log(data);
  res.render("top-tracks-short", {
    tracks: data.items
  });
});

app.get("/top-tracks-medium", async (req, res) => {

  const params = new URLSearchParams({
    time_range: "medium_term",
  });

  const data = await getData("/me/top/tracks?"+ params);
  //console.log(data);
  res.render("top-tracks-medium", {
    tracks: data.items
  });
});

app.get("/top-tracks-long", async (req, res) => {

  const params = new URLSearchParams({
    time_range: "long_term",
  });

  const data = await getData("/me/top/tracks?"+ params);
  //console.log(data);
  res.render("top-tracks-long", {
    tracks: data.items
  });
});

//TOP ARTISTS FUNCTIONS

app.get("/top-artists-short", async (req, res) => {

  const params = new URLSearchParams({
    time_range: "short_term",
  });

  const data = await getData("/me/top/artists?" + params);
  //console.log(data);
  res.render("top-artists-short", {
    artists: data.items
  });
});

app.get("/top-artists-medium", async (req, res) => {

  const params = new URLSearchParams({
    time_range: "medium_term",
  });

  const data = await getData("/me/top/artists?"+ params);
  //console.log(data);
  res.render("top-artists-medium", {
    artists: data.items
  });
});

app.get("/top-artists-long", async (req, res) => {

  const params = new URLSearchParams({
    time_range: "long_term",
  });

  const data = await getData("/me/top/artists?"+ params);
  //console.log(data);
  res.render("top-artists-long", {
    artists: data.items
  });
});

app.get("/historyRecommendations", async (req, res) => {
  const track_id = req.query.track;

  const params = new URLSearchParams({
    seed_tracks: track_id,
  });

  const data = await getData("/recommendations?" + params);
  //console.log(data);
  res.render("recommendation", {
    tracks: data.tracks
  });
});

app.get("/history", async (req, res) => {
  const userInfo = await getData("/me");
  var songList = [];

  conn.query(`SELECT * From \`history\` WHERE \`user_id\`='${userInfo.id}' ORDER BY \`played_at\` DESC`, async function (error, results, fields) {
    if (error) res.status(500).send("Unable to display user history."); //throw error;
    else {
      for (var i = 0; i < results.length; i++) {

        var song = {
          'song_id': results[i].song_id,
          'song_name': results[i].song_name,
          'played_at': results[i].played_at,
          'album_url': results[i].album_url
        }
        songList.push(song);
      }
      res.render('history', {
        "songList": songList
      });
    }
  });
});

//UNUSED FUNCTION
app.get('/createPlaylist', async (req, res, next) => {
  const userInfo = await getData("/me");

  const params = new URLSearchParams({
    seed_tracks: '12'
  });

  const data = await getData("/recommendations?" + params);

  await fetch(`https://api.spotify.com/v1/users/${userInfo.id}/playlists`, {
    headers: {
      'Authorization': 'Bearer ' + global.access_token
    },
    contentType: 'application/json',
    method: 'POST',
    body: JSON.stringify({
      "name": `Storify`,
      "description": `A playlist created with Storify.com`,
      "public": true
    })
  }).then(function (response) {
    //console.log(response);
    const playListID = response;
  }).catch(err => {
    console.log(err);
  });


  const playlists = await getData("/me/playlists?limit=1")
  //console.log(data);
  //console.log(data.track);


  await fetch(`https://api.spotify.com/v1/playlists/${playlists.items.id}/tracks`, {
    headers: {
      'Authorization': 'Bearer ' + global.access_token
    },
    contentType: 'application/json',
    method: 'POST',
    data: data.tracks.uri
  })

});

// pre : function called with results from /me/player/recently-played api endpoint passed 
// post : inserts all history into database that doesn't already exist in the db EVERY 24 HOURS
cron.schedule('0 */2 * * *', async () => {
  if (global.access_token) {
    const userInfo = await getData("/me");
    const recents = await getData("/me/player/recently-played");
    if (dbStatus() === true) updateHistory(recents, userInfo);
  }
});

// tell express to listen for connections on port 3000
let listener = app.listen(3000, function () {
  console.log(
    "Your app is listening on http://localhost:" + listener.address().port
  );
});