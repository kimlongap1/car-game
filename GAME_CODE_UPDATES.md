# Game Code Updates - Enable Progress Tracking

Update your game code to send progress data to N8N when each game session completes.

---

## Current Status

✅ Your game already has:
- `trackProgress()` function for each round
- `showCompletionMessage()` when game ends
- Game timer with `gameStartTime`

❌ Missing:
- Call to database when game completes
- Proper session timing
- Progress data formatting

---

## File to Update

**File**: `car-game.html`

---

## Changes Needed

### 1. Update Game Initialization (Line ~400)

**BEFORE:**
```javascript
function startGame(gameType) {
    currentGame = gameType;
    currentRound = 0;
    selectedAnswer = '';
    sessionScore = { correct: 0, total: 0 };

    // Fetch cards from n8n
    fetchCardsFromN8n(gameType);

    // Display the game
    if (gameType === 'which-car') {
        playWhichCar();
    }
    // ... other game types
}
```

**AFTER:**
```javascript
function startGame(gameType) {
    currentGame = gameType;
    currentRound = 0;
    selectedAnswer = '';
    sessionScore = { correct: 0, total: 0 };
    gameStartTime = Date.now(); // ← ADD THIS LINE (track when game starts)

    // Fetch cards from n8n
    fetchCardsFromN8n(gameType);

    // Display the game
    if (gameType === 'which-car') {
        playWhichCar();
    } else if (gameType === 'car-sounds') {
        playCarSounds();
    } else if (gameType === 'fix-car') {
        playFixCar();
    }
}
```

**What changed:**
- Added `gameStartTime = Date.now();` to track when game starts
- Added missing `else if` for other game types

---

### 2. Add New Function After trackProgress (Around Line 511)

Add this new function after the existing `trackProgress()`:

```javascript
// Send final session data to database when game completes
async function endGameSession() {
    const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);
    const accuracy = (sessionScore.correct / sessionScore.total) * 100;

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'track_progress',              // ← Tells N8N to use PostgreSQL
                game_type: currentGame,                // ← which-car, car-sounds, fix-car
                correct_answers: sessionScore.correct, // ← How many right
                total_questions: sessionScore.total,   // ← Total attempts
                difficulty: currentDifficulty,         // ← Current difficulty level
                time_taken: timeTaken,                 // ← Time in seconds
                child_name: 'Emma',                    // ← Can make dynamic
                session_id: `session_${Date.now()}`,   // ← Unique session ID
                metadata: {
                    browser: navigator.userAgent,
                    timestamp: new Date().toISOString(),
                    accuracy_percent: accuracy
                }
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Session tracked to database:', result);
        } else {
            console.warn('⚠️ Database tracking returned:', response.status);
        }
    } catch (error) {
        console.warn('⚠️ Could not track session to database:', error);
        // Game still works - just no tracking. Not a critical error.
    }
}
```

**What this does:**
- Calculates total time played
- Sends all session data to N8N
- N8N routes to PostgreSQL (because `action: "track_progress"`)
- Data inserted into database
- Logs result to browser console

---

### 3. Update showCompletionMessage (Around Line 653)

