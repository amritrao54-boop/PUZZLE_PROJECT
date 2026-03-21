import { generatePatternMatch, validatePatternMatch } from '../engine/patternMatch'
import { generateSeed } from '../engine/seedEngine'

describe('patternMatch', () => {
  const seed = generateSeed('2024-02-16')
  const puzzle = generatePatternMatch(seed)

  test('puzzle has a sequence, answer, type, and options', () => {
    expect(puzzle.sequence).toBeInstanceOf(Array)
    expect(typeof puzzle.answer).toBe('number')
    expect(typeof puzzle.type).toBe('string')
    expect(puzzle.options).toBeInstanceOf(Array)
  })

  test('options array has 4 choices', () => {
    expect(puzzle.options).toHaveLength(4)
  })

  test('correct answer is among options', () => {
    expect(puzzle.options).toContain(puzzle.answer)
  })

  test('all options are positive numbers', () => {
    puzzle.options.forEach((o) => {
      expect(typeof o).toBe('number')
      expect(o).toBeGreaterThan(0)
    })
  })

  test('same seed is deterministic', () => {
    const seed2 = generateSeed('2024-02-16')
    const puzzle2 = generatePatternMatch(seed2)
    expect(puzzle.answer).toBe(puzzle2.answer)
  })

  test('validatePatternMatch accepts correct answer', () => {
    expect(validatePatternMatch(puzzle.answer, puzzle.answer)).toBe(true)
  })

  test('validatePatternMatch rejects wrong answer', () => {
    expect(validatePatternMatch(puzzle.answer + 1, puzzle.answer)).toBe(false)
  })

  test('validatePatternMatch handles string-to-number coercion', () => {
    expect(validatePatternMatch(String(puzzle.answer), puzzle.answer)).toBe(true)
  })
})
