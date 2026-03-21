# 🚢 Logic Looper Deployment Guide

This document provides advanced instructions for deploying the Logic Looper project to various environments.

## 📋 Prerequisites
- Node.js (v18+)
- Prisma CLI (`npm install -g prisma`)
- A production database (PostgreSQL recommended for production, though SQLite is supported).

## 🗄️ Database Migration
When deploying, you should not use `prisma migrate dev`. Instead, use:

```bash
cd server
export DATABASE_URL="your_production_db_url"
npx prisma migrate deploy
```

## 🚀 Deployment Platforms

### 1. Render / Railway / Fly.io
Most of these platforms will automatically detect the `package.json` in the root.

**Root `package.json` Commands:**
- **Build Command**: `npm install && cd server && npm install && npx prisma generate && cd .. && npm run build`
- **Start Command**: `npm start` (which runs `cd server && node index.js`)

**Environment Variables**:
- `DATABASE_URL`: Your production connection string.
- `PORT`: Usually 10000 or 8080 (provided by the host).

### 2. Manual VPS (Nginx + PM2)
1. **Clone & Build**:
   ```bash
   git clone [repo-url]
   npm install
   npm run build
   cd server && npm install && npx prisma generate && npx prisma migrate deploy
   ```
2. **PM2 Setup**:
   ```bash
   pm2 start server/index.js --name logic-looper-api
   ```
3. **Nginx Reverse Proxy**:
   Point your domain to `http://localhost:5000`.

## 🔒 Security Best Practices
1. **Change SECRET_KEY**: In `server/index.js`, the `SECRET_KEY` is currently hardcoded for the demo. For production, move this to an environment variable:
   ```javascript
   const SECRET_KEY = process.env.SECRET_KEY || 'YOUR_PRODUCTION_SECRET';
   ```
2. **CORS**: Update the `cors()` middleware to restrict origins to your production domain only.
3. **HTTPS**: Ensure your production environment uses SSL (Certbot/Let's Encrypt).

## 🛠️ Infrastructure as Code (Optional)
If you require a Dockerfile or specialized configuration (Docker Compose, Terraform), please request it specifically.
