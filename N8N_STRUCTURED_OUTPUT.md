# N8N Agent AI - Structured Output Parser Guide

You're using the **Structured Output Parser** node! This is the cleanest approach for handling JSON from Agent AI.

## The Solution

The **Structured Output Parser** automatically:
- ✅ Parses JSON from Agent AI output
- ✅ Validates against schema
- ✅ Removes markdown wrappers
- ✅ Returns clean structured data

## Setup (Already Done!)

Your schema shows:
```json
{
  "cards": [
    {"word": "RED", "emoji": "🔴🚗", "category": "color", "difficulty": 1}
  ],
  "difficulty": 1,
  "status": "success"
}
```

This is **exactly what your game needs!** ✅

## Why You Got an Error

The error message says:
> "Model output doesn't fit required format"

This means the **Agent AI output doesn't match your schema**.

### Common Causes:

1. **Agent AI returns markdown wrapped JSON**
   ```
   ```json
   {...}
   ```
   ```

2. **Missing required fields** in Agent AI output

3. **Agent AI returns wrong structure**
   - Expected: `{cards: [...], difficulty: 1, status: "success"}`
   - Got: `[{...}]` (just array)

4. **Wrong field types**
   - Expected: `difficulty` (number)
   - Got: `difficulty` (string)

## Fix: Update Agent AI System Prompt

In your **Agent AI node**, set the system prompt to output EXACTLY this format:

```
You are generating educational flashcards for a children's car game.

Game Type: {{$json.game_type}}
Difficulty Level: {{$json.difficulty}}
Child's Score: {{$json.session_score.correct}} / {{$json.session_score.total}}

Generate 5-10 flashcards. Output ONLY valid JSON matching this exact structure:

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

CRITICAL RULES:
- Output ONLY valid JSON
- NO markdown code blocks
- NO extra text or explanation
- All fields must be present
- 'difficulty' and 'cards' count are required
- 'status' should always be "success"
- Each card must have: word, emoji, category, difficulty
```

## Verify Your Schema

In Structured Output Parser, make sure your JSON Example matches:

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

## Structured Output Parser Settings

### Parameters Tab:
- **Schema Type**: "Generate From JSON Example"
- **JSON Example**: (the schema above)
- **Auto-Fix Format**: Toggle ON (recommended)

### Settings Tab:
- **On Error**: Choose "Continue" to allow retry

## How It Works

```
Agent AI generates:
↓
"```json\n{\"cards\": [...], \"difficulty\": 1, \"status\": \"success\"}\n```"
↓
Structured Output Parser:
  - Detects JSON
  - Removes markdown
  - Validates against schema
  - Returns clean object
↓
Your game gets:
{
  "cards": [...],
  "difficulty": 1,
  "status": "success"
}
```

## Workflow

```
┌─────────────┐
│  Webhook    │
└──────┬──────┘
       │
       ▼
   Agent AI
 (with system prompt)
       │
       ▼
Structured Output Parser
 (validates & cleans)
       │
       ▼
Respond to Webhook
       │
       ▼
  Your Game ✅
```

## Testing

After configuring, test with curl:

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

**Expected response:**
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

## Troubleshooting

### "Model output doesn't fit required format"

**Solution 1: Fix Agent Prompt**
- Agent is not outputting correct structure
- Update system prompt (see above)
- Test Agent AI separately first
- Check Agent AI logs

**Solution 2: Enable Auto-Fix Format**
- In Structured Output Parser Settings
- Toggle "Auto-Fix Format" ON
- This helps with markdown wrapping

**Solution 3: Check Field Names**
- Make sure field names match exactly:
  - `cards` (not `card` or `items`)
  - `difficulty` (not `level`)
  - `status` (not `ok` or `success_status`)

**Solution 4: Check Field Types**
- `cards` must be an array `[...]`
- `difficulty` must be a number `1` (not `"1"`)
- `status` must be a string `"success"`

### Agent AI returns wrong format

**If Agent returns just array:**
```json
[
  {"word": "RED", ...}
]
```

**Fix:** Update prompt to include wrapper object:
```
Output this exact format:
{
  "cards": [
    {"word": "RED", ...}
  ],
  "difficulty": 1,
  "status": "success"
}
```

### Empty cards array

**Cause:** Agent AI isn't generating cards properly

**Fix:**
1. Test Agent AI separately
2. Simplify the prompt
3. Add example in system prompt
4. Check Agent AI logs for errors

## Advanced: Optional Fields

If you want optional fields, use JSON Schema instead:

1. Change Schema Type to **"JSON Schema"**
2. Add this schema:

```json
{
  "type": "object",
  "properties": {
    "cards": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "word": {"type": "string"},
          "emoji": {"type": "string"},
          "category": {"type": "string"},
          "difficulty": {"type": "number"}
        },
        "required": ["word", "emoji"]
      },
      "required": true
    },
    "difficulty": {
      "type": "number",
      "default": 1
    },
    "status": {
      "type": "string",
      "default": "success"
    }
  },
  "required": ["cards"]
}
```

This makes `difficulty` and `status` optional with defaults.

## Complete Setup Checklist

- [ ] Agent AI node has correct system prompt
- [ ] Agent AI outputs matching structure
- [ ] Structured Output Parser has correct schema
- [ ] Auto-Fix Format is enabled (recommended)
- [ ] On Error is set to "Continue"
- [ ] Test with curl command
- [ ] Game receives clean JSON
- [ ] Game displays cards correctly

## Summary

| Component | Purpose |
|-----------|---------|
| Agent AI | Generates cards with AI |
| Structured Output Parser | Validates & cleans JSON |
| Respond to Webhook | Returns to game |

The **Structured Output Parser** is perfect for this! It automatically handles:
- Markdown removal
- JSON parsing
- Schema validation
- Type conversion

## Next Steps

1. Update Agent AI system prompt (copy from above)
2. Verify Structured Output Parser schema matches
3. Enable Auto-Fix Format
4. Test with curl
5. Your game will work! ✅

Your approach is excellent - Structured Output Parser is the most reliable method! 🚗✨
