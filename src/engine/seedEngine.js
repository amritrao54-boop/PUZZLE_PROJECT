import CryptoJS from 'crypto-js'

const SECRET_KEY = 'LOGIC_LOOPER_V1'

/**
 * Generate a deterministic integer seed from a date string.
 * Same date always produces the same seed (for all users).
 * @param {string} dateStr - "YYYY-MM-DD"
 * @returns {number} seed integer
 */
export function generateSeed(dateStr) {
  const hash = CryptoJS.SHA256(dateStr + SECRET_KEY).toString(CryptoJS.enc.Hex)
  // Take first 8 hex chars → 32-bit integer
  return parseInt(hash.slice(0, 8), 16)
}

/**
 * Seeded pseudo-random number generator (Mulberry32).
 * @param {number} seed
 * @returns {() => number} function returning [0, 1)
 */
export function createRng(seed) {
  let s = seed >>> 0
  return function () {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 0x100000000
  }
}

/**
 * Pick a puzzle type for a given date (cycles through types).
 * @param {string} dateStr
 * @returns {'number-matrix'|'pattern-match'}
 */
export function getPuzzleTypeForDate(dateStr) {
  const seed = generateSeed(dateStr)
  const types = ['number-matrix', 'pattern-match']
  return types[seed % types.length]
}
