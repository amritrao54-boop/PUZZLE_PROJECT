import { motion } from 'framer-motion'

const TYPE_LABELS = {
  arithmetic: 'Arithmetic Sequence',
  geometric: 'Geometric Sequence',
  fibonacci: 'Fibonacci Pattern',
  squares: 'Square Numbers',
  alternating: 'Alternating Pattern',
}

export default function PatternMatchBoard({ puzzle, answer, onSelectAnswer, isCompleted }) {
  if (!puzzle) return null

  const { sequence, options, type } = puzzle

  return (
    <div className="w-full max-w-lg">
      {/* Pattern type label */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-neon-blue/60 font-mono">
          {TYPE_LABELS[type] || 'Sequence Pattern'}
        </span>
      </div>

      {/* Sequence display */}
      <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
        {sequence.map((num, i) => (
          <motion.div
            key={i}
            className="w-14 h-14 flex items-center justify-center bg-navy-700 border-2 border-neon-blue/30 rounded-xl text-white text-xl font-bold font-mono"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {num}
          </motion.div>
        ))}

        {/* Next arrow */}
        <motion.div
          className="text-neon-blue/50 text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: sequence.length * 0.1 }}
        >
          →
        </motion.div>

        {/* Answer slot */}
        <motion.div
          className={`w-14 h-14 flex items-center justify-center rounded-xl text-xl font-bold font-mono border-2 transition-all duration-300 ${
            answer !== null
              ? 'bg-neon-purple/20 border-neon-purple text-white'
              : 'bg-navy-800 border-dashed border-neon-blue/40 text-neon-blue/30'
          }`}
          animate={answer !== null ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {answer !== null ? answer : '?'}
        </motion.div>
      </div>

      {/* Multiple choice options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const isSelected = answer === opt
          const isCorrect = isCompleted && opt === puzzle.answer
          const isWrong = isCompleted && isSelected && opt !== puzzle.answer

          return (
            <motion.button
              key={i}
              onClick={() => !isCompleted && onSelectAnswer(opt)}
              className={`py-4 px-6 rounded-xl text-2xl font-bold font-mono border-2 transition-all duration-200
                ${isCorrect ? 'bg-neon-green/20 border-neon-green text-neon-green' : ''}
                ${isWrong ? 'bg-red-900/30 border-red-500 text-red-400' : ''}
                ${isSelected && !isCompleted ? 'bg-neon-purple/20 border-neon-purple text-white' : ''}
                ${!isSelected && !isCompleted ? 'bg-navy-700 border-navy-600 text-white hover:border-neon-blue/60 hover:bg-navy-600' : ''}
              `}
              whileHover={!isCompleted ? { scale: 1.03 } : {}}
              whileTap={!isCompleted ? { scale: 0.97 } : {}}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              disabled={isCompleted}
            >
              {opt}
            </motion.button>
          )
        })}
      </div>

      <p className="text-center text-xs text-gray-500 mt-6">Choose the next number in the sequence</p>
    </div>
  )
}
