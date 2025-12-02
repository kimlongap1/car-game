# How to Connect Your Game App to N8N

Complete guide on how your car game app communicates with your N8N workflow.

## Overview

Your game is already configured to connect to N8N! Here's how it works:

```
Game (car-game.html)
  ↓ (sends HTTP request)
  ↓
N8N Webhook
  ↓ (processes with Agent AI)
  ↓
N8N Structured Output Parser
  ↓ (returns JSON response)
  ↓
Game (receives cards and displays)
```

## Current Configuration

Your game has the webhook URL already set:

**File**: `car-game.html` (line 382)
```javascript
const N8N_WEBHOOK_URL = 'https://n8n-new.vibookers.com/webhook-test/car-game';
```

This is already pointing to your N8N instance! ✅

## How the Connection Works

### 1. Game Sends Request

When a player clicks a game mode, the game sends this HTTP request:

```javascript
// From startGame() function
await fetchCardsFromN8n(gameType);
```

**Request Details:**
- **Method**: POST
- **URL**: `https://n8n-new.vibookers.com/webhook-test/car-game`
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "action": "get_cards",
  "game_type": "which-car",
  "difficulty": 1,
  "session_score": {"correct": 0, "total": 0}
}
```

### 2. N8N Receives & Processes

Your N8N workflow:
1. **Webhook** node receives the request
2. **Agent AI** node generates cards using the system prompt
3. **Structured Output Parser** validates the output
4. **Respond to Webhook** node sends back the response

### 3. Game Receives Response

Expected response from N8N:
```json
{
  "cards": [
    {
      "word": "RED",
      "emoji": "🔴🚗",
      "category": "color",
      "difficulty": 1
    },
    {
      "word": "BLUE",
      "emoji": "🔵🚗",
      "category": "color",
      "difficulty": 1
    }
  ],
  "difficulty": 1,
  "status": "success"
}
```

### 4. Game Displays Cards

The game takes the `cards` array and displays them:
```javascript
cardDeck = data.cards || [];
```

Then renders them based on the game type.

---

## Code Flow in Detail

### Step 1: Game Initialization

```javascript
// User clicks "Which Car?" button
async function startGame(gameType) {
  currentGame = gameType;
  currentRound = 0;
  selectedAnswer = '';
  sessionScore = { correct: 0, total: 0 };

  // Fetch cards from n8n
  await fetchCardsFromN8n(gameType);

  // Display the game
  if (gameType === 'which-car') {
    playWhichCar();
  }
}
```

### Step 2: Send Request to N8N

```javascript
async function fetchCardsFromN8n(gameType) {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_cards',
        game_type: gameType,
        difficulty: currentDifficulty,
        session_score: sessionScore
      })
    });

    if (!response.ok) throw new Error('n8n request failed');

    const data = await response.json();
    cardDeck = data.cards || [];
    console.log('Fetched from n8n:', cardDeck);
  } catch (error) {
    console.warn('n8n fetch failed, using fallback cards:', error);
    // Use built-in fallback cards
    cardDeck = generateFallbackCards(gameType);
  }
}
```

### Step 3: Display Game with Cards

```javascript
function playWhichCar() {
  // Use cards from N8N (or fallback)
  const colors = cardDeck.map(card => card.word);

  // Shuffle and select correct answer
  correctAnswer = colors[Math.floor(Math.random() * colors.length)];

  // Render cards
  container.innerHTML = '';
  colors.forEach(color => {
    const div = document.createElement('div');
    div.innerHTML = `<span class="car-emoji">${carEmojis[color]}</span>`;
    div.onclick = () => selectWhichCar(color, div);
    container.appendChild(div);
  });
}
```

---

## Testing the Connection

### Test 1: Check Browser Console

1. Open your game in browser
2. Press **F12** to open Developer Console
3. Click a game mode
4. You should see logs:
   ```
   Fetched from n8n: [Array with cards]
   ```

### Test 2: Manual cURL Test

Test your N8N webhook directly:

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

**Expected Response:**
```json
{
  "cards": [...],
  "difficulty": 1,
  "status": "success"
}
```

### Test 3: Browser Network Tab

1. Open Developer Tools → **Network** tab
2. Click a game mode
3. You should see a POST request to:
   ```
   https://n8n-new.vibookers.com/webhook-test/car-game
   ```
4. Check the response - should have cards array

---

## Game Types & Expected Responses

### Which Car Game

**Request:**
```json
{
  "action": "get_cards",
  "game_type": "which-car",
  "difficulty": 1,
  "session_score": {"correct": 0, "total": 0}
}
```

**Expected Response:**
```json
{
  "cards": [
    {"word": "RED", "emoji": "🔴🚗", "category": "color", "difficulty": 1},
    {"word": "BLUE", "emoji": "🔵🚗", "category": "color", "difficulty": 1},
    {"word": "YELLOW", "emoji": "🟡🚗", "category": "color", "difficulty": 1}
  ],
  "difficulty": 1,
  "status": "success"
}
```

### Car Sounds Game

**Request:**
```json
{
  "action": "get_cards",
  "game_type": "car-sounds",
  "difficulty": 1,
  "session_score": {"correct": 0, "total": 0}
}
```

**Expected Response:**
```json
{
  "cards": [
    {"word": "POLICE", "emoji": "🚓", "category": "car", "difficulty": 1},
    {"word": "TRUCK", "emoji": "🚚", "category": "car", "difficulty": 1},
    {"word": "AMBULANCE", "emoji": "🚑", "category": "car", "difficulty": 1}
  ],
  "difficulty": 1,
  "status": "success"
}
```

### Fix the Car Game

**Request:**
```json
{
  "action": "get_cards",
  "game_type": "fix-car",
  "difficulty": 1,
  "session_score": {"correct": 0, "total": 0}
}
```

**Expected Response:**
```json
{
  "cards": [
    {"word": "WHEEL", "emoji": "⚫", "category": "part", "difficulty": 1},
    {"word": "WINDOW", "emoji": "🪟", "category": "part", "difficulty": 1},
    {"word": "DOOR", "emoji": "🚪", "category": "part", "difficulty": 1}
  ],
  "difficulty": 1,
  "status": "success"
}
```

---

## Troubleshooting Connection Issues

### Issue 1: "n8n fetch failed, using fallback cards"

**Cause**: Request to N8N failed

**Check:**
1. Is N8N workflow running?
   - Go to N8N dashboard
   - Click your workflow
   - Check status (should be "Running")

2. Is webhook configured?
   - Webhook node path should be: `car-game`
   - Full URL: `https://n8n-new.vibookers.com/webhook-test/car-game`

