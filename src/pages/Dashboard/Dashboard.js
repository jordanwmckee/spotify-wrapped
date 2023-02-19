import React, { useEffect, useState } from "react";
import TitleCard from "../../components/Cards/TitleCard/TitleCard";
import TopCard from "../../components/Cards/TopCard/TopCard";
import PageTitle from "../../components/PageTitle/PageTitle";
import { spotifyApi } from "../../spotify";
import "./Dashboard.css";

const Dashboard = (spotifyLinked) => {
  const [account, setAccount] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [artists, setArtists] = useState(null);

  const params = {
    time_range: "short_term",
    limit: "8",
  };

  const getData = async () => {
    // fetch spotify data
    if (spotifyLinked && (!account || !tracks || !artists)) {
      setAccount(await spotifyApi.getMe(params));
      const topTracksRes = await spotifyApi.getMyTopTracks(params);
      const topArtistsRes = await spotifyApi.getMyTopArtists(params);
      // convert requests into objects for TopCard component
      let topTracksArr = [];
      let topArtistsArr = [];
      if (topTracksRes) {
        topTracksRes.items.forEach((track) => {
          let data = {
            name: track.name,
            image: track.album.images[0].url,
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
      setTracks(topTracksArr);
      setArtists(topArtistsArr);
    }
  };

  useEffect(() => {
    getData();
  }, [spotifyLinked]);

  return (
    <>
      {spotifyLinked && account && (
        <>
          <PageTitle
            title="Dashboard"
            description={"Welcome back " + account.display_name + "."}
          />
          <div className="content">
            <div className="heading-card-section">
              <TitleCard heading="Title Card" text="test description" />
              <TitleCard heading="Other Title" text="testy here" />
              <TitleCard heading="Other Title" text="testy here" />
            </div>
            {
              artists && tracks && (
                <>
                  <TopCard list={artists} title="Your Top Artists" />
                  <TopCard list={tracks} title="Your Top Tracks" />
                </>
              )
              /* <div className="info">
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
              </div> */
            }
          </div>
        </>
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
