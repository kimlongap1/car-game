# N8N Setup - Super Simple Version

Don't want to read 10 pages? Here's the 5-minute version!

## Your Webhook URL (Already Configured!)
```
https://n8n-new.vibookers.com/webhook-test/car-game
```

## What to Do

### 1. Open N8N
```
https://n8n-new.vibookers.com/
```

### 2. Create New Workflow
Click: **+ New Workflow**
Name: `car-game`

### 3. Add Webhook Node
- **+ Add Node** → Search "Webhook"
- HTTP Method: **POST**
- Path: **car-game**
- Save

### 4. Add Response Node
- **+ Add Node** → Search "Respond to Webhook"
- Leave defaults
- Save

### 5. Connect Them
- Drag line from Webhook to Respond to Webhook

### 6. Click Execute
- Click **Execute Workflow** (play button)
- Wait for "Running" status

### 7. Done! ✅
Your game can now fetch cards from n8n

---

## Test It

```bash
curl -X POST https://n8n-new.vibookers.com/webhook-test/car-game \
  -H "Content-Type: application/json" \
  -d '{"action":"get_cards","game_type":"which-car"}'
```

Should work!

---

## Want AI-Generated Cards? (Optional)

If you have a Claude API key:

1. Add **Anthropic Claude** node between Webhook and Response
2. Paste your API key
3. Add prompt (see N8N_INTEGRATION_SETUP.md)
4. Connect: Webhook → Claude → Response

---

## That's It!

- Game works now
- Cards come from n8n
- Optional: Add Claude for AI

---

**For detailed setup:** See N8N_INTEGRATION_SETUP.md
