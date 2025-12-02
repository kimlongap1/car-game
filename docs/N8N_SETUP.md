# N8N Webhook Setup

Configure your N8N workflow for card generation and progress tracking.

---

## Table of Contents

1. [Overview](#overview)
2. [Webhook Configuration](#webhook-configuration)
3. [Card Generation](#card-generation)
4. [Structured Output](#structured-output)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Overview

Your game connects to N8N via webhook for:
1. **Card Generation** - AI generates dynamic flashcards
2. **Progress Tracking** - Database saves game sessions

---

## Webhook Configuration

### Webhook URL

```
https://n8n-new.vibookers.com/webhook-test/car-game
```

This is already configured in `car-game.html` (line 382).

### Game Requests

The game sends two types of requests:

**1. Get Cards**
```json
{
  "action": "get_cards",
  "game_type": "which-car",
  "difficulty": 1,
  "session_score": {"correct": 0, "total": 0}
}
```

**2. Track Progress**
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

---

## Card Generation

### Agent AI Node

**System Prompt**:
```
You are generating educational flashcards for a children's car game.

Game Type: {{$json.game_type}}
Difficulty Level: {{$json.difficulty}}
Child's Score: {{$json.session_score.correct}} / {{$json.session_score.total}}

Generate 5-10 flashcards. Output ONLY valid JSON:

{
  "cards": [
    {
      "word": "RED",
      "emoji": "🔴🚗",
      "category": "color",
      "difficulty": 1
    }
  ],
  "difficulty": 1,
  "status": "success"
}

CRITICAL RULES:
- Output ONLY valid JSON
- NO markdown code blocks
- NO extra text
- All fields required
```

### Expected Response

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

## Structured Output

### Parser Configuration

**Schema Type**: Generate From JSON Example

**JSON Example**:
```json
{
  "cards": [
    {
      "word": "RED",
      "emoji": "🔴🚗",
      "category": "color",
      "difficulty": 1
    }
  ],
  "difficulty": 1,
  "status": "success"
}
```

**Settings**:
- Auto-Fix Format: ON
- On Error: Continue

This removes markdown wrappers and validates JSON from Agent AI.

---

## Testing

### Test Card Generation

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

**Expected**: Array of cards

### Test Progress Tracking

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

**Expected**: Success response

---

## Troubleshooting

### Webhook Not Responding

**Check**:
1. N8N workflow is active
2. Webhook node path is correct: `/webhook-test/car-game`
3. Respond to Webhook node is connected

**Fix**:
- Activate workflow
- Re-check node connections
- Test with curl

### LLM Output Wrapped in Markdown

**Issue**: Cards returned as `"```json\n[...]\n```"`

**Fix**:
1. Update Agent AI prompt (see above)
2. Enable "Auto-Fix Format" in Structured Output Parser
3. Verify all rules in prompt

### No Data to Database

See [DATABASE_SETUP.md](./DATABASE_SETUP.md#troubleshooting)

---

## Workflow Diagram

```
┌─────────────────┐
│   Webhook       │
└────────┬────────┘
         │
         ▼
    ┌────────┐
    │   IF   │
    └─┬───┬──┘
      │   │
   TRUE FALSE
      │   │
      ▼   ▼
   ┌────────┐  ┌──────────┐
   │Agent AI│  │PostgreSQL│
   └─┬──────┘  └──┬───────┘
     │            │
     ▼            │
 ┌──────────┐    │
 │Structured│    │
 │  Output  │    │
 └─┬────────┘    │
   │             │
   └──────┬──────┘
          ▼
   ┌─────────────┐
   │   Respond   │
   │   Webhook   │
   └─────────────┘
```

---

**See also**: [DATABASE_SETUP.md](./DATABASE_SETUP.md) for progress tracking configuration
