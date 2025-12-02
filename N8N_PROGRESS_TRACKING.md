# N8N Progress Tracking - Database & Google Sheets Setup

Track every game session to a database for analytics and parent reports.

## Overview

Your workflow will now:
1. Generate cards (existing)
2. Track progress when game ends (new)
3. Log to Google Sheets or database (new)

---

## Architecture

```
Game Plays
    │
    ├─ action="get_cards" → Card Generation (existing)
    │
    └─ action="track_progress" → Log to Database (NEW)
        ├─ Save: game_type, correct, total, difficulty, time
        └─ Store in: Google Sheets / Database
```

---

## Option 1: Google Sheets (Easiest)

### Why Google Sheets?
- ✅ Free
- ✅ Easy to set up
- ✅ Parents can view anytime
- ✅ Auto-generates charts
- ✅ No backend needed

### Setup

#### Step 1: Create Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new spreadsheet: `car-game-progress`
3. Create columns:
```
A: Date
B: Game Type
C: Correct Answers
D: Total Questions
E: Accuracy %
F: Difficulty Level
G: Time (seconds)
H: Child Name
```

#### Step 2: Share Sheet for N8N

1. Click **Share** (top right)
2. Copy the **Sheet ID** from URL:
```
https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```
3. Share with "Anyone with link" or specific email

#### Step 3: Get Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `car-game`
3. Enable Google Sheets API
4. Create Service Account:
   - Go to Credentials
   - Create Service Account
   - Create JSON key
   - Download the JSON file
5. Share your Google Sheet with the service account email

#### Step 4: Add to N8N

In N8N:
1. Add **Google Sheets** node after Webhook
2. Authenticate with service account JSON
3. Configure:
   - **Spreadsheet ID**: (from URL)
   - **Sheet**: Sheet1
   - **Operation**: Append
4. Map fields:
   - Date: `=now()`
   - Game Type: `={{$json.game_type}}`
   - Correct: `={{$json.correct_answers}}`
   - Total: `={{$json.total_questions}}`
   - Accuracy: `={{$json.correct_answers / $json.total_questions * 100}}`
   - Difficulty: `={{$json.difficulty}}`
   - Time: `={{$json.time_taken}}`
   - Child: `={{$json.child_name}}`

#### Step 5: Test

Run this curl:
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
    "child_name": "Emma"
  }'
```

Check your Google Sheet - new row should appear! ✅

---

## Option 2: Database (PostgreSQL/MySQL)

### Why Database?
- ✅ Better for analytics
- ✅ Faster queries
- ✅ More data control
- ✅ Professional solution
- ❌ Requires hosting

### Setup

#### Step 1: Create Database

Using free options:
- **Supabase** (PostgreSQL) - Free tier
- **Railway** (PostgreSQL) - Free tier
- **Heroku** (PostgreSQL) - Paid
- **AWS RDS** - Free tier

**Using Supabase (recommended):**

1. Go to [supabase.com](https://supabase.com)
2. Sign up (free)
3. Create new project
4. Create table:

```sql
CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  child_name VARCHAR(100),
  game_type VARCHAR(50),
  correct_answers INT,
  total_questions INT,
  accuracy_percent FLOAT,
  difficulty_level INT,
  time_taken_seconds INT
);
```

5. Get connection details:
   - Host
   - Database
   - User
   - Password

#### Step 2: Add to N8N

In N8N:
1. Add **PostgreSQL** node after Webhook
2. Authenticate with connection details
3. Query:

```sql
INSERT INTO game_sessions
(child_name, game_type, correct_answers, total_questions, accuracy_percent, difficulty_level, time_taken_seconds)
VALUES
('{{$json.child_name}}', '{{$json.game_type}}', {{$json.correct_answers}}, {{$json.total_questions}}, {{$json.accuracy}}, {{$json.difficulty}}, {{$json.time_taken}});
```

#### Step 3: Test

Same curl as above - data goes to database! ✅

---

## Option 3: Hybrid (Smart Mix) - RECOMMENDED

**Use both for best results:**

```
Track Progress
    ├─ Google Sheets (for parents to view)
    └─ Database (for advanced analytics)
```

### Setup

1. Add both Google Sheets AND PostgreSQL nodes
2. Track to both destinations
3. Parents can view sheets
4. You can run analytics on database

Cost: Still free! (Supabase free tier)

---

## Update N8N Workflow

Your workflow should now handle two actions:

```
Webhook receives request
    │
    ├─ Check action field
    │
    ├─ If action="get_cards"
    │   └─→ Agent AI → Structured Output → Response
    │
    └─ If action="track_progress"
        └─→ Google Sheets / Database → Response
```

### In N8N:

1. After Webhook, add **IF** node:
```
Condition: $json.action == "track_progress"
```

2. If TRUE:
```
→ Google Sheets (or PostgreSQL) → Respond to Webhook
```

3. If FALSE:
```
→ Agent AI → Structured Output → Respond to Webhook
```

---

## Update Game Code

In `car-game.html`, add progress tracking after each game:

```javascript
// After game ends (in nextWhichCar, nextFixCar, etc.)
async function endGame() {
  // Game finished, track progress
  await trackProgress(sessionScore.correct, sessionScore.total);
}

