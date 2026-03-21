import { useEffect, useState } from 'react'
import { getLast365Dates, getTodayStr, formatDate } from '../../utils/dateUtils'
import { getAllActivity } from '../../db/idb'
import { scoreToIntensity } from '../../engine/scoreEngine'
import { motion } from 'framer-motion'

const INTENSITY_COLORS = [
  'bg-[#1a2234]',        // 0 - no activity
  'bg-[#164e63]',        // 1 - completed
  'bg-[#0891b2]',        // 2 - medium
  'bg-[#00a5cc]',        // 3 - hard
  'bg-[#00d4ff]',        // 4 - perfect
]

const INTENSITY_LABELS = ['Not played', 'Completed', 'Medium score', 'High score', 'Perfect!']

export default function HeatmapGrid() {
  const [activityMap, setActivityMap] = useState({})
  const [tooltip, setTooltip] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const dates = getLast365Dates()
  const today = getTodayStr()

  useEffect(() => {
    getAllActivity().then((activities) => {
      const map = {}
      activities.forEach((a) => {
        map[a.date] = { score: a.score, solved: a.solved }
      })
      setActivityMap(map)
      setIsLoaded(true)
    })
  }, [])

  // Build weekly columns: 365 days → ~53 columns of 7 days each
  const firstDate = dates[0]
  const firstDow = new Date(firstDate).getDay() // 0=Sun

  // Pad start so grid aligns to Sunday
  const paddedDates = [...Array(firstDow).fill(null), ...dates]
  const weeks = []
  for (let i = 0; i < paddedDates.length; i += 7) {
    weeks.push(paddedDates.slice(i, i + 7))
  }

  const getIntensity = (date) => {
    if (!date) return -1 // padding cell
    const activity = activityMap[date]
    if (!activity?.solved) return 0
    return scoreToIntensity(activity.score)
  }

  const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Generate month label positions
  const monthPositions = []
  weeks.forEach((week, wi) => {
    const firstReal = week.find(Boolean)
    if (firstReal) {
      const d = new Date(firstReal)
      if (d.getDate() <= 7) {
        monthPositions.push({ wi, label: MONTH_LABELS[d.getMonth()] })
      }
    }
  })

  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-2">
        {/* Month labels */}
        <div className="flex gap-[3px] mb-1 ml-0">
          {weeks.map((_, wi) => {
            const mp = monthPositions.find((m) => m.wi === wi)
            return (
              <div key={wi} className="w-[14px] text-[9px] text-gray-500 font-mono truncate">
                {mp ? mp.label : ''}
              </div>
            )
          })}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((date, di) => {
                const intensity = getIntensity(date)
                if (intensity === -1) {
                  return <div key={di} className="w-[14px] h-[14px]" />
                }
                const isToday = date === today

                return (
                  <motion.div
                    key={di}
                    className={`w-[14px] h-[14px] rounded-[2px] cursor-pointer transition-transform
                      ${INTENSITY_COLORS[intensity]}
                      ${isToday ? 'ring-1 ring-neon-blue ring-offset-1 ring-offset-navy-900' : ''}
                    `}
                    whileHover={{ scale: 1.4 }}
                    initial={isLoaded ? { opacity: 0, scale: 0 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (wi * 7 + di) * 0.001 }}
                    onMouseEnter={() =>
                      setTooltip({ date, intensity, score: activityMap[date]?.score || 0, x: wi, y: di })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mt-1 absolute -left-7 top-0" style={{ fontSize: '9px' }}>
          {['', 'M', '', 'W', '', 'F', ''].map((d, i) => (
            <div key={i} className="h-[14px] flex items-center text-gray-500 font-mono">
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && tooltip.date && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center text-xs text-gray-300 bg-navy-700 px-3 py-1.5 rounded-lg inline-block"
        >
          <span className="text-neon-blue font-semibold">{formatDate(tooltip.date)}</span>
          <span className="mx-2 text-gray-600">·</span>
          <span>{INTENSITY_LABELS[tooltip.intensity]}</span>
          {tooltip.score > 0 && <span className="ml-2 text-neon-green font-mono">{tooltip.score}pts</span>}
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
        <span>Less</span>
        {INTENSITY_COLORS.map((cls, i) => (
          <div key={i} className={`w-3 h-3 rounded-[2px] ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
