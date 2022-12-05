import { useState, useEffect } from 'react';

const Login = () => {
	const CLIENT_ID = "155ce0eabe804923855dd85cbd23329e";
  const REDIRECT_URI = "http://localhost:3000/dashboard";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  //const CLIENT_SECRET = "40498951b9224388b01a2a0920b5289e";
  const [token, setToken] = useState("");

  var auth_query_params = new URLSearchParams({
    show_dialog: true,
    response_type: RESPONSE_TYPE,
    client_id: CLIENT_ID,
    scope: [
      "user-library-read", 
      "user-read-recently-played", 
      "playlist-read-collaborative", 
      "playlist-read-private", 
      "user-read-currently-playing", 
      "playlist-modify-public", 
      "user-top-read", 
      "user-read-private", 
      "playlist-modify-private"
    ],
    redirect_uri: REDIRECT_URI,
  });

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

	return ( 
		<div className="login">
      <img id="spotify-logo" src="spotify-logo.svg" alt="Spotify" />
      <br /> <br />
      {!token &&
        <div className="buttons">
          <a 
            href={AUTH_ENDPOINT + "?" + auth_query_params.toString()}
            className="button"
          >
            LOGIN
          </a>
        </div>
      }
		</div>
	 );
}
 
export default Login;