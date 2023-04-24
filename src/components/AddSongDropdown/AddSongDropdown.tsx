import AddButtonIcon from 'assets/logos/add-button.png';
import styles from './AddSongDropdown.module.css';
import { spotifyApi } from 'spotify';
import useToggleState from 'hooks/useToggleState';
import { toast } from 'react-toastify';

const AddSongDropdown = (props: AddSongDropdownProps) => {
  const { userPlaylists, uri, id } = props;
  const [dropdown, toggleDropdown, closeDropdown] = useToggleState(false);

  const addSongToPlaylist = (playListId: string): void => {
    try {
      spotifyApi.addTracksToPlaylist(playListId, [uri]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.playlistAdd} onMouseLeave={closeDropdown}>
      <img
        onClick={toggleDropdown}
        src={AddButtonIcon}
        className={styles.addIcon}
        alt=""
        title="Add song to playlist"
      />
      {dropdown && (
        <div className={styles.playlistSelection}>
          {userPlaylists &&
            userPlaylists.map((playlist) => (
              <p
                key={playlist.id}
                onClick={() => {
                  addSongToPlaylist(playlist.id);
                  toast.success('Added song to playlist!');
                  closeDropdown();
                }}
              >
                {playlist.name}
              </p>
            ))}
        </div>
      )}
    </div>
  );
};

export default AddSongDropdown;
