import SpotifyPlayer from 'react-spotify-web-playback';
import { useDispatch, useSelector } from 'react-redux';
import { spotifyApi } from 'spotify';
import { RootState } from 'context/store';
import DoubleArrow from 'assets/logos/double-arrow.png';
import styles from './Player.module.css';
import { SET_PLAYER_URIS } from 'context/user';

const Player = (props: PlayerProps) => {
  const { userPlaylists } = props;
  const { playerUris, recommendUris } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

  const togglePopup = () => {
    document
      .querySelector(`.${styles.popup}`)
      ?.classList.toggle(styles.popupOpen);
    document
      .querySelector(`.${styles.popupImg}`)
      ?.classList.toggle(styles.activePopup);
  };

  return (
    <div id={styles.player}>
      <div className={styles.popup}>
        <div
          className={styles.popupButton}
          onClick={togglePopup}
          title="show/hide playback sources"
        >
          <img className={styles.popupImg} src={DoubleArrow} alt="" />
        </div>
        <div className={styles.title}>
          <h3>Playback Sources</h3>
        </div>
        <div className={styles.playbackOptions}>
          <div className={styles.recommended}>
            <h4>For You</h4>
            <div className={styles.recommendedBtn}>
              <p
                onClick={() => {
                  dispatch(SET_PLAYER_URIS(recommendUris!));
                }}
              >
                Recommended Songs
              </p>
            </div>
          </div>
          <div className={styles.playlists}>
            <h4>Your Playlists</h4>
            <div className={styles.playlistList}>
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
      <div className={styles.playerBox}>
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
