import { validateNumberMatrix } from './numberMatrix'
import { validatePatternMatch } from './patternMatch'

/**
 * Unified solution validator.
 * @param {'number-matrix'|'pattern-match'} type
 * @param {object} puzzle - puzzle object from generator
 * @param {*} answer - user-submitted answer
 * @returns {boolean}
 */
export function validateSolution(type, puzzle, answer) {
  switch (type) {
    case 'number-matrix':
      return validateNumberMatrix(answer, puzzle.solution)
    case 'pattern-match':
      return validatePatternMatch(answer, puzzle.answer)
    default:
      return false
  }
}
