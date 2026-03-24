import { generateNumberMatrix, validateNumberMatrix, getConflicts } from '../engine/numberMatrix'
import { generateSeed } from '../engine/seedEngine'

describe('numberMatrix - 4x4', () => {
  const seed = generateSeed('2024-02-15') // Odd day = 4x4 in our logic if used in usePuzzle, but here we test directly
  const { solution, clues } = generateNumberMatrix(seed, 4)

  test('solution is a 4x4 grid', () => {
    expect(solution).toHaveLength(4)
    solution.forEach((row) => expect(row).toHaveLength(4))
  })

  test('each row has digits 1-4 exactly once', () => {
    solution.forEach((row) => {
      expect([...new Set(row)].sort()).toEqual([1, 2, 3, 4])
    })
  })

  test('initial grid has 8 given clues', () => {
    let givenCount = 0
    clues.forEach((row) => row.forEach((v) => { if (v) givenCount++ }))
    expect(givenCount).toBe(8)
  })
})

describe('numberMatrix - 6x6', () => {
  const seed = generateSeed('2024-02-16')
  const { solution, clues } = generateNumberMatrix(seed, 6)

  test('solution is a 6x6 grid', () => {
    expect(solution).toHaveLength(6)
    solution.forEach((row) => expect(row).toHaveLength(6))
  })

  test('each row has digits 1-6 exactly once', () => {
    solution.forEach((row) => {
      expect([...new Set(row)].sort()).toEqual([1, 2, 3, 4, 5, 6])
    })
  })

  test('each column has digits 1-6 exactly once', () => {
    for (let c = 0; c < 6; c++) {
      const col = solution.map((r) => r[c])
      expect([...new Set(col)].sort()).toEqual([1, 2, 3, 4, 5, 6])
    }
  })

  test('initial grid has 18 given clues', () => {
    let givenCount = 0
    clues.forEach((row) => row.forEach((v) => { if (v) givenCount++ }))
    expect(givenCount).toBe(18)
  })

  test('validateNumberMatrix accepts correct solution', () => {
    expect(validateNumberMatrix(solution, solution)).toBe(true)
  })

  test('getConflicts detects duplicates', () => {
    const bad = solution.map((r) => [...r])
    bad[0][0] = bad[0][1]
    const conflicts = getConflicts(bad)
    expect(conflicts[0][0]).toBe(true)
    expect(conflicts[0][1]).toBe(true)
  })
})
