import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 250 } },
}

// Firework particles
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  angle: (i / 20) * 360,
  distance: 80 + Math.random() * 60,
  color: ['#00d4ff', '#a855f7', '#22c55e', '#f97316', '#ffffff'][i % 5],
}))

export default function CompletionModal({ score, timeTaken, isOpen, isPractice, onClose }) {
  const navigate = useNavigate()
  const minutes = Math.floor(timeTaken / 60)
  const seconds = timeTaken % 60
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`

  const getRank = (s) => {
    if (s >= 900) return { label: '🏆 Perfect!', color: 'text-yellow-400' }
    if (s >= 700) return { label: '💎 Excellent!', color: 'text-neon-blue' }
    if (s >= 500) return { label: '✨ Great job!', color: 'text-neon-purple' }
    return { label: '💪 Completed!', color: 'text-neon-green' }
  }

  const rank = getRank(score)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          ))}

          {/* Modal */}
          <motion.div
            className="relative bg-navy-800 border border-neon-blue/30 rounded-3xl p-8 mx-4 w-full max-w-sm shadow-2xl shadow-neon-blue/10"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 pointer-events-none" />

            <div className="text-center">
              {/* Trophy animation */}
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                🎉
              </motion.div>

              <motion.h2
                className={`text-2xl font-bold mb-1 ${rank.color}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {rank.label}
              </motion.h2>

              <motion.p
                className="text-gray-400 text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isPractice ? 'Practice attempt finished!' : 'Puzzle completed!'}
              </motion.p>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 gap-3 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-navy-700/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Score</p>
                  <p className="text-2xl font-bold font-mono text-neon-blue">{score}</p>
                </div>
                <div className="bg-navy-700/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Time</p>
                  <p className="text-2xl font-bold font-mono text-white">{timeStr}</p>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {!isPractice && (
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex-1 py-3 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-sm font-semibold hover:bg-neon-blue/20 transition-colors"
                  >
                    View Heatmap
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-neon-purple text-white text-sm font-semibold hover:bg-neon-purple/80 transition-colors"
                >
                  {isPractice ? 'Keep Playing' : 'Done'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
