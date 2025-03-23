import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData:  null,
  token:  null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.token = null;
    },
  },
});

export const { setUserData, setToken, clearUserData } = userSlice.actions;
export default userSlice.reducer;