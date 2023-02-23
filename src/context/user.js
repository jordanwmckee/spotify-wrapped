import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    account: null,
    monthlySongs: null,
    monthlyArtists: null,
    allTimeSongs: null,
    allTimeArtists: null,
    recommendUris: null,
  },
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
    SET_RECOMMEND_URIS: (state, action) => {
      state.recommendUris = action.payload;
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
} = userSlice.actions;

export default userSlice.reducer;
