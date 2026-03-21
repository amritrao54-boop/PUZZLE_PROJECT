import { motion } from 'framer-motion'
import { getConflicts } from '../../engine/numberMatrix'

export default function NumberMatrixBoard({ puzzle, answer, clues, onCellUpdate, isCompleted }) {
  if (!puzzle || !answer) return null

  const conflicts = isCompleted ? [] : getConflicts(answer)

  const handleInput = (row, col, value) => {
    if (isCompleted || clues[row][col]) return
    
    // Get the last character entered
    const lastChar = value.slice(-1)
    const num = parseInt(lastChar, 10)

    if (isNaN(num) || num < 1 || num > 4) {
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
      if (e.key === 'ArrowDown') nr = Math.min(3, row + 1)
      if (e.key === 'ArrowLeft') nc = Math.max(0, col - 1)
      if (e.key === 'ArrowRight') nc = Math.min(3, col + 1)
      
      const nextInput = document.querySelector(`input[aria-label="Cell row ${nr + 1} col ${nc + 1}"]`)
      if (nextInput) {
        nextInput.focus()
        nextInput.select()
      }
      return
    }

    if (!/^[1-4]$/.test(e.key)) {
      e.preventDefault()
    }
  }

  const getCellClass = (row, col) => {
    const isClue = clues[row][col]
    const hasConflict = conflicts[row]?.[col]
    const isEmpty = answer[row][col] === 0
    const isBoxBorderRight = col === 1
    const isBoxBorderBottom = row === 1

    let base =
      'w-14 h-14 flex items-center justify-center text-xl font-mono font-bold rounded-lg transition-all duration-200 border-2 outline-none focus-within:ring-2 focus-within:ring-neon-blue/40'

    if (isClue) {
      base += ' bg-navy-700 border-neon-blue/30 text-neon-blue cursor-default'
    } else if (hasConflict) {
      base += ' bg-red-900/40 border-red-500 text-red-400'
    } else if (!isEmpty) {
      base += ' bg-neon-purple/10 border-neon-purple/50 text-white hover:border-neon-purple focus-within:border-neon-purple'
    } else {
      base += ' bg-navy-800 border-navy-600 text-transparent hover:border-neon-blue/50 focus-within:border-neon-blue'
    }

    if (isBoxBorderRight) base += ' mr-2'
    if (isBoxBorderBottom) base += ' mb-2'

    return base
  }

  return (
    <div className="flex flex-col gap-0 p-4 bg-navy-800/50 rounded-2xl border border-navy-600/50 shadow-2xl">
      {answer.map((row, r) => (
        <div key={r} className="flex gap-0">
          {row.map((val, c) => (
            <motion.div
              key={c}
              className={getCellClass(r, c)}
              whileTap={!clues[r][c] ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (r * 4 + c) * 0.03 }}
            >
              {clues[r][c] ? (
                <span>{val}</span>
              ) : (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[1-4]*"
                  maxLength={2}
                  value={val === 0 ? '' : val}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleInput(r, c, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, r, c)}
                  className="w-full h-full bg-transparent text-center text-xl font-bold font-mono outline-none text-white cursor-pointer"
                  disabled={isCompleted}
                  autoComplete="off"
                  aria-label={`Cell row ${r + 1} col ${c + 1}`}
                />
              )}
            </motion.div>
          ))}
        </div>
      ))}
      <p className="text-center text-xs text-gray-500 mt-3">Fill each row, column & 2×2 box with 1-4</p>
    </div>
  )
}
