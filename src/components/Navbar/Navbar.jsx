import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import StreakBadge from '../StreakBadge/StreakBadge'

export default function Navbar() {
  const { user, isGuest } = useSelector((s) => s.auth)
  const { syncStatus, isOnline, pendingCount } = useSelector((s) => s.sync)
  const location = useLocation()

  const syncIndicator = () => {
    if (!isOnline) return { icon: '📡', label: 'Offline', color: 'text-yellow-400' }
    if (syncStatus === 'syncing') return { icon: '⟳', label: 'Syncing', color: 'text-neon-blue animate-spin' }
    if (syncStatus === 'success') return { icon: '✓', label: 'Synced', color: 'text-neon-green' }
    if (syncStatus === 'error') return { icon: '!', label: 'Sync failed', color: 'text-red-400' }
    if (pendingCount > 0) return { icon: `${pendingCount}`, label: 'Pending sync', color: 'text-yellow-400' }
    return null
  }

  const syncInfo = syncIndicator()

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 bg-navy-900/80 backdrop-blur-xl border-b border-navy-700/50"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white text-sm font-bold"
            whileHover={{ rotate: 10 }}
          >
            ∞
          </motion.div>
          <span className="font-bold text-white text-lg hidden sm:block">
            Logic<span className="text-neon-blue">Looper</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {[
            { to: '/game', label: 'Play' },
            { to: '/profile', label: 'Stats' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-neon-blue/10 text-neon-blue'
                  : 'text-gray-400 hover:text-white hover:bg-navy-700/50'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Sync indicator */}
          {syncInfo && (
            <motion.div
              className={`flex items-center gap-1 text-xs font-mono ${syncInfo.color}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              title={syncInfo.label}
            >
              <span className="text-sm">{syncInfo.icon}</span>
              <span className="hidden sm:block">{syncInfo.label}</span>
            </motion.div>
          )}

          <StreakBadge />

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white text-xs font-bold">
            {isGuest ? 'G' : user?.name?.[0]?.toUpperCase() || '?'}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