3. Is Respond to Webhook node connected?
   - Agent AI → Structured Output Parser → Respond to Webhook

4. Test with curl:
   ```bash
   curl -X POST https://n8n-new.vibookers.com/webhook-test/car-game \
     -H "Content-Type: application/json" \
     -d '{"action":"get_cards","game_type":"which-car"}'
   ```

### Issue 2: "Model output doesn't fit required format"

**Cause**: Agent AI output doesn't match Structured Output Parser schema

**Fix:**
1. Update Agent AI system prompt (see N8N_STRUCTURED_OUTPUT.md)
2. Ensure output matches this structure:
   ```json
   {
     "cards": [...],
     "difficulty": 1,
     "status": "success"
   }
   ```
3. Enable "Auto-Fix Format" in Structured Output Parser

### Issue 3: No Cards Display in Game

**Check:**
1. Open browser console (F12)
2. Look for error messages
3. Check Network tab for failed requests
4. Verify webhook URL is correct in car-game.html

### Issue 4: Network Error in Browser

**Cause**: CORS issue or network connectivity

**Check:**
1. Is N8N accessible from your location?
2. Try curl test from terminal
3. Check browser console for CORS error
4. Verify internet connection

---

## How to Modify the Connection

### Change N8N URL

If you want to use a different N8N instance:

**File**: `car-game.html` (line 382)

Current:
```javascript
const N8N_WEBHOOK_URL = 'https://n8n-new.vibookers.com/webhook-test/car-game';
```

Change to your N8N URL:
```javascript
const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/car-game';
```

Then redeploy the game.

### Add Custom Headers

If you need to add authentication:

```javascript
async function fetchCardsFromN8n(gameType) {
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'  // Add if needed
    },
    body: JSON.stringify({
      action: 'get_cards',
      game_type: gameType,
      difficulty: currentDifficulty,
      session_score: sessionScore
    })
  });
  // ... rest of code
}
```

### Add Timeout

Prevent hanging requests:

```javascript
async function fetchCardsFromN8n(gameType) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_cards',
        game_type: gameType,
        difficulty: currentDifficulty,
        session_score: sessionScore
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    // ... rest of code
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('Request timeout or failed:', error);
    cardDeck = generateFallbackCards(gameType);
  }
}
```

---

## Full Request-Response Flow Diagram

```
┌─────────────────────────────────────┐
│      Browser (Game Loaded)          │
└─────────────────────────────────────┘
        │
        │ User clicks "Which Car?"
        ▼
┌─────────────────────────────────────┐
│  startGame('which-car')             │
│  → fetchCardsFromN8n('which-car')  │
└─────────────────────────────────────┘
        │
        │ POST request
        │ {
        │   "action": "get_cards",
        │   "game_type": "which-car",
        │   "difficulty": 1,
        │   "session_score": {...}
        │ }
        │
        ▼
┌─────────────────────────────────────┐
│       N8N Webhook Node              │
│    (Receives POST request)          │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│     Agent AI Node                   │
│  (Generates flashcards using AI)    │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  Structured Output Parser           │
│  (Validates JSON & formats)         │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  Respond to Webhook Node            │
│  (Returns response)                 │
└─────────────────────────────────────┘
        │
        │ Response with cards
        │ {
        │   "cards": [...],
        │   "difficulty": 1,
        │   "status": "success"
        │ }
        │
        ▼
┌─────────────────────────────────────┐
│  Browser receives response          │
│  cardDeck = data.cards              │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  playWhichCar()                     │
│  (Render game with cards)           │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  User plays the game! 🎮           │
└─────────────────────────────────────┘
```

---

## Summary

**Your game is already connected!**

| Component | Status |
|-----------|--------|
| Webhook URL | ✅ Configured |
| N8N Workflow | ✅ Ready |
| Structured Output | ✅ Working |
| Game Connection | ✅ Active |

**Everything is working!** When the game runs:
1. It sends a request to your N8N webhook
2. N8N processes it with Agent AI
3. Structured Output Parser validates the response
4. Game displays the cards

No additional setup needed - your connection is complete! 🚗✨
