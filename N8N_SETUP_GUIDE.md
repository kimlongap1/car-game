# N8N Setup Guide for Car Game

## Current Status
✅ Webhook URL configured: `https://n8n-new.vibookers.com/webhook-test/car-game`
⏳ Workflow needs to be created

## Step 1: Access N8N
1. Open your n8n instance: `https://n8n-new.vibookers.com/`
2. Log in with your credentials

## Step 2: Create a New Workflow
1. Click **+ New Workflow**
2. Name it: `car-game-backend`
3. Save it

## Step 3: Add Webhook Trigger Node
1. Click **+ Add Node**
2. Search for **Webhook**
3. Configure:
   - **HTTP Method**: POST
   - **Path**: `car-game`
4. Save the node
5. The full webhook URL will be: `https://YOUR_DOMAIN/webhook/car-game`

## Step 4: Add Claude LLM Node (Optional - for dynamic cards)
1. Click **+ Add Node**
2. Search for **Anthropic Claude**
3. Add your Claude API Key as a credential
4. Set **Model**: `claude-3-5-sonnet-20241022`
5. In **Messages** field, add this prompt:

```
You are generating simple flashcards for a 4-year-old with speech delay who loves cars.

IMPORTANT: Output ONLY valid JSON, no other text.

Game Type: {{$json.game_type}}
Difficulty Level: {{$json.difficulty}}
Child's Score: {{$json.session_score.correct}} / {{$json.session_score.total}}

Generate 5 flashcards as JSON array:
[
  {"word": "RED", "emoji": "🔴🚗", "category": "color", "difficulty": 1},
  {"word": "BLUE", "emoji": "🔵🚗", "category": "color", "difficulty": 1},
  {"word": "YELLOW", "emoji": "🟡🚗", "category": "color", "difficulty": 1}
]
```

## Step 5: Add Response Node
1. Click **+ Add Node**
2. Search for **Respond to Webhook**
3. In the Response Body field, enter:

```json
{
  "cards": [
    {"word": "RED", "emoji": "🔴🚗", "category": "color", "difficulty": 1},
    {"word": "BLUE", "emoji": "🔵🚗", "category": "color", "difficulty": 1},
    {"word": "YELLOW", "emoji": "🟡🚗", "category": "color", "difficulty": 1}
  ],
  "difficulty": 1,
  "status": "success"
}
```

## Step 6: Connect the Nodes
- Connect **Webhook** → **Claude** (or directly to Response if not using Claude)
- Connect **Claude** → **Respond to Webhook**

## Step 7: Activate the Workflow
1. Click **Save**
2. Click the **Execute Workflow** button (play icon)
3. Your workflow is now active

## Step 8: Test in Your Game
1. Open `car-game.html` in a browser
2. Click any game button
3. Check the browser console (F12) for logs
4. The game should fetch cards from n8n

## Testing the Webhook Manually

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

Expected Response:
```json
{
  "cards": [...],
  "difficulty": 1,
  "status": "success"
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "webhook not registered" | Make sure workflow is saved and you clicked Execute Workflow |
| No response from webhook | Check that Respond to Webhook node is connected |
| Blank cards in game | Check browser console for errors (F12) |
| Claude errors | Verify API key is valid and has sufficient credits |

## Games Configuration

### Which Car Game
- Select correct colored car
- 3 rounds per game
- Colors: RED, BLUE, YELLOW, GREEN

### Car Sounds Game
- Tap cars to hear sounds
- No rounds limit - endless play
- Cars: RED, BLUE, YELLOW, POLICE, TRUCK, AMBULANCE

### Fix the Car Game
- Select correct car part
- 3 rounds per game
- Parts: WHEEL, WINDOW, DOOR, LIGHT

## Notes
- The game has a **fallback mode** - it works with or without n8n
- If n8n is unavailable, the game automatically uses built-in cards
- You can enable AI card generation by connecting Claude node
- Progress tracking is optional (see trackProgress function)

## Support
If you need help:
1. Check the browser console (F12) for error messages
2. Verify webhook URL in car-game.html
3. Ensure n8n workflow is running
4. Test webhook manually with curl command above
