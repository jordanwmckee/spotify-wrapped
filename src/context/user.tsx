import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface for initial state
interface initState {
  recommendUris: string[] | null;
  playerUris: string[] | null;
}

const initialState: initState = {
  recommendUris: null,
  playerUris: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_RECOMMEND_URIS: (state, action: PayloadAction<string[]>) => {
      state.recommendUris = action.payload;
    },
    SET_PLAYER_URIS: (state, action: PayloadAction<string[]>) => {
      state.playerUris = action.payload;
    },
    RESET: () => {
      return { ...initialState };
    },
  },
});

// Action creators are generated for each case reducer function
export const { SET_PLAYER_URIS, SET_RECOMMEND_URIS, RESET } = userSlice.actions;

export default userSlice.reducer;
