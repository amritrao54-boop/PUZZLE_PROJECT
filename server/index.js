const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');

app.use(cors());
app.use(express.json());

// Serve static files from the React app dist folder
app.use(express.static(path.join(__dirname, '../dist')));

const SECRET_KEY = 'LOGIC_LOOPER_V1';

/**
 * Deterministic seed generation (matches client-side logic)
 */
function generateSeed(dateStr) {
  const hash = crypto.createHash('sha256').update(dateStr + SECRET_KEY).digest('hex');
  return parseInt(hash.slice(0, 8), 16);
}

function getPuzzleTypeForDate(dateStr) {
  const seed = generateSeed(dateStr);
  const types = ['number-matrix', 'pattern-match'];
  return types[seed % types.length];
}

// Mock Auth Middleware
const authMiddleware = async (req, res, next) => {
  let userId = req.headers['x-user-id'];
  
  if (!userId) {
    const guestUser = await prisma.user.upsert({
      where: { id: 'guest-id-123' },
      update: {},
      create: {
        id: 'guest-id-123',
        name: 'Guest Player',
        isGuest: true,
      },
    });
    userId = guestUser.id;
  }
  
  req.userId = userId;
  next();
};

// --- API Endpoints ---

// Get Daily Puzzle Configuration
app.get('/api/daily-puzzle', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const type = getPuzzleTypeForDate(today);
  const seed = generateSeed(today);
  
  res.json({
    date: today,
    type,
    seed,
    version: 'v1'
  });
});

// Get Global Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const topScores = await prisma.dailyScore.findMany({
      orderBy: [
        { score: 'desc' },
        { timeTaken: 'asc' }
      ],
      take: 10,
      include: {
        user: {
          select: { name: true, isGuest: true }
        }
      }
    });

    const formatted = topScores.map((s, i) => ({
      rank: i + 1,
      name: s.user.name,
      score: s.score,
      timeTaken: s.timeTaken,
      date: s.date,
      isGuest: s.user.isGuest
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Sync Daily Score
app.post('/api/sync/daily-scores', authMiddleware, async (req, res) => {
  const { date, score, timeTaken, difficulty } = req.body;
  const userId = req.userId;

  if (!date || score === undefined || !timeTaken || !difficulty) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const today = new Date().toISOString().split('T')[0];
  if (date > today) {
    return res.status(400).json({ error: 'Cannot sync future dates' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const dailyScore = await tx.dailyScore.upsert({
        where: {
          userId_date: { userId, date },
        },
        update: {
          score,
          timeTaken,
          difficulty,
          syncedAt: new Date(),
        },
        create: {
          userId,
          date,
          score,
          timeTaken,
          difficulty,
        },
      });

      const userScores = await tx.dailyScore.findMany({
        where: { userId },
        select: { score: true },
      });

      const totalSolved = userScores.length;
      const avgScore = totalSolved > 0 
        ? userScores.reduce((sum, s) => sum + s.score, 0) / totalSolved 
        : 0;

      const user = await tx.user.update({
        where: { id: userId },
        data: {
          totalSolved,
          avgScore,
        },
      });

      return { dailyScore, user };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Internal server error during sync' });
  }
});

// Get User Profile & Stats
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        scores: {
          orderBy: { date: 'desc' },
          take: 365,
        },
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Catch-all to serve React's index.html for any other routes
app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
