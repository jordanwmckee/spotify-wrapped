import { useEffect } from "react";
import { useState } from "react";
import { auth, db } from "../../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { Buffer } from 'buffer';

const Callback = () => {
  const [user, loading, error] = useAuthState(auth);
	const [code, setCode] = useState("");
	const [fail, setFail] = useState(false);
	const REDIRECT_URI = "http://localhost:3000/callback";
  const CLIENT_ID = "155ce0eabe804923855dd85cbd23329e";
	const CLIENT_SECRET = "40498951b9224388b01a2a0920b5289e";
	const navigate = useNavigate();

	// add collected tokens to user db
	const updateUserTokens = async (data) => {
		var authToken, refreshToken;
		if (data) {
			authToken = data.access_token;
			refreshToken = data.refresh_token;
		}
    await updateDoc(doc(db, "users", user?.uid), {
      authToken: authToken,
      refreshToken: refreshToken,
    }).then(res => {
      console.log("user tokens updated");
    }).catch(err => {
      console.error("error updating user tokens: ", err);
			setFail(true);
    });
  }

	// use parsed code from url to request for access/refresh tokens
	const fetchTokens = async () => {
		var body = new URLSearchParams({
			code: code,
			redirect_uri: REDIRECT_URI,
			grant_type: "authorization_code",
		});
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "post",
			body: body,
			headers: {
				"Content-type": "application/x-www-form-urlencoded",
				Authorization: "Basic " +
					Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
			},
  	});
		const data = await response.json();
		// now add to user account in db
		updateUserTokens(data);
		// redirect to dashboard
		navigate("/dashboard");
	}
  
	useEffect(() => {
		// get code from url
		const urlParams = new URLSearchParams(window.location.search);
		// if there are no errors fetching user info and it is not loading, grab
		// code from url and use it to get tokens
		if (loading || error || !urlParams) {
			setFail(true);
			return;
		}
		setCode(urlParams.get("code"));
		// fetch tokens from url
		fetchTokens();
	}, [code, loading, user]);

	return ( 
		<div>
		{!fail && <p>An error may have occured while verifying your Spotify account. Please re-login and try again.</p> }
		</div>
	);
}
 
export default Callback;