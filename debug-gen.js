import { generateSeed } from './src/engine/seedEngine.js';
import { generateNumberMatrix, getConflicts } from './src/engine/numberMatrix.js';

function testGenerator() {
  console.log('--- Testing Number Matrix Generator ---');
  for (let i = 0; i < 100; i++) {
    const seed = generateSeed('test-date-' + i);
    const { grid, solution, clues } = generateNumberMatrix(seed);

    // 1. Check for 0s in solution
    for (const row of solution) {
      if (row.includes(0)) {
        console.error('FAIL: Solution contains 0 at seed', seed);
        process.exit(1);
      }
      if (row.some(v => v === undefined)) {
        console.error('FAIL: Solution contains undefined at seed', seed);
        process.exit(1);
      }
    }

    // 2. Check conflicts in solution
    const conflicts = getConflicts(solution);
    if (conflicts.some(row => row.some(v => v === true))) {
      console.error('FAIL: Solution has internal conflicts at seed', seed);
      console.log('Solution:', solution);
      process.exit(1);
    }
  }
  console.log('SUCCESS: Generated 100 valid puzzles without conflicts or 0s.');
}

testGenerator();
