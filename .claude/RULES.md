# Development Rules

Coding standards, constraints, and decision-making principles for this project.

## Core Constraints

These are **hard requirements** that cannot be violated:

### 1. Offline-First Architecture
- ✅ Game MUST work without internet connection
- ✅ All features MUST have offline fallbacks
- ✅ Cloud integration is ALWAYS optional
- ❌ NEVER add features that require internet to function

**Testing**: Before committing, test with network disabled.

### 2. No Build Tools or Frameworks
- ✅ Vanilla JavaScript only (ES6+ acceptable)
- ✅ Standard HTML5 and CSS3
- ✅ No npm, webpack, babel, or bundlers
- ❌ NEVER add React, Vue, Angular, or similar frameworks
- ❌ NEVER require compilation or build steps

**Rationale**: Deployability - anyone should be able to open the HTML file and play.

### 3. Single-File Deployment Option
- ✅ Core game MUST be deployable as single HTML file
- ✅ All CSS and JS can be inline in `car-game.html`
- ✅ External dependencies are optional enhancements only
- ❌ NEVER make the game require multiple files to function

**Current**: `car-game.html` is 22 KB and fully self-contained.

### 4. Child Safety & Privacy
- ✅ No personal data collection without explicit consent
- ✅ No external tracking or analytics by default
- ✅ No third-party scripts or CDN dependencies
- ❌ NEVER add telemetry without user awareness
- ❌ NEVER collect data that could identify individual children

**Exception**: Optional N8N tracking with explicit configuration.

### 5. File Size Limits
- ✅ Main game file: <25 KB target
- ✅ Total page load: <50 KB if externalized
- ✅ Optimize all assets (inline SVG, compress JSON)
- ❌ NEVER add large libraries or images without justification

## Coding Standards

### JavaScript Style

#### Vanilla JavaScript Only
```javascript
// ✅ GOOD - Vanilla JS
const button = document.querySelector('.menu-btn');
button.addEventListener('click', handleClick);

// ❌ BAD - Requires framework
import React from 'react';
const Button = () => <button onClick={handleClick}>Click</button>;
```

#### ES6+ Features (Acceptable)
```javascript
// ✅ GOOD - Modern JS features are fine
const cards = [...fallbackCards];
const { difficulty, score } = gameState;
const playGame = async () => { /* ... */ };

// Arrow functions, destructuring, spread, async/await all OK
```

#### Avoid Over-Engineering
```javascript
// ✅ GOOD - Simple and direct
function playSound(frequency) {
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.start();
}

// ❌ BAD - Unnecessary abstraction for one-time use
class SoundManager {
    constructor(context) { /* ... */ }
    createOscillator() { /* ... */ }
    configureTone() { /* ... */ }
}
```

#### Error Handling - Graceful Degradation
```javascript
// ✅ GOOD - Fail gracefully, use fallback
async function getCards() {
    try {
        const response = await fetch(N8N_WEBHOOK_URL, { /* ... */ });
        return await response.json();
    } catch (error) {
        console.warn('Using fallback cards:', error);
        return { cards: fallbackCards, difficulty: 1 };
    }
}

// ❌ BAD - Crash on error
async function getCards() {
    const response = await fetch(N8N_WEBHOOK_URL);
    return await response.json(); // Breaks offline mode!
}
```

### HTML/CSS Style

#### Semantic HTML
```html
<!-- ✅ GOOD - Semantic, accessible -->
<button class="menu-btn btn-which-car" aria-label="Play Which Car Game">
    Which Car? 🚗
</button>

<!-- ❌ BAD - Div soup, not accessible -->
<div class="btn" onclick="startGame()">
    <span>Which Car? 🚗</span>
</div>
```

#### CSS Custom Properties for Theming
```css
/* ✅ GOOD - Use CSS variables for consistency */
:root {
    --color-primary: #2180C6;
    --color-success: #2DB858;
}

.button {
    background-color: var(--color-primary);
}

/* ❌ BAD - Hardcoded colors everywhere */
.button { background-color: #2180C6; }
.header { background-color: #2180C6; }
.footer { background-color: #2180C6; }
```

