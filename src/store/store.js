import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from "../redux/tasksSlice.js";

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  }
});

export default store;