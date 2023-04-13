import FollowArtistIcon from 'assets/logos/follow-artist.png';
import isFollowingIcon from 'assets/logos/isFollowing.png';
import PlayIcon from 'assets/logos/play-button-square.png';
import styles from './RecommendedCard.module.css';
import { useDispatch } from 'react-redux';
import { SET_PLAYER_URIS } from 'context/user';
import { spotifyApi } from 'spotify';
import AddSongDropdown from 'components/AddSongDropdown/AddSongDropdown';

const RecommendedCard = (props: RecommendedCardProps) => {
  const { title, list, userPlaylists, type, length } = props;
  const dispatch = useDispatch();

  // follow/unfollow artist based on following status
  const toggleFollowing = (
    e: React.MouseEvent<HTMLImageElement>,
    artist: RecommendedItems
  ) => {
    // follow/unfollow artist & update image
    if (artist.following) {
      spotifyApi.unfollowArtists([artist.id!]);
      (e.target as HTMLImageElement).src = FollowArtistIcon;
    } else {
      spotifyApi.followArtists([artist.id!]);
      (e.target as HTMLImageElement).src = isFollowingIcon;
    }
    artist.following = !artist.following;
  };

  return (
    <div className={styles.recommendedCard}>
      <div className={styles.recommendedCardTitle}>
        <h2>{title}</h2>
      </div>
      <div className={styles.recommendedCardList}>
        {list.slice(0, length).map((data) => (
          <div className={styles.recommendedListItem} key={data.uri}>
            <div
              className={styles.albumImage}
              onClick={() => {
                dispatch(SET_PLAYER_URIS([data.uri!]));
              }}
            >
              <img
                src={data.image}
                alt="unavailable"
                className={styles.recommendedImage}
              />
              <div className={styles.imgButton}>
                <img
                  src={PlayIcon}
                  alt=""
                  className={styles.recommendedImage}
                />
              </div>
            </div>
            <a href={data.uri} target="_blank">
              <h3>
                <u>{data.name}</u>
              </h3>
            </a>
            {type == 'artists' ? (
              <img
                src={!data.following ? FollowArtistIcon : isFollowingIcon}
                className={styles.itemIcon}
                alt=""
                title="Follow artist"
                onClick={(e: React.MouseEvent<HTMLImageElement>) => {
                  toggleFollowing(e, data);
                }}
              />
            ) : (
              <AddSongDropdown
                userPlaylists={userPlaylists}
                uri={data.uri}
                id={data.id}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCard;
