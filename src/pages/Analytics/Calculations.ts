const topGenres: string[] = [
  'Rock',
  'Pop',
  'Hip Hop',
  'Jazz',
  'Country',
  'Electronic',
  'Classical',
  'R&B/Soul',
  'Blues',
  'Reggae',
  'Funk',
  'Metal',
  'Alternative',
  'Latin',
  'Folk',
  'Punk',
  'World',
  'Gospel',
  'Indie',
  'New Age',
  'Opera',
  'Rap',
  'Techno',
  'House',
  'Trance',
  'Ambient',
  'Dance',
  'Dubstep',
  'Trip Hop',
  'Grunge',
  'Ska',
  'Heavy Metal',
  'Psychedelic',
  'Rock and Roll',
  'Emo',
  'Hardcore',
  'Garage',
  'Britpop',
  'Glam Rock',
  'Shoegaze',
  'Industrial',
  'Darkwave',
  'Synthpop',
  'Post-Punk',
  'Death Metal',
  'Thrash Metal',
  'Power Metal',
  'Black Metal',
  'Doom Metal',
  'Speed Metal',
  'Progressive Rock',
  'Progressive Metal',
  'Psychedelic Rock',
  'Psychedelic Pop',
  'Psychedelic Folk',
  'Psychedelic Soul',
  'Electronic Rock',
  'Ambient Pop',
  'Ambient Techno',
  'Ambient House',
  'Ambient Dub',
  'Ambient Trance',
  'Ambient Jazz',
  'Jazz Fusion',
  'Smooth Jazz',
  'Acid Jazz',
  'Bebop',
  'Cool Jazz',
  'Free Jazz',
  'Latin Jazz',
  'Jazz Funk',
  'Bossa Nova',
  'Salsa',
  'Tango',
  'Mariachi',
  'Ranchera',
  'Tejano',
  'Norteño',
  'Reggaeton',
  'Soca',
  'Calypso',
  'Highlife',
  'Afrobeat',
  'Fado',
  'Flamenco',
  'Tuvan Throat Singing',
  'Traditional Indian Music',
  'Japanese Traditional Music',
  'Celtic Music',
  'Arabic Music',
  'African Music',
  'Brazilian Music',
  'French Chanson',
  'Klezmer',
  'Gypsy Music',
  'Russian Folk Music',
  'Irish Music',
  'Scottish Music',
  'English Folk Music',
  'American Folk Music',
];

function findTopGenre(genre: string): string | undefined {
  const genreRegex = new RegExp(topGenres.join('|'), 'i');
  const match = genre.match(genreRegex);
  if (match) {
    return match[0];
  } else {
    return undefined;
  }
}

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
  var oth_obj = {
    name: 'other',
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
  if (GenresArg.length === 0) {
    return [];
  }

  const genreCounts: { [key: string]: number } = {};

  GenresArg.forEach((song: any) => {
    if (typeof song === 'string') {
      const cleanedGenre = findTopGenre(song) || 'other';
      if (!genreCounts[cleanedGenre]) {
        genreCounts[cleanedGenre] = 1;
      } else {
        genreCounts[cleanedGenre]++;
      }
    } else if (Array.isArray(song)) {
      song.forEach((genre: string) => {
        const cleanedGenre = findTopGenre(genre) || 'other';

        if (!genreCounts[cleanedGenre]) {
          genreCounts[cleanedGenre] = 1;
        } else {
          genreCounts[cleanedGenre]++;
        }
      });
    }
    // If the element is neither a string nor an array, skip it
  });

  const rankedGenres = Object.entries(genreCounts)
    .map(([name, count]) => ({ name, count, percent: -1.1 }))
    .sort((a, b) => b.count - a.count);

  const total = rankedGenres.reduce((acc, cur) => acc + cur.count, 0);

  get_percentages(rankedGenres, total);
  prune(rankedGenres, total);

  return rankedGenres;
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
        data.name = 'other';
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