**BEFORE:**
```javascript
function showCompletionMessage() {
    const messageHTML = `
        <div class="celebration">🎊🎉🏆</div>
        <div class="celebration-text">Great job!</div>
        <div style="margin-top: 30px;">
            <button class="menu-btn" onclick="backToMenu()" style="background-color: var(--color-primary);">Back to Menu</button>
        </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.className = 'screen active';
    tempDiv.id = 'completionScreen';
    tempDiv.style.position = 'fixed';
    tempDiv.style.top = '0';
    tempDiv.style.left = '0';
    tempDiv.style.width = '100%';
    tempDiv.style.height = '100%';
    tempDiv.innerHTML = `<div class="game-area">${messageHTML}</div>`;

    document.querySelector('.container').appendChild(tempDiv);
    showScreen('completionScreen');
    playSound('celebration');
}
```

**AFTER:**
```javascript
async function showCompletionMessage() {  // ← Change from function to async function
    // Track the completed game session BEFORE showing completion screen
    await endGameSession();

    const messageHTML = `
        <div class="celebration">🎊🎉🏆</div>
        <div class="celebration-text">Great job!</div>
        <div style="margin-top: 30px;">
            <button class="menu-btn" onclick="backToMenu()" style="background-color: var(--color-primary);">Back to Menu</button>
        </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.className = 'screen active';
    tempDiv.id = 'completionScreen';
    tempDiv.style.position = 'fixed';
    tempDiv.style.top = '0';
    tempDiv.style.left = '0';
    tempDiv.style.width = '100%';
    tempDiv.style.height = '100%';
    tempDiv.innerHTML = `<div class="game-area">${messageHTML}</div>`;

    document.querySelector('.container').appendChild(tempDiv);
    showScreen('completionScreen');
    playSound('celebration');
}
```

**What changed:**
- Made `async` so it can `await endGameSession()`
- Added `await endGameSession();` at the start
- This sends data to database BEFORE showing completion screen

---

### 4. Update Call Sites for showCompletionMessage

Since `showCompletionMessage` is now async, update all calls to it:

**nextWhichCar (Line ~563):**
```javascript
async function nextWhichCar() {
    currentRound++;
    if (currentRound < 3) {
        playWhichCar();
    } else {
        await showCompletionMessage();  // ← Add await
    }
}
```

**nextCarSounds (find this function):**
```javascript
async function nextCarSounds() {
    currentRound++;
    if (currentRound < 3) {
        playCarSounds();
    } else {
        await showCompletionMessage();  // ← Add await
    }
}
```

**nextFixCar (Line ~644):**
```javascript
async function nextFixCar() {
    currentRound++;
    if (currentRound < 3) {
        playFixCar();
    } else {
        await showCompletionMessage();  // ← Add await
    }
}
```

---

## Summary of Changes

| Location | Change | Type |
|----------|--------|------|
| `startGame()` | Add `gameStartTime = Date.now();` | Update |
| After `trackProgress()` | Add `endGameSession()` function | New |
| `showCompletionMessage()` | Add `async` and call `endGameSession()` | Update |
| `nextWhichCar()` | Add `await` before `showCompletionMessage()` | Update |
| `nextCarSounds()` | Add `await` before `showCompletionMessage()` | Update |
| `nextFixCar()` | Add `await` before `showCompletionMessage()` | Update |

---

## Data Flow After Updates

```
User clicks "Which Car?" button
    ↓
startGame('which-car')
  ├─ Sets currentGame = 'which-car'
  ├─ Resets sessionScore = {correct: 0, total: 0}
  └─ Sets gameStartTime = NOW

Game plays 3 rounds
    ↓
Each round calls trackProgress()
  ├─ Updates sessionScore
  └─ Adjusts difficulty

Game ends (round 3 complete)
    ↓
nextWhichCar() called
  └─ Calls await showCompletionMessage()

showCompletionMessage() executes
    ↓
Calls await endGameSession()
  ├─ Calculates timeTaken
  ├─ Formats session data
  └─ Sends POST to N8N with action="track_progress"

N8N receives request
    ↓
IF node routes to PostgreSQL (false path)
    ↓
PostgreSQL inserts row:
  ├─ child_name: 'Emma'
  ├─ game_type: 'which-car'
  ├─ correct_answers: 2
  ├─ total_questions: 3
  ├─ accuracy_percent: 66.67
  ├─ difficulty_level: 1
  ├─ time_taken_seconds: 120
  └─ session_id: 'session_1733...'

Data in Supabase! ✅

showCompletionMessage continues
    ↓
Displays celebration screen
    ↓
User clicks "Back to Menu"
    ↓
backToMenu() clears session
```

---

## Testing Your Changes

### Test 1: Browser Console

1. Open game in browser
2. Press **F12** to open Developer Tools
3. Click on **Console** tab
4. Play a full game (3 rounds)
5. When celebration shows, check console for:

```
✅ Session tracked to database: {success: true}
```

or

```
⚠️ Could not track session to database: ...
```

---

### Test 2: Supabase Check

1. Open Supabase dashboard
2. Go to **Table Editor** → **game_sessions**
3. Play the game
4. Refresh Supabase table
5. New row should appear with:
   - child_name: 'Emma'
   - game_type: 'which-car' (or game you played)
   - correct_answers: (your score)
   - total_questions: 3
   - time_taken_seconds: (how long you played)

---

### Test 3: Multiple Games

1. Play "Which Car?" game
2. Check database → row added
3. Play "Car Sounds" game
4. Check database → new row for car-sounds
5. Play "Fix the Car" game
6. Check database → new row for fix-car

All three game types should log data! ✓

---

## What Gets Sent to Database

```json
{
  "action": "track_progress",
  "game_type": "which-car",
  "correct_answers": 2,
  "total_questions": 3,
  "difficulty": 1,
  "time_taken": 120,
  "child_name": "Emma",
  "session_id": "session_1733400000000",
  "metadata": {
    "browser": "Mozilla/5.0...",
    "timestamp": "2025-12-02T10:30:00.000Z",
    "accuracy_percent": 66.67
  }
}
```

---

## Troubleshooting

### Issue: "Nothing appears in database"

**Check:**
1. Did game complete 3 rounds? (Need to see celebration screen)
2. Check browser console (F12 → Console)
3. Look for "Session tracked" or error message
4. Verify N8N workflow is active
5. Test with curl command manually

---

### Issue: "Error in console: Cannot read property 'current'"

**Cause:** `gameStartTime` not defined

**Fix:** Make sure `gameStartTime = Date.now();` is in `startGame()` function

---

### Issue: "showCompletionMessage is not async"

**Cause:** Didn't change function signature

**Fix:** Change line from:
```javascript
function showCompletionMessage() {
```
to:
```javascript
async function showCompletionMessage() {
```

---

### Issue: "Database has multiple rows with same data"

**Cause:** Function called multiple times

**Check:**
- `endGameSession()` only called once per game
- Not called during trackProgress rounds
- Only called when game completes

---

## Commit to GitHub

After making changes:

```bash
git add car-game.html
git commit -m "Add progress tracking to database on game completion"
git push
```

---

## Complete Checklist

- [ ] Add `gameStartTime = Date.now();` to `startGame()`
- [ ] Add `endGameSession()` function
- [ ] Make `showCompletionMessage()` async
- [ ] Add `await endGameSession();` in `showCompletionMessage()`
- [ ] Add `await` to all `showCompletionMessage()` calls
- [ ] Test playing a full game
- [ ] Check browser console for success message
- [ ] Verify data in Supabase
- [ ] Test all 3 game types
- [ ] Commit changes to GitHub

---

## Next Steps

1. ✅ Supabase database created ([SUPABASE_DATABASE_SETUP.md](SUPABASE_DATABASE_SETUP.md))
2. ✅ N8N workflow configured ([N8N_WORKFLOW_SETUP.md](N8N_WORKFLOW_SETUP.md))
3. ✅ Game code updated (this file)
4. → Test end-to-end
5. → View analytics queries
6. → (Optional) Build dashboard

---

## Summary

| Step | Time | What You Did |
|------|------|-------------|
| 1 | 2 min | Add `gameStartTime` |
| 2 | 3 min | Add `endGameSession()` |
| 3 | 2 min | Make `showCompletionMessage()` async |
| 4 | 2 min | Add `await` to calls |
| 5 | 2 min | Test |

**Total: 11 minutes to enable database tracking!** ⚡

Your game now automatically logs every session! 🎉
