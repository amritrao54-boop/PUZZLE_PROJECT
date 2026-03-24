import { createRng } from './seedEngine.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_4x4 = [
  [1, 2, 3, 4],
  [3, 4, 1, 2],
  [2, 1, 4, 3],
  [4, 3, 2, 1],
]

const BASE_6x6 = [
  [1, 2, 3, 4, 5, 6],
  [4, 5, 6, 1, 2, 3],
  [2, 3, 1, 5, 6, 4],
  [5, 6, 4, 2, 3, 1],
  [3, 1, 2, 6, 4, 5],
  [6, 4, 5, 3, 1, 2],
]

// ─── Generator ────────────────────────────────────────────────────────────────

/**
 * Generate a Number Matrix puzzle.
 * @param {number} seed
 * @param {number} size - 4 or 6
 * @returns {{ grid: number[][], solution: number[][], clues: boolean[][] }}
 */
export function generateNumberMatrix(seed, size = 4) {
  const rng = createRng(seed)
  const is4x4 = size === 4
  const boxR = is4x4 ? 2 : 2 // box height
  const boxC = is4x4 ? 2 : 3 // box width
  const base = is4x4 ? BASE_4x4 : BASE_6x6

  const swap = (arr, i, j) => { ;[arr[i], arr[j]] = [arr[j], arr[i]] }
  
  // Transform base grid
  let grid = base.map(r => [...r])

  // 1. Shuffle rows within bands
  for (let i = 0; i < size; i += boxR) {
    if (rng() > 0.5) swap(grid, i, i + 1)
  }

  // 2. Shuffle columns within bands
  for (let i = 0; i < size; i += boxC) {
    if (rng() > 0.5) {
      grid = grid.map(r => {
        const next = [...r]
        ;[next[i], next[i+1]] = [next[i+1], next[i]]
        return next
      })
    }
  }

  // 3. Digit permutation
  const digits = Array.from({length: size}, (_, i) => i + 1)
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    swap(digits, i, j)
  }
  const solution = grid.map(row => row.map(v => digits[v - 1]))

  // 4. Clue generation
  // 4x4: 8 clues. 6x6: 18 clues.
  const clueCount = is4x4 ? 8 : 18
  const clues = Array.from({ length: size }, () => Array(size).fill(false))
  const positions = []
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) positions.push([r, c])

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    swap(positions, i, j)
  }

  positions.slice(0, clueCount).forEach(([r, c]) => (clues[r][c] = true))
  const initialGrid = solution.map((row, r) => row.map((v, c) => (clues[r][c] ? v : 0)))

  return { grid: initialGrid, solution, clues }
}

// ─── Validator ────────────────────────────────────────────────────────────────

export function validateNumberMatrix(answer, solution) {
  const size = solution.length
  if (!answer || answer.length !== size) return false

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (answer[r][c] === 0) return false
    }
  }

  const conflicts = getConflicts(answer)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (conflicts[r][c]) return false
    }
  }

  return true
}

export function getConflicts(grid) {
  const size = grid.length
  const conflicts = Array.from({ length: size }, () => Array(size).fill(false))
  const is4x4 = size === 4
  const boxR = is4x4 ? 2 : 2
  const boxC = is4x4 ? 2 : 3

  const markConflict = (cells) => {
    const seen = {}
    cells.forEach(([r, c]) => {
      const v = grid[r][c]
      if (v === 0) return
      if (seen[v] !== undefined) {
        conflicts[r][c] = true
        conflicts[seen[v][0]][seen[v][1]] = true
      } else {
        seen[v] = [r, c]
      }
    })
  }

  // Rows
  for (let r = 0; r < size; r++) markConflict(Array.from({length: size}, (_, c) => [r, c]))
  // Columns
  for (let c = 0; c < size; c++) markConflict(Array.from({length: size}, (_, r) => [r, c]))
  // Boxes
  for (let br = 0; br < size / boxR; br++) {
    for (let bc = 0; bc < size / boxC; bc++) {
      const cells = []
      for (let r = br * boxR; r < (br + 1) * boxR; r++) {
        for (let c = bc * boxC; c < (bc + 1) * boxC; c++) {
          cells.push([r, c])
        }
      }
      markConflict(cells)
    }
  }

  return conflicts
}
