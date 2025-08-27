import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/reducers/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Global types inferred from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
