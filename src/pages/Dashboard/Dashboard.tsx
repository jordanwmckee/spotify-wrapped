import TopCard from 'components/Cards/TopCard/TopCard';
import PageTitle from 'components/PageTitle/PageTitle';
import styles from './Dashboard.module.css';

const Dashboard = (props: DashboardProps) => {
  const {
    displayName,
    monthlyArtists,
    monthlySongs,
    allTimeArtists,
    allTimeSongs,
    userId,
    playlists,
  } = props;

  return (
    <>
      <PageTitle
        title="Dashboard"
        description={displayName ? `Welcome back ${displayName}.` : ''}
      />
      <div className={styles.dashboard}>
        {monthlyArtists && monthlySongs && (
          <>
            <TopCard
              list={monthlyArtists}
              title="Top Artists this Month"
              timeFrame="month"
            />
            <TopCard
              list={monthlySongs}
              title="Top Tracks this Month"
              userId={userId}
              playlists={playlists}
              timeFrame="month"
            />
          </>
        )}
        {allTimeArtists && allTimeSongs && (
          <>
            <TopCard
              list={allTimeArtists}
              title="Top Artists All Time"
              timeFrame="all-time"
            />
            <TopCard
              list={allTimeSongs}
              title="Top Tracks All Time"
              userId={userId}
              playlists={playlists}
              timeFrame="all-time"
            />
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
