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
    <div className="min-h-screen bg-navy-950 text-white selection:bg-neon-blue/20 selection:text-neon-blue">
      {/* Immersive Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/5 rounded-full blur-[120px]" />
      </div>

      {/* Top HUD (Sticky/Glassy) */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-4 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <motion.div 
               className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center font-bold text-lg shadow-lg"
               whileHover={{ scale: 1.1, rotate: 5 }}
               onClick={() => window.location.href = '/'}
               style={{ cursor: 'pointer' }}
             >
               ∞
             </motion.div>
             <div className="hidden sm:block">
               <h2 className="text-sm font-black tracking-tighter uppercase text-white/40">Daily Challenge</h2>
               <p className="text-xs font-mono text-neon-blue">{formatDate(today)}</p>
             </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Timer />
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-widest hidden sm:inline">Streak</span>
              <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-black">
                🔥 7
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-4 max-w-2xl mx-auto relative z-10 flex flex-col min-h-screen">
        {/* Puzzle Header */}
        <motion.header 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-900/50 border border-white/5 mb-4">
            <span className="text-xl">{meta.icon}</span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{meta.title}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">Today's <span className="gradient-text">Loop</span></h1>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">{meta.desc}</p>
        </motion.header>

        {/* Loading / Status */}
        {puzzle.status === 'loading' && (
          <div className="flex-1 flex flex-col items-center justify-center -mt-12">
            <motion.div
              className="w-16 h-16 rounded-3xl border-4 border-neon-blue/20 border-t-neon-blue shadow-[0_0_30px_rgba(0,212,255,0.2)]"
              animate={{ rotate: 360, borderRadius: ["24px", "32px", "24px"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <p className="text-gray-400 mt-6 font-medium animate-pulse">Initializing Board...</p>
          </div>
        )}

        {/* Board Area */}
        {(puzzle.status === 'playing' || puzzle.status === 'completed') && (
          <motion.div
            className="flex-1 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Top Bar for Game Info */}
            <div className="w-full flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                 <button
                    onClick={handleHintClick}
                    disabled={isCompleted || puzzle.hintsRemaining === 0}
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all border
                      ${puzzle.hintsRemaining > 0 && !isCompleted
                        ? 'glass border-white/10 hover:border-yellow-500/50 text-yellow-400 shadow-xl'
                        : 'bg-white/5 border-transparent text-gray-700 cursor-not-allowed'
                      }`}
                  >
                    <span className="text-xl">💡</span>
                    {puzzle.hintsRemaining > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-navy-950 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-navy-950">
                        {puzzle.hintsRemaining}
                      </span>
                    )}
                 </button>
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1">Hint</span>
              </div>

              {isCompleted && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-6 py-2 rounded-2xl glass border-neon-green/30 text-neon-green font-black font-mono shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                >
                  +{puzzle.score} XP
                </motion.div>
              )}

              {puzzle.isPractice && !isCompleted && (
                <div className="px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest">
                  Practice Mode
                </div>
              )}
            </div>

            {/* The Actual Table */}
            <div className="w-full h-full flex items-center justify-center py-4">
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
          </motion.div>
        )}
      </main>

      {/* Persistent Bottom UI */}
      {(puzzle.status === 'playing' || puzzle.status === 'completed') && (
        <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-navy-950 via-navy-950/90 to-transparent z-40">
           <div className="max-w-md mx-auto flex flex-col gap-3">
             <AnimatePresence>
                {submitError && (
                  <motion.div
                    className="glass border-red-500/50 bg-red-500/10 p-3 rounded-xl text-red-100 text-xs font-bold text-center mb-1 shadow-2xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    ⚠️ {submitError}
                  </motion.div>
                )}
             </AnimatePresence>

             {!isCompleted ? (
               <div className="flex gap-3">
                 {puzzle.type === 'number-matrix' && (
                    <motion.button
                      onClick={handleClearConflicts}
                      className="h-16 w-16 glass border-white/5 flex items-center justify-center rounded-2xl hover:bg-white/5 transition-all"
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-xl">🧹</span>
                    </motion.button>
                 )}
                 <motion.button
                    onClick={handleTrySubmit}
                    className="flex-1 h-16 bg-white text-navy-900 flex items-center justify-center font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    SUBMIT
                  </motion.button>
               </div>
             ) : (
               <div className="flex flex-col gap-3 items-center">
                  <div className="text-center mb-2">
                    <p className="text-neon-green font-black text-lg">PUZZLE SOLVED!</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {puzzle.isPractice ? 'Practice round complete' : 'Progress saved to your streak'}
                    </p>
                  </div>
                  <div className="flex gap-3 w-full">
                    <motion.button
                      onClick={handleReplay}
                      className="flex-1 h-16 glass border-white/10 text-white font-black text-lg rounded-2xl"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {puzzle.isPractice ? 'PLAY AGAIN' : 'PRACTICE MODE'}
                    </motion.button>
                    <motion.button
                      onClick={() => window.location.href = '/'}
                      className="h-16 w-16 glass border-white/10 flex items-center justify-center rounded-2xl"
                    >
                      <span>🏠</span>
                    </motion.button>
                  </div>
               </div>
             )}
           </div>
        </div>
      )}

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
