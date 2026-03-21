import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import HeatmapGrid from '../components/HeatmapGrid/HeatmapGrid'
import { getAllActivity } from '../db/idb'
import { formatDate } from '../utils/dateUtils'
import { useSync } from '../hooks/useSync'

export default function ProfilePage() {
  const { count: streak, longestStreak } = useSelector((s) => s.streak)
  const { user, isGuest, isLoggedIn } = useSelector((s) => s.auth)
  const { syncStatus, pendingCount, lastSyncAt, isOnline } = useSelector((s) => s.sync)
  const { syncPending } = useSync(isLoggedIn, isGuest)
  const [stats, setStats] = useState({ total: 0, avgScore: 0, avgTime: 0 })

  useEffect(() => {
    getAllActivity().then((activities) => {
      const solved = activities.filter((a) => a.solved)
      if (solved.length === 0) return
      const avgScore = Math.round(solved.reduce((sum, a) => sum + a.score, 0) / solved.length)
      const avgTime = Math.round(solved.reduce((sum, a) => sum + a.timeTaken, 0) / solved.length)
      setStats({ total: solved.length, avgScore, avgTime })
    })
  }, [])

  const formatAvgTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  const statCards = [
    { label: 'Puzzles Solved', value: stats.total, icon: '🧩', color: 'text-neon-blue' },
    { label: 'Current Streak', value: `${streak} 🔥`, icon: '📅', color: 'text-orange-400' },
    { label: 'Best Streak', value: longestStreak, icon: '🏆', color: 'text-yellow-400' },
    { label: 'Avg Score', value: stats.avgScore || '—', icon: '⭐', color: 'text-neon-purple' },
    { label: 'Avg Time', value: stats.total > 0 ? formatAvgTime(stats.avgTime) : '—', icon: '⏱', color: 'text-neon-green' },
  ]

  return (
    <div className="min-h-screen bg-navy-900 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white text-2xl font-bold">
            {isGuest ? '👤' : user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{isGuest ? 'Guest Player' : user?.name}</h1>
            <p className="text-gray-400 text-sm">Your Logic Looper journey</p>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {statCards.map((s, i) => (
            <motion.div
              key={i}
              className="bg-navy-800/50 border border-navy-700/50 rounded-2xl p-4 text-center hover:border-neon-blue/20 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}
            >
              <div className="text-xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Sync & Heatmap section */}
        <motion.div
          className="bg-navy-800/30 border border-navy-700/30 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-white font-bold text-lg">Activity & Sync</h2>
              <p className="text-gray-500 text-sm">Last 365 days of puzzle activity</p>
            </div>
            
            <div className="flex items-center gap-3">
              {lastSyncAt && (
                <span className="text-[10px] text-gray-600 font-mono hidden sm:inline">
                  Last sync: {new Date(lastSyncAt).toLocaleTimeString()}
                </span>
              )}
              
              <motion.button
                onClick={syncPending}
                disabled={!isOnline || syncStatus === 'syncing'}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2
                  ${syncStatus === 'syncing' 
                    ? 'bg-navy-700 border-navy-600 text-gray-400' 
                    : !isOnline 
                      ? 'bg-navy-800 border-navy-700 text-gray-600 cursor-not-allowed'
                      : 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20'
                  }`}
                whileTap={isOnline && syncStatus !== 'syncing' ? { scale: 0.95 } : {}}
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <div className="w-3 h-3 rounded-full border border-gray-400 border-t-transparent animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    <span>Sync Progress {pendingCount > 0 ? `(${pendingCount})` : ''}</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          <div className="relative">
            <HeatmapGrid />
          </div>
        </motion.div>

        {/* Offline badge */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span>✈️</span>
          <span>All data stored locally — works 100% offline</span>
        </motion.div>
      </div>
    </div>
  )
}
