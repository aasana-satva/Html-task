
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more slices here as the app grows
  },
});

export default store;