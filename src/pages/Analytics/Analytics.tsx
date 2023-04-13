import { PieChart, Pie, Sector, Cell } from 'recharts';
import PageTitle from 'components/PageTitle/PageTitle';
import styles from './Analytics.module.css';
import {
  sort_artists_and_rank,
  sort_genres_and_rank,
  test,
} from 'pages/Analytics/Calculations';
import FloatingCard from 'components/Cards/FloatingCard/FloatingCard.js';

const Analytics = (props: AnalyticsProps) => {
  const { monthlyListens, monthlyGenres, allTimeListens, allTimeGenres } =
    props;
  if (monthlyListens && monthlyGenres && allTimeListens && allTimeGenres) {
    const monthly_genre_stats = sort_genres_and_rank(monthlyGenres);
    const monthly_artist_stats = sort_artists_and_rank(monthlyListens);
    const allTime_genre_stats = sort_genres_and_rank(allTimeGenres);
    const alltime_artist_stats = sort_artists_and_rank(allTimeListens);

    return (
      <>
        <PageTitle title="Analytics" description="Find out your style" />
        <div className="content">
          <FloatingCard data={monthly_genre_stats} title="Top Monthly Genres" />
          <FloatingCard
            data={monthly_artist_stats}
            title="Top Monthly Artists"
          />
          <FloatingCard
            data={allTime_genre_stats}
            title="Top All-Time Genres"
          />
          <FloatingCard
            data={alltime_artist_stats}
            title="Top All-Time Artists"
          />
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export default Analytics;
