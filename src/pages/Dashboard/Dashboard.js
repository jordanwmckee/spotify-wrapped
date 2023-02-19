import React, { useEffect, useState } from "react";
import { spotifyApi } from "../../spotify";
import "./Dashboard.css";

const Dashboard = (spotifyLinked) => {
  const [account, setAccount] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [artists, setArtists] = useState(null);

  const params = {
    time_range: "short_term",
    limit: "20",
  };

  const getData = async () => {
    // fetch spotify data
    if (spotifyLinked && (!account || !tracks || !artists)) {
      setAccount(await spotifyApi.getMe(params));
      setTracks(await spotifyApi.getMyTopTracks(params));
      setArtists(await spotifyApi.getMyTopArtists(params));
    }
  };

  useEffect(() => {
    getData();
  }, [spotifyLinked]);

  return (
    <>
      {spotifyLinked && account && (
        <div className="dashboard">
          <div className="color_grad page-title">
            <div className="title-text">
              <h2>Dashboard</h2>
              <p>
                Hello, {account.display_name}. Here are some of your monthly
                stats..
              </p>
            </div>
          </div>
          {artists && tracks && (
            <div className="info">
              <div className="top-artists">
                <h2>Your Top Artists</h2> <br />
                <table>
                  <tbody>
                    {artists.items.map((artist) => (
                      <tr key={artist.id}>
                        <td>
                          <h3>{artist.name}</h3>
                        </td>
                        <td>
                          <img
                            src={artist.images[0].url}
                            width="100px"
                            height="100px"
                            alt="unavailable."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="top-tracks">
                <h2>Your Top Tracks</h2> <br />
                <table>
                  <tbody>
                    {tracks.items.map((track) => (
                      <tr key={track.id}>
                        <td>
                          <img
                            src={track.album.images[0].url}
                            width="100px"
                            height="100px"
                            alt="unavailable."
                          />
                        </td>
                        <td>
                          <h3>{track.name}</h3>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Dashboard;

/*
        {!spotifyLinked && (
          <div className="linked">
            <p>
              Please connect your Spotify account to view your monthly wrapped.
            </p>
            <a href={loginUrl} className="button">
              CONNECT
            </a>
          </div>
        )}
*/
