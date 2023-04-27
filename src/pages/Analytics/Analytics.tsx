import PageTitle from 'components/PageTitle/PageTitle';
import {
  sort_artists_and_rank,
  sort_genres_and_rank,
} from 'pages/Analytics/Calculations';
import FloatingCard from 'components/Cards/FloatingCard/FloatingCard.js';
import { useEffect, useState } from 'react';

const Analytics = (props: AnalyticsProps) => {
  const { monthlySongs, monthlyGenres, allTimeSongs, allTimeGenres } = props;
  const [monthlyGenreStats, setMonthlyGenreStats] = useState<any>();
  const [monthlyArtistStats, setMonthlyArtistStats] = useState<any>();
  const [allTimeGenreStats, setAllTimeGenreStats] = useState<any>();
  const [allTimeArtistStats, setAllTimeArtistStats] = useState<any>();

  useEffect(() => {
    monthlyGenres && setMonthlyGenreStats(sort_genres_and_rank(monthlyGenres));
    monthlySongs && setMonthlyArtistStats(sort_artists_and_rank(monthlySongs));
    allTimeGenres && setAllTimeGenreStats(sort_genres_and_rank(allTimeGenres));
    allTimeSongs && setAllTimeArtistStats(sort_artists_and_rank(allTimeSongs));
  }, []);

  return (
    <>
      <PageTitle title="Analytics" description="Find out your style" />
      <div className="content">
        {monthlyGenreStats && (
          <FloatingCard data={monthlyGenreStats} title="Top Monthly Genres" />
        )}
        {monthlyArtistStats && (
          <FloatingCard data={monthlyArtistStats} title="Top Monthly Artists" />
        )}
        {allTimeGenreStats && (
          <FloatingCard data={allTimeGenreStats} title="Top All-Time Genres" />
        )}
        {allTimeArtistStats && (
          <FloatingCard
            data={allTimeArtistStats}
            title="Top All-Time Artists"
          />
        )}
      </div>
    </>
  );
};

export default Analytics;
