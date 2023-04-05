import PageTitle from 'components/PageTitle/PageTitle';
import RecommendedCard from 'components/Cards/RecommendedCard/RecommendedCard';
import './Discover.css';

const Discover = (props: DiscoverProps) => {
  const { recommendedArtists, recommendedSongs, userPlaylists } = props;

  return (
    <>
      <PageTitle
        title="Discover"
        description="Recommended artists and music."
      />
      <div className="discover content">
        {recommendedArtists && userPlaylists && (
          <RecommendedCard
            title="Artists"
            type="artists"
            list={recommendedArtists}
            userPlaylists={userPlaylists}
          />
        )}
        {recommendedSongs && userPlaylists && (
          <RecommendedCard
            title="Tracks"
            type="tracks"
            list={recommendedSongs}
            userPlaylists={userPlaylists}
          />
        )}
      </div>
    </>
  );
};

export default Discover;
