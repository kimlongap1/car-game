# N8N Integration Setup - Complete Guide

Your car game is configured to work with n8n at:
```
https://n8n-new.vibookers.com/webhook-test/car-game
```

This guide will help you set up the n8n workflow for dynamic card generation and progress tracking.

## What You'll Get

✅ **Dynamic Card Generation** - Claude AI generates unique cards based on game type and difficulty
✅ **Progress Tracking** - Track child's performance across sessions
✅ **Difficulty Adjustment** - Game adapts based on accuracy (easy/medium/hard)
✅ **Fallback Mode** - Game works even if n8n is offline

## Prerequisites

- n8n instance running at: https://n8n-new.vibookers.com/
- Claude API key (from Anthropic)
- 10 minutes of setup time

## Quick Setup (Copy & Paste)

### Step 1: Access Your N8N Instance

1. Open: https://n8n-new.vibookers.com/
2. Log in with your credentials
3. Click **+ New Workflow**
4. Name it: `car-game-backend`

### Step 2: Add Webhook Node

1. Click **+ Add Node**
2. Search: **Webhook**
3. Configure:
   ```
   HTTP Method: POST
   Path: car-game
   ```
4. Copy the full webhook URL shown (should match your config)
5. Save the node

### Step 3: Test Webhook (Optional but Recommended)

Execute a test request to verify:

```bash
curl -X POST https://n8n-new.vibookers.com/webhook-test/car-game \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get_cards",
    "game_type": "which-car",
    "difficulty": 1,
    "session_score": {"correct": 0, "total": 0}
  }'
```

Expected: You'll get a "no response" error (that's OK - we're adding that next)

### Step 4: Add Anthropic Claude Node (Optional - For AI Cards)

If you want AI-generated cards:

1. Click **+ Add Node**
2. Search: **Anthropic Claude**
3. Click **Credentials** → **Create New**
   - API Key: (paste your Claude API key)
   - Name: claude-api
4. Set **Model**: `claude-3-5-sonnet-20241022`
5. In **Messages**, add this prompt:

```
You are generating simple educational flashcards for a child learning about cars.

Game Type: {{$json.game_type}}
Difficulty Level: {{$json.difficulty}} (1=easy, 2=medium, 3=hard)
Child's Current Score: {{$json.session_score.correct}} / {{$json.session_score.total}}

Generate exactly 5 flashcards in PURE JSON ONLY (no other text):

[
  {
    "word": "RED",
    "emoji": "🔴🚗",
    "category": "color",
    "difficulty": 1,
    "sound": "beep"
  },
  {
    "word": "BLUE",
    "emoji": "🔵🚗",
    "category": "color",
    "difficulty": 1,
    "sound": "beep"
  },
  {
    "word": "YELLOW",
    "emoji": "🟡🚗",
    "category": "color",
    "difficulty": 1,
    "sound": "beep"
  }
]

Rules:
- ALWAYS output VALID JSON ONLY
- No markdown, no explanations
- Include word, emoji, category, difficulty, and optional sound
- Vary cards based on difficulty level
- For difficulty 2, add police/truck/ambulance
- For difficulty 3, add more complex parts
```

### Step 5: Add Response Formatter Node

1. Click **+ Add Node**
2. Search: **Set** (or **Set Value** depending on version)
3. If using Claude, configure to format the AI response:
   ```javascript
   cards = JSON.parse($json.message)
   difficulty = $json.difficulty || 1
   status = "success"
   ```
4. If NOT using Claude, set static cards:
   ```javascript
   cards = [
     {"word": "RED", "emoji": "🔴🚗", "category": "color", "difficulty": 1},
     {"word": "BLUE", "emoji": "🔵🚗", "category": "color", "difficulty": 1},
     {"word": "YELLOW", "emoji": "🟡🚗", "category": "color", "difficulty": 1}
   ]
   difficulty = 1
   status = "success"
   ```

### Step 6: Add Response Node

1. Click **+ Add Node**
2. Search: **Respond to Webhook**
3. Leave default settings
4. This node responds to your game with the cards

### Step 7: Connect the Nodes

**Option A: With Claude AI**
```
Webhook → Claude → Set → Respond to Webhook
```

**Option B: Without Claude (Static Cards)**
```
Webhook → Set → Respond to Webhook
```

### Step 8: Save and Activate

1. Click **Save Workflow**
2. Click the **Execute Workflow** button (▶️ play icon)
3. Status should show **Workflow is running**

