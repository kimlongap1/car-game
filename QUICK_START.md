# Quick Start - Car Game with N8N Integration

## Files Overview
```
car-game/
├── car-game.html              ✅ Main game (22KB)
├── N8N_SETUP_GUIDE.md         📖 Full setup instructions
├── car-game-workflow.json     🔧 Import this into n8n (optional)
└── QUICK_START.md             👈 You are here
```

## Webhook Status
- **URL**: `https://n8n-new.vibookers.com/webhook-test/car-game`
- **Status**: ✅ Configured in car-game.html
- **Status**: ⏳ Needs workflow activation in n8n

## Fast Setup (5 minutes)

### Step 1: Open N8N
```
https://n8n-new.vibookers.com/
```

### Step 2: Create Workflow
1. Click **+ New Workflow**
2. Name: `car-game-backend`
3. Save

### Step 3: Add Webhook
1. **+ Add Node** → Search **Webhook**
2. Set:
   - HTTP Method: **POST**
   - Path: **car-game**
3. Save

### Step 4: Add Response (Simple Path)
1. **+ Add Node** → Search **Respond to Webhook**
2. Leave as default (responds with first input as JSON)

### Step 5: Connect
- Drag line from **Webhook** to **Respond to Webhook**

### Step 6: Test
1. Click **Save**
2. Click the **Execute Workflow** button (▶️)
3. Workflow is now LIVE

### Step 7: Test in Game
```bash
# Test from terminal
curl -X POST https://n8n-new.vibookers.com/webhook-test/car-game \
  -H "Content-Type: application/json" \
  -d '{"action":"get_cards","game_type":"which-car","difficulty":1,"session_score":{"correct":0,"total":0}}'
```

Expected: You should get a response

### Step 8: Play Game
1. Open `car-game.html` in browser
2. Click any game
3. Cards should load!

## Advanced Setup (Optional - with AI)

Want Claude to generate dynamic cards? Follow these steps:

### Add Claude Node
1. **+ Add Node** → Search **Anthropic Claude**
2. Add API Key credential
3. Model: `claude-3-5-sonnet-20241022`
4. Messages prompt: (See N8N_SETUP_GUIDE.md)

### Add Format Node
1. **+ Add Node** → Search **Set**
2. Add field: `cards` = JSON array from Claude

### Connect
- Webhook → Claude → Set → Respond to Webhook

## Game Features

### 1. Which Car Game
- Identify colored cars
- 3 rounds
- Success: Shows 🎉
- Tracks accuracy

### 2. Car Sounds Game
- Tap cars to hear sounds
- Endless play
- No API needed - uses built-in sounds

### 3. Fix the Car Game
- Select car parts
- 3 rounds
- Success: Shows ⭐
- Tracks accuracy

## Troubleshooting

### "webhook not registered" error
- Make sure workflow is **Saved**
- Make sure you clicked **Execute Workflow** (▶️)

### No cards appear in game
- Open browser console: **F12**
- Check for error messages
- Make sure webhook URL is correct

### Test webhook locally
```bash
curl -X POST https://n8n-new.vibookers.com/webhook-test/car-game \
  -H "Content-Type: application/json" \
  -d '{"test":"true"}'
```

## Game Works Without N8N!
The game has **fallback cards** built-in. If n8n is down:
- Game still works
- Uses static cards
- Shows console warning: "n8n fetch failed, using fallback cards"

## Deployment

### Local Testing
```bash
python3 -m http.server 8000
# Open: http://localhost:8000/car-game.html
```

### Online Hosting
- **GitHub Pages**: Upload car-game.html, enable Pages
- **Vercel**: Connect GitHub, auto-deploys
- **Any static host**: Just upload HTML file

## Files Ready to Use

✅ **car-game.html** - Complete game with webhook configured
✅ **N8N_SETUP_GUIDE.md** - Full step-by-step guide
✅ **car-game-workflow.json** - Import template (optional)
✅ **QUICK_START.md** - This file

## Next Steps

1. **Immediate**: Open car-game.html - game works now!
2. **Optional**: Set up n8n workflow for cloud deployment
3. **Fun**: Play on iPad!

---

Questions? See **N8N_SETUP_GUIDE.md** for detailed instructions.
