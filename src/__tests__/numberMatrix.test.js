import { generateNumberMatrix, validateNumberMatrix, getConflicts } from '../engine/numberMatrix'
import { generateSeed } from '../engine/seedEngine'

describe('numberMatrix', () => {
  const seed = generateSeed('2024-02-16')
  const { grid, solution, clues } = generateNumberMatrix(seed)

  test('solution is a 4x4 grid', () => {
    expect(solution).toHaveLength(4)
    solution.forEach((row) => expect(row).toHaveLength(4))
  })

  test('solution contains only digits 1-4', () => {
    solution.forEach((row) => {
      row.forEach((val) => {
        expect(val).toBeGreaterThanOrEqual(1)
        expect(val).toBeLessThanOrEqual(4)
      })
    })
  })

  test('each row has digits 1-4 exactly once', () => {
    solution.forEach((row) => {
      expect([...new Set(row)].sort()).toEqual([1, 2, 3, 4])
    })
  })

  test('each column has digits 1-4 exactly once', () => {
    for (let c = 0; c < 4; c++) {
      const col = solution.map((r) => r[c])
      expect([...new Set(col)].sort()).toEqual([1, 2, 3, 4])
    }
  })

  test('same seed, same puzzle (deterministic)', () => {
    const seed2 = generateSeed('2024-02-16')
    const { solution: sol2 } = generateNumberMatrix(seed2)
    expect(solution).toEqual(sol2)
  })

  test('different seeds produce different puzzles', () => {
    const seed2 = generateSeed('2024-02-17')
    const { solution: sol2 } = generateNumberMatrix(seed2)
    expect(solution).not.toEqual(sol2)
  })

  test('initial grid has 8 given clues', () => {
    let givenCount = 0
    clues.forEach((row) => row.forEach((v) => { if (v) givenCount++ }))
    expect(givenCount).toBe(8)
  })

  test('validateNumberMatrix accepts correct solution', () => {
    expect(validateNumberMatrix(solution, solution)).toBe(true)
  })

  test('validateNumberMatrix rejects wrong solution', () => {
    const wrong = solution.map((r) => [...r])
    wrong[0][0] = (solution[0][0] % 4) + 1 // change one cell
    expect(validateNumberMatrix(wrong, solution)).toBe(false)
  })

  test('getConflicts returns empty for valid grid', () => {
    const conflicts = getConflicts(solution)
    conflicts.forEach((row) => row.forEach((v) => expect(v).toBe(false)))
  })

  test('getConflicts detects duplicate in row', () => {
    const bad = solution.map((r) => [...r])
    bad[0][0] = bad[0][1] // duplicate in row 0
    const conflicts = getConflicts(bad)
    expect(conflicts[0][0] || conflicts[0][1]).toBe(true)
  })
})
