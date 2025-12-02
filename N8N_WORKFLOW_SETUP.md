# N8N Workflow Configuration - Complete Setup

Step-by-step guide to configure your N8N workflow for both card generation AND database tracking.

---

## Current Status

Your current workflow (working):
```
Webhook → Agent AI → Structured Output Parser → Respond to Webhook
```

Your new workflow (needed):
```
Webhook
    ↓
IF Node: Check $json.action
    │
    ├─ TRUE (action="get_cards")
    │   └─ Agent AI → Structured Output Parser → Respond to Webhook
    │
    └─ FALSE (action="track_progress")
        └─ PostgreSQL → Respond to Webhook
```

---

## Overview: How It Works

When game sends request to webhook:

**GET CARDS:**
```json
{
  "action": "get_cards",
  "game_type": "which-car",
  "difficulty": 1,
  "session_score": {"correct": 0, "total": 0}
}
```
↓
IF node sees action="get_cards"
↓
Routes to Agent AI (existing path)
↓
Returns: `{"cards": [...], "difficulty": 1, "status": "success"}`

---

**TRACK PROGRESS:**
```json
{
  "action": "track_progress",
  "game_type": "which-car",
  "correct_answers": 2,
  "total_questions": 3,
  "difficulty": 1,
  "time_taken": 120,
  "child_name": "Emma",
  "session_id": "session_123"
}
```
↓
IF node sees action="track_progress"
↓
Routes to PostgreSQL (new path)
↓
Inserts into database
↓
Returns: `{"success": true}`

---

## Visual Workflow Diagram

```
┌────────────────────────┐
│   Webhook (POST)       │
│  /webhook-test/car-game
└────────┬───────────────┘
         │
         ▼
┌────────────────────────────┐
│  IF Node                   │
│  Condition:                │
│  $json.action == "get_cards"
└────┬───────────────┬───────┘
     │ TRUE          │ FALSE
     │               │
     ▼               ▼
┌─────────────┐   ┌──────────────┐
│  Agent AI   │   │  PostgreSQL  │
│  (LLM)      │   │  (Insert)    │
└─────┬───────┘   └──────┬───────┘
      │                  │
      ▼                  ▼
┌─────────────────────────────┐
│ Structured Output Parser    │
│ (JSON validation)           │
└─────┬───────────────────────┘
      │
      ▼
┌──────────────────────────┐
│  Respond to Webhook      │
│  (Send response back)    │
└──────────────────────────┘
```

---

## Step 1: Add IF Node

### In your N8N workflow:

1. **Open your workflow** in N8N
2. **After Webhook node**, click **"+"** to add new node
3. Search for **"IF"** and click **"If"** node
4. Click to add it

Your workflow now has:
```
Webhook → IF → ...
```

---

## Step 2: Configure IF Node

### Node Configuration:

**Click on IF node** to see settings panel

**In "Condition" section:**

```
Condition Type: String
Property: $json.action
Condition: Equal to
Value: "get_cards"
```

This means:
- **TRUE**: When action is "get_cards" (card generation)
- **FALSE**: When action is NOT "get_cards" (tracking, etc.)

---

## Step 3: Connect TRUE Path (Agent AI)

The TRUE path is your existing card generation workflow.

### From IF node:
1. Click the **output socket** (bottom right, labeled "true")
2. Drag to **Agent AI node**
3. Connect

Your TRUE path:
```
IF (true) → Agent AI → Structured Output Parser → Respond to Webhook
```

**IMPORTANT**: Make sure your Respond to Webhook node is connected to Structured Output Parser, NOT directly from Agent AI.

---

## Step 4: Add PostgreSQL Node (FALSE Path)

When action is "track_progress", route to database.

### Add PostgreSQL Node:

1. Click **IF node** again
2. Find the **"false" output** (bottom right)
3. Click **"+"** to add node to false path
4. Search: **"PostgreSQL"**
5. Click **"PostgreSQL"** node
6. Click to add

Now you have:
```
IF (false) → PostgreSQL
```

---

## Step 5: Configure PostgreSQL Connection

### Click on PostgreSQL node:

**Credentials Section:**
1. Click **"Create New"** dropdown
2. Select **"Create a new PostgreSQL connection"**

### Fill in Supabase Details:

From [SUPABASE_DATABASE_SETUP.md](SUPABASE_DATABASE_SETUP.md), Step 3, get:

| Field | Value |
|-------|-------|
| **Hostname** | `db.xxxxxxxxxxx.supabase.co` |
| **Port** | `5432` |
| **Database** | `postgres` |
| **User** | `postgres` |
| **Password** | (from Supabase) |
| **SSL** | **Toggle ON** (required!) |

### Test Connection:
1. Click **"Test Connection"** button
2. Should see: "Connection successful ✓"
3. If fails, verify credentials exactly

### Save Credentials:
1. Click **"Save"** button
2. Connection is now saved

---

## Step 6: Configure PostgreSQL Query

### In PostgreSQL node, set Query Type:

**Query Type**: `SQL` (should be default)

### Query:

In the "Query" field, paste:

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

### Parameters:

Below the query, you'll see "Parameters" section. Add these:

| Param | Expression |
|-------|-----------|
| **$1** | `$json.child_name` |
| **$2** | `$json.game_type` |
| **$3** | `$json.correct_answers` |
| **$4** | `$json.total_questions` |
| **$5** | `$json.correct_answers / $json.total_questions * 100` |
| **$6** | `$json.difficulty` |
| **$7** | `$json.time_taken` |
| **$8** | `$json.session_id` |
| **$9** | `$json.metadata \|\| {}` |

