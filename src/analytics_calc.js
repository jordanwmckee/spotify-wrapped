import {
  recentListens,
  genresList,
} from "./App.js"


function load_recent_genres(recentListens, genresList) {
  let rec_genres = [];
  let exists = false;
  genresList.forEach((object)=>{
  let artist = object;
  artist.forEach((category) =>{
      exists = false;
      let genre ={
        g_name: category.name,
        count: 1,
        }
      if(rec_genres[0] == null){
        rec_genres.push(genre);
        } else {
        rec_genres.forEach((element)=> {
          if(element.g_name == genre.g_name){
            element.count += 1;
            exists = true;
            }
          });
        if(exists == false){
          rec_genres.push(genre);
          }
        }
    });
  });
  return(rec_genres);
  }

  export {
  load_recent_genres,
  };