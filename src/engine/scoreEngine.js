/**
 * Calculate score based on base points, time taken, and hints used.
 * @param {number} timeSec - seconds taken to solve
 * @param {number} hintsUsed - number of hints used (0-3)
 * @param {number} difficulty - 1-5 difficulty level
 * @returns {number} integer score
 */
export function calcScore(timeSec, hintsUsed, difficulty = 3) {
  const BASE_SCORE = 1000
  const HINT_PENALTY = 100
  const MIN_SCORE = 100

  // Time multiplier: full points under 60s, degrades linearly to 0.2x at 300s
  const timeMultiplier = Math.max(0.2, 1 - (timeSec - 60) / 300)

  // Difficulty bonus: 1.0x to 2.0x
  const difficultyBonus = 1 + (difficulty - 1) * 0.25

  const raw = BASE_SCORE * timeMultiplier * difficultyBonus - hintsUsed * HINT_PENALTY
  return Math.max(MIN_SCORE, Math.round(raw))
}

/**
 * Determine intensity level (0-4) for heatmap from score.
 * @param {number|null} score
 * @returns {0|1|2|3|4}
 */
export function scoreToIntensity(score) {
  if (!score || score === 0) return 0
  if (score < 300) return 1
  if (score < 600) return 2
  if (score < 900) return 3
  return 4
}
