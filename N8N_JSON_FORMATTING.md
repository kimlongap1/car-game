# N8N JSON Formatting - Fix LLM Output

Your Claude LLM node is outputting JSON wrapped in markdown code blocks. Here's how to extract and format it properly.

## The Problem

Claude outputs:
```
```json
[
  {"word": "RED", ...},
  ...
]
```
```

But your game expects:
```json
{
  "cards": [
    {"word": "RED", ...}
  ],
  "difficulty": 1,
  "status": "success"
}
```

## Solution: Use Function Node to Extract & Format

### Step 1: Add Function Node

1. In your N8N workflow, add a **Function** node
2. Place it **after your Claude node**
3. Configure it with this JavaScript code:

```javascript
// Extract JSON from Claude's markdown wrapper
let output = $input.all()[0].json.output;

// Remove markdown code block markers
let jsonStr = output
  .replace(/```json\n?/g, '')
  .replace(/```\n?/g, '')
  .trim();

// Parse the JSON
let cards = JSON.parse(jsonStr);

// Format the response
return {
  cards: cards,
  difficulty: $input.all()[0].json.difficulty || 1,
  status: "success"
};
```

### Step 2: Connect Nodes

```
Webhook → Claude → Function → Respond to Webhook
```

### Step 3: Test

Run the workflow and check the output - should be clean JSON!

---

## Alternative Method: Using Edit Fields Node

If Function node doesn't work, try this:

### Step 1: Add "Edit Fields" Node

1. Add **Set** node (or **Edit Fields** if available)
2. After Claude node
3. Configure:

```
Name: cards
Type: Expression
Value: =JSON.parse($json.output.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())

Name: difficulty
Type: Expression
Value: =$json.difficulty || 1

Name: status
Type: Expression
Value: ="success"
```

### Step 2: Connect

```
Webhook → Claude → Set → Respond to Webhook
```

---

## Advanced: More Robust Extraction

If Claude sometimes outputs with different formatting, use this more robust code:

```javascript
let output = $input.all()[0].json.output;

// Try multiple ways to extract JSON
let jsonStr = output;

// Remove markdown code blocks
jsonStr = jsonStr.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');

// Remove any escaped quotes at the start/end
jsonStr = jsonStr.trim();

// Try to parse
let cards;
try {
  cards = JSON.parse(jsonStr);
} catch (e) {
  // If parsing fails, log the error
  throw new Error(`Failed to parse JSON: ${e.message}. Input: ${jsonStr.substring(0, 100)}`);
}

// Return formatted response
return {
  cards: Array.isArray(cards) ? cards : [cards],
  difficulty: $input.all()[0].json.difficulty || 1,
  status: "success"
};
```

---

## Better Claude Prompt (Prevention)

To avoid markdown wrapping, update your Claude node's prompt:

```
You are generating simple educational flashcards for a child learning about cars.

Game Type: {{$json.game_type}}
Difficulty Level: {{$json.difficulty}}
Child's Score: {{$json.session_score.correct}} / {{$json.session_score.total}}

Generate exactly 10 flashcards. Output ONLY valid JSON array, nothing else:

[
  {"word": "RED", "emoji": "🔴🚗", "category": "color", "difficulty": 1},
  {"word": "BLUE", "emoji": "🔵🚗", "category": "color", "difficulty": 1}
]

Rules:
- ONLY output JSON
- NO markdown code blocks
- NO explanations
- NO extra text
- Valid JSON only
```

The key is:
- Say "Output ONLY valid JSON array"
- Say "NO markdown code blocks"
- Say "NO extra text"

---

## Quick Setup Summary

### Minimal Setup (Fastest)
```
Webhook → Claude (good prompt) → Respond to Webhook
```

With proper prompt, Claude won't wrap in markdown.

### Current Setup (With Function Node)
```
Webhook → Claude → Function (JSON extraction) → Respond to Webhook
```

Use the JavaScript function to clean up output.

### Most Robust Setup
```
Webhook → Claude → Function (extraction) → Set (format) → Respond to Webhook
```

Extra formatting to ensure correct response structure.

---

## Test Your Setup

After adding the Function node, test with curl:

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

Expected response:
```json
{
  "cards": [
    {"word": "RED", "emoji": "🔴🚗", ...},
    {"word": "BLUE", "emoji": "🔵🚗", ...}
  ],
  "difficulty": 1,
  "status": "success"
}
```

---

## Troubleshooting

### "JSON is not valid"
- Claude wrapped it in markdown
- Check output in node logs
- Use Function node to extract

### "Unexpected token"
- Check for escaped quotes
- Verify no extra markdown markers
- Test JSON parsing separately

### "cards is undefined"
- Ensure cards field is set
- Check function is returning correct object
- Verify Array.isArray() works

### Game shows no cards
- Check browser console (F12)
- Verify curl test works
- Check N8N logs for errors
- Make sure Respond to Webhook returns correct format

---

## Complete Working Example

Here's a complete working flow:

### 1. Webhook Node
- Method: POST
- Path: car-game

### 2. Claude Node
```
Model: claude-3-5-sonnet-20241022

Prompt:
You are generating flashcards for a car game.

Game Type: {{$json.game_type}}
Difficulty: {{$json.difficulty}}

Output ONLY valid JSON array (no markdown, no explanation):
[
  {"word": "RED", "emoji": "🔴🚗", "category": "color", "difficulty": 1},
  {"word": "BLUE", "emoji": "🔵🚗", "category": "color", "difficulty": 1}
]
```

### 3. Function Node
```javascript
let output = $input.all()[0].json.output;
let jsonStr = output.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
let cards = JSON.parse(jsonStr);

return {
  cards: cards,
  difficulty: $input.all()[0].json.difficulty || 1,
  status: "success"
};
```

### 4. Respond to Webhook Node
- Default settings

### 5. Connect
Webhook → Claude → Function → Respond to Webhook

---

## Summary

| Issue | Solution |
|-------|----------|
| JSON wrapped in markdown | Use Function node to extract |
| Claude includes code blocks | Update prompt to say "NO markdown" |
| Parsing fails | Use try/catch in Function |
| Wrong response format | Ensure cards/difficulty/status fields |

The **Function node** method is most reliable and gives you complete control over output formatting.

---

## Next Steps

1. Add Function node after Claude
2. Paste the JavaScript code
3. Test with curl
4. Check browser console
5. Game should fetch cards!

Your game will work perfectly once the JSON is formatted correctly! 🚗✨
