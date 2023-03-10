import { useSelector } from "react-redux";
import store from "../src/context/store";

  /* Test function, I edit this function as I need to test numbers, by default its basically just
   * a typedef- for console.log(), but I do change it to manipulate and display data as I need
   * It may seem redundent to leave it in, but please don't change the location or delete it.
   */
  function test(arg){
  console.log(arg);
  };

  /* merge_decending(...) **NOTE** this is the primary helper function of merge_sort_decending(...)
   * PRE->) two sub-arrays of objects are passed
   * 
   * POST-> Objects are sorted in decending order into a larger array and returned via the larger array
   */
  function merge_decending(left, right){
  let sorted = []
  while(left.length && right.length){
    if(left[0].count > right[0].count){
      sorted.push(left.shift());
      } else {
      sorted.push(right.shift());  
      }
    }
  return[...sorted, ...left, ...right];
  };

  /* merge_sort_decending(...)
   * PRE->) An array of objects containing some sort of ranking is passed,
   *
   * POST->) The array is sorted via Merge-Sort in Decending order
   * 
   * NOTE*** REFERENCE for how to implement merge-sort in Javascript:
   * "https://www.doabledanny.com/merge-sort-javascript" <<-- I pretty-well copied this so I'm citing it
   */
  function merge_sort_decending(object){
    if(object.length <= 1){
      return(object);
      }
    let mid = Math.floor(object.length/2);
    let left = merge_sort_decending(object.slice(0, mid));
    let right = merge_sort_decending(object.slice(mid));

    return merge_decending(left, right);
    };

  function get_percentages(objArr, total){
    objArr.forEach((genre) => {
      genre.percent = ((genre.count)/total);
      });
    };

  /* sort_genres_and_rank(...)
   *  PRE->) An array of string arrays is passed:: ( object var[ string var[...] ] )
   *
   *  POST->) The individual string elements of the string arrays are seperated and sorted into and array of objects
   *  Each object stores the name of the genre, a count of how many times that genre appears, and a 
   *  percentage representing the percent that genre was listend to. Then the array of objects are sorted by rank 
   *  in decending order, percentages are calculated, then the array of objects is returned.
   */
function sort_genres_and_rank(GenresArg){
//var declerations
let ranked_recents = [];
let is_found = false;
let total = 0;

  GenresArg.recentGenres.forEach((song) => { //this loop iterates through the array of string arrays
    song.forEach((genre) => { //this loop iterates through the string arrays themselves
      let data ={  //declairing the object used to rank
        name: genre,
        count: 1,
        percent: -1.1
        };
      if(data.name == null){ //checks if there is no name, if no name present, name is auto set to other
        data.name = "other";
        }
      ranked_recents.forEach(element => {
        if((element != null) && (element.name == data.name)){ //checks if exists, if it does add to count var child
          element.count += 1;
          is_found = true;
          }
        });
        if(is_found == false){ //if it doesn't exist, insert new rank object into array
          ranked_recents.push(data);
          }
        is_found = false;
        total += 1;
      });
    });
    //sort the array by number of times the genre was listened to in decending order
    ranked_recents = merge_sort_decending(ranked_recents); 
    get_percentages(ranked_recents, total);
  return (ranked_recents);
  };



  export {
  test,
  sort_genres_and_rank,
  };