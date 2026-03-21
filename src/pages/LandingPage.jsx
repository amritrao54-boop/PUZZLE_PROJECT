import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginAsGuest } from '../store/authSlice'
import { loadStreakFromStorage } from '../store/streakSlice'

const features = [
  { icon: '🧩', title: 'Daily Puzzles', desc: '365 unique challenges that reset each day' },
  { icon: '🔥', title: 'Streak System', desc: 'Keep your streak alive, track your best' },
  { icon: '📊', title: 'Activity Heatmap', desc: 'GitHub-style visualization of your progress' },
  { icon: '✈️', title: '100% Offline', desc: 'Play anywhere — no internet required' },
]

export default function LandingPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoggedIn, isGuest } = useSelector((s) => s.auth)

  const handleGuestPlay = () => {
    dispatch(loginAsGuest())
    dispatch(loadStreakFromStorage())
    navigate('/game')
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main content */}
      <motion.div
        className="text-center max-w-2xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-neon-blue/30"
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        >
          ∞
        </motion.div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 leading-tight">
          Logic<span className="text-neon-blue">Looper</span>
        </h1>
        <p className="text-gray-400 text-xl mb-10">
          A new brain puzzle every day. Build your streak.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          {isLoggedIn || isGuest ? (
            <motion.button
              onClick={() => navigate('/game')}
              className="px-12 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold text-lg rounded-2xl hover:shadow-lg hover:shadow-neon-blue/30 transition-all"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Back to Game →
            </motion.button>
          ) : (
            <>
              <motion.button
                onClick={handleGuestPlay}
                className="px-8 py-4 bg-neon-blue text-navy-900 font-bold text-lg rounded-2xl hover:bg-neon-blue/90 transition-colors shadow-lg shadow-neon-blue/30"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Play as Guest →
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-navy-700 text-white font-semibold text-lg rounded-2xl border border-navy-600 hover:border-neon-blue/40 hover:bg-navy-600 transition-all"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => alert('Google OAuth coming soon! Play as guest for now.')}
              >
                Sign in with Google
              </motion.button>
            </>
          )}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="bg-navy-800/50 border border-navy-700/50 rounded-2xl p-4 text-left hover:border-neon-blue/20 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-white text-sm font-semibold mb-1">{f.title}</p>
              <p className="text-gray-500 text-xs leading-snug">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
