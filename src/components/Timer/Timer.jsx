import { useTimer } from '../../hooks/useTimer'
import { motion } from 'framer-motion'
import { ClockIcon } from '../Icons'

export default function Timer() {
  const { timerSeconds, timerRunning, format } = useTimer()

  return (
    <motion.div
      className="flex items-center gap-2 bg-navy-700/50 border border-navy-600/50 rounded-xl px-4 py-2"
      animate={timerRunning ? { borderColor: ['rgba(0,212,255,0.2)', 'rgba(0,212,255,0.5)', 'rgba(0,212,255,0.2)'] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <span className="text-neon-blue/60 text-sm">⏱</span>
      <span className="font-mono text-lg font-bold text-white tabular-nums">{format(timerSeconds)}</span>
      {timerRunning && (
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-neon-green"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
    </motion.div>
  )
}
