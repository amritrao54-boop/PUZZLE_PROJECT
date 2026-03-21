import { createRng } from './seedEngine.js'

const PATTERN_TEMPLATES = [
  // Arithmetic sequences
  {
    type: 'arithmetic',
    generate: (rng) => {
      const start = Math.floor(rng() * 20) + 1
      const diff = Math.floor(rng() * 8) + 2
      const seq = Array.from({ length: 7 }, (_, i) => start + i * diff)
      return { sequence: seq.slice(0, 5), answer: seq[5], full: seq }
    },
  },
  // Geometric sequences
  {
    type: 'geometric',
    generate: (rng) => {
      const start = Math.floor(rng() * 5) + 1
      const ratio = Math.floor(rng() * 3) + 2
      const seq = Array.from({ length: 6 }, (_, i) => start * Math.pow(ratio, i))
      return { sequence: seq.slice(0, 4), answer: seq[4], full: seq }
    },
  },
  // Fibonacci-like
  {
    type: 'fibonacci',
    generate: (rng) => {
      const a = Math.floor(rng() * 5) + 1
      const b = Math.floor(rng() * 5) + 2
      const seq = [a, b]
      for (let i = 2; i < 7; i++) seq.push(seq[i - 1] + seq[i - 2])
      return { sequence: seq.slice(0, 5), answer: seq[5], full: seq }
    },
  },
  // Square numbers offset
  {
    type: 'squares',
    generate: (rng) => {
      const offset = Math.floor(rng() * 10)
      const seq = Array.from({ length: 6 }, (_, i) => (i + 1) * (i + 1) + offset)
      return { sequence: seq.slice(0, 4), answer: seq[4], full: seq }
    },
  },
  // Alternating add/subtract
  {
    type: 'alternating',
    generate: (rng) => {
      const start = Math.floor(rng() * 30) + 10
      const add = Math.floor(rng() * 7) + 3
      const sub = Math.floor(rng() * 5) + 1
      const seq = [start]
      for (let i = 1; i < 7; i++) {
        seq.push(i % 2 === 0 ? seq[i - 1] - sub : seq[i - 1] + add)
      }
      return { sequence: seq.slice(0, 5), answer: seq[5], full: seq }
    },
  },
]

/**
 * Generate a Pattern Match puzzle (next-in-sequence).
 * @param {number} seed
 * @returns {{ sequence: number[], answer: number, type: string, options: number[] }}
 */
export function generatePatternMatch(seed) {
  const rng = createRng(seed)
  const templateIdx = Math.floor(rng() * PATTERN_TEMPLATES.length)
  const template = PATTERN_TEMPLATES[templateIdx]
  const { sequence, answer } = template.generate(rng)
  const type = template.type

  // Generate exactly 3 wrong options using deterministic offsets from the answer
  // Using alternating positive/negative offsets of increasing size to guarantee uniqueness
  const offsets = [3, -3, 7, -7, 11, -11, 15, -15, 20, -20, 25, -25]
  const wrongOptions = []
  for (const offset of offsets) {
    const candidate = answer + offset
    if (candidate > 0 && candidate !== answer && !wrongOptions.includes(candidate)) {
      wrongOptions.push(candidate)
      if (wrongOptions.length === 3) break
    }
  }

  // Build final options array and shuffle
  const allOptions = [answer, ...wrongOptions]
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]]
  }

  return { sequence, answer, type, options: allOptions }
}

/**
 * Validate a pattern match answer.
 * @param {number} userAnswer
 * @param {number} correctAnswer
 * @returns {boolean}
 */
export function validatePatternMatch(userAnswer, correctAnswer) {
  return Number(userAnswer) === Number(correctAnswer)
}
