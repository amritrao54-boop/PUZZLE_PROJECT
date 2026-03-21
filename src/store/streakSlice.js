import { createSlice } from '@reduxjs/toolkit'
import { getTodayStr, areConsecutiveDays } from '../utils/dateUtils'

// Load streak from localStorage
function loadStreak() {
  try {
    const raw = localStorage.getItem('ll_streak')
    return raw ? JSON.parse(raw) : { count: 0, lastPlayed: null, longestStreak: 0 }
  } catch {
    return { count: 0, lastPlayed: null, longestStreak: 0 }
  }
}

function saveStreak(state) {
  try {
    localStorage.setItem('ll_streak', JSON.stringify({
      count: state.count,
      lastPlayed: state.lastPlayed,
      longestStreak: state.longestStreak,
    }))
  } catch {
    // storage unavailable
  }
}

const saved = loadStreak()

const initialState = {
  count: saved.count,
  lastPlayed: saved.lastPlayed,
  longestStreak: saved.longestStreak,
}

const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {
    updateStreak(state) {
      const today = getTodayStr()

      // Already played today — no change
      if (state.lastPlayed === today) return

      if (state.lastPlayed && areConsecutiveDays(state.lastPlayed, today)) {
        // Consecutive day — increment
        state.count += 1
      } else {
        // Missed a day or first play — reset
        state.count = 1
      }

      state.lastPlayed = today
      state.longestStreak = Math.max(state.longestStreak, state.count)
      saveStreak(state)
    },

    loadStreakFromStorage(state) {
      const data = loadStreak()
      state.count = data.count
      state.lastPlayed = data.lastPlayed
      state.longestStreak = data.longestStreak

      // Check if streak should be reset (missed yesterday)
      const today = getTodayStr()
      if (data.lastPlayed && data.lastPlayed !== today) {
        if (!areConsecutiveDays(data.lastPlayed, today)) {
          state.count = 0
        }
      }
    },
  },
})

export const { updateStreak, loadStreakFromStorage } = streakSlice.actions
export default streakSlice.reducer
