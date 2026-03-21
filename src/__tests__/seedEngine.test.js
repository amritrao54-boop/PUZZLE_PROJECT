import { generateSeed, createRng, getPuzzleTypeForDate } from '../engine/seedEngine'

describe('seedEngine', () => {
  test('same date always produces same seed', () => {
    const seed1 = generateSeed('2024-02-16')
    const seed2 = generateSeed('2024-02-16')
    expect(seed1).toBe(seed2)
  })

  test('different dates produce different seeds', () => {
    const seed1 = generateSeed('2024-02-16')
    const seed2 = generateSeed('2024-02-17')
    expect(seed1).not.toBe(seed2)
  })

  test('seed is a positive integer', () => {
    const seed = generateSeed('2024-01-01')
    expect(typeof seed).toBe('number')
    expect(Number.isInteger(seed)).toBe(true)
    expect(seed).toBeGreaterThan(0)
  })

  test('createRng produces values in [0, 1)', () => {
    const rng = createRng(12345)
    for (let i = 0; i < 100; i++) {
      const val = rng()
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThan(1)
    }
  })

  test('createRng is deterministic', () => {
    const rng1 = createRng(99999)
    const rng2 = createRng(99999)
    expect(rng1()).toBe(rng2())
    expect(rng1()).toBe(rng2())
  })

  test('getPuzzleTypeForDate returns valid type', () => {
    const type = getPuzzleTypeForDate('2024-02-16')
    expect(['number-matrix', 'pattern-match']).toContain(type)
  })
})
