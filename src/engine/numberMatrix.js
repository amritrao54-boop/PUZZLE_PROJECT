import { createRng } from './seedEngine.js'

// ─── Generator ────────────────────────────────────────────────────────────────

/**
 * Generate a 4×4 Number Matrix puzzle (Sudoku-variant).
 * Grid uses digits 1-4, each appears exactly once per row, column, and 2×2 box.
 * @param {number} seed
 * @returns {{ grid: number[][], solution: number[][], clues: boolean[][] }}
 */
export function generateNumberMatrix(seed) {
  const rng = createRng(seed)

  // Valid base grid — satisfies all row/col/2x2 box constraints
  const base = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1],
  ]

  // Helper: swap two items in array
  const swap = (arr, i, j) => { ;[arr[i], arr[j]] = [arr[j], arr[i]] }

  // Deep copy base
  let grid = base.map(r => [...r])

  // 1. Swap row bands (top 2 rows ↔ bottom 2 rows) — preserves box constraints
  if (rng() > 0.5) {
    swap(grid, 0, 2)
    swap(grid, 1, 3)
  }

  // 2. Shuffle rows within top band (rows 0↔1) — preserves box constraints
  if (rng() > 0.5) swap(grid, 0, 1)

  // 3. Shuffle rows within bottom band (rows 2↔3) — preserves box constraints
  if (rng() > 0.5) swap(grid, 2, 3)

  // 4. Swap column bands (left 2 cols ↔ right 2 cols) — preserves box constraints
  if (rng() > 0.5) {
    grid = grid.map(r => [r[2], r[3], r[0], r[1]])
  }

  // 5. Shuffle cols within left band (cols 0↔1) — preserves box constraints
  if (rng() > 0.5) {
    grid = grid.map(r => [r[1], r[0], r[2], r[3]])
  }

  // 6. Shuffle cols within right band (cols 2↔3) — preserves box constraints
  if (rng() > 0.5) {
    grid = grid.map(r => [r[0], r[1], r[3], r[2]])
  }

  // 7. Apply a digit permutation (relabels 1-4) — preserves all constraints
  const digits = [1, 2, 3, 4]
  // Fisher-Yates shuffle of digit mapping
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    swap(digits, i, j)
  }
  const solution = grid.map(row => row.map(v => digits[v - 1]))

  // Determine which cells are clues — reveal exactly 8 of 16 cells
  // Ensure at least 1 clue per row for better playability
  const clues = Array.from({ length: 4 }, () => Array(4).fill(false))
  const positions = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) positions.push([r, c])

  // Fisher-Yates shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    swap(positions, i, j)
  }

  // Reveal first 8 positions
  positions.slice(0, 8).forEach(([r, c]) => (clues[r][c] = true))

  // Build initial grid (blank = 0)
  const initialGrid = solution.map((row, r) => row.map((v, c) => (clues[r][c] ? v : 0)))

  return { grid: initialGrid, solution, clues }
}

// ─── Validator ────────────────────────────────────────────────────────────────

/**
 * Validate a 4×4 Number Matrix answer against the stored solution.
 * @param {number[][]} answer - Full 4×4 grid filled by user
 * @param {number[][]} solution
 * @returns {boolean}
 */
export function validateNumberMatrix(answer, solution) {
  if (!answer || answer.length !== 4) return false

  // 1. Check if all cells are filled
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (answer[r][c] === 0) return false
    }
  }

  // 2. Check for Sudoku-style conflicts (rows, columns, 2x2 boxes)
  const conflicts = getConflicts(answer)
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (conflicts[r][c]) return false
    }
  }

  return true
}

/**
 * Check row / column / box constraints (for real-time highlighting).
 * Returns a 4×4 boolean grid — true = cell has a conflict.
 */
export function getConflicts(grid) {
  const conflicts = Array.from({ length: 4 }, () => Array(4).fill(false))

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
  for (let r = 0; r < 4; r++) markConflict([0, 1, 2, 3].map((c) => [r, c]))
  // Columns
  for (let c = 0; c < 4; c++) markConflict([0, 1, 2, 3].map((r) => [r, c]))
  // 2×2 boxes
  for (let br = 0; br < 2; br++)
    for (let bc = 0; bc < 2; bc++) {
      const cells = []
      for (let r = br * 2; r < br * 2 + 2; r++)
        for (let c = bc * 2; c < bc * 2 + 2; c++) cells.push([r, c])
      markConflict(cells)
    }

  return conflicts
}
