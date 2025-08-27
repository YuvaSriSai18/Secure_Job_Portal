import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { AuthState, User } from "@/utils/types";

const initialState: AuthState = {
  userData: {},
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<User>) {
      state.userData = action.payload;
    },
    updateUserData(state, action: PayloadAction<Partial<User>>) {
      state.userData = { ...state.userData, ...action.payload };
    },
    clearUserData(state) {
      state.userData = {};
    },
  },
});

export const { setUserData, updateUserData, clearUserData } = authSlice.actions;

export const selectUserData = (state: RootState) => state.auth.userData;

export default authSlice.reducer;
