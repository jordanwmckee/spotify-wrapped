import FollowArtistIcon from 'assets/logos/follow-artist.png';
import isFollowingIcon from 'assets/logos/isFollowing.png';
import PlayIcon from 'assets/logos/play-button-square.png';
import './RecommendedCard.css';
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
  ): void => {
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
    <div className="recommended-card">
      <div className="recommended-card-title">
        <h2>{title}</h2>
      </div>
      <div className="recommended-card-list">
        {list.slice(0, length).map((data) => (
          <div className="recommended-list-item" key={data.uri}>
            {type == 'artists' ? (
              <img
                src={data.image}
                alt="unavailable."
                className="recommended-image"
              />
            ) : (
              <div
                className="album-image"
                onClick={() => {
                  dispatch(SET_PLAYER_URIS([data.uri!]));
                }}
              >
                <img
                  src={data.image}
                  alt="unavailable"
                  className="recommended-image"
                />
                <div className="img-button">
                  <img src={PlayIcon} alt="" className="recommended-image" />
                </div>
              </div>
            )}
            <a href={data.uri} target="_blank">
              <h3>
                <u>{data.name}</u>
              </h3>
            </a>
            {type == 'artists' ? (
              <img
                src={!data.following ? FollowArtistIcon : isFollowingIcon}
                className="item-icon recommended-image"
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
