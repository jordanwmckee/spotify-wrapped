import AddButtonIcon from 'assets/logos/add-button.png';
import styles from './AddSongDropdown.module.css';
import { spotifyApi } from 'spotify';
import useToggleState from 'hooks/useToggleState';

const AddSongDropdown = (props: AddSongDropdownProps) => {
  const { userPlaylists, uri, id } = props;
  const [primary, togglePrimary, closePrimary] = useToggleState(false);
  const [secondary, toggleSecondary, closeSecondary] = useToggleState(false);

  const closeDropdowns = () => {
    closePrimary();
    closeSecondary();
  };

  const saveSongToLibrary = () => {
    try {
      spotifyApi.addToMySavedTracks([id]);
    } catch (err) {
      console.error(err);
    }
  };

  const addSongToPlaylist = (playListId: string): void => {
    try {
      spotifyApi.addTracksToPlaylist(playListId, [uri]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.playlistAdd} onMouseLeave={closeDropdowns}>
      <img
        onClick={togglePrimary}
        src={AddButtonIcon}
        className={styles.addIcon}
        alt=""
        title="Add song to playlist"
      />
      {primary && (
        <div className={styles.playlistDropdown}>
          <div className={styles.options}>
            <h4
              onClick={() => {
                saveSongToLibrary();
                closeDropdowns();
              }}
            >
              Add to liked
            </h4>
            <h4 onClick={toggleSecondary}>Add to playlist...</h4>
            {secondary && (
              <div className={styles.playlistSelection}>
                {userPlaylists!.map((playlist) => (
                  <p
                    key={playlist.id}
                    onClick={() => {
                      addSongToPlaylist(playlist.id);
                      closeDropdowns();
                    }}
                  >
                    {playlist.name}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSongDropdown;
