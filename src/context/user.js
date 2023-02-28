import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: null,
  monthlySongs: null,
  monthlyArtists: null,
  allTimeSongs: null,
  allTimeArtists: null,
  recommendUris: null,
  playerUris: null,
  userPlaylists: null,
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
    SET_RECOMMEND_URIS: (state, action) => {
      state.recommendUris = [...action.payload];
    },
    SET_PLAYER_URIS: (state, action) => {
      state.playerUris = [...action.payload];
    },
    SET_USER_PLAYLISTS: (state, action) => {
      state.userPlaylists = [...action.payload];
    },
    RESET: () => {
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
  SET_PLAYER_URIS,
  SET_USER_PLAYLISTS,
  RESET,
} = userSlice.actions;

export default userSlice.reducer;
