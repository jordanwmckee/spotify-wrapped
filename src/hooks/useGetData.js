import { useState, useEffect } from "react";

const useGetData = (endpoint, token) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();

    fetch("https://api.spotify.com/v1" + endpoint, {
      signal: abortCont.signal,
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw Error(""); //Unable to retrieve user information from Spotify at this time.');
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setIsPending(false);
        setError(null);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("fetch aborted");
        } else {
          setIsPending(false);
          setError(err.message);
        }
      });

    return () => abortCont.abort();
  }, [endpoint, token]);

  return { data, isPending, error };
};

export default useGetData;

/**
 * Example
 * const { data: account, isPending: accountPending, error: accountError } = useGetData('/me', spotifyApi.getAccessToken());
 */
