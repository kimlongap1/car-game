# Quick Reference

Fast lookup guide for common tasks, file locations, and patterns.

## File Locations

### Core Game Files
| File | Purpose | Size | Required |
|------|---------|------|----------|
| `car-game.html` | Main game (self-contained) | ~22 KB | Yes |
| `index.html` | Landing page | ~5 KB | No |

### Documentation
| Directory | Purpose |
|-----------|---------|
| `.claude/` | AI assistant toolkit |
| `docs/` | User documentation |
| `specifications/` | Product specs |

### Key Documentation Files
| File | Use When |
|------|----------|
| `.claude/CONTEXT.md` | Understanding the project |
| `.claude/RULES.md` | Writing code |
| `.claude/ARCHITECTURE.md` | Implementing features |
| `specifications/SPECIFICATION.md` | Understanding requirements |
| `docs/DATABASE_SETUP.md` | Setting up Supabase |
| `docs/N8N_SETUP.md` | Configuring webhooks |
| `docs/TROUBLESHOOTING.md` | Debugging issues |

## Common Tasks

### 1. Test Offline Mode

```bash
# Open game in browser
open car-game.html

# Disable network in DevTools:
# Chrome: DevTools → Network tab → Offline checkbox
# Firefox: DevTools → Network tab → Throttling → Offline

# Verify:
# - Game loads
# - All 3 game modes work
# - Sounds play
# - Results screen appears
```

### 2. Add New Fallback Cards

**Location**: `car-game.html` → `<script>` section → `fallbackCards` object

```javascript
// Find this section in car-game.html
const fallbackCards = {
    'which-car': {
        1: [ // Easy level
            { word: 'RED', emoji: '🔴🚗', category: 'color', difficulty: 1 },
            // Add new card here:
            { word: 'GREEN', emoji: '🟢🚗', category: 'color', difficulty: 1 }
        ],
        2: [ /* medium */ ],
        3: [ /* hard */ ]
    },
    // Other game types...
};
```

### 3. Modify Difficulty Levels

**Location**: `car-game.html` → `calculateNextDifficulty()` function

```javascript
function calculateNextDifficulty(currentDifficulty, accuracy) {
    const accuracyPercent = (accuracy.correct / accuracy.total) * 100;

    // Adjust these thresholds:
    if (accuracyPercent >= 80 && currentDifficulty < 3) {
        return currentDifficulty + 1; // Increase difficulty
    }

    if (accuracyPercent < 50 && currentDifficulty > 1) {
        return currentDifficulty - 1; // Decrease difficulty
    }

    return currentDifficulty; // Maintain
}
```

### 4. Change Number of Rounds

**Location**: `car-game.html` → `gameState` initialization

```javascript
const gameState = {
    // ...
    totalRounds: 3, // Change this number (default: 3)
    // ...
};
```

### 5. Update N8N Webhook URL

**Location**: `car-game.html` → `<script>` section → top

```javascript
// Find this line near the top of <script>
const N8N_WEBHOOK_URL = 'https://n8n-new.vibookers.com/webhook-test/car-game';

// Update to your webhook URL:
const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/your-path';
```

### 6. Customize Colors/Theme

**Location**: `car-game.html` → `<style>` section → `:root`

```css
:root {
    --color-primary: #2180C6;       /* Main blue */
    --color-primary-hover: #1a66a3; /* Darker blue */
    --color-secondary: #32B8C6;     /* Teal */
    --color-success: #2DB858;       /* Green */
    --color-warning: #E69C4D;       /* Orange */
    --color-bg: #FFF9F0;            /* Cream background */
    --color-text: #1F2121;          /* Dark text */
}
```

### 7. Adjust Touch Target Sizes

**Location**: `car-game.html` → `.menu-btn` CSS class

```css
.menu-btn {
    padding: 30px 40px;   /* Increase for larger buttons */
    font-size: 32px;      /* Increase for larger text */
    min-width: 48px;      /* WCAG minimum (don't go below) */
    min-height: 48px;
}
```

### 8. Modify Audio Sounds

**Location**: `car-game.html` → `playSound()` function

```javascript
function playSound(frequency, duration = 0.3) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.value = frequency; // Change frequency (Hz)
    oscillator.type = 'sine'; // Options: 'sine', 'square', 'sawtooth', 'triangle'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Volume
    // ...
}

// Predefined sound frequencies:
const SOUNDS = {
    correct: () => playSound(523.25, 0.3),   // C5 - Change frequency
    incorrect: () => playSound(220, 0.3),     // A3
    click: () => playSound(440, 0.1),         // A4
};
```

