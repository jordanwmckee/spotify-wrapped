import { useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard/TitleCard";
import TopCard from "../../components/Cards/TopCard/TopCard";
import PageTitle from "../../components/PageTitle/PageTitle";
import "./Dashboard.css";

const Dashboard = () => {
  const {
    account,
    monthlySongs,
    monthlyArtists,
    allTimeSongs,
    allTimeArtists,
  } = useSelector((state) => state.user);

  return (
    <>
      <PageTitle
        title="Dashboard"
        description={account ? `Welcome back ${account.display_name}.` : ""}
      />
      {account && (
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
      )}
    </>
  );
};

export default Dashboard;
