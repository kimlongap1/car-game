# Supabase Database Setup - Car Game Progress Tracking

Fast, free database solution for tracking game sessions. Complete in **15 minutes**.

---

## Overview

```
Game Session Ends
    ↓
trackProgress() sends to N8N
    ↓
N8N IF node: Check action
    ├─ action="get_cards" → Agent AI (existing)
    └─ action="track_progress" → PostgreSQL Insert (NEW)
        ↓
Supabase Database
    ↓
Instant data available for analytics
```

---

## Why Supabase?

- ✅ Free PostgreSQL database (500MB free tier)
- ✅ Real-time data
- ✅ Easy N8N integration
- ✅ Fast queries
- ✅ Built-in REST API
- ✅ No backend coding needed

---

## Step 1: Create Supabase Account (2 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub (easiest)
4. Create new organization (or use default)
5. Create new project:
   - **Project name**: `car-game`
   - **Password**: Generate strong password (save it!)
   - **Region**: Choose closest to you
   - **Click "Create new project"**

Wait 1-2 minutes for project to initialize...

---

## Step 2: Create Database Table (3 minutes)

Once project loads, go to **SQL Editor** (left sidebar):

1. Click **"New Query"**
2. Copy and paste this SQL:

```sql
CREATE TABLE game_sessions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),

  -- Game Info
  child_name VARCHAR(100),
  game_type VARCHAR(50),

  -- Performance
  correct_answers INT,
  total_questions INT,
  accuracy_percent FLOAT,

  -- Metadata
  difficulty_level INT,
  time_taken_seconds INT,

  -- Extra fields
  session_id VARCHAR(100),
  metadata JSONB
);

-- Create index for faster queries
CREATE INDEX idx_game_sessions_child_name ON game_sessions(child_name);
CREATE INDEX idx_game_sessions_game_type ON game_sessions(game_type);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);
```

3. Click **"Run"**
4. See success message: `✓ Execute successfully`

---

## Step 3: Get Connection Details (2 minutes)

Go to **Project Settings** (⚙️ bottom left):

1. Click **"Database"**
2. Copy these details (save in a text file):
   - **Host**: `db.xxxxxxxxxxx.supabase.co`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: (the one you created)
   - **Port**: `5432`

Also note your **Project URL**:
- Go to **Home** tab
- Copy the **Project URL** (example: `https://xxxxxxxxxxx.supabase.co`)

---

## Step 4: Get API Key (1 minute)

