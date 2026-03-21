import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // 'loading' | 'playing' | 'completed' | 'error'
  status: 'loading',
  type: null,        // 'number-matrix' | 'pattern-match'
  puzzle: null,      // puzzle object from generator
  answer: null,      // current user answer
  timerSeconds: 0,
  timerRunning: false,
  hintsUsed: 0,
  hintsRemaining: 3,
  score: 0,
  dateStr: null,
  isPractice: false,
}

const puzzleSlice = createSlice({
  name: 'puzzle',
  initialState,
  reducers: {
    setPuzzle(state, action) {
      const { type, puzzle, dateStr, savedProgress } = action.payload
      state.type = type
      state.puzzle = puzzle
      state.dateStr = dateStr
      state.status = 'playing'
      state.timerRunning = true

      if (savedProgress) {
        state.answer = savedProgress.answer
        // Self-heal: Ensure clue cells in saved answer match the current solution
        if (type === 'number-matrix' && state.answer) {
          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
              if (puzzle.clues[r][c]) {
                state.answer[r][c] = puzzle.solution[r][c]
              }
            }
          }
        }
        state.timerSeconds = savedProgress.timerSeconds || 0
        state.hintsUsed = savedProgress.hintsUsed || 0
        state.hintsRemaining = Math.max(0, 3 - (savedProgress.hintsUsed || 0))
      } else {
        state.answer = type === 'number-matrix'
          ? puzzle.grid.map((r) => [...r])
          : null
        state.timerSeconds = 0
        state.hintsUsed = 0
        state.hintsRemaining = 3
      }
      state.isPractice = false // Reset practice mode on new puzzle load
    },

    setPractice(state, action) {
      state.isPractice = action.payload
    },

    resetForPractice(state) {
      if (!state.puzzle) return
      state.answer = state.type === 'number-matrix'
        ? state.puzzle.grid.map((r) => [...r])
        : null
      state.timerSeconds = 0
      state.timerRunning = true
      state.status = 'playing'
      state.isPractice = true
      state.hintsUsed = 0
      state.hintsRemaining = 3
      state.score = 0
    },

    setAnswer(state, action) {
      state.answer = action.payload
      if (!state.timerRunning && state.status === 'playing') {
        state.timerRunning = true
      }
    },

    updateCell(state, action) {
      const { row, col, value } = action.payload
      if (state.type === 'number-matrix' && state.answer) {
        // Explicitly replace the row to ensure reactivity in all environments
        const newRow = [...state.answer[row]]
        newRow[col] = value
        state.answer[row] = newRow
        if (!state.timerRunning && state.status === 'playing') state.timerRunning = true
      }
    },

    tickTimer(state) {
      if (state.timerRunning) {
        state.timerSeconds += 1
      }
    },

    stopTimer(state) {
      state.timerRunning = false
    },

    startTimer(state) {
      state.timerRunning = true
    },

    useHintAction(state) {
      if (state.hintsRemaining > 0) {
        state.hintsUsed += 1
        state.hintsRemaining -= 1
      }
    },

    setCompleted(state, action) {
      state.status = 'completed'
      state.timerRunning = false
      state.score = action.payload.score
    },

    setError(state) {
      state.status = 'error'
    },

    resetPuzzle() {
      return initialState
    },
  },
})

export const {
  setPuzzle,
  setAnswer,
  updateCell,
  tickTimer,
  stopTimer,
  startTimer,
  useHintAction,
  setCompleted,
  setError,
  setPractice,
  resetForPractice,
  resetPuzzle,
} = puzzleSlice.actions

export default puzzleSlice.reducer
