import SpotifyPlayer from "react-spotify-web-playback";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spotifyApi } from "../../spotify";
import "./Player.css";
import { SET_PLAYER_URIS } from "../../context/user";

const Player = () => {
  const [open, setOpen] = useState(false);
  const { playerUris, recommendUris, userPlaylists } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const togglePopup = () => {
    const popupContent = document.querySelector(".popup");
    if (!open) popupContent.style.maxHeight = "350px";
    else popupContent.style.maxHeight = "0";
    setOpen(!open);
    document.querySelector(".popup-img").classList.toggle("active-popup");
  };

  return (
    <div id="player">
      <div className="popup">
        <div
          className="popup-button"
          onClick={togglePopup}
          title="show/hide playback sources"
        >
          <img
            src={require("../../assets/images/double-arrow.png")}
            alt=""
            className="popup-img"
          />
        </div>
        <div className="title">
          <h3>Playback Sources</h3>
        </div>
        <div className="playback-options">
          <div className="recommended">
            <h4>For You</h4>
            <div className="recommended-btn">
              <p
                onClick={() => {
                  dispatch(SET_PLAYER_URIS(recommendUris));
                }}
              >
                Recommended Songs
              </p>
            </div>
          </div>
          <div className="playlists">
            <h4>Your Playlists</h4>
            <div className="playlist-list">
              {userPlaylists &&
                userPlaylists.map((data) => (
                  <p
                    onClick={() => {
                      dispatch(SET_PLAYER_URIS([data.uri]));
                    }}
                    key={data.name}
                  >
                    {data.name}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="player-box">
        <SpotifyPlayer
          token={spotifyApi.getAccessToken()}
          uris={playerUris}
          showSaveIcon={true}
        />
      </div>
    </div>
  );
};

export default Player;
