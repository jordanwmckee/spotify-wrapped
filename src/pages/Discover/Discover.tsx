import PageTitle from 'components/PageTitle/PageTitle';
import RecommendedCard from 'components/Cards/RecommendedCard/RecommendedCard';
import './Discover.css';
import { useState } from 'react';

const Discover = (props: DiscoverProps) => {
  const { recommendedArtists, recommendedSongs, userPlaylists } = props;
  const [length, setLength] = useState<number>(10);

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
            length={length}
          />
        )}
        {recommendedSongs && userPlaylists && (
          <RecommendedCard
            title="Tracks"
            type="tracks"
            list={recommendedSongs}
            userPlaylists={userPlaylists}
            length={length}
          />
        )}
      </div>
      <button
        onClick={() => {
          length == 10 ? setLength(20) : setLength(10);
        }}
      >
        {length == 10 ? 'Show More' : 'Show less'}
      </button>
    </>
  );
};

export default Discover;
