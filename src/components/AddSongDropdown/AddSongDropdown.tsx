import { useState } from 'react';
import AddButtonIcon from 'assets/logos/add-button.png';
import './AddSongDropdown.css';
import { spotifyApi } from 'spotify';

const AddSongDropdown = (props: AddSongDropdownProps) => {
  const { userPlaylists, uri, id } = props;
  const [primary, setPrimary] = useState<boolean>(false);
  const [secondary, setSecondary] = useState<boolean>(false);

  const toggleDropdown = (dd: 'primary' | 'secondary') => {
    dd == 'primary' ? setPrimary(!primary) : setSecondary(!secondary);
  };

  const closeDropdown = () => {
    setPrimary(false);
    setSecondary(false);
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
    <div className="playlist-add" onMouseLeave={closeDropdown}>
      <img
        onClick={() => {
          toggleDropdown('primary');
        }}
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
                closeDropdown();
              }}
            >
              Add to liked
            </h4>
            <h4
              onClick={() => {
                toggleDropdown('secondary');
              }}
            >
              Add to playlist...
            </h4>
            {secondary && (
              <div className="playlist-selection">
                {userPlaylists!.map((playlist) => (
                  <p
                    key={playlist.id}
                    onClick={() => {
                      addSongToPlaylist(playlist.id);
                      closeDropdown();
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
