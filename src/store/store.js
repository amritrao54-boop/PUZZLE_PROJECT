import { configureStore } from '@reduxjs/toolkit'
import puzzleReducer from './puzzleSlice'
import streakReducer from './streakSlice'
import authReducer from './authSlice'
import syncReducer from './syncSlice'

export const store = configureStore({
  reducer: {
    puzzle: puzzleReducer,
    streak: streakReducer,
    auth: authReducer,
    sync: syncReducer,
  },
})

export default store
