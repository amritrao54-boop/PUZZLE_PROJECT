import { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tickTimer, stopTimer, startTimer } from '../store/puzzleSlice'

export function useTimer() {
  const dispatch = useDispatch()
  const { timerRunning, timerSeconds } = useSelector((s) => s.puzzle)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        dispatch(tickTimer())
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [timerRunning, dispatch])

  const start = useCallback(() => dispatch(startTimer()), [dispatch])
  const stop = useCallback(() => dispatch(stopTimer()), [dispatch])

  const format = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return { timerSeconds, timerRunning, start, stop, format }
}
