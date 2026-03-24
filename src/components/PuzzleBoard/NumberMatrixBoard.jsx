import { motion, AnimatePresence } from 'framer-motion'
import { getConflicts } from '../../engine/numberMatrix'

export default function NumberMatrixBoard({ puzzle, answer, clues, onCellUpdate, isCompleted }) {
  if (!puzzle || !answer) return null

  const size = answer.length
  const conflicts = isCompleted ? [] : getConflicts(answer)

  const handleInput = (row, col, value) => {
    if (isCompleted || clues[row][col]) return
    const lastChar = value.slice(-1)
    const num = parseInt(lastChar, 10)
    if (isNaN(num) || num < 1 || num > size) {
      onCellUpdate(row, col, 0)
    } else {
      onCellUpdate(row, col, num)
    }
  }

  const handleKeyDown = (e, row, col) => {
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab') return
    if (e.key.startsWith('Arrow')) {
      e.preventDefault()
      let nr = row, nc = col
      if (e.key === 'ArrowUp') nr = Math.max(0, row - 1)
      if (e.key === 'ArrowDown') nr = Math.min(size - 1, row + 1)
      if (e.key === 'ArrowLeft') nc = Math.max(0, col - 1)
      if (e.key === 'ArrowRight') nc = Math.min(size - 1, col + 1)
      const nextInput = document.querySelector(`input[aria-label="Cell row ${nr + 1} col ${nc + 1}"]`)
      if (nextInput) {
        nextInput.focus()
        nextInput.select()
      }
      return
    }
  }

  const getCellClass = (row, col) => {
    const isClue = clues[row][col]
    const hasConflict = conflicts[row]?.[col]
    const isEmpty = answer[row][col] === 0
    
    // Grid box borders (for 4x4 it's 2x2, for 6x6 it's 2x3 or similar)
    const isBoxBorderRight = size === 4 ? col === 1 : col % 3 === 2 && col !== size - 1
    const isBoxBorderBottom = size === 4 ? row === 1 : row % 2 === 1 && row !== size - 1

    let base = 'relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl font-black rounded-2xl transition-all duration-300'

    if (isClue) {
      base += ' bg-navy-900/50 border-white/5 text-white/40 cursor-default'
    } else if (hasConflict) {
      base += ' bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
    } else if (!isEmpty) {
      base += ' glass border-neon-blue/40 text-neon-blue shadow-[0_0_25px_rgba(0,212,255,0.15)] focus-within:scale-105'
    } else {
      base += ' glass border-white/5 text-white/10 hover:border-white/20 focus-within:border-neon-blue/50 focus-within:bg-neon-blue/5'
    }

    let margin = ''
    if (isBoxBorderRight) margin += ' mr-3'
    if (isBoxBorderBottom) margin += ' mb-3'

    return { base, margin }
  }

  return (
    <div className={`grid gap-2 p-1 sm:p-2 overflow-visible`}>
      {answer.map((row, r) => (
        <div key={r} className="flex gap-2">
          {row.map((val, c) => {
            const classes = getCellClass(r, c)
            return (
              <motion.div
                key={c}
                className={`${classes.base} ${classes.margin}`}
                whileHover={!clues[r][c] && !isCompleted ? { scale: 1.05, y: -2 } : {}}
                whileTap={!clues[r][c] && !isCompleted ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: (r * size + c) * 0.02 
                }}
              >
                {clues[r][c] ? (
                  <span className="font-mono">{val}</span>
                ) : (
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={val === 0 ? '' : val}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleInput(r, c, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, r, c)}
                    className="w-full h-full bg-transparent text-center text-2xl font-black font-mono outline-none cursor-pointer placeholder-white/5"
                    placeholder="·"
                    disabled={isCompleted}
                    autoComplete="off"
                    aria-label={`Cell row ${r + 1} col ${c + 1}`}
                  />
                )}
                {/* Visual Conflict Glow */}
                <AnimatePresence>
                  {conflicts[r]?.[c] && (
                    <motion.div 
                      className="absolute inset-x-2 -bottom-1 h-1 bg-red-500 rounded-full blur-[2px]"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
