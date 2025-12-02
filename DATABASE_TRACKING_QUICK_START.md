# Database Progress Tracking - Quick Start (15 Minutes)

Fast implementation guide for adding Supabase database tracking to your car game.

---

## ⚡ What You're Building

```
Game plays → Session ends → Data sent to N8N → Stored in Supabase
                                                     ↓
                                            Real-time analytics
```

---

## 📋 Pre-requisites

✅ Car game created
✅ N8N webhook connected
✅ Card generation working
❌ Database tracking (this is what we're adding)

---

## 🚀 The Plan (4 Steps, 15 Minutes)

| Step | Time | Task |
|------|------|------|
| 1 | 5 min | Set up Supabase database |
| 2 | 5 min | Configure N8N workflow |
| 3 | 3 min | Update game code |
| 4 | 2 min | Test end-to-end |

---

## Step 1: Supabase Database Setup (5 minutes)

### 1.1: Create Account
```
Go to: https://supabase.com
Sign up with GitHub → Create project → Name: "car-game"
```

### 1.2: Create Table (Copy-Paste SQL)

In Supabase **SQL Editor**, paste and run:

```sql
CREATE TABLE game_sessions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  child_name VARCHAR(100),
  game_type VARCHAR(50),
  correct_answers INT,
  total_questions INT,
  accuracy_percent FLOAT,
  difficulty_level INT,
  time_taken_seconds INT,
  session_id VARCHAR(100),
  metadata JSONB
);

CREATE INDEX idx_game_sessions_child_name ON game_sessions(child_name);
CREATE INDEX idx_game_sessions_game_type ON game_sessions(game_type);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);
```

### 1.3: Copy Connection Details

**Settings** → **Database** → Copy:
- **Host**: `db.xxxx.supabase.co`
- **Password**: (your password)
- **User**: `postgres`

Save these! You'll need them in N8N.

---

## Step 2: N8N Workflow Configuration (5 minutes)

### 2.1: Add IF Node

In your N8N workflow (after Webhook):
```
Add node → IF → Condition: $json.action == "get_cards"
```

### 2.2: Wire Agent AI Path

```
IF (true) → Agent AI → Structured Output Parser → Respond to Webhook
```

(This is your existing card generation - keep it as is)

### 2.3: Add PostgreSQL Node

```
IF (false) → Add PostgreSQL node
```

### 2.4: Configure PostgreSQL

**Credentials:**
- Host: (from Step 1.3)
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Password: (from Step 1.3)
- **SSL: Toggle ON** ✓

**Query:**
```sql
INSERT INTO game_sessions (
  child_name, game_type, correct_answers, total_questions,
  accuracy_percent, difficulty_level, time_taken_seconds, session_id, metadata
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
```

**Parameters:**
```
$1 = $json.child_name
$2 = $json.game_type
$3 = $json.correct_answers
$4 = $json.total_questions
$5 = $json.correct_answers / $json.total_questions * 100
$6 = $json.difficulty
$7 = $json.time_taken
$8 = $json.session_id
$9 = $json.metadata || {}
```

### 2.5: Connect Response

```
PostgreSQL → Respond to Webhook
```

**Test:**
```bash
curl -X POST https://n8n-new.vibookers.com/webhook-test/car-game \
  -H "Content-Type: application/json" \
  -d '{
    "action": "track_progress",
    "game_type": "which-car",
    "correct_answers": 2,
    "total_questions": 3,
    "difficulty": 1,
    "time_taken": 120,
    "child_name": "Emma",
    "session_id": "test_123"
  }'
```

---

## Step 3: Update Game Code (3 minutes)

**File**: `car-game.html`

### 3.1: Add Timer to startGame()

Around line 400, in `startGame()`, add:
```javascript
gameStartTime = Date.now();
```

Full function:
```javascript
function startGame(gameType) {
    currentGame = gameType;
    currentRound = 0;
    selectedAnswer = '';
    sessionScore = { correct: 0, total: 0 };
    gameStartTime = Date.now();  // ← ADD THIS

    fetchCardsFromN8n(gameType);

    if (gameType === 'which-car') playWhichCar();
    else if (gameType === 'car-sounds') playCarSounds();
    else if (gameType === 'fix-car') playFixCar();
}
```

### 3.2: Add Session Tracking Function

After `trackProgress()` function (around line 511), add:

```javascript
async function endGameSession() {
    const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);
    const accuracy = (sessionScore.correct / sessionScore.total) * 100;

    try {
        await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'track_progress',
                game_type: currentGame,
                correct_answers: sessionScore.correct,
                total_questions: sessionScore.total,
                difficulty: currentDifficulty,
                time_taken: timeTaken,
                child_name: 'Emma',
                session_id: `session_${Date.now()}`,
                metadata: { accuracy_percent: accuracy }
            })
        });
        console.log('✅ Session saved to database');
    } catch (error) {
        console.warn('⚠️ Database save failed:', error);
    }
}
```

### 3.3: Update showCompletionMessage

**Before:**
```javascript
function showCompletionMessage() {
```

**After:**
```javascript
async function showCompletionMessage() {
    await endGameSession();  // ← ADD THIS
```

Full function:
```javascript
async function showCompletionMessage() {
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

### 3.4: Add await to nextXxx Functions

Find these functions and add `await`:

```javascript
async function nextWhichCar() {
    currentRound++;
    if (currentRound < 3) {
        playWhichCar();
    } else {
        await showCompletionMessage();  // ← ADD await
    }
}

async function nextFixCar() {
    currentRound++;
    if (currentRound < 3) {
        playFixCar();
    } else {
        await showCompletionMessage();  // ← ADD await
    }
}
```

---

## Step 4: Test Everything (2 minutes)

### Test 4.1: Browser Console

1. Open game in browser
2. Press **F12** → **Console**
3. Play one full game (3 rounds)
4. Look for: **✅ Session saved to database**

### Test 4.2: Check Supabase

1. Open Supabase dashboard
2. **Table Editor** → **game_sessions**
3. You should see a new row!

### Test 4.3: Play All Games

- Play "Which Car?" → Check database
- Play "Car Sounds" → Check database
- Play "Fix the Car" → Check database

All three should create rows in the database. ✓

---

## ✅ You're Done!

Your game now tracks every session automatically! 🎉

---

## 📊 View Your Data

### SQL Queries in Supabase

**All sessions:**
```sql
SELECT * FROM game_sessions ORDER BY created_at DESC LIMIT 10;
```

**By child:**
```sql
SELECT child_name, COUNT(*) as games, AVG(accuracy_percent) as avg_accuracy
FROM game_sessions GROUP BY child_name;
```

**By game type:**
```sql
SELECT game_type, COUNT(*) as played, AVG(accuracy_percent) as avg_score
FROM game_sessions GROUP BY game_type;
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No data in database | Check browser console for error |
| Error: "Connection refused" | Make sure SSL is ON in N8N PostgreSQL |
| Game won't complete | Check browser console (F12) for JavaScript errors |
| Supabase table is empty | Run curl test manually from terminal |

---

## 📁 Full Documentation

For detailed information, see:

- [SUPABASE_DATABASE_SETUP.md](SUPABASE_DATABASE_SETUP.md) - Complete Supabase guide
- [N8N_WORKFLOW_SETUP.md](N8N_WORKFLOW_SETUP.md) - Detailed N8N configuration
- [GAME_CODE_UPDATES.md](GAME_CODE_UPDATES.md) - Code changes explained

---

## 🎯 What's Next

1. **Dashboard** - Display progress in the app
2. **Parent Reports** - Export weekly reports
3. **Analytics** - Track learning progress over time
4. **Achievements** - Unlock badges based on progress

But for now, you have a working progress tracking system! 🚀

---

## Summary

| Component | Status |
|-----------|--------|
| Supabase Database | ✅ Ready |
| N8N Workflow | ✅ Configured |
| Game Code | ✅ Updated |
| Testing | ✅ Complete |

**Database tracking is LIVE!** Every game session is now saved to your database in real-time. 📊

No delays, no Google Sheets, pure speed! ⚡
