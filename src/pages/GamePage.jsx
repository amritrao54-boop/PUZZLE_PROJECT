import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { usePuzzle } from '../hooks/usePuzzle'
import { useTimer } from '../hooks/useTimer'
import NumberMatrixBoard from '../components/PuzzleBoard/NumberMatrixBoard'
import PatternMatchBoard from '../components/PuzzleBoard/PatternMatchBoard'
import Timer from '../components/Timer/Timer'
import CompletionModal from '../components/CompletionModal/CompletionModal'
import { getTodayStr, formatDate } from '../utils/dateUtils'

const PUZZLE_TITLES = {
  'number-matrix': { title: 'Number Matrix', icon: '🔢', desc: 'Fill the grid — each digit 1-4 appears once per row, column & box' },
  'pattern-match': { title: 'Pattern Match', icon: '🔮', desc: 'Identify the next number in the sequence' },
}

import { getConflicts } from '../engine/numberMatrix'

export default function GamePage() {
  const { puzzle, handleCellUpdate, handleSelectAnswer, handleHint, handleSubmit, saveProgress, handleReplay } = usePuzzle()
  const { format } = useTimer()
  const [submitError, setSubmitError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const today = getTodayStr()

  const handleClearConflicts = () => {
    if (puzzle.type !== 'number-matrix' || !puzzle.answer) return
    const conflicts = getConflicts(puzzle.answer)
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (conflicts[r][c] && !puzzle.puzzle.clues[r][c]) {
          handleCellUpdate(r, c, 0)
        }
      }
    }
  }

  const handleTrySubmit = async () => {
    setSubmitError(null)
    
    // Check if filled
    if (puzzle.type === 'number-matrix' && puzzle.answer?.some(r => r.some(v => v === 0))) {
      setSubmitError('Please fill all cells before submitting.')
      return
    }

    const res = await handleSubmit()
    if (!res.valid) {
      setSubmitError('Incorrect solution. Check for red conflicts!')
    } else {
      setShowModal(true)
    }
  }

  // Auto-save progress every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      if (puzzle.status === 'playing') saveProgress()
    }, 5000)
    return () => clearInterval(interval)
  }, [saveProgress, puzzle.status])

  const meta = PUZZLE_TITLES[puzzle.type] || { title: 'Daily Puzzle', icon: '🧩', desc: '' }
  const isCompleted = puzzle.status === 'completed'

  const handleHintClick = () => {
    if (!puzzle.puzzle || isCompleted) return
    if (puzzle.type === 'number-matrix') {
      const success = handleHint()
      if (!success) return
      // Find first empty cell and fill it with the solution value
      const currentAnswer = puzzle.answer
      const solution = puzzle.puzzle.solution
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (!puzzle.puzzle.clues[r][c] && currentAnswer[r][c] === 0) {
            handleCellUpdate(r, c, solution[r][c])
            return
          }
        }
      }
    } else {
      handleHint()
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 pt-20 pb-12 px-4">
      {/* Background */}
      <div className="absolute top-32 right-0 w-64 h-64 bg-neon-blue/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 left-0 w-64 h-64 bg-neon-purple/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto">
        {/* Date header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-500 text-sm font-mono">{formatDate(today)}</p>
          <h1 className="text-white text-2xl font-bold mt-1">
            {meta.icon} {meta.title}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{meta.desc}</p>
        </motion.div>

        {/* Loading state */}
        {puzzle.status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              className="w-12 h-12 rounded-full border-2 border-neon-blue border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
            <p className="text-gray-400 mt-4">Loading today's puzzle…</p>
          </div>
        )}

        {/* Game area */}
        {(puzzle.status === 'playing' || puzzle.status === 'completed') && (
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Timer + info bar */}
            <div className="w-full flex items-center justify-between">
              <Timer />
              <div className="flex items-center gap-3">
                {/* Hints */}
                <motion.button
                  onClick={handleHintClick}
                  disabled={isCompleted || puzzle.hintsRemaining === 0}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all
                    ${puzzle.hintsRemaining > 0 && !isCompleted
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 cursor-pointer'
                      : 'bg-navy-700/30 border-navy-600/30 text-gray-600 cursor-not-allowed'
                    }`}
                  whileHover={puzzle.hintsRemaining > 0 && !isCompleted ? { scale: 1.05 } : {}}
                  whileTap={puzzle.hintsRemaining > 0 && !isCompleted ? { scale: 0.95 } : {}}
                >
                  <span>💡</span>
                  <span>{puzzle.hintsRemaining}</span>
                </motion.button>

                {/* Practice Indicator */}
                {puzzle.isPractice && (
                  <motion.div
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">Practice Mode</span>
                  </motion.div>
                )}

                {/* Score (shown when completed) */}
                <AnimatePresence>
                  {isCompleted && (
                    <motion.div
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neon-green/10 border border-neon-green/30"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <span className="text-neon-green text-sm font-bold font-mono">{puzzle.score}pts</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Puzzle board */}
            <div className="w-full flex justify-center">
              <AnimatePresence mode="wait">
                {puzzle.type === 'number-matrix' && (
                  <NumberMatrixBoard
                    puzzle={puzzle.puzzle}
                    answer={puzzle.answer}
                    clues={puzzle.puzzle?.clues}
                    onCellUpdate={handleCellUpdate}
                    isCompleted={isCompleted}
                  />
                )}
                {puzzle.type === 'pattern-match' && (
                  <PatternMatchBoard
                    puzzle={puzzle.puzzle}
                    answer={puzzle.answer}
                    onSelectAnswer={handleSelectAnswer}
                    isCompleted={isCompleted}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Submit button */}
            {!isCompleted && (
              <div className="w-full flex flex-col gap-3 items-center">
                <AnimatePresence>
                  {submitError && (
                    <motion.div
                      className="text-red-400 text-sm font-medium mb-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ⚠️ {submitError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleTrySubmit}
                  className="w-full max-w-xs py-4 rounded-2xl font-bold text-lg transition-all
                    bg-gradient-to-r from-neon-blue to-neon-purple text-white
                    hover:shadow-lg hover:shadow-neon-blue/30"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit Solution ✓
                </motion.button>
                
                <div className="flex gap-4">
                  {puzzle.type === 'number-matrix' && !isCompleted && (
                    <button
                      onClick={handleClearConflicts}
                      className="text-neon-blue/60 text-xs hover:text-neon-blue transition-colors flex items-center gap-1"
                    >
                      <span>🧹</span> Clear Conflicts
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      if (window.confirm('This will clear today\'s board and status. Continue?')) {
                        const { clearPuzzleProgress, deleteDailyActivity, getDailyActivity } = await import('../db/idb')
                        const existing = await getDailyActivity(today)
                        
                        await clearPuzzleProgress(today)
                        // Only delete activity if it's NOT already solved (i.e. we are not in practice mode)
                        // If it IS solved, we want to keep that record and just refresh the board.
                        if (!existing?.solved) {
                          await deleteDailyActivity(today)
                          window.location.reload()
                        } else {
                          // If already solved, just reset for practice
                          handleReplay()
                        }
                      }
                    }}
                    className="text-gray-500 text-xs hover:text-gray-400 transition-colors"
                  >
                    Reset Board
                  </button>
                </div>
              </div>
            )}

            {/* Completed state notice / Replay button */}
            {isCompleted && (
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center text-neon-green font-semibold">
                  {puzzle.isPractice 
                    ? '✓ Practice attempt complete!' 
                    : "✓ Today's puzzle complete! Come back tomorrow for a new one."}
                </div>
                
                <motion.button
                  onClick={handleReplay}
                  className="px-6 py-2 rounded-xl bg-navy-700 border border-navy-600 text-gray-300 text-sm font-medium hover:bg-navy-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {puzzle.isPractice ? 'Play Again' : 'Replay (Practice)'}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Completion modal */}
      <CompletionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        score={puzzle.score}
        timeTaken={puzzle.timerSeconds}
        isPractice={puzzle.isPractice}
      />
    </div>
  )
}
