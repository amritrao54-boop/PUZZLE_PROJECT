import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadStreakFromStorage } from './store/streakSlice'
import { useSync } from './hooks/useSync'
import Navbar from './components/Navbar/Navbar'
import LandingPage from './pages/LandingPage'
import GamePage from './pages/GamePage'
import ProfilePage from './pages/ProfilePage'

function AppContent() {
  const dispatch = useDispatch()
  const { isLoggedIn, isGuest } = useSelector((s) => s.auth)

  // Load streak on boot
  useEffect(() => {
    dispatch(loadStreakFromStorage())
  }, [dispatch])

  // Background sync hook
  useSync(isLoggedIn, isGuest)

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/game" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
