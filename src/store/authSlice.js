import { createSlice } from '@reduxjs/toolkit'

function loadAuth() {
  try {
    const raw = localStorage.getItem('ll_auth')
    return raw ? JSON.parse(raw) : { user: null, isGuest: false, isLoggedIn: false }
  } catch {
    return { user: null, isGuest: false, isLoggedIn: false }
  }
}

const saved = loadAuth()

const initialState = {
  user: saved.user,
  isGuest: saved.isGuest,
  isLoggedIn: saved.isLoggedIn,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAsGuest(state) {
      state.isGuest = true
      state.isLoggedIn = true
      state.user = { name: 'Guest', id: 'guest_' + Date.now() }
      try {
        localStorage.setItem('ll_auth', JSON.stringify({
          user: state.user,
          isGuest: true,
          isLoggedIn: true,
        }))
      } catch {}
    },

    loginWithGoogle(state, action) {
      state.isGuest = false
      state.isLoggedIn = true
      state.user = action.payload
      try {
        localStorage.setItem('ll_auth', JSON.stringify({
          user: state.user,
          isGuest: false,
          isLoggedIn: true,
        }))
      } catch {}
    },

    logout(state) {
      state.user = null
      state.isGuest = false
      state.isLoggedIn = false
      try {
        localStorage.removeItem('ll_auth')
      } catch {}
    },
  },
})

export const { loginAsGuest, loginWithGoogle, logout } = authSlice.actions
export default authSlice.reducer
