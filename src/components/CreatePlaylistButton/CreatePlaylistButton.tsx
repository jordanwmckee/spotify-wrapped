import { spotifyApi } from 'spotify';
import styles from './CreatePlaylistButton.module.css';
import PlaylistAdd from 'assets/logos/playlist-add.png';
import { toast } from 'react-toastify';

const CreatePlaylistButton = (props: CreatePlaylistButtonProps) => {
  const { list, playlists, userId, type } = props;

  // generate a playlist name from given type
  const generatePlaylistName = (type: string): string => {
    if (type === 'month') {
      const date = new Date();
      const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12
      const year = date.getFullYear().toString().slice(-2); // get the last two digits of the year
      return `Wrapped Monthly (${month.toString().padStart(2, '0')}/${year})`;
    } else {
      return `Wrapped Monthly (${type})`;
    }
  };

  // check if playlist already exists. if so, return its id else return null
  const playlistExists = async (
    userId: string,
    playlistName: string
  ): Promise<string | null> => {
    const { items } = await spotifyApi.getUserPlaylists(userId);
    const playlist = items.find((item: any) => item.name === playlistName);
    return playlist ? playlist.id : null;
  };

  // create a playlist in Spotify from given list
  const createPlaylist = async () => {
    if (!list || !playlists || !userId) {
      toast.error('Unable to add songs to playlist at this time.');
      return;
    }

    const playlistName = generatePlaylistName(type);
    const playlistId =
      (await playlistExists(userId, playlistName)) ||
      (
        await spotifyApi.createPlaylist(userId, {
          name: playlistName,
          public: false,
        })
      ).id;

    try {
      const urisToSend = list.map((track) => track.uri);
      await spotifyApi.replaceTracksInPlaylist(playlistId, urisToSend);
      toast.success('Songs added to playlist!');
    } catch (error) {
      toast.error('Unable to add songs to playlist at this time.');
    }
  };

  return (
    <img
      src={PlaylistAdd}
      className={styles.playlistButton}
      onClick={createPlaylist}
      alt=""
      title="Send items to playlist"
    />
  );
};

export default CreatePlaylistButton;
