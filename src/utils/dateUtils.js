import dayjs from 'dayjs'

/**
 * Get today's date string "YYYY-MM-DD" in local time.
 */
export function getTodayStr() {
  return dayjs().format('YYYY-MM-DD')
}

/**
 * Get a date string N days ago.
 * @param {number} n
 */
export function getDaysAgo(n) {
  return dayjs().subtract(n, 'day').format('YYYY-MM-DD')
}

/**
 * Get array of last N date strings (newest first).
 * @param {number} n
 */
export function getLastNDates(n) {
  return Array.from({ length: n }, (_, i) => getDaysAgo(i))
}

/**
 * Get array of 365 date strings ending today (oldest first, for heatmap).
 */
export function getLast365Dates() {
  const dates = []
  for (let i = 364; i >= 0; i--) {
    dates.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'))
  }
  return dates
}

/**
 * Check if two date strings are consecutive days.
 */
export function areConsecutiveDays(dateStr1, dateStr2) {
  const d1 = dayjs(dateStr1)
  const d2 = dayjs(dateStr2)
  return Math.abs(d1.diff(d2, 'day')) === 1
}

/**
 * Get day-of-week (0=Sun, 6=Sat) for a date string.
 */
export function getDayOfWeek(dateStr) {
  return dayjs(dateStr).day()
}

/**
 * Format date for display.
 */
export function formatDate(dateStr) {
  return dayjs(dateStr).format('MMM D, YYYY')
}

/**
 * Check if a year is a leap year.
 */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
