import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: null,
  monthlySongs: null,
  monthlyArtists: null,
  allTimeSongs: null,
  allTimeArtists: null,
  recommendUris: null,
  recentListens: null,
  recentGenres: null,
  monthlyListens: null,
  monthlyGenres: null,
  allTimeListens: null,
  allTimeGenres: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SET_ACCOUNT: (state, action) => {
      state.account = { ...action.payload };
    },
    SET_MONTHLY_SONGS: (state, action) => {
      state.monthlySongs = [...action.payload];
    },
    SET_MONTHLY_ARTISTS: (state, action) => {
      state.monthlyArtists = [...action.payload];
    },
    SET_ALL_TIME_SONGS: (state, action) => {
      state.allTimeSongs = [...action.payload];
    },
    SET_ALL_TIME_ARTISTS: (state, action) => {
      state.allTimeArtists = [...action.payload];
    },
    SET_RECENT_LISTENS: (state, action) => {
      state.recentListens = [...action.payload];
    },
    SET_RECENT_GENRES: (state, action) => {
      state.recentGenres = [...action.payload];
    },
    SET_MONTHLY_LISTENS: (state, action) => {
      state.monthlyListens = [...action.payload];
    },
    SET_MONTHLY_GENRES: (state, action) => {
      state.monthlyGenres = [...action.payload];
    },
    SET_ALLTIME_LISTENS: (state, action) => {
      state.allTimeListens = [...action.payload];
    },
    SET_ALLTIME_GENRES: (state, action) => {
      state.allTimeGenres = [...action.payload];
    },
    SET_RECOMMEND_URIS: (state, action) => {
      state.recommendUris = action.payload;
    },
    RESET: (state, action) => {
      return { ...initialState };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  SET_ACCOUNT,
  SET_MONTHLY_SONGS,
  SET_MONTHLY_ARTISTS,
  SET_ALL_TIME_SONGS,
  SET_ALL_TIME_ARTISTS,
  SET_RECOMMEND_URIS,
  SET_RECENT_LISTENS,
  SET_RECENT_GENRES,
  SET_MONTHLY_LISTENS,
  SET_MONTHLY_GENRES,
  SET_ALLTIME_LISTENS,
  SET_ALLTIME_GENRES,
  //SET_AUX_LISTEN_DATA,
  RESET,
} = userSlice.actions;

export default userSlice.reducer;