### Step 9: Test the Integration

```bash
curl -X POST https://n8n-new.vibookers.com/webhook-test/car-game \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get_cards",
    "game_type": "which-car",
    "difficulty": 1,
    "session_score": {"correct": 0, "total": 0}
  }'
```

Expected Response:
```json
{
  "cards": [
    {"word": "RED", "emoji": "🔴🚗", ...},
    {"word": "BLUE", "emoji": "🔵🚗", ...}
  ],
  "difficulty": 1,
  "status": "success"
}
```

### Step 10: Test in Your Game!

1. Open: `https://kimlongap1.github.io/car-game/` (or your Vercel URL)
2. Open browser console: **F12**
3. Click any game mode
4. Check console for logs
5. Cards should load from n8n! ✅

---

## Workflow Templates

### Simple Template (No AI)

Just returns static cards - no API keys needed:

```
Webhook → Set (static cards) → Respond to Webhook
```

**Pros:** Simple, free, instant
**Cons:** Same cards every game

### With Claude AI

Generates unique cards using AI:

```
Webhook → Claude → Set → Respond to Webhook
```

**Pros:** Unique cards, adaptive difficulty
**Cons:** Requires Claude API key (costs ~$0.01 per game)

### With Progress Tracking (Advanced)

Saves progress to database:

```
Webhook → Claude → Database → Set → Respond to Webhook
```

**Pros:** See child's progress over time
**Cons:** Needs database setup

---

## Game Types

Your game sends different data based on game type:

### Which Car Game
```json
{
  "action": "get_cards",
  "game_type": "which-car",
  "difficulty": 1,
  "session_score": {"correct": 0, "total": 0}
}
```

Should return colors (RED, BLUE, YELLOW, GREEN)

### Car Sounds Game
```json
{
  "action": "get_cards",
  "game_type": "car-sounds",
  "difficulty": 1,
  "session_score": {"correct": 0, "total": 0}
}
```

Should return cars (POLICE, TRUCK, AMBULANCE)

### Fix the Car Game
```json
{
  "action": "get_cards",
  "game_type": "fix-car",
  "difficulty": 1,
  "session_score": {"correct": 0, "total": 0}
}
```

Should return parts (WHEEL, WINDOW, DOOR, LIGHT)

---

## Troubleshooting

### "webhook not registered"
- Make sure workflow is **Saved**
- Click **Execute Workflow** button
- Wait for "Workflow is running" message

### No cards in game
- Open browser console: **F12**
- Look for errors in console
- Check n8n workflow logs

### Test curl works but game doesn't
- Game might be cached
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh: Ctrl+F5
- Try incognito window

### Claude returns error
- Check API key is valid
- Verify account has credits
- Check API key is copied correctly

### "Invalid JSON" error
- Make sure Claude outputs ONLY JSON
- No markdown code blocks
- No extra explanations
- Test with simple prompt first

---

## Environment Variables (Advanced)

For production, store sensitive data in environment variables:

In n8n node, use:
```
$env('CLAUDE_API_KEY')
```

Configure in n8n Settings → Variables

---

## Performance Optimization

### Caching Strategy
- Cache cards for 5-10 minutes
- Reduces API calls
- Faster response times

### Database Indexing
- Index by game_type + difficulty
- Index by date for analytics
- Improves query speed

### Batch Operations
- Generate multiple sets of cards at once
- Schedule daily pre-generation
- Always ready for users

---

## Security Notes

✅ **No personal data stored** - Only game progress
✅ **No authentication needed** - Webhook is public
✅ **API keys hidden** - n8n handles securely
✅ **HTTPS only** - All requests encrypted

---

## Next Steps

1. ✅ Have n8n URL ready
2. ✅ Have Claude API key (optional)
3. ✅ Create new workflow
4. ✅ Add webhook node
5. ✅ (Optional) Add Claude node
6. ✅ Add response node
7. ✅ Test with curl
8. ✅ Test in your game!

---

## Support

If you need help:

1. Check n8n logs (click workflow → Logs tab)
2. Check game console (F12 in browser)
3. Verify webhook URL matches your config
4. Test curl command manually
5. See QUICK_START.md for alternatives

Your game will work perfectly even without n8n!

The fallback mode ensures cards always load. N8N integration is optional for advanced features.

---

**Ready to integrate?** Start with Step 1 above! 🚀