### How to Add Parameters:

1. Click **"Add parameter"** button
2. For each row above:
   - **Name**: `$1`, `$2`, etc.
   - **Value**: The expression from table
3. Use **Expression** toggle (not "Constant")

---

## Step 7: Connect PostgreSQL to Response

From PostgreSQL node:
1. Click the **output socket** (bottom right)
2. Drag to **Respond to Webhook** node
3. Connect

Now FALSE path:
```
IF (false) → PostgreSQL → Respond to Webhook
```

---

## Step 8: Update Respond to Webhook Node

Your Respond to Webhook should now receive from TWO sources:

```
IF (true) → Agent AI → Structured Output Parser ─┐
                                                   ├─→ Respond to Webhook
IF (false) → PostgreSQL ──────────────────────────┘
```

This is correct! The Respond to Webhook node can have multiple inputs.

### Configure Response:

**Click Respond to Webhook node:**

**Response Body:**
```json
{
  "success": true,
  "message": "Processed successfully"
}
```

Both paths will send a response. The game doesn't care about the exact response format for tracking—it just needs 200 OK.

---

## Step 9: Complete Workflow Check

Your final workflow should look like:

```
┌─────────────┐
│   Webhook   │
└──────┬──────┘
       │
       ▼
  ┌────────┐
  │   IF   │
  └─┬───┬──┘
    │   │
  true false
    │   │
    ▼   ▼
  ┌─────────────┬──────────────┐
  │  Agent AI   │  PostgreSQL  │
  └──────┬──────┴──────┬───────┘
         │             │
         ▼             │
  ┌──────────────┐    │
  │  Structured  │    │
  │   Output     │    │
  │   Parser     │    │
  └──────┬───────┘    │
         │            │
         └──────┬─────┘
                ▼
         ┌──────────────┐
         │  Respond to  │
         │   Webhook    │
         └──────────────┘
```

---

## Step 10: Test the Setup

### Test Card Generation (GET_CARDS):

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
  "cards": [
    {"word": "RED", "emoji": "🔴🚗", "category": "color", "difficulty": 1},
    {"word": "BLUE", "emoji": "🔵🚗", "category": "color", "difficulty": 1}
  ],
  "difficulty": 1,
  "status": "success"
}
```

---

### Test Progress Tracking (TRACK_PROGRESS):

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
  "message": "Processed successfully"
}
```

### Verify in Supabase:

1. Go to Supabase dashboard
2. Open **Table Editor**
3. Click **game_sessions** table
4. Should see new row with Emma's data!

---

## Troubleshooting

### Issue: "IF node not routing correctly"

**Check:**
1. Condition is exactly: `$json.action == "get_cards"`
2. Both true and false outputs are connected
3. Save workflow (Ctrl+S)
4. Test with both curl commands

---

### Issue: "PostgreSQL connection fails"

**Check:**
1. Host is exactly: `db.xxxxxxxxxxx.supabase.co`
2. SSL is **toggled ON**
3. Port is `5432`
4. Database is `postgres`
5. User is `postgres`
6. Password copied exactly
7. Click "Test Connection" again

---

### Issue: "No data in database"

**Check:**
1. Did PostgreSQL node execute? Check N8N logs
2. Does game send `action: "track_progress"`? Check game code
3. Run manual curl test (Step 10) first
4. Look at N8N workflow execution logs

---

### Issue: "Agent AI still returning markdown"

**Check:**
1. Structured Output Parser is enabled
2. Schema matches expected output
3. Auto-Fix Format is ON in Structured Output Parser settings

---

## Workflow Save

After completing all steps:

1. Click **Save** (top right, or Ctrl+S)
2. Click **Activate** (toggle to ON)
3. Webhook is now LIVE

Your workflow is now ready!

---

## Quick Reference

### Game Actions Handled

| Action | Route | Handler | Response |
|--------|-------|---------|----------|
| `get_cards` | TRUE path | Agent AI | Cards array |
| `track_progress` | FALSE path | PostgreSQL | Success message |
| (other) | FALSE path | PostgreSQL | Attempts insert (may fail) |

---

### Data Flow Example

**User plays 3 rounds of Which Car:**

```
Game starts
  ↓ Sends: action="get_cards"
N8N Routes to Agent AI
  ↓
Cards returned to game
  ↓
User plays rounds 1, 2, 3
  ↓
Game ends (3 rounds complete)
  ↓
Game sends: action="track_progress"
  ↓
N8N Routes to PostgreSQL
  ↓
Data inserted: Emma, which-car, 2/3 correct, 120 seconds
  ↓
Supabase table updated
  ↓
✓ Complete!
```

---

## Next: Update Game Code

After workflow is set up, go to [Game Code Updates](GAME_CODE_UPDATES.md) to add the trackProgress function.

---

## Summary

| Component | Status |
|-----------|--------|
| IF Node | ⬜ Add |
| PostgreSQL Connection | ⬜ Configure |
| PostgreSQL Query | ⬜ Set up |
| Response Routing | ⬜ Connect |
| Test GET_CARDS | ⬜ Verify |
| Test TRACK_PROGRESS | ⬜ Verify |
| Database Data | ⬜ Check |

Once complete, your N8N workflow handles both card generation and progress tracking! 🚀