### 9. Add New Game Mode (Template)

**Steps**:

1. **Add fallback cards**:
```javascript
fallbackCards['new-game'] = {
    1: [{ word: 'ITEM1', emoji: '🎮', category: 'new', difficulty: 1 }],
    2: [/* medium cards */],
    3: [/* hard cards */]
};
```

2. **Add HTML screen** (in `<body>`):
```html
<div id="new-game-screen" class="screen">
    <h1 class="game-title">New Game Title</h1>
    <div id="new-game-content">
        <!-- Game UI elements -->
    </div>
</div>
```

3. **Add menu button**:
```html
<button class="menu-btn btn-new-game" onclick="playNewGame()">
    New Game 🎮
</button>
```

4. **Implement game logic**:
```javascript
async function playNewGame() {
    gameState.currentGame = 'new-game';
    gameState.score = { correct: 0, total: 0 };
    gameState.currentRound = 0;
    gameState.startTime = Date.now();

    showScreen('new-game-screen');

    // Fetch cards
    const cards = await getCards('new-game', gameState.difficulty);
    gameState.cards = cards;

    // Run game rounds
    for (let i = 0; i < gameState.totalRounds; i++) {
        await playRound(cards[i]);
    }

    // Show results
    await finishGame();
}
```

### 10. Deploy to GitHub Pages

```bash
# 1. Ensure game works locally
open car-game.html

# 2. Commit changes
git add .
git commit -m "Update car game"

# 3. Push to GitHub
git push origin main

# 4. Enable GitHub Pages
# Go to: Settings → Pages → Source: main branch → Save

# 5. Access at: https://yourusername.github.io/car-game/car-game.html
```

### 11. Check File Size

```bash
# Check main game file size (should be < 25 KB)
ls -lh car-game.html

# Check total project size
du -sh .

# If too large, check for:
# - Large comments
# - Unused code
# - Base64 encoded images (should avoid)
```

### 12. Debug N8N Integration

```javascript
// Add debug logging to fetchCards function
async function getCards(gameType, difficulty) {
    console.log('Fetching cards:', { gameType, difficulty });

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get_cards',
                game_type: gameType,
                difficulty: difficulty
            })
        });

        console.log('N8N Response:', response.status);
        const data = await response.json();
        console.log('Cards received:', data);

        return data.cards;
    } catch (error) {
        console.error('N8N Error:', error);
        return getFallbackCards(gameType, difficulty);
    }
}
```

**Common N8N Issues**:
- **CORS errors**: Configure N8N webhook to allow your domain
- **Timeout**: Increase timeout in fetch call
- **500 errors**: Check N8N workflow logs
- **No response**: Verify webhook URL is correct

## Code Patterns

### Screen Transition Pattern
```javascript
async function transitionTo(screenId, delay = 0) {
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    showScreen(screenId);
}

// Usage:
await transitionTo('results-screen', 1000); // Wait 1s then show results
```

### Async Game Round Pattern
```javascript
async function playRound(card) {
    return new Promise((resolve) => {
        // Display question
        displayQuestion(card);

        // Set up answer handlers
        const handleAnswer = (isCorrect) => {
            if (isCorrect) {
                gameState.score.correct++;
                playSound(SOUNDS.correct);
            } else {
                playSound(SOUNDS.incorrect);
            }
            gameState.score.total++;
            resolve();
        };

        // Attach handlers to UI elements
        document.querySelectorAll('.answer-option').forEach(option => {
            option.onclick = () => handleAnswer(option.dataset.correct === 'true');
        });
    });
}
```

### Celebration Animation Pattern
```javascript
function celebrate() {
    const resultsScreen = document.getElementById('results-screen');
    resultsScreen.classList.add('celebration');

    // Play celebration sound
    SOUNDS.celebration();

    // Remove class after animation
    setTimeout(() => {
        resultsScreen.classList.remove('celebration');
    }, 2000);
}
```

## Browser DevTools Tips

### Test Offline Mode
1. Open DevTools (F12)
2. Network tab
3. Check "Offline" or select "No throttling" → "Offline"

### Test Mobile View
1. DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPad" or "iPhone"
4. Test touch interactions

### Debug Audio Issues
```javascript
// Check if AudioContext is initialized
console.log('AudioContext:', audioContext);
console.log('State:', audioContext?.state);

// Resume if suspended (common on iOS)
if (audioContext?.state === 'suspended') {
    audioContext.resume();
}
```

