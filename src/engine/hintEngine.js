const DAILY_HINT_QUOTA = 3

/**
 * Get remaining hints for today from localStorage.
 * @param {string} dateStr "YYYY-MM-DD"
 * @returns {number}
 */
export function getRemainingHints(dateStr) {
  try {
    const key = `hints_${dateStr}`
    const used = parseInt(localStorage.getItem(key) || '0', 10)
    return Math.max(0, DAILY_HINT_QUOTA - used)
  } catch {
    return DAILY_HINT_QUOTA
  }
}

/**
 * Use one hint (decrements count). Returns false if none remaining.
 * @param {string} dateStr
 * @returns {boolean} success
 */
export function useHint(dateStr) {
  try {
    const key = `hints_${dateStr}`
    const used = parseInt(localStorage.getItem(key) || '0', 10)
    if (used >= DAILY_HINT_QUOTA) return false
    localStorage.setItem(key, String(used + 1))
    return true
  } catch {
    return false
  }
}

/**
 * Get total hints used today.
 * @param {string} dateStr
 * @returns {number}
 */
export function getHintsUsed(dateStr) {
  try {
    return parseInt(localStorage.getItem(`hints_${dateStr}`) || '0', 10)
  } catch {
    return 0
  }
}
