import PageTitle from 'components/PageTitle/PageTitle';
import RecommendedCard from 'components/Cards/RecommendedCard/RecommendedCard';
import styles from './Discover.module.css';
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
      <div className={styles.discover}>
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
        className={styles.expandButton}
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
