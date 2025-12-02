# N8N Agent AI - JSON Formatting Guide

You're using the **Agent AI node** (with Google Gemini or Claude as the model). Here's how to format the JSON output properly.

## The Problem

Agent AI output format:
```json
[
  {
    "output": "```json\n[...]\n```"
  }
]
```

Your game expects:
```json
{
  "cards": [...],
  "difficulty": 1,
  "status": "success"
}
```

## Solution 1: Add Format Response Node (Easiest)

### Step 1: Add "Set" Node After Agent

1. Click **+ Add Node**
2. Search: **Set**
3. Place it after Agent AI node

### Step 2: Configure the Set Node

In the "Values" section, add these fields:

**Field 1: cards**
- Type: Expression
- Value:
```javascript
=JSON.parse($json.output.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
```

**Field 2: difficulty**
- Type: Expression
- Value:
```javascript
=$json.difficulty || 1
```

**Field 3: status**
- Type: Expression
- Value:
```javascript
="success"
```

### Step 3: Connect

```
Webhook → Agent AI → Set → Respond to Webhook
```

### Step 4: Test

Your response will now be clean JSON!

---

## Solution 2: Use Function Node (More Control)

### Step 1: Add Function Node

1. Click **+ Add Node**
2. Search: **Function**
3. After Agent AI node

### Step 2: Paste Code

```javascript
// Extract from Agent AI output
let agentOutput = $input.all()[0].json;

// Handle both cases: direct output or wrapped in "output" field
let jsonStr = agentOutput.output || agentOutput;

// Remove markdown code blocks
jsonStr = jsonStr
  .replace(/```json\n?/g, '')
  .replace(/```\n?/g, '')
  .trim();

// Parse JSON
let cards;
try {
  cards = JSON.parse(jsonStr);
} catch (e) {
  // If it's already an array, use it directly
  if (Array.isArray(agentOutput)) {
    cards = agentOutput;
  } else {
    throw new Error(`Failed to parse JSON: ${e.message}`);
  }
}

// Return formatted response
return {
  cards: Array.isArray(cards) ? cards : [cards],
  difficulty: agentOutput.difficulty || 1,
  status: "success"
};
```

### Step 3: Connect

```
Webhook → Agent AI → Function → Respond to Webhook
```

---

## Solution 3: Fix Agent AI Prompt (Prevention)

**Best approach:** Configure the Agent AI system prompt correctly.

### In Agent AI Node Settings:

Under "System Prompt" or "Instructions", add:

```
You are generating flashcards for a car game.

When asked for cards, generate a JSON array with these fields for each card:
- word: The word/label
- emoji: An emoji representation
- category: The category (color, car, part, etc)
- difficulty: Difficulty level (1-3)

Game Type: {{$json.game_type}}
Difficulty Level: {{$json.difficulty}}
Child's Score: {{$json.session_score.correct}} / {{$json.session_score.total}}

IMPORTANT:
- Output ONLY a valid JSON array
- NO markdown code blocks
- NO explanation text
- NO additional information
- Start with [ and end with ]

Example output format:
[
  {"word": "RED", "emoji": "🔴🚗", "category": "color", "difficulty": 1},
  {"word": "BLUE", "emoji": "🔵🚗", "category": "color", "difficulty": 1}
]
```

**Key phrases that work with Agent AI:**
- "Output ONLY valid JSON array"
- "NO markdown code blocks"
- "NO explanation"
- "Start with [ and end with ]"

---

## Solution 4: Format Response Node (Simplest)

If N8N has a **Format Response** node (as shown in your diagram):

1. Add **Format Response** node after Agent AI
2. Configure to output as JSON
3. Map fields:
   - `cards` → `$json.output` (parsed)
   - `difficulty` → `$json.difficulty`
   - `status` → `"success"`

---

## Comparison of Methods

| Method | Difficulty | Time | Reliability |
|--------|-----------|------|------------|
| Set Node (Expression) | Easy | 2 min | Good |
| Function Node | Medium | 3 min | Excellent |
| Fix Prompt | Medium | 5 min | Excellent |
| Format Response | Easy | 1 min | Good |

**Recommended:** Use **Set Node** (easiest) + **Fix Prompt** (prevents issues)

---

## Complete Workflow with Agent AI

```
┌─────────────┐
│  Webhook    │ (POST /car-game)
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Agent AI Node               │
├─────────────────────────────────────┤
│ Chat Model: Claude or Gemini        │
│ System Prompt: (see above)          │
│ Input: $json.game_type, difficulty │
└──────┬──────────────────────────────┘
       │ (outputs: {"output": "```json[...]```"})
       ▼
┌─────────────────────────────────────┐
│  Set Node (Format Response)         │
├─────────────────────────────────────┤
│ cards: JSON.parse($json.output)    │
│ difficulty: $json.difficulty || 1  │
│ status: "success"                   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Respond to Webhook                │
├─────────────────────────────────────┤
│ Returns clean JSON to game          │
└─────────────────────────────────────┘
```

---

## Testing Your Setup

### Test with cURL

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

---

## Troubleshooting

### Agent AI returns plain text instead of JSON
- Update system prompt to emphasize JSON-only output
- Add "NO markdown" explicitly
- Test with simple prompt first

### "Invalid JSON" error
- Agent wrapped output in markdown
- Use Set node with JSON.parse + string replacement
- Check Agent AI logs for actual output

### Cards array is empty
- Check Agent AI is actually generating content
- Verify system prompt is being used
- Test Agent AI separately first

### Function node throws error
- Check $json.output exists
- Verify markdown markers are present
- Use console.log for debugging

---

## Tips for Agent AI

1. **Be explicit in system prompt**
   - "Output ONLY JSON"
   - "NO explanations"
   - "NO markdown"

2. **Provide example output**
   - Show exact format you want
   - Include sample JSON in prompt
   - Use triple brackets: `[...]`

3. **Test incrementally**
   - Test Agent AI output first
   - Then add Set/Format node
   - Finally test full webhook

4. **Check Agent AI logs**
   - Click "Logs" in workflow
   - See actual Agent output
   - Verify formatting

---

## Your Workflow (Recommended Setup)

**Step 1:** Add Set Node after Agent AI

**Step 2:** Configure with:
```
cards = JSON.parse($json.output.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
difficulty = $json.difficulty || 1
status = "success"
```

**Step 3:** Connect: Webhook → Agent AI → Set → Response

**Step 4:** Update Agent AI system prompt with "NO markdown" instruction

**Step 5:** Test with curl command above

---

## Summary

| Component | Action |
|-----------|--------|
| Agent AI | Generates cards (may wrap in markdown) |
| Set Node | Extracts & formats JSON |
| Response | Returns clean JSON to game |

The **Set node** handles the markdown removal and formatting.

Your game will work perfectly! 🚗✨
