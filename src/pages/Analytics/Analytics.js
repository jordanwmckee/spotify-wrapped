import PageTitle from "../../components/PageTitle/PageTitle";
import { useSelector } from "react-redux";
import "./Analytics.css";
import{
  sort_genres_and_rank,
  test,
} from "../../analytics_calc"

const Analytics = () => {
  const{
  recentListens,
  recentGenres,
  } = useSelector((state) => state.user);

  //test(recentGenres);
  if((recentGenres != 'undefined') && (recentGenres != null)){
    let rec_genre_stats = sort_genres_and_rank({recentGenres});
    console.log(rec_genre_stats);
    }

  return (
    
    <>
      <PageTitle title={"Analytics"} />
      <div className="content">
        <div className="analytics_win_border">
          <h2>Model Graph</h2>
          <div className="graph"></div>
          <p className="p1">
            this is a place holder for what the graphs will look like<br></br>
          </p>
          <p>This will be more stylized as I automate graph generation</p>
        </div>
      </div>
    </>
  );
};

const styles = {
  test: {
    fontSize: "50px",
  },
};

export default Analytics;
