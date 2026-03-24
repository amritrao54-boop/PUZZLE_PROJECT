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
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Main Content */}
      <motion.div
        className="text-center max-w-3xl w-full z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated Logo */}
        <motion.div
          className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink mx-auto mb-8 flex items-center justify-center text-5xl font-bold text-white shadow-[0_0_50px_rgba(0,212,255,0.3)]"
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            rotate: { repeat: Infinity, duration: 8, ease: 'easeInOut' },
            y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
          }}
        >
          ∞
        </motion.div>

        <motion.h1 
          className="text-6xl sm:text-8xl font-black text-white mb-4 tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Logic<span className="gradient-text">Looper</span>
        </motion.h1>
        
        <motion.p 
          className="text-gray-400 text-xl sm:text-2xl mb-12 font-medium max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Master your mind with unique daily challenges designed to push your cognitive limits.
        </motion.p>

        {/* CTA Section */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {isLoggedIn || isGuest ? (
            <motion.button
              onClick={() => navigate('/game')}
              className="px-16 py-5 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-black text-xl rounded-2xl shadow-[0_10px_40px_rgba(0,212,255,0.3)] hover:shadow-[0_15px_50px_rgba(0,212,255,0.4)] transition-all"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              RESUME JOURNEY →
            </motion.button>
          ) : (
            <>
              <motion.button
                onClick={handleGuestPlay}
                className="px-10 py-5 bg-white text-navy-950 font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                START PLAYING →
              </motion.button>
              <motion.button
                className="px-10 py-5 glass text-white font-bold text-xl rounded-2xl hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert('Google OAuth coming soon! Play as guest for now.')}
              >
                Sign in with Google
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 overflow-visible">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="glass p-6 rounded-[2rem] text-left relative group overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-neon-blue/10 transition-colors" />
              <div className="text-4xl mb-4 bg-navy-900/50 w-14 h-14 flex items-center justify-center rounded-2xl border border-white/10 shadow-inner">{f.icon}</div>
              <h3 className="text-white text-lg font-bold mb-2 tracking-tight">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer / Info */}
        <motion.div 
          className="mt-20 text-gray-600 text-sm font-medium tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Inspired by LinkedIn Games • Optimized for Mobile
        </motion.div>
      </motion.div>

      {/* Floating Decorative Elements */}
      <motion.div 
        className="absolute top-[15%] right-[15%] text-6xl opacity-10 pointer-events-none hidden lg:block"
        animate={{ y: [0, 30, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        🧩
      </motion.div>
      <motion.div 
        className="absolute bottom-[20%] left-[10%] text-6xl opacity-10 pointer-events-none hidden lg:block"
        animate={{ y: [0, -40, 0], rotate: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        🔢
      </motion.div>
    </div>
  )
}
