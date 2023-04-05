import FollowArtistIcon from 'assets/logos/follow-artist.png';
import isFollowingIcon from 'assets/logos/isFollowing.png';
import AddButtonIcon from 'assets/logos/add-button.png';
import PlayIcon from 'assets/logos/play-button-square.png';
import './RecommendedCard.css';
import { useDispatch } from 'react-redux';
import { SET_PLAYER_URIS } from 'context/user';
import { spotifyApi } from 'spotify';

const RecommendedCard = (props: RecommendedCardProps) => {
  const { title, list, userPlaylists, type } = props;
  const dispatch = useDispatch();

  return (
    <div className="recommended-card">
      <div className="recommended-card-title">
        <h2>{title}</h2>
      </div>
      <div className="recommended-card-list">
        {list.slice(0, 10).map((data) => (
          <div className="recommended-list-item" key={data.uri}>
            {type == 'artists' ? (
              <img src={data.image} alt="unavailable." />
            ) : (
              <div
                className="album-image"
                onClick={() => {
                  dispatch(SET_PLAYER_URIS([data.uri!]));
                }}
              >
                <img src={data.image} alt="unavailable" />
                <div className="img-button">
                  <img src={PlayIcon} alt="" />
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
                className="item-icon"
                alt=""
                title="Follow artist"
                onClick={(e: React.MouseEvent<HTMLImageElement>) => {
                  // follow/unfollow artist & update image
                  if (data.following) {
                    spotifyApi.unfollowArtists([data.id!]);
                    (e.target as HTMLImageElement).src = FollowArtistIcon;
                  } else {
                    spotifyApi.followArtists([data.id!]);
                    (e.target as HTMLImageElement).src = isFollowingIcon;
                  }
                  data.following = !data.following;
                }}
              />
            ) : (
              <img
                src={AddButtonIcon}
                className="item-icon"
                alt=""
                title="Add song to playlist"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCard;
