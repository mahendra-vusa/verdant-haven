import { createSlice } from '@reduxjs/toolkit';

const currUser = JSON.parse(localStorage.getItem('currUser')) || {
  role: "",
  username: "",
  id: ""
};

const initialState = {
  role: currUser.role,
  username: currUser.username,
  id: currUser.id
};

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state) => {
      const storedUser = JSON.parse(localStorage.getItem('currUser')) || {};
      state.role = storedUser.role || "";
      state.username = storedUser.username || "";
      state.id = storedUser.id || "";
    },
    logout: (state) => {
      state.role = "";
      state.username = "";
      state.id = "";
      localStorage.removeItem('currUser');
    }
  }
});

export const { login, logout } = userReducer.actions;
export default userReducer.reducer;
