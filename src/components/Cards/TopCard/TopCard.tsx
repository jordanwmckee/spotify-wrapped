import { useDispatch } from 'react-redux';
import { SET_PLAYER_URIS } from 'context/user';
import PlayButton from 'assets/logos/play-button-square.png';
import styles from './TopCard.module.css';
import CreatePlaylistButton from 'components/CreatePlaylistButton/CreatePlaylistButton';

const TopCard = (props: TopCardProps) => {
  const { list, title, userId, playlists, timeFrame } = props;
  const dispatch = useDispatch();

  return (
    <div className={styles.topCard}>
      <div className={styles.topCardTitle}>
        <h2>{title}</h2>
        {list[0].artist && (
          <CreatePlaylistButton
            list={list}
            playlists={playlists}
            userId={userId}
            type={timeFrame}
          />
        )}
      </div>
      <div className={styles.topCardList}>
        {list.map((data) => (
          <ul className={styles.topListItem} key={data.id}>
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
