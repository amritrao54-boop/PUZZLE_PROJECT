import { motion } from 'framer-motion'

const TYPE_LABELS = {
  arithmetic: 'Arithmetic Sequence',
  geometric: 'Geometric Sequence',
  fibonacci: 'Fibonacci Pattern',
  squares: 'Square Numbers',
  alternating: 'Alternating Pattern',
  primes: 'Prime Sequence',
  squaredDiff: 'Squared Difference',
}

export default function PatternMatchBoard({ puzzle, answer, onSelectAnswer, isCompleted }) {
  if (!puzzle) return null

  const { sequence, options, type } = puzzle

  return (
    <div className="w-full max-w-lg px-4 flex flex-col items-center">
      {/* Sequence Display */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
        {sequence.map((num, i) => (
          <motion.div
            key={i}
            className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center glass border-white/5 rounded-3xl text-white text-2xl sm:text-3xl font-black font-mono shadow-xl relative group"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", delay: i * 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            {num}
          </motion.div>
        ))}

        {/* The Missing Link */}
        <motion.div
          className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-3xl text-2xl sm:text-3xl font-black font-mono border-2 transition-all duration-500 shadow-2xl relative
            ${answer !== null
              ? 'glass border-neon-purple shadow-[0_0_30px_rgba(168,85,247,0.2)] text-white'
              : 'bg-navy-900/50 border-dashed border-white/10 text-white/10'
            }`}
          animate={answer !== null ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
        >
          {answer !== null ? answer : '?'}
          {answer === null && (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white/20 rounded-full animate-ping" />
             </div>
          )}
        </motion.div>
      </div>

      {/* Multiple Choice Options */}
      <div className="w-full grid grid-cols-2 gap-4">
        {options.map((opt, i) => {
          const isSelected = answer === opt
          const isCorrect = isCompleted && opt === puzzle.answer
          const isWrong = isCompleted && isSelected && opt !== puzzle.answer

          return (
            <motion.button
              key={i}
              onClick={() => !isCompleted && onSelectAnswer(opt)}
              className={`h-20 sm:h-24 rounded-[2rem] text-3xl font-black font-mono border-2 transition-all duration-300 relative overflow-hidden group
                ${isCorrect ? 'bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_30px_rgba(34,197,94,0.2)]' : ''}
                ${isWrong ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : ''}
                ${isSelected && !isCompleted ? 'glass border-neon-purple text-neon-purple shadow-[0_0_40px_rgba(168,85,247,0.3)]' : ''}
                ${!isSelected && !isCompleted ? 'glass border-white/5 text-white/40 hover:border-white/20 hover:text-white hover:shadow-2xl' : ''}
              `}
              whileHover={!isCompleted ? { y: -5, scale: 1.02 } : {}}
              whileTap={!isCompleted ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              disabled={isCompleted}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {opt}
            </motion.button>
          )
        })}
      </div>

      <motion.p 
        className="text-center text-xs font-black uppercase tracking-[0.2em] text-gray-600 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Complete the sequence to solve
      </motion.p>
    </div>
  )
}
