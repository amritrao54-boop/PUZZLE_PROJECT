import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pendingCount: 0,
  lastSyncAt: null,
  syncStatus: 'idle', // 'idle' | 'syncing' | 'success' | 'error'
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
}

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setPendingCount(state, action) {
      state.pendingCount = action.payload
    },
    setSyncStatus(state, action) {
      state.syncStatus = action.payload
      if (action.payload === 'success') {
        state.lastSyncAt = new Date().toISOString()
        state.pendingCount = 0
      }
    },
    setOnlineStatus(state, action) {
      state.isOnline = action.payload
    },
  },
})

export const { setPendingCount, setSyncStatus, setOnlineStatus } = syncSlice.actions
export default syncSlice.reducer