#### Mobile-First Responsive
```css
/* ✅ GOOD - Mobile-first approach */
.container {
    width: 100%;
    padding: 20px;
}

@media (min-width: 768px) {
    .container {
        max-width: 600px;
    }
}

/* ❌ BAD - Desktop-first */
.container {
    width: 1200px;
}

@media (max-width: 768px) {
    .container {
        width: 100%;
    }
}
```

## Architecture Patterns

### State Management

#### Global Game State
```javascript
// ✅ GOOD - Simple global state object
const gameState = {
    currentGame: null,
    difficulty: 1,
    score: { correct: 0, total: 0 },
    childName: '',
    sessionId: `session_${Date.now()}`
};

// Access directly - no need for complex state management
gameState.score.correct++;
```

### Data Flow

#### Offline-First Pattern
```javascript
// ✅ GOOD - Try cloud, fallback to local
async function fetchGameData() {
    // 1. Try cloud
    if (N8N_WEBHOOK_URL) {
        try {
            return await fetchFromN8N();
        } catch (error) {
            console.warn('Cloud unavailable, using fallback');
        }
    }

    // 2. Fallback to local
    return getLocalFallbackData();
}

// ❌ BAD - Requires cloud
async function fetchGameData() {
    return await fetchFromN8N(); // Breaks offline!
}
```

### Configuration

#### Environment Variables (Optional)
```javascript
// ✅ GOOD - Optional configuration with safe defaults
const CONFIG = {
    N8N_WEBHOOK_URL: window.GAME_CONFIG?.webhookUrl || '',
    ENABLE_TRACKING: window.GAME_CONFIG?.enableTracking ?? false,
    DEBUG_MODE: window.GAME_CONFIG?.debug ?? false
};

// Can be configured by adding before game script:
// <script>
//     window.GAME_CONFIG = {
//         webhookUrl: 'https://...',
//         enableTracking: true
//     };
// </script>
```

## Accessibility Requirements

### WCAG 2.1 Level A Compliance

#### Keyboard Navigation
```javascript
// ✅ GOOD - Keyboard accessible
button.addEventListener('click', handleClick);
button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        handleClick(e);
    }
});
```

#### Touch Targets
```css
/* ✅ GOOD - Minimum 48px touch targets */
.menu-btn {
    min-width: 48px;
    min-height: 48px;
    padding: 30px 40px; /* Even larger for kids */
}
```

#### Color Contrast
```css
/* ✅ GOOD - High contrast for readability */
:root {
    --color-text: #1F2121;     /* Dark text */
    --color-bg: #FFF9F0;       /* Light background */
    /* Ratio: 13.5:1 (exceeds WCAG AAA) */
}
```

#### Alt Text and ARIA
```html
<!-- ✅ GOOD - Descriptive labels -->
<button aria-label="Play the Which Car game - tap to start">
    Which Car? 🚗
</button>
```

## Performance Standards

### Load Time Requirements
- **Target**: <1 second on 3G connection
- **File size**: <25 KB HTML
- **Time to Interactive**: <1 second
- **First Contentful Paint**: <0.5 seconds

### Testing Performance
```bash
# Test file size
ls -lh car-game.html

# Should be under 25KB
# Current: ~22KB ✅
```

### Optimization Guidelines
1. Inline all CSS and JS (no external files for core game)
2. Use CSS animations over JavaScript
3. Minimize DOM manipulations
4. Debounce/throttle event handlers if needed
5. Use Web Audio API efficiently (create oscillators on demand)

## Testing Requirements

### Manual Testing Checklist

Before committing changes, verify:

- [ ] **Offline Mode**: Disable network, game still works
- [ ] **Mobile**: Test on iOS Safari and Chrome Mobile
- [ ] **Tablet**: Test on iPad (primary target device)
- [ ] **Desktop**: Test on Chrome, Firefox, Safari
- [ ] **Keyboard**: Tab navigation works
- [ ] **Touch**: All buttons respond to touch
- [ ] **Audio**: Sounds play correctly
- [ ] **Visual**: Animations smooth at 60 FPS
- [ ] **Fallback**: Works without N8N configured
- [ ] **File Size**: Still under 25 KB

### Browser Support

**Minimum Versions**:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Mobile 90+

**Testing Priority**:
1. iOS Safari (iPad) - PRIMARY platform
2. Chrome Desktop - Development
3. Mobile browsers - Secondary
4. Other browsers - Best effort

