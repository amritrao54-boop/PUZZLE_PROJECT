import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { getTodayStr } from '../utils/dateUtils'
import { generateSeed, getPuzzleTypeForDate } from '../engine/seedEngine'
import { generateNumberMatrix } from '../engine/numberMatrix'
import { generatePatternMatch } from '../engine/patternMatch'
import { loadPuzzleProgress, savePuzzleProgress, clearPuzzleProgress, saveDailyActivity, getDailyActivity } from '../db/idb'
import { setPuzzle, updateCell, setAnswer, setCompleted, useHintAction, resetForPractice } from '../store/puzzleSlice'
import { useHint, getHintsUsed } from '../engine/hintEngine'
import { calcScore } from '../engine/scoreEngine'
import { validateSolution } from '../engine/validator'
import { updateStreak } from '../store/streakSlice'
import { setSyncStatus } from '../store/syncSlice'
import { useSelector } from 'react-redux'

export function usePuzzle() {
  const dispatch = useDispatch()
  const puzzle = useSelector((s) => s.puzzle)

  // Load today's puzzle on mount
  const loadTodaysPuzzle = useCallback(async () => {
    const dateStr = getTodayStr()
    const seed = generateSeed(dateStr)
    const type = getPuzzleTypeForDate(dateStr)

    let puzzleData
    if (type === 'number-matrix') {
      // Even days = 6x6 (Hard), Odd days = 4x4 (Normal)
      const isHard = parseInt(dateStr.slice(-1), 10) % 2 === 0
      puzzleData = generateNumberMatrix(seed, isHard ? 6 : 4)
    } else {
      puzzleData = generatePatternMatch(seed)
    }

    console.log(`[PuzzleEngine] Loaded today's puzzle (${type}). Solution:`, puzzleData.solution)

    // Check if already completed today
    const existing = await getDailyActivity(dateStr)
    if (existing?.solved) {
      dispatch(setPuzzle({ type, puzzle: puzzleData, dateStr, savedProgress: null }))
      dispatch(setCompleted({ score: existing.score }))
      // Load their previous result into the answer state
      if (existing.answer) {
        dispatch(setAnswer(existing.answer))
      }
      return
    }

    // Restore saved progress
    const savedProgress = await loadPuzzleProgress(dateStr)
    dispatch(setPuzzle({ type, puzzle: puzzleData, dateStr, savedProgress }))
  }, [dispatch])

  useEffect(() => {
    loadTodaysPuzzle()
  }, [loadTodaysPuzzle])

  // Auto-save progress when answer changes
  const saveProgress = useCallback(async () => {
    if (!puzzle.dateStr || puzzle.status === 'completed') return
    await savePuzzleProgress(puzzle.dateStr, {
      answer: puzzle.answer,
      timerSeconds: puzzle.timerSeconds,
      hintsUsed: puzzle.hintsUsed,
    })
  }, [puzzle])

  // Handle cell update (number matrix)
  const handleCellUpdate = useCallback((row, col, value) => {
    dispatch(updateCell({ row, col, value }))
  }, [dispatch])

  // Handle pattern match answer selection
  const handleSelectAnswer = useCallback((value) => {
    dispatch(setAnswer(value))
  }, [dispatch])

  // Handle hint request
  const handleHint = useCallback(() => {
    if (!puzzle.dateStr) return null
    const success = useHint(puzzle.dateStr)
    if (success) {
      dispatch(useHintAction())
      return true
    }
    return false
  }, [dispatch, puzzle.dateStr])

  // Handle puzzle submission
  const handleSubmit = useCallback(async () => {
    if (!puzzle.puzzle || !puzzle.type || !puzzle.dateStr) return { valid: false }

    const isValid = validateSolution(puzzle.type, puzzle.puzzle, puzzle.answer)
    if (!isValid) return { valid: false }

    const hintsUsed = getHintsUsed(puzzle.dateStr)
    const score = calcScore(puzzle.timerSeconds, hintsUsed, 3)

    dispatch(setCompleted({ score }))
    dispatch(updateStreak())

    if (!puzzle.isPractice) {
      // Persist to IndexedDB
      await saveDailyActivity({
        date: puzzle.dateStr,
        solved: true,
        score,
        timeTaken: puzzle.timerSeconds,
        difficulty: 3,
        synced: false,
        answer: puzzle.answer, // Save answer for replay viewing
      })

      await clearPuzzleProgress(puzzle.dateStr)

      // Attempt server sync
      dispatch(setSyncStatus('syncing'))
      try {
        const authRaw = localStorage.getItem('ll_auth')
        const auth = authRaw ? JSON.parse(authRaw) : null
        if (auth?.isLoggedIn && !auth?.isGuest) {
          await fetch('/api/sync/daily-scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: puzzle.dateStr, score, timeTaken: puzzle.timerSeconds, difficulty: 3 }),
          })
          dispatch(setSyncStatus('success'))
        } else {
          dispatch(setSyncStatus('idle'))
        }
      } catch {
        dispatch(setSyncStatus('error'))
      }
    } else {
      // Practice mode: skip persistence and sync
      console.log('[PuzzleEngine] Practice attempt complete. Score:', score)
    }

    return { valid: true, score }
  }, [dispatch, puzzle])

  // Handle practice replay
  const handleReplay = useCallback(() => {
    dispatch(resetForPractice())
  }, [dispatch])

  return {
    puzzle,
    handleCellUpdate,
    handleSelectAnswer,
    handleHint,
    handleSubmit,
    saveProgress,
    handleReplay,
  }
}
