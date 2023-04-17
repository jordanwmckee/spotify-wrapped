import SpotifyPlayer from 'react-spotify-web-playback';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { spotifyApi } from 'spotify';
import { RootState } from 'context/store';
import DoubleArrow from 'assets/logos/double-arrow.png';
import './Player.css';
import { SET_PLAYER_URIS } from 'context/user';

const Player = (props: PlayerProps) => {
  const { userPlaylists } = props;
  const [open, setOpen] = useState(false);
  const { playerUris, recommendUris } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

  const togglePopup = () => {
    document.querySelector('.popup')!.classList.toggle('popup-open');
    document.querySelector('.popup-img')?.classList.toggle('active-popup');
    setOpen(!open);
  };

  return (
    <div id="player">
      <div className="popup">
        <div
          className="popup-button"
          onClick={togglePopup}
          title="show/hide playback sources"
        >
          <img src={DoubleArrow} alt="" className="popup-img" />
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
                  dispatch(SET_PLAYER_URIS(recommendUris!));
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
          token={spotifyApi.getAccessToken()!}
          uris={playerUris!}
          showSaveIcon={true}
        />
      </div>
    </div>
  );
};

export default Player;
