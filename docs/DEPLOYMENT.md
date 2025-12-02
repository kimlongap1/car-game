# Deployment Guide

Deploy your car game to production.

---

## Table of Contents

1. [Quick Deploy](#quick-deploy)
2. [GitHub Pages](#github-pages)
3. [Vercel](#vercel)
4. [Custom Domain](#custom-domain)

---

## Quick Deploy

Your game is already prepared for deployment.

**Files to deploy**:
- `car-game.html` - Main game
- `index.html` - Landing page

**Already configured**:
- ✅ N8N webhook URL
- ✅ Responsive design
- ✅ No build step needed

---

## GitHub Pages

### Deploy in 1 Minute

1. Push code to GitHub (already done ✓)
2. Go to repo settings → Pages
3. Set source to `main` branch
4. Save

**Your game will be live at**:
```
https://kimlongap1.github.io/car-game
```

---

## Vercel

### Deploy in 2 Minutes

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import GitHub repo: `car-game`
4. Click **"Deploy"**

**Your game will be live at**:
```
https://car-game-{your-name}.vercel.app
```

---

## Custom Domain

### Point Domain to GitHub Pages

If you have a custom domain (e.g., `carpame.dev`):

1. Go to domain registrar settings
2. Add DNS record:
   - **Type**: A
   - **Name**: @
   - **Value**: `185.199.108.153`
3. Wait 24 hours for propagation
4. Go to GitHub repo → Settings → Pages
5. Add custom domain in Pages settings

---

## Testing After Deployment

### Test 1: Load Game
- Visit deployed URL
- Game should load

### Test 2: Play a Game
- Click a game mode
- Should load cards from N8N
- Play 3 rounds
- Should complete successfully

### Test 3: Check N8N
- Open N8N dashboard
- See requests in logs
- Verify webhook is working

### Test 4: Database (if enabled)
- Open Supabase
- Play game on deployed site
- Check if data appears in database

---

## Troubleshooting

### Game Won't Load

**Check**:
1. Browser console (F12)
2. Network tab for failed requests
3. File paths are correct

### N8N Not Responding

**Check**:
1. Webhook URL is correct in game
2. N8N workflow is active
3. Try test with curl

### Custom Domain Not Working

**Check**:
1. DNS records are set
2. Wait 24 hours for propagation
3. Flush DNS cache

---

## Summary

| Platform | Time | Cost | Features |
|----------|------|------|----------|
| GitHub Pages | 1 min | Free | Static hosting, fast |
| Vercel | 2 min | Free | Static hosting, fast, CDN |
| Custom Domain | - | $10-15/yr | Professional look |

**Recommendation**: Use Vercel for best performance.

---

**Next**: [DATABASE_SETUP.md](./DATABASE_SETUP.md) to add progress tracking
