import AddButtonIcon from 'assets/logos/add-button.png';
import './AddSongDropdown.css';
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
    <div className="playlist-add" onMouseLeave={closeDropdowns}>
      <img
        onClick={togglePrimary}
        src={AddButtonIcon}
        className="add-icon"
        alt=""
        title="Add song to playlist"
      />
      {primary && (
        <div className="playlist-dropdown">
          <div className="options">
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
              <div className="playlist-selection">
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
