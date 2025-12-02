# Database Progress Tracking

Complete guide for setting up real-time progress tracking with Supabase and N8N.

**Time**: 15 minutes
**Cost**: $0 (free tier)
**Difficulty**: Easy (copy-paste)

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 1: Supabase (5 min)](#phase-1-supabase-5-min)
3. [Phase 2: N8N Workflow (5 min)](#phase-2-n8n-workflow-5-min)
4. [Phase 3: Game Code (3 min)](#phase-3-game-code-3-min)
5. [Testing (2 min)](#testing-2-min)
6. [Verification](#verification)
7. [What Gets Tracked](#what-gets-tracked)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### Architecture

```
Game Session Ends
    ↓
POST to N8N webhook
    ↓
N8N IF Node routes to PostgreSQL
    ↓
Data saved to Supabase
    ↓
Ready for analytics
```

### Data Stored

Per session:
- Child name
- Game type
- Score (correct/total)
- Accuracy %
- Difficulty level
- Time taken
- Timestamp

---

## Phase 1: Supabase (5 min)

### Step 1: Create Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub
4. Create project:
   - **Name**: `car-game`
   - **Region**: Closest to you
   - Wait 1-2 minutes...

### Step 2: Create Table

In **SQL Editor**, paste and run:

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

### Step 3: Get Connection Details

**Settings** → **Database**

Copy and save:
- **Host**: `db.xxxx.supabase.co`
- **User**: `postgres`
- **Password**: (your password)
- **Port**: `5432`
- **Database**: `postgres`

---

## Phase 2: N8N Workflow (5 min)

### Step 1: Add IF Node

After Webhook node:
1. Click **"+"** to add node
2. Search: **"IF"**
3. Configure:
   - **Condition**: `$json.action == "get_cards"`

This routes:
- `get_cards` → Agent AI (existing)
- `track_progress` → PostgreSQL (new)

### Step 2: Add PostgreSQL Node

1. Click **"+"** on IF false path
2. Search: **"PostgreSQL"**
3. Create new credential:
   - Host: (from Step 3 above)
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: (from Step 3)
   - **SSL: Toggle ON** ✓
4. Test connection → Success ✓

### Step 3: Configure Query

In PostgreSQL node:

**Query**:
```sql
INSERT INTO game_sessions (
  child_name, game_type, correct_answers, total_questions,
  accuracy_percent, difficulty_level, time_taken_seconds,
  session_id, metadata
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
```

**Parameters**:
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

### Step 4: Connect Response

PostgreSQL → Respond to Webhook

### Step 5: Save & Activate

- Click **Save**
- Click **Activate** toggle → ON

---

## Phase 3: Game Code (3 min)

Edit `car-game.html`:

### Change 1: Add Timer

In `startGame()` function, add:
```javascript
gameStartTime = Date.now();
```

### Change 2: Add Tracking Function

After `trackProgress()`, add:
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

### Change 3: Update Completion

Change `showCompletionMessage()` to async:
```javascript
async function showCompletionMessage() {
    await endGameSession();
    // ... rest of function
}
```

### Change 4: Add Await Calls

In `nextWhichCar()` and `nextFixCar()`:
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

---

## Testing (2 min)

### Test 1: Manual cURL

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

Expected: `{"success": true}`

### Test 2: Browser Console

1. Press **F12** → **Console**
2. Play one full game
3. Look for: `✅ Session saved to database`

### Test 3: Supabase Table

1. Open Supabase dashboard
2. **Table Editor** → **game_sessions**
3. Should see new rows with your game data

---

## Verification

### Checklist

- [ ] Supabase table created
- [ ] PostgreSQL connection works
- [ ] N8N IF node added
- [ ] N8N PostgreSQL node configured
- [ ] Game code updated
- [ ] curl test passes
- [ ] Browser console shows success
- [ ] Supabase has data

---

## What Gets Tracked

### Example Data

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
  "session_id": "session_1733400000000",
  "metadata": {"accuracy_percent": 66.67}
}
```

### Analytics Queries

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

## Troubleshooting

### No Data in Database

**Check**:
1. Browser console (F12) for errors
2. N8N PostgreSQL connection test
3. SSL is enabled in N8N

**Fix**:
- Verify connection details exact
- Re-test N8N PostgreSQL connection
- Check N8N workflow logs

### Connection Refused

**Cause**: PostgreSQL connection failed

**Fix**:
1. Verify Host: `db.xxxx.supabase.co`
2. Port: `5432`
3. **SSL: ON** (required!)
4. Password exact

### Game Won't Complete

**Check**:
- Browser console for JavaScript errors
- All code changes applied
- Functions are async/await

---

## Next Steps

1. ✅ Track game sessions
2. → Query data with SQL
3. → Build dashboards
4. → Generate reports
5. → Add achievements

---

**Need help?** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
