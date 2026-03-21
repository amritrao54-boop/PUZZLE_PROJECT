import { areConsecutiveDays, getTodayStr, getLast365Dates } from '../utils/dateUtils'

describe('dateUtils', () => {
  test('areConsecutiveDays: consecutive days returns true', () => {
    expect(areConsecutiveDays('2024-02-15', '2024-02-16')).toBe(true)
    expect(areConsecutiveDays('2024-02-16', '2024-02-15')).toBe(true)
  })

  test('areConsecutiveDays: non-consecutive returns false', () => {
    expect(areConsecutiveDays('2024-02-14', '2024-02-16')).toBe(false)
    expect(areConsecutiveDays('2024-02-16', '2024-02-18')).toBe(false)
  })

  test('areConsecutiveDays: same day returns false', () => {
    expect(areConsecutiveDays('2024-02-16', '2024-02-16')).toBe(false)
  })

  test('areConsecutiveDays: leap year boundary', () => {
    expect(areConsecutiveDays('2024-02-28', '2024-02-29')).toBe(true)
    expect(areConsecutiveDays('2024-02-29', '2024-03-01')).toBe(true)
  })

  test('getTodayStr returns YYYY-MM-DD format', () => {
    const today = getTodayStr()
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test('getLast365Dates returns exactly 365 dates', () => {
    const dates = getLast365Dates()
    expect(dates).toHaveLength(365)
  })

  test('getLast365Dates: last date is today', () => {
    const dates = getLast365Dates()
    expect(dates[dates.length - 1]).toBe(getTodayStr())
  })

  test('getLast365Dates: dates are in ascending order', () => {
    const dates = getLast365Dates()
    for (let i = 1; i < dates.length; i++) {
      expect(new Date(dates[i]).getTime()).toBeGreaterThan(new Date(dates[i - 1]).getTime())
    }
  })
})
