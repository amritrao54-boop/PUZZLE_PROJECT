import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'

export default function StreakBadge() {
  const { count, longestStreak } = useSelector((s) => s.streak)

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          className="flex items-center gap-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-full px-3 py-1"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          {/* Fire emoji with glow */}
          <motion.span
            className="text-lg"
            animate={count > 0 ? { rotate: [-5, 5, -5] } : {}}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            🔥
          </motion.span>
          <span className="text-orange-400 font-bold font-mono text-sm">{count}</span>
          <span className="text-orange-400/60 text-xs">streak</span>
        </motion.div>
      </AnimatePresence>

      {longestStreak > 0 && longestStreak > count && (
        <div className="text-xs text-gray-500 font-mono">
          best: {longestStreak}
        </div>
      )}
    </div>
  )
}
