import TopCard from "components/Cards/TopCard/TopCard";
import PageTitle from "components/PageTitle/PageTitle";
import "./Dashboard.css";

const Dashboard = (props: {
  displayName?: string;
  monthlyArtists?: { name: string; image: string }[];
  monthlySongs?: { name: string; image: string; uri: string }[];
  allTimeArtists?: { name: string; image: string }[];
  allTimeSongs?: { name: string; image: string; uri: string }[];
}) => {
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
        description={displayName ? `Welcome back ${displayName}.` : ""}
      />
      <div className="content">
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