1. Go to **Project Settings** → **API**
2. Under "Project API keys", copy **anon public** key
3. Save it (you'll need this)

---

## Step 5: Configure N8N Workflow (5 minutes)

Your N8N workflow needs to route based on action.

### Current Structure:
```
Webhook → Agent AI → Structured Output → Response
```

### New Structure:
```
Webhook
    ↓
IF: Check $json.action
    ├─ TRUE: action = "get_cards"
    │   └─ Agent AI → Structured Output → Response
    │
    └─ FALSE: action = "track_progress"
        └─ PostgreSQL Insert → Response
```

### In N8N:

**Step 1: Add IF Node**
1. After Webhook, click **"+"** to add node
2. Search: **IF**
3. Add IF node

**Step 2: Configure IF Node**
- **Condition**: `$json.action == "get_cards"`
- **Then**: Connect to Agent AI (your existing path)
- **Else**: Continue to PostgreSQL

**Step 3: Add PostgreSQL Node**
1. Click **"+"** after IF node (false path)
2. Search: **PostgreSQL**
3. Click to add

**Step 4: Configure PostgreSQL Connection**
1. Click **"Create New Credential"**
2. Fill in:
   - **Host**: (from Step 3)
   - **Port**: 5432
   - **Database**: postgres
   - **User**: postgres
   - **Password**: (from Step 3)
   - **SSL**: Toggle ON (required for Supabase)

3. Click **"Test Connection"** → Should say "Connection successful"
4. Click **"Save"**

**Step 5: Configure INSERT Query**
In PostgreSQL node, under "Query", paste:

```sql
INSERT INTO game_sessions (
  child_name,
  game_type,
  correct_answers,
  total_questions,
  accuracy_percent,
  difficulty_level,
  time_taken_seconds,
  session_id,
  metadata
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9
)
```

**Step 6: Map Parameters**
In "Parameters" section, add these values:

| Parameter | Expression |
|-----------|-----------|
| 1 | `$json.child_name` |
| 2 | `$json.game_type` |
| 3 | `$json.correct_answers` |
| 4 | `$json.total_questions` |
| 5 | `$json.correct_answers / $json.total_questions * 100` |
| 6 | `$json.difficulty` |
| 7 | `$json.time_taken` |
| 8 | `$json.session_id` |
| 9 | `$json.metadata \|\| {}` |

**Step 7: Connect Response**
- PostgreSQL → Respond to Webhook

Your workflow should now look like:
```
Webhook → IF → [Agent AI → Structured Output → Response]
               [PostgreSQL → Response]
```

---

## Step 6: Update Game Code (2 minutes)

The game already has `trackProgress()` function, but it needs updating.

**File**: `car-game.html` (line 483-511)

Replace the current `trackProgress()` function with:

```javascript
let gameStartTime = 0; // Add this at top with other variables

async function trackProgress(isCorrect) {
    sessionScore.total += 1;
    if (isCorrect) sessionScore.correct += 1;

    // Update difficulty if needed
    const accuracy = sessionScore.correct / sessionScore.total;
    if (accuracy > 0.8 && sessionScore.total > 3) {
        currentDifficulty = Math.min(3, currentDifficulty + 1);
    } else if (accuracy < 0.5 && sessionScore.total > 3) {
        currentDifficulty = Math.max(1, currentDifficulty - 1);
    }
}

// Call this when game starts
function startGame(gameType) {
    currentGame = gameType;
    currentRound = 0;
    selectedAnswer = '';
    sessionScore = { correct: 0, total: 0 };
    gameStartTime = Date.now(); // Start timer

    // Fetch cards from N8N
    fetchCardsFromN8n(gameType);

    // Show appropriate game screen
    if (gameType === 'which-car') playWhichCar();
    else if (gameType === 'car-sounds') playCarSounds();
    else if (gameType === 'fix-car') playFixCar();
}

// Call this when game completes
async function endGameSession() {
    const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'track_progress',
                game_type: currentGame,
                correct_answers: sessionScore.correct,
                total_questions: sessionScore.total,
                difficulty: currentDifficulty,
                time_taken: timeTaken,
                child_name: 'Emma', // Can be dynamic
                session_id: `session_${Date.now()}`
            })
        });

        const result = await response.json();
        console.log('Session tracked:', result);
    } catch (error) {
        console.warn('Could not track session:', error);
        // Game still works, just no tracking
    }
}

// Update showCompletionMessage to call endGameSession
function showCompletionMessage() {
    // Track the completed game session
    endGameSession();

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

---

## Step 7: Test the Connection (2 minutes)

### Test 1: Manual Test with curl

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

**Expected Response:**
```json
{
  "success": true,
  "rows_affected": 1,
  "message": "Data inserted to database"
}
```

### Test 2: Check Data in Supabase

1. Go to Supabase Dashboard
2. Click **"Table Editor"** (left sidebar)
3. Click **"game_sessions"** table
4. You should see the row you just inserted!

### Test 3: Play Game and Check Database

1. Open your game
2. Play 3 rounds of "Which Car"
3. Game completion sends data to N8N
4. Check Supabase table → New row appears!

---

## Step 8: View Your Data (Analytics)

### In Supabase, run SQL queries:

**All sessions:**
```sql
SELECT * FROM game_sessions ORDER BY created_at DESC;
```

**Sessions by child:**
```sql
SELECT
  child_name,
  COUNT(*) as games_played,
  AVG(accuracy_percent) as avg_accuracy,
  MAX(difficulty_level) as max_difficulty,
  SUM(time_taken_seconds) as total_time
FROM game_sessions
GROUP BY child_name;
```

**Performance by game type:**
```sql
SELECT
  game_type,
  COUNT(*) as times_played,
  AVG(accuracy_percent) as avg_accuracy,
  AVG(time_taken_seconds) as avg_time
FROM game_sessions
GROUP BY game_type
ORDER BY times_played DESC;
```

**Weekly progress:**
```sql
SELECT
  DATE_TRUNC('week', created_at) as week,
  COUNT(*) as sessions,
  AVG(accuracy_percent) as avg_accuracy,
  COUNT(DISTINCT child_name) as unique_children
FROM game_sessions
GROUP BY week
ORDER BY week DESC;
```

---

## Complete Setup Checklist

- [ ] Supabase account created
- [ ] Database table created with SQL
- [ ] Connection details saved
- [ ] N8N PostgreSQL connection configured
- [ ] N8N IF node added for action routing
- [ ] N8N PostgreSQL INSERT query configured
- [ ] Game code updated with trackProgress
- [ ] Game code updated with endGameSession
- [ ] showCompletionMessage calls endGameSession
- [ ] Manual curl test passed
- [ ] Data appears in Supabase
- [ ] Played game end-to-end and verified tracking

---

## Data Structure in Database

### What Gets Stored

```json
{
  "id": 1,
  "created_at": "2025-12-02T10:30:00Z",
  "child_name": "Emma",
  "game_type": "which-car",
  "correct_answers": 2,
  "total_questions": 3,
  "accuracy_percent": 66.67,
  "difficulty_level": 1,
  "time_taken_seconds": 120,
  "session_id": "session_1733132400000",
  "metadata": {}
}
```

### Example Analytics Results

```
child_name: Emma
games_played: 15
avg_accuracy: 85%
max_difficulty: 3
total_time: 1800 seconds
```

---

## Troubleshooting

### PostgreSQL Connection Failed

**Error**: "Connection refused" or "SSL connection error"

**Fix**:
1. Verify Host is exactly: `db.xxxxxxxxxxx.supabase.co`
2. Make sure **SSL is ON** (required for Supabase)
3. Port must be **5432**
4. Copy password exactly from Supabase

### No Data in Database

**Check**:
1. Did N8N workflow execute? Check N8N workflow logs
2. Did you call `endGameSession()`? Check browser console
3. Test curl command first (Step 7)
4. Verify game actually completes (shows celebration screen)

### IF Node Not Working

**Check**:
1. Condition is exactly: `$json.action == "get_cards"`
2. For get_cards: goes to Agent AI path
3. For track_progress: goes to PostgreSQL path
4. Both paths end with Respond to Webhook

### Slow Queries

The database is fast, but you can optimize:

```sql
-- Already created in setup, but verify:
CREATE INDEX idx_game_sessions_child_name ON game_sessions(child_name);
CREATE INDEX idx_game_sessions_game_type ON game_sessions(game_type);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);
```

---

## Next Steps

1. **Real-time Dashboard** - Display progress in the game UI
2. **Weekly Reports** - Generate parent reports from database
3. **Export to CSV** - Download progress data
4. **Achievements** - Unlock badges based on database metrics

---

## Summary

| Step | Time | Status |
|------|------|--------|
| 1. Supabase Account | 2 min | ⬜ |
| 2. Database Table | 3 min | ⬜ |
| 3. Connection Details | 2 min | ⬜ |
| 4. API Key | 1 min | ⬜ |
| 5. N8N Workflow | 5 min | ⬜ |
| 6. Game Code | 2 min | ⬜ |
| 7. Testing | 2 min | ⬜ |

**Total: 17 minutes for complete setup!** ⚡

Your database is now tracking every game session in real-time. No delays, no Google Sheets limits, pure speed! 🚀

---

## Cost

- **Free tier**: 500MB database (stores ~100,000 game sessions)
- **Queries**: Unlimited
- **Real-time**: Included
- **Cost**: $0 until you exceed free tier

Perfect for starting out! 🎉