async function trackProgress(correct, total) {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'track_progress',
        game_type: currentGame,
        correct_answers: correct,
        total_questions: total,
        difficulty: currentDifficulty,
        time_taken: Math.round((Date.now() - gameStartTime) / 1000),
        child_name: 'Emma' // Can be dynamic
      })
    });

    const response_data = await response.json();
    console.log('Progress tracked:', response_data);
  } catch (error) {
    console.warn('Could not track progress:', error);
    // Game still works, just no tracking
  }
}

// Call after each game round
function nextWhichCar() {
  currentRound++;
  if (currentRound < 3) {
    playWhichCar();
  } else {
    // Game finished!
    await trackProgress(sessionScore.correct, sessionScore.total);
    showCompletionMessage();
  }
}
```

---

## Data Structure

### What Gets Tracked

```json
{
  "action": "track_progress",
  "game_type": "which-car",
  "correct_answers": 2,
  "total_questions": 3,
  "accuracy": 66.67,
  "difficulty": 1,
  "time_taken": 120,
  "child_name": "Emma"
}
```

### In Google Sheets

| Date | Game Type | Correct | Total | Accuracy % | Difficulty | Time (s) | Child |
|------|-----------|---------|-------|-----------|-----------|---------|-------|
| 1/15 | which-car | 2 | 3 | 66.67 | 1 | 120 | Emma |
| 1/15 | car-sounds | 5 | 6 | 83.33 | 1 | 180 | Emma |
| 1/15 | fix-car | 3 | 3 | 100 | 1 | 90 | Emma |

### In Database

```sql
SELECT
  child_name,
  game_type,
  COUNT(*) as sessions,
  AVG(accuracy_percent) as avg_accuracy,
  MAX(difficulty_level) as max_difficulty,
  SUM(time_taken_seconds) as total_time
FROM game_sessions
GROUP BY child_name, game_type;
```

---

## Analytics You Can Do

### With Google Sheets
- View all game sessions
- See accuracy trends
- Track difficulty progress
- Monthly reports
- Share with parents

### With Database
- Advanced queries
- Accuracy by game type
- Learning velocity
- Difficulty progression
- Time analysis
- Generate charts

---

## Example Dashboard Query (Database)

```sql
-- Weekly progress report
SELECT
  DATE_TRUNC('week', created_at) as week,
  game_type,
  AVG(accuracy_percent) as avg_accuracy,
  COUNT(*) as games_played
FROM game_sessions
WHERE child_name = 'Emma'
GROUP BY week, game_type
ORDER BY week DESC;
```

---

## Cost Analysis

| Option | Cost | Setup Time | Data Control |
|--------|------|-----------|--------------|
| Google Sheets | Free | 10 min | Limited |
| Database (Supabase) | Free tier | 15 min | Full |
| **Both (Hybrid)** | Free | 25 min | Best |

---

## Step-by-Step Implementation

### Phase 1: Add Google Sheets (10 minutes)

1. Create Google Sheet
2. Add Google Sheets node to N8N
3. Test with curl
4. Done!

### Phase 2: Add Conditional Logic (5 minutes)

1. Add IF node after Webhook
2. Route to correct action handler
3. Test both paths

### Phase 3: Update Game Code (10 minutes)

1. Add `trackProgress()` function
2. Call after each game
3. Test in browser

### Phase 4: Optional - Add Database (15 minutes)

1. Set up Supabase
2. Add PostgreSQL node to N8N
3. Both Google Sheets and database log data

---

## Testing

### Test Card Generation (existing)
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

### Test Progress Tracking (new)
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
    "child_name": "Emma"
  }'
```

---

## Complete N8N Workflow

```
Webhook (POST /car-game)
    │
    ▼
IF node: Check $json.action
    │
    ├─ "get_cards" → TRUE
    │   └─→ Agent AI
    │       └─→ Structured Output Parser
    │           └─→ Respond to Webhook
    │
    └─ "track_progress" → TRUE
        └─→ Google Sheets (new!)
            └─→ (Optional) PostgreSQL (new!)
                └─→ Respond to Webhook
```

---

## Summary

| Task | Time | Difficulty | Value |
|------|------|-----------|-------|
| Add Google Sheets | 10 min | Easy | High |
| Add Database | 15 min | Easy | High |
| Update Game Code | 10 min | Easy | High |
| Both Options | 25 min | Easy | Very High |

**Total time: 25 minutes for full tracking!** 🚀

---

## Next Steps

1. **Immediate**: Set up Google Sheets (10 min)
2. **Then**: Add IF logic to N8N (5 min)
3. **Then**: Update game code (10 min)
4. **Optional**: Add database for analytics (15 min)

You'll have complete progress tracking in ~25 minutes! 📊