## Security Guidelines

### Input Validation
```javascript
// ✅ GOOD - Validate and sanitize
function setChildName(name) {
    // Limit length, remove special chars
    const sanitized = name.trim().slice(0, 50).replace(/[<>]/g, '');
    gameState.childName = sanitized;
}

// ❌ BAD - No validation
function setChildName(name) {
    gameState.childName = name; // XSS risk!
}
```

### External Requests
```javascript
// ✅ GOOD - Validate URLs, use HTTPS
const ALLOWED_HOSTS = ['n8n-new.vibookers.com'];

function isValidWebhookUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' &&
               ALLOWED_HOSTS.includes(parsed.hostname);
    } catch {
        return false;
    }
}
```

### No Eval or Inline Scripts
```javascript
// ❌ NEVER use eval or Function constructor
eval(userInput); // FORBIDDEN
new Function(userInput)(); // FORBIDDEN

// ✅ GOOD - Safe alternatives
JSON.parse(userInput); // Safe for JSON
// Or validate explicitly
```

## Decision-Making Principles

When adding features or making changes, ask:

### 1. Does it maintain offline functionality?
- If NO → Reject or make it optional with fallback

### 2. Does it require a framework or build tool?
- If YES → Reject or find vanilla JS alternative

### 3. Does it increase file size significantly?
- If YES (>5 KB) → Justify or find lighter alternative

### 4. Does it collect personal data?
- If YES → Make opt-in and document clearly

### 5. Does it complicate deployment?
- If YES → Reconsider or provide simpler option

### 6. Is it simple and maintainable?
- If NO → Refactor to simplify

## Common Patterns to Follow

### Adding a New Game Mode
1. Add fallback cards to `fallbackCards` array
2. Create game screen in HTML (follow existing pattern)
3. Implement game logic in `play{GameName}()` function
4. Add menu button following existing style
5. Test offline mode thoroughly

### Modifying Difficulty Logic
```javascript
// ✅ Follow existing pattern
function getNextDifficulty(currentDiff, accuracy) {
    if (accuracy >= 80 && currentDiff < 3) return currentDiff + 1;
    if (accuracy < 50 && currentDiff > 1) return currentDiff - 1;
    return currentDiff;
}
```

### Adding Configuration Options
```javascript
// ✅ Use global config with safe defaults
const CONFIG = {
    // Existing...
    NEW_FEATURE: window.GAME_CONFIG?.newFeature ?? false
};
```

## Version Control

### Commit Messages
```bash
# ✅ GOOD - Clear, descriptive
git commit -m "Add difficulty adjustment to car-sounds game"
git commit -m "Fix offline mode fallback for N8N timeout"
git commit -m "Improve touch target sizes for mobile"

# ❌ BAD - Vague
git commit -m "updates"
git commit -m "fix bug"
git commit -m "wip"
```

### Branch Naming
```bash
# ✅ GOOD - Descriptive
feature/add-shape-game-mode
fix/offline-audio-playback
docs/update-deployment-guide

# ❌ BAD - Unclear
my-changes
test
branch1
```

## Documentation Standards

### Code Comments
```javascript
// ✅ GOOD - Explain why, not what
// Use exponential backoff to handle N8N rate limiting
await delay(Math.pow(2, attempt) * 1000);

// ❌ BAD - Obvious comment
// Increment the counter
counter++;
```

### Function Documentation
```javascript
// ✅ GOOD - Document complex functions
/**
 * Fetches game cards from N8N or falls back to local cards.
 * @param {string} gameType - 'which-car', 'car-sounds', or 'fix-car'
 * @param {number} difficulty - 1, 2, or 3
 * @returns {Promise<Array>} Array of card objects
 */
async function getCards(gameType, difficulty) {
    // ...
}
```

## When in Doubt

1. Check existing code for patterns
2. Prefer simplicity over cleverness
3. Test offline mode
4. Ask: "Does this help children learn?"
5. Review [Constitution](../specifications/CONSTITUTION.md) values

---

**Related Documents**:
- [Product Context](./CONTEXT.md) - Understanding the project
- [Architecture](./ARCHITECTURE.md) - Technical patterns
- [Constitution](../specifications/CONSTITUTION.md) - Core values

**Version**: 1.0
**Last Updated**: December 4, 2025
