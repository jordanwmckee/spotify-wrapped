import PageTitle from "../../components/PageTitle/PageTitle";
import "./Analytics.css";
import{
  load_recent_genres
} from "../../analytics_calc"

const Analytics = () => {
  //let rec_genres = load_recent_genres();
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
