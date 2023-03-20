/* Test function, I edit this function as I need to test numbers, by default its basically just
 * a typedef- for console.log(), but I do change it to manipulate and display data as I need
 * It may seem redundent to leave it in, but please don't change the location or delete it.
 */
function test(arg: any) {
  console.log(arg);
}

/* merge_decending(...) **NOTE** this is the primary helper function of merge_sort_decending(...)
 * PRE->) two sub-arrays of objects are passed
 *
 * POST-> Objects are sorted in decending order into a larger array and returned via the larger array
 */
function merge_decending(left: any, right: any) {
  let sorted = [];
  while (left.length && right.length) {
    if (left[0].count > right[0].count) {
      sorted.push(left.shift());
    } else {
      sorted.push(right.shift());
    }
  }
  return [...sorted, ...left, ...right];
}

/* merge_sort_decending(...)
 * PRE->) An array of objects containing some sort of ranking is passed,
 *
 * POST->) The array is sorted via Merge-Sort in Decending order
 *
 * NOTE*** REFERENCE for how to implement merge-sort in Javascript:
 * "https://www.doabledanny.com/merge-sort-javascript" <<-- I pretty-well copied this so I'm citing it
 */
function merge_sort_decending(object: any) {
  if (object.length <= 1) {
    return object;
  }
  let mid = Math.floor(object.length / 2);
  let left: any = merge_sort_decending(object.slice(0, mid));
  let right: any = merge_sort_decending(object.slice(mid));

  return merge_decending(left, right);
}
/*get_pecentage()
 * calculates percentage transforms percentage value
 */
function get_percentages(objArr: any, total: any) {
  objArr.forEach((genre: any) => {
    genre.percent = ((genre.count / total) * 100).toFixed(2);
  });
}

function prune(array: any, total: any) {
  let indexes = [];
  var oth_obj = {
    name: "other",
    count: 0,
    percent: 0.0,
  };
  array.forEach((element: any) => {
    if ((element.count / total) * 100 < 1) {
      oth_obj.count += element.count;
      oth_obj.percent += parseFloat(element.percent);
    }
  });

  oth_obj.percent = +parseFloat(oth_obj.percent.toString()).toFixed(2);

  while ((array[array.length - 1].count / total) * 100 < 1) {
    array.pop();
  }

  if (oth_obj.percent != 0) {
    array.push(oth_obj);
  } else {
    return;
  }
}

/* sort_genres_and_rank(...)
 *  PRE->) An array of string arrays is passed:: ( object var[ string var[...] ] )
 *
 *  POST->) The individual string elements of the string arrays are seperated and sorted into and array of objects
 *  Each object stores the name of the genre, a count of how many times that genre appears, and a
 *  percentage representing the percent that genre was listend to. Then the array of objects are sorted by rank
 *  in decending order, percentages are calculated, then the array of objects is returned.
 */
function sort_genres_and_rank(GenresArg: any) {
  //var declerations
  let ranked_recents: any = [];
  let is_found = false;
  let total = 0;

  if (GenresArg.length == 0) {
    return;
  }

  GenresArg.forEach((song: any) => {
    //this loop iterates through the array of string arrays
    song.forEach((genre: any) => {
      //this loop iterates through the string arrays themselves
      let data = {
        //declairing the object used to rank
        name: genre,
        count: 1,
        percent: -1.1,
      };
      if (data.name == null) {
        //checks if there is no name, if no name present, name is auto set to other
        data.name = "other";
      }
      ranked_recents.forEach((element: any) => {
        if (element != null && element.name == data.name) {
          //checks if exists, if it does add to count var child
          element.count += 1;
          is_found = true;
        }
      });
      if (is_found == false) {
        //if it doesn't exist, insert new rank object into array
        ranked_recents.push(data);
      }
      is_found = false;
      total += 1;
    });
  });
  //sort the array by number of times the genre was listened to in decending order
  ranked_recents = merge_sort_decending(ranked_recents);
  get_percentages(ranked_recents, total);
  prune(ranked_recents, total);
  ranked_recents = merge_sort_decending(ranked_recents);
  return ranked_recents;
}

function sort_artists_and_rank(artistArg: any) {
  let ranked: any = [];
  let is_found = false;
  let total = 0;

  if (artistArg.length == 0) {
    return -1;
  }
  artistArg.forEach((object: any) => {
    object.artist.forEach((artist: any) => {
      let holder = artist.name;
      let data = {
        name: holder,
        count: 1,
        percent: -1,
      };
      if (data.name == null) {
        data.name = "other";
      }
      ranked.forEach((element: any) => {
        if (element != null && element.name == data.name) {
          element.count += 1;
          is_found = true;
        }
      });
      if (is_found == false) {
        ranked.push(data);
      }
      is_found = false;
      total += 1;
    });
  });

  ranked = merge_sort_decending(ranked);
  get_percentages(ranked, total);
  prune(ranked, total);
  // /ranked = merge_decending(ranked);
  return ranked;
}

export { test, sort_genres_and_rank, sort_artists_and_rank };
