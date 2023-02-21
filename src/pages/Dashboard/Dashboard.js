import React, { useEffect, useState } from "react";
import TitleCard from "../../components/Cards/TitleCard/TitleCard";
import TopCard from "../../components/Cards/TopCard/TopCard";
import PageTitle from "../../components/PageTitle/PageTitle";
import { spotifyApi } from "../../spotify";
import "./Dashboard.css";

const Dashboard = (spotifyLinked) => {
  const [name, setName] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [artists, setArtists] = useState(null);

  // params for getting top tracks/artists
  const params = {
    time_range: "short_term",
    limit: "8",
  };

  const getData = async () => {
    // fetch spotify data
    if (spotifyLinked && (!name || !tracks || !artists)) {
      // get username
      const account = await spotifyApi.getMe();
      setName(account.display_name);
      // get top items
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

  // if the status of spotify linked changes, get data
  useEffect(() => {
    getData();
  }, [spotifyLinked]);

  return (
    <>
      {spotifyLinked && name && (
        <>
          <PageTitle
            title="Dashboard"
            description={"Welcome back " + name + "."}
          />
          <div className="content">
            <div className="heading-card-section">
              <TitleCard heading="Title Card" text="test description" />
              <TitleCard heading="Other Title" text="testy here" />
              <TitleCard heading="Other Title" text="testy here" />
            </div>
            {artists && tracks && (
              <>
                <TopCard list={artists} title="Your Top Artists" />
                <TopCard list={tracks} title="Your Top Tracks" />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
