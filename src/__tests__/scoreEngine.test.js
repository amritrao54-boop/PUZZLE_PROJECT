import { calcScore, scoreToIntensity } from '../engine/scoreEngine'

describe('scoreEngine', () => {
  test('fast solve with no hints gives high score', () => {
    const score = calcScore(30, 0, 3)
    expect(score).toBeGreaterThan(700)
  })

  test('slow solve gives lower score than fast solve', () => {
    const fast = calcScore(30, 0, 3)
    const slow = calcScore(240, 0, 3)
    expect(fast).toBeGreaterThan(slow)
  })

  test('hints reduce score', () => {
    const noHints = calcScore(60, 0, 3)
    const withHints = calcScore(60, 3, 3)
    expect(noHints).toBeGreaterThan(withHints)
  })

  test('score is never below minimum (100)', () => {
    const score = calcScore(9999, 3, 1)
    expect(score).toBeGreaterThanOrEqual(100)
  })

  test('higher difficulty gives higher score', () => {
    const low = calcScore(60, 0, 1)
    const high = calcScore(60, 0, 5)
    expect(high).toBeGreaterThan(low)
  })

  test('scoreToIntensity: 0 for null/zero', () => {
    expect(scoreToIntensity(null)).toBe(0)
    expect(scoreToIntensity(0)).toBe(0)
  })

  test('scoreToIntensity: 4 for scores >= 900', () => {
    expect(scoreToIntensity(900)).toBe(4)
    expect(scoreToIntensity(1200)).toBe(4)
  })

  test('scoreToIntensity returns correct tiers', () => {
    expect(scoreToIntensity(100)).toBe(1)
    expect(scoreToIntensity(400)).toBe(2)
    expect(scoreToIntensity(700)).toBe(3)
    expect(scoreToIntensity(950)).toBe(4)
  })
})