### Monitor Performance
```javascript
// Check load time
performance.getEntriesByType('navigation')[0].loadEventEnd

// Check file size loaded
performance.getEntriesByType('navigation')[0].transferSize

// Frame rate (should be ~60 FPS)
// DevTools → Rendering → Frame Rendering Stats
```

## Accessibility Testing

### Keyboard Navigation
```
Tab → Navigate to button
Enter/Space → Activate button
Escape → Close modal/return to menu (if implemented)
```

### Screen Reader Test
- MacOS: Enable VoiceOver (Cmd + F5)
- Windows: Enable Narrator (Win + Ctrl + Enter)
- Verify all buttons have readable labels

### Color Contrast Check
```javascript
// Test contrast ratio (should be ≥ 4.5:1 for normal text)
// DevTools → Elements → Styles → Color picker → Contrast ratio
```

## Performance Benchmarks

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Load Time** | <1 second | DevTools → Network → DOMContentLoaded |
| **File Size** | <25 KB | `ls -lh car-game.html` |
| **Time to Interactive** | <1 second | Lighthouse report |
| **First Contentful Paint** | <0.5 seconds | Lighthouse report |
| **Frame Rate** | 60 FPS | DevTools → Rendering → FPS meter |

### Run Lighthouse Audit
1. Open DevTools
2. Lighthouse tab
3. Select "Performance" + "Accessibility"
4. Click "Generate report"
5. Target scores: All 90+

## Troubleshooting Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| **Audio not working** | User must interact first (click anywhere) |
| **N8N timeout** | Check URL, test in Postman, increase timeout |
| **Offline mode broken** | Verify `fallbackCards` exist and are correct |
| **Layout broken on mobile** | Check viewport meta tag in `<head>` |
| **Buttons not responding** | Check z-index, ensure no overlapping elements |
| **Animations laggy** | Use CSS transforms instead of position changes |
| **File size too large** | Remove comments, minimize whitespace |

## Environment Variables

### Configure via window.GAME_CONFIG

```html
<!-- Add before car-game script -->
<script>
    window.GAME_CONFIG = {
        webhookUrl: 'https://your-n8n.com/webhook/car-game',
        enableTracking: true,
        debug: false,
        startDifficulty: 1,
        roundsPerGame: 3,
        soundEnabled: true
    };
</script>
<script src="car-game.html"></script>
```

**Or inline in car-game.html**:
```javascript
const CONFIG = {
    N8N_WEBHOOK_URL: window.GAME_CONFIG?.webhookUrl || '',
    ENABLE_TRACKING: window.GAME_CONFIG?.enableTracking ?? false,
    DEBUG: window.GAME_CONFIG?.debug ?? false
};
```

## Git Workflow

### Make Changes
```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes to car-game.html

# 3. Test thoroughly (especially offline mode)

# 4. Commit
git add car-game.html
git commit -m "Add: your feature description"

# 5. Push
git push origin feature/your-feature

# 6. Create pull request on GitHub
```

### Quick Commit
```bash
git add .
git commit -m "Update: brief description of changes"
git push
```

## Resources

### Internal Documentation
- [CONTEXT.md](./CONTEXT.md) - Product context
- [RULES.md](./RULES.md) - Development rules
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [Full Docs](../docs/README.md) - User documentation

### External Resources
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [N8N Documentation](https://docs.n8n.io/)
- [Supabase Docs](https://supabase.com/docs)

### Design Tools
- [Coolors](https://coolors.co/) - Color palette generator
- [Emojipedia](https://emojipedia.org/) - Emoji reference
- [Can I Use](https://caniuse.com/) - Browser compatibility

### Testing Tools
- Chrome DevTools
- Firefox Developer Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Support

### Getting Help
1. Check [TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md)
2. Review relevant sections in [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Search existing GitHub issues
4. Create new issue with:
   - Browser version
   - Steps to reproduce
   - Expected vs actual behavior
   - Console errors (if any)

### Making Contributions
1. Read [CONTEXT.md](./CONTEXT.md) and [RULES.md](./RULES.md)
2. Check existing issues and pull requests
3. Make changes following coding standards
4. Test thoroughly (offline mode critical)
5. Submit pull request with clear description

---

**Last Updated**: December 4, 2025
**Maintainer**: Car Game Team
**Need Help?** See [docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md)
