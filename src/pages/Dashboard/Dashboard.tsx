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
            <TopCard list={monthlyArtists} title="Top Artists this Month" />
            <TopCard list={monthlySongs} title="Top Tracks this Month" />
          </>
        )}
        {allTimeArtists && allTimeSongs && (
          <>
            <TopCard list={allTimeArtists} title="Top Artists All Time" />
            <TopCard list={allTimeSongs} title="Top Tracks All Time" />
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
