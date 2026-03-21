import { openDB } from 'idb'
import LZString from 'lz-string'

const DB_NAME = 'logic-looper-db'
const DB_VERSION = 1

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Daily activity store
        if (!db.objectStoreNames.contains('dailyActivity')) {
          const activityStore = db.createObjectStore('dailyActivity', { keyPath: 'date' })
          activityStore.createIndex('synced', 'synced')
        }
        // Puzzle progress store
        if (!db.objectStoreNames.contains('puzzleProgress')) {
          db.createObjectStore('puzzleProgress', { keyPath: 'date' })
        }
        // Achievements store
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

// ─── Daily Activity ───────────────────────────────────────────────────────────

/**
 * @typedef {Object} DailyActivity
 * @property {string} date - "YYYY-MM-DD"
 * @property {boolean} solved
 * @property {number} score
 * @property {number} timeTaken - seconds
 * @property {number} difficulty - 1-5
 * @property {boolean} synced
 */

export async function saveDailyActivity(activity) {
  const db = await getDB()
  return db.put('dailyActivity', activity)
}

export async function getDailyActivity(dateStr) {
  const db = await getDB()
  return db.get('dailyActivity', dateStr)
}

export async function getAllActivity() {
  const db = await getDB()
  return db.getAll('dailyActivity')
}

export async function getUnsynced() {
  const db = await getDB()
  const index = (await db).transaction('dailyActivity').store.index('synced')
  return index.getAll(false)
}

export async function deleteDailyActivity(dateStr) {
  const db = await getDB()
  return db.delete('dailyActivity', dateStr)
}

export async function markSynced(dateStr) {
  const db = await getDB()
  const activity = await db.get('dailyActivity', dateStr)
  if (activity) {
    await db.put('dailyActivity', { ...activity, synced: true })
  }
}

// ─── Puzzle Progress ──────────────────────────────────────────────────────────

/**
 * Save partial puzzle progress (compressed).
 */
export async function savePuzzleProgress(dateStr, progress) {
  const db = await getDB()
  const compressed = LZString.compress(JSON.stringify(progress))
  return db.put('puzzleProgress', { date: dateStr, data: compressed, updatedAt: Date.now() })
}

/**
 * Load partial puzzle progress.
 */
export async function loadPuzzleProgress(dateStr) {
  const db = await getDB()
  const record = await db.get('puzzleProgress', dateStr)
  if (!record) return null
  try {
    return JSON.parse(LZString.decompress(record.data))
  } catch {
    return null
  }
}

export async function clearPuzzleProgress(dateStr) {
  const db = await getDB()
  return db.delete('puzzleProgress', dateStr)
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export async function saveAchievement(achievement) {
  const db = await getDB()
  return db.put('achievements', achievement)
}

export async function getAchievements() {
  const db = await getDB()
  return db.getAll('achievements')
}
