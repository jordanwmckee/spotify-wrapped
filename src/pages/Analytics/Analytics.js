import { PieChart, Pie, Sector, Cell } from "recharts";
import TitleCard from "../../components/Cards/TitleCard/TitleCard";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useSelector } from "react-redux";
import "./Analytics.css";
import{
  sort_artists_and_rank,
  sort_genres_and_rank,
  test,
} from "../../analytics_calc";
import FloatingCard from "../../components/Cards/FloatingCard/FloatingCard.js";
import { Await } from "react-router-dom";


const Analytics = () => {
  const{
    recentListens,
    recentGenres,
    } =  useSelector((state) => state.user);

  if((recentListens) && (recentGenres) ){
  const rec_genre_stats = sort_genres_and_rank(recentGenres);
  //console.log(rec_genre_stats);
  const rec_artist_stats = sort_artists_and_rank(recentListens);
  console.log(rec_artist_stats);
 
  return (
    <>
    <PageTitle
      title="Analytics"
      description="Find out your style"
    />
    <FloatingCard data={rec_artist_stats} title="Recently Played Artists"/>
    <FloatingCard data={rec_genre_stats} title="Recently Played Genres"/>
    </>
  );
  }
};

const styles = {
  test: {
    fontSize: "50px",
  },
};

export default Analytics;
