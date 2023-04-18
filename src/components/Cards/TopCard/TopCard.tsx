import { useDispatch } from 'react-redux';
import { SET_PLAYER_URIS } from 'context/user';
import PlayButton from 'assets/logos/play-button-square.png';
import PlaylistAdd from 'assets/logos/playlist-add.png';
import styles from './TopCard.module.css';
import { spotifyApi } from 'spotify';
import { toast } from 'react-toastify';

const TopCard = (props: TopCardProps) => {
  const { list, title, userId, playlists } = props;
  const dispatch = useDispatch();

  const createPlaylist = async () => {
    // get date for playlist name
    const date = new Date();
    const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12
    const year = date.getFullYear().toString().slice(-2); // get the last two digits of the year
    const formattedDate = `${month.toString().padStart(2, '0')}/${year}`;

    // derrive playlist name from date
    const playlistName = `Monthly Wrapped (${formattedDate})`;

    // check if playlist already exists
    let playlistExists = false;
    let playlistId: string = '';
    playlists!.forEach((playlist: Playlist) => {
      if (playlist.name === playlistName) {
        playlistExists = true;
        playlistId = playlist.id;
      }
    });

    // create playlist if it doesn't exist
    if (!playlistExists) {
      const createPlaylistResult = await spotifyApi.createPlaylist(userId!, {
        name: playlistName,
        public: false,
        description: `My top tracks in ${formattedDate}`,
      });
      playlistId = createPlaylistResult.id;
    }

    // update playlist items
    const urisToSend = list.map((track) => track.uri);
    spotifyApi.replaceTracksInPlaylist(playlistId, urisToSend);
    toast.success('Songs added to playlist!');
  };

  return (
    <div className={styles.topCard}>
      <div className={styles.topCardTitle}>
        <h2>{title}</h2>
        {list[0].artist && (
          <img
            src={PlaylistAdd}
            onClick={createPlaylist}
            alt=""
            title="Export items to playlist"
          />
        )}
      </div>
      <div className={styles.topCardList}>
        {list.map((data) => (
          <ul className={styles.topListItem} key={data.name}>
            <li>
              <div
                className={styles.albumImage}
                onClick={() => {
                  dispatch(SET_PLAYER_URIS([data.uri!]));
                }}
              >
                <img src={data.image} alt="unavailable" />
                <div className={styles.imgButton}>
                  <img src={PlayButton} alt="" />
                </div>
              </div>
              <a href={data.uri}>{data.name}</a>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default TopCard;
