import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { name, email, image, _id, etc. }
  token: localStorage.getItem('token'), // Initialize token from localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // Assuming action.payload is { user: {...}, token: '...' }
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token); // Persist token
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Remove token on logout
    },
    updateProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload, // action.payload should be the updated user object from backend
      };
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
