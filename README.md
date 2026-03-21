# 🧩 Logic Looper

Logic Looper is a premium daily brain puzzle application designed for consistent cognitive training. It features deterministic daily challenges, offline-first persistence, and seamless backend synchronization.

![Demo](.gemini/antigravity/brain/2fd86ebf-66bd-437c-854f-42339801347a/logic_looper_demo_1774016090823.webp)

## 🚀 Key Features

- **Daily Puzzles**: New challenges every day (Number Matrix & Pattern Match) generated from a deterministic seed.
- **Offline-First**: Powered by **IndexedDB**, the app works 100% offline with LZ-String compression for local storage.
- **Backend Sync**: Automatically syncs your scores and streaks to a Node.js/Express server whenever you're online.
- **Activity Heatmap**: Track your progress with a GitHub-style 365-day activity grid.
- **Streak System**: Build and maintain your daily puzzle streak to stay motivated.
- **Practice Mode**: Replay today's puzzle as many times as you like. Only the first successful solve is recorded, allowing for unlimited risk-free practice.
- **Premium UX**: Smooth animations with **Framer Motion** and a responsive layout tailored for all devices.

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite**
- **Redux Toolkit** (State Management)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **IndexedDB** (Local Persistence)
- **CryptoJS** (SHA-256 Seed Generation)

### Backend
- **Node.js** + **Express**
- **Prisma ORM**
- **SQLite** (Development Database)

## 🏁 Getting Started

### 1. Installation
Clone the repository and install dependencies in both the root and server directories:

```bash
# Root (Frontend)
npm install

# Server (Backend)
cd server
npm install
```

### 2. Database Setup
Initialize the SQLite database using Prisma:

```bash
cd server
npx prisma migrate dev --name init
```

### 3. Running the App
Start both the frontend and backend servers concurrently:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd server
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Development Flow
For local development with full features (sync, leaderboard):
1.  Ensure `server/dev.db` is initialized (Step 2).
2.  Ensure `server/.env` has `DATABASE_URL="file:./dev.db"`.
3.  Start backend (`cd server && npm run dev`).
4.  Start frontend (`npm run dev`).

## 🌐 Deployment Guide

### Frontend Deployment (Static Hosting)
The frontend is a Vite application. To deploy to Vercel, Netlify, or GitHub Pages:
1.  Run `npm run build`.
2.  The `dist` folder contains the static assets.
3.  Ensure your environment variables (if any) are configured in the hosting provider.

### Backend Deployment (Node.js)
To deploy the Express server (e.g., to Render, Railway, or VPS):
1.  **Environment Variables**: Set `DATABASE_URL` and `PORT`.
2.  **Build Step**:
    ```bash
    cd server
    npm install
    npx prisma generate
    npx prisma migrate deploy
    ```
3.  **Start Command**: `npm start` (runs `node index.js`).

### Full-Stack (Single Server)
If you want to host both on one server:
1.  Build the frontend: `npm run build`.
2.  The server in `server/index.js` is already configured to serve `../dist/index.html` for any non-API routes.
3.  Deploy the `logic-looper` folder, ensuring both `server/` and `dist/` are uploaded.
4.  Start with `npm start` from the root.


## 🧪 Testing
The project includes a comprehensive suite of unit tests for the puzzle engines, score systems, and date utilities.

```bash
npm test
```
*Current status: 41/41 tests passing.*

## 🧹 Maintenance & Diagnostics
- **Replay (Practice)**: After completing a puzzle, use this button to reset the board for practice without affecting your official score.
- **Reset Board**: If you encounter local data corruption, use the "Reset Board" button on the game page.
- **Clear Conflicts**: Use the 🧹 helper to clear incorrect entries while preserving fixed clues.

---
Created with ❤️ by Antigravity.
