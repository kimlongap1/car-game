# Troubleshooting

Common issues and solutions.

---

## Table of Contents

1. [Game Issues](#game-issues)
2. [N8N Issues](#n8n-issues)
3. [Database Issues](#database-issues)
4. [Deployment Issues](#deployment-issues)

---

## Game Issues

### Game Won't Load

**Problem**: Browser shows blank page or error

**Check**:
1. Open **F12** → **Console** tab
2. Look for red error messages
3. Check file paths are correct

**Solutions**:
- Try different browser (Chrome, Firefox, Safari)
- Clear browser cache (Ctrl+Shift+Delete)
- Check `car-game.html` file exists
- Verify you're opening correct file path

### Cards Won't Load

**Problem**: Game shows "fallback cards" instead of N8N cards

**Cause**: N8N webhook not responding

**Check**:
1. Open **F12** → **Network** tab
2. Click game mode
3. Look for request to `n8n-new.vibookers.com`
4. Check response status (should be 200)

**Solutions**:
- Verify N8N workflow is active
- Test webhook with curl (see below)
- Check N8N logs for errors
- Verify webhook URL in game code (line 382)

### Sound Not Working

**Problem**: Game plays but no sounds

**Solutions**:
- Check browser volume
- Unmute browser/tab
- Try different browser
- Check speakers/headphones connected

### Game Freezes

**Problem**: Game becomes unresponsive

**Check**:
1. Browser console for JavaScript errors
2. N8N logs for slow responses
3. Network tab for stuck requests

**Solutions**:
- Reload page (Ctrl+R or Cmd+R)
- Close other browser tabs
- Check internet connection
- Restart browser

---

## N8N Issues

### Webhook Not Responding

**Problem**: curl test fails or game gets no response

**Test with curl**:
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

**Check response**:
- Should have cards array
- Should be valid JSON
- Should not have errors

**If fails**:
1. Check N8N workflow is active (toggle switch ON)
2. Check webhook node path is: `/webhook-test/car-game`
3. Verify Respond to Webhook node is connected
4. Check N8N logs for errors

### LLM Returns Wrong Format

**Problem**: Cards don't match expected format

**Cause**: Agent AI not following system prompt

**Check**:
1. Agent AI system prompt has all rules
2. Agent AI prompt includes exact JSON example
3. Structured Output Parser is enabled
4. "Auto-Fix Format" is ON

**Solutions**:
- Update system prompt (see [N8N_SETUP.md](./N8N_SETUP.md))
- Enable Structured Output Parser Auto-Fix
- Test Agent AI separately
- Check N8N logs for actual output

### If Node Not Routing Correctly

**Problem**: Both paths executing or wrong path taken

**Check**:
1. IF condition is exactly: `$json.action == "get_cards"`
2. Both TRUE and FALSE paths connected
3. Workflow is saved and activated

**Solutions**:
- Update IF condition exactly
- Connect both output paths
- Save workflow (Ctrl+S)
- Activate workflow toggle

---

## Database Issues

### No Data in Database

**Problem**: Game completes but nothing in Supabase

**Check**:
1. Browser console (F12) for errors
2. N8N PostgreSQL connection works
3. PostgreSQL node executed (check logs)

**Solutions**:
1. Run manual curl test:
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

2. If curl works, check game code:
   - Verify `endGameSession()` function exists
   - Verify `showCompletionMessage()` calls it with `await`

3. If curl fails, check N8N:
   - Verify PostgreSQL node is connected
   - Test PostgreSQL connection
   - Check IF node routing to PostgreSQL

### PostgreSQL Connection Fails

**Problem**: "Connection refused" error

**Check**:
1. Connection details are exact
2. SSL is enabled (toggle ON)
3. Firewall allows connection

**Solutions**:
1. Verify connection string:
   - Host: `db.xxxx.supabase.co` (exact!)
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - **SSL: ON** (critical!)

2. Test connection:
   - Click "Test Connection" in N8N
   - Should say "Connection successful"

3. If still fails:
   - Get new credentials from Supabase
   - Recreate PostgreSQL node in N8N
   - Try again

### SSL Certificate Error

**Problem**: "SSL certificate problem" error

**Solutions**:
1. Enable SSL in N8N PostgreSQL settings (toggle ON)
2. Verify SSL cert with:
   - In N8N: Select "SSL certificate" dropdown
   - Try different SSL options

### Data Not Appearing Immediately

**Problem**: curl works but data takes time to appear

**This is normal**:
- Supabase has slight delay (usually <1 second)
- Refresh table to see data
- Check "Table Editor" → "game_sessions"

---

## Deployment Issues

### GitHub Pages Not Updating

**Problem**: Changes not visible on GitHub Pages

**Solutions**:
1. Wait 1-2 minutes for rebuild
2. Hard refresh browser (Ctrl+Shift+R)
3. Check GitHub Actions tab for build status
4. Verify changes pushed to `main` branch

### Vercel Deploy Fails

**Problem**: Deployment shows error

**Check**:
1. Go to Vercel dashboard → Deployments
2. Click failed deploy to see error
3. Check build logs

**Common causes**:
- Typo in config
- Missing file
- Syntax error

**Solutions**:
- Fix issue locally
- Push to GitHub
- Vercel auto-redeploys

### Custom Domain Not Working

**Problem**: Domain points to GitHub Pages but not loading

**Check**:
1. DNS records are set correctly:
   - Type: A
   - Value: `185.199.108.153`

2. GitHub Settings → Pages:
   - Custom domain is set
   - HTTPS enabled

**Solutions**:
1. Wait 24 hours for DNS propagation
2. Clear browser cache
3. Flush local DNS cache:
   ```bash
   # Mac
   sudo dscacheutil -flushcache

   # Windows
   ipconfig /flushdns

   # Linux
   sudo systemctl restart systemd-resolved
   ```

---

## Still Stuck?

### Debug Steps

1. **Check browser console** (F12)
   - Look for red errors
   - Copy error message
   - Search error online

2. **Check N8N logs**
   - Open workflow → Logs tab
   - Look for execution errors
   - Check input/output of nodes

3. **Check Supabase**
   - Go to Table Editor
   - Manually look for your data
   - Check Logs tab for database errors

4. **Test with curl**
   - Test each action separately
   - Check response format
   - Verify all fields present

### Getting Help

Provide:
1. Error message (exact text)
2. What you were doing when error occurred
3. Browser type and version
4. Steps you already tried
5. Recent code changes

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot read property 'cards'" | Webhook not returning JSON | Check N8N workflow |
| "Connection refused" | PostgreSQL not accessible | Verify host, port, SSL |
| "SSL certificate problem" | SSL not enabled | Turn SSL ON in N8N |
| "Model output doesn't fit" | LLM format wrong | Update system prompt |
| "No route to host" | Network issue | Check internet, firewall |
| "ENOTFOUND n8n-new.vibookers.com" | DNS issue | Check domain name, internet |

---

**More help**: See specific setup guide for your issue
