import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { getAllActivity, getUnsynced, markSynced } from '../db/idb'
import { setSyncStatus, setPendingCount, setOnlineStatus } from '../store/syncSlice'

export function useSync(isLoggedIn, isGuest) {
  const dispatch = useDispatch()

  // Track online/offline
  useEffect(() => {
    const handleOnline = () => {
      dispatch(setOnlineStatus(true))
      if (isLoggedIn && !isGuest) syncPending()
    }
    const handleOffline = () => dispatch(setOnlineStatus(false))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isLoggedIn, isGuest])

  // Count pending on mount
  useEffect(() => {
    countPending()
  }, [])

  const countPending = useCallback(async () => {
    try {
      const all = await getAllActivity()
      const pending = all.filter((a) => !a.synced).length
      dispatch(setPendingCount(pending))
    } catch {}
  }, [dispatch])

  const syncPending = useCallback(async () => {
    if (!isLoggedIn) return
    dispatch(setSyncStatus('syncing'))
    try {
      const all = await getAllActivity()
      const pending = all.filter((a) => !a.synced)
      
      const authRaw = localStorage.getItem('ll_auth')
      const auth = authRaw ? JSON.parse(authRaw) : null
      const userId = auth?.user?.id || 'guest-id-123'

      for (const activity of pending) {
        await fetch('/api/sync/daily-scores', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify({
            date: activity.date,
            score: activity.score,
            timeTaken: activity.timeTaken,
            difficulty: activity.difficulty,
          }),
        })
        await markSynced(activity.date)
      }
      dispatch(setSyncStatus('success'))
      dispatch(setPendingCount(0))
    } catch {
      dispatch(setSyncStatus('error'))
    }
  }, [dispatch, isLoggedIn])

  return { syncPending }
}
