# Technical Architecture

Understanding how the Car Game is built, structured, and operates.

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │           car-game.html (22 KB)                    │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │  HTML Structure                              │ │ │
│  │  │  - Menu Screen                               │ │ │
│  │  │  - Game Screens (Which Car, Sounds, Fix)     │ │ │
│  │  │  - Results Screen                            │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │  CSS Styling (Inline)                        │ │ │
│  │  │  - Responsive layout                         │ │ │
│  │  │  - Animations                                │ │ │
│  │  │  - Touch-optimized                           │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │  JavaScript Logic (Inline)                   │ │ │
│  │  │  - Game State Management                     │ │ │
│  │  │  - Event Handlers                            │ │ │
│  │  │  - Web Audio API                             │ │ │
│  │  │  - N8N Integration (optional)                │ │ │
│  │  │  - Fallback Data                             │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS POST (optional)
                           ▼
              ┌────────────────────────────┐
              │   N8N Workflow Engine      │
              │  ┌──────────────────────┐  │
              │  │  Webhook Node        │  │
              │  └──────┬───────────────┘  │
              │         │                  │
              │  ┌──────▼───────────────┐  │
              │  │  IF Node (Router)    │  │
              │  └──┬──────────────┬────┘  │
              │     │              │       │
              │  ┌──▼────────┐  ┌─▼─────┐ │
              │  │ AI Agent  │  │ Supa- │ │
              │  │ (Cards)   │  │ base  │ │
              │  └───────────┘  └───────┘ │
              └────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose | Optional? |
|-------|-----------|---------|-----------|
| **Markup** | HTML5 | Structure | Required |
| **Styling** | CSS3 | Visual design | Required |
| **Logic** | Vanilla JavaScript (ES6+) | Interactivity | Required |
| **Audio** | Web Audio API | Sound effects | Required |
| **Storage** | LocalStorage | Session data | Required |
| **Backend** | N8N | Card generation, tracking | Optional |
| **AI** | Claude/Gemini | Dynamic cards | Optional |
| **Database** | Supabase (PostgreSQL) | Progress tracking | Optional |
| **Hosting** | GitHub Pages/Vercel/S3 | Static hosting | Optional |

## File Structure

```
car-game/
├── car-game.html          # Main game file (22 KB, self-contained)
│   ├── <style>           # Inline CSS
│   ├── <body>            # HTML structure
│   └── <script>          # JavaScript logic
│
├── index.html             # Landing page (optional)
│
├── .claude/               # AI Assistant Toolkit
│   ├── README.md
│   ├── CONTEXT.md
│   ├── RULES.md
│   ├── ARCHITECTURE.md    # This file
│   └── QUICK_REFERENCE.md
│
├── docs/                  # User documentation
│   ├── QUICK_START.md
│   ├── DATABASE_SETUP.md
│   ├── N8N_SETUP.md
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
│
└── specifications/        # Product specifications
    ├── SPECIFICATION.md
    ├── CONSTITUTION.md
    └── PLAN.md
```

## Core Components

### 1. Game State Management

```javascript
// Global state object (simple, no framework needed)
const gameState = {
    currentGame: null,           // 'which-car' | 'car-sounds' | 'fix-car' | null
    difficulty: 1,               // 1 (easy) | 2 (medium) | 3 (hard)
    score: {
        correct: 0,
        total: 0
    },
    childName: '',               // Optional, for tracking
    sessionId: `session_${Date.now()}`,
    startTime: null,
    currentRound: 0,
    totalRounds: 3,
    currentCard: null,
    cards: []
};
```

**State Updates**: Direct mutation (no reducers or complex patterns)
```javascript
gameState.score.correct++;
gameState.currentRound++;
```

### 2. Screen Management

```javascript
// Simple screen switching
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    document.getElementById(screenId).classList.add('active');
}
```

**Screens**:
- `menu-screen` - Main menu with game mode selection
- `which-car-screen` - "Which Car?" game
- `car-sounds-screen` - "Car Sounds" game
- `fix-car-screen` - "Fix the Car" game
- `results-screen` - Score summary and replay

### 3. Audio System (Web Audio API)

```javascript
// Audio context initialization
let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Generate sound programmatically (no audio files needed)
function playSound(frequency, duration = 0.3) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
    );

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

// Predefined sounds
const SOUNDS = {
    correct: () => playSound(523.25, 0.3),    // C5
    incorrect: () => playSound(220, 0.3),      // A3
    click: () => playSound(440, 0.1),          // A4
    celebration: () => {
        // Play chord
        playSound(261.63, 0.5);  // C4
        playSound(329.63, 0.5);  // E4
        playSound(392.00, 0.5);  // G4
    }
};
```

**Why Web Audio API?**
- No external audio files required
- Works offline
- Programmatic control
- Small file size
- Cross-browser support

### 4. Data Flow

#### Offline-First Pattern

```javascript
async function getCards(gameType, difficulty) {
    // 1. Check if N8N is configured
    if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.trim() === '') {
        console.log('N8N not configured, using fallback cards');
        return getFallbackCards(gameType, difficulty);
    }

    // 2. Try fetching from N8N
    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get_cards',
                game_type: gameType,
                difficulty: difficulty,
                session_score: gameState.score
            }),
            signal: AbortSignal.timeout(5000) // 5s timeout
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        return data.cards || getFallbackCards(gameType, difficulty);

    } catch (error) {
        // 3. Fallback on any error
        console.warn('N8N unavailable, using fallback:', error);
        return getFallbackCards(gameType, difficulty);
    }
}
```

#### Fallback Data Structure

```javascript
const fallbackCards = {
    'which-car': {
        1: [ // Easy
            { word: 'RED', emoji: '🔴🚗', category: 'color', difficulty: 1 },
            { word: 'BLUE', emoji: '🔵🚗', category: 'color', difficulty: 1 }
        ],
        2: [ // Medium
            { word: 'YELLOW', emoji: '🟡🚗', category: 'color', difficulty: 2 }
        ],
        3: [ // Hard
            { word: 'PURPLE', emoji: '🟣🚗', category: 'color', difficulty: 3 }
        ]
    },
    'car-sounds': {
        // Similar structure for sounds
    },
    'fix-car': {
        // Similar structure for car parts
    }
};
```

### 5. N8N Integration (Optional)

#### Request Format

**Action 1: Get Cards**
```javascript
const request = {
    action: 'get_cards',
    game_type: 'which-car',      // or 'car-sounds', 'fix-car'
    difficulty: 1,               // 1, 2, or 3
    session_score: {
        correct: 2,
        total: 3
    }
};
```

**Action 2: Track Progress**
```javascript
const request = {
    action: 'track_progress',
    game_type: 'which-car',
    correct_answers: 2,
    total_questions: 3,
    difficulty: 1,
    time_taken: 120,             // seconds
    child_name: 'Emma',          // optional
    session_id: 'session_1733400000000',
    metadata: {
        accuracy_percent: 66.67,
        browser: navigator.userAgent,
        timestamp: new Date().toISOString()
    }
};
```

#### Response Format

**Cards Response**
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

**Tracking Response**
```json
{
    "success": true,
    "message": "Session tracked successfully",
    "session_id": "12345"
}
```

### 6. Difficulty Adaptation

```javascript
function calculateNextDifficulty(currentDifficulty, accuracy) {
    const accuracyPercent = (accuracy.correct / accuracy.total) * 100;

    // Increase difficulty if doing well
    if (accuracyPercent >= 80 && currentDifficulty < 3) {
        return currentDifficulty + 1;
    }

    // Decrease difficulty if struggling
    if (accuracyPercent < 50 && currentDifficulty > 1) {
        return currentDifficulty - 1;
    }

    // Maintain current difficulty
    return currentDifficulty;
}
```

**Difficulty Levels**:
- **Level 1 (Easy)**: Basic colors (RED, BLUE, GREEN)
- **Level 2 (Medium)**: More colors (YELLOW, ORANGE, PURPLE)
- **Level 3 (Hard)**: Advanced (PINK, BROWN, GRAY)

## Game Flows

### Which Car Game Flow

```
1. User clicks "Which Car?" button
   ↓
2. Initialize game state
   - Set currentGame = 'which-car'
   - Reset score
   - Set currentRound = 0
   ↓
3. Fetch cards (N8N or fallback)
   ↓
4. For each round (3 total):
   a. Display question: "FIND THE [COLOR] CAR!"
   b. Show 3 car options (1 correct, 2 distractors)
   c. Wait for user tap
   d. Play feedback sound (correct/incorrect)
   e. Update score
   f. Increment round
   ↓
5. Calculate accuracy
   ↓
6. Determine next difficulty level
   ↓
7. Track progress to N8N (if configured)
   ↓
8. Show results screen
   ↓
9. Offer replay or return to menu
```

### Car Sounds Game Flow

```
1. User clicks "Car Sounds" button
   ↓
2. Initialize game state
   ↓
3. For each round:
   a. Display: "TAP THE CAR TO HEAR ITS SOUND!"
   b. Show 3 cars
   c. User taps car → play unique sound
   d. User can tap multiple times
   e. After exploration, ask: "WHICH CAR MAKES THIS SOUND?"
   f. Play target sound
   g. User selects car
   h. Feedback and scoring
   ↓
4. Results and tracking
```

### Fix the Car Game Flow

```
1. User clicks "Fix the Car" button
   ↓
2. Initialize game state
   ↓
3. For each round:
   a. Display: "FIND THE [CAR PART]!"
   b. Show car diagram with 3 selectable parts
   c. User taps part
   d. Feedback and scoring
   ↓
4. Results and tracking
```

## Data Models

### Card Object
```typescript
interface Card {
    word: string;           // Display text (e.g., "RED")
    emoji: string;          // Visual representation (e.g., "🔴🚗")
    category: string;       // Type (e.g., "color", "sound", "part")
    difficulty: number;     // 1, 2, or 3
    sound?: number;         // Frequency for audio (car-sounds only)
    position?: string;      // Location on car (fix-car only)
}
```

### Session Object
```typescript
interface GameSession {
    session_id: string;         // Unique identifier
    child_name: string;         // Optional
    game_type: string;          // 'which-car' | 'car-sounds' | 'fix-car'
    correct_answers: number;
    total_questions: number;
    accuracy_percent: number;
    difficulty_level: number;
    time_taken_seconds: number;
    metadata: {
        browser: string;
        timestamp: string;
        // Additional context
    };
}
```

## Performance Optimizations

### 1. Inline Everything
- CSS inline in `<style>` tags
- JavaScript inline in `<script>` tags
- No external requests for core functionality
- Result: Single HTTP request, fast load

### 2. CSS Animations Over JS
```css
/* ✅ Use CSS transitions for smooth animations */
.car-option:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease;
}

/* ❌ Avoid JavaScript animations for simple effects */
```

### 3. Event Delegation
```javascript
// ✅ Single listener for multiple buttons
document.querySelector('.menu-buttons').addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-btn')) {
        handleMenuClick(e.target);
    }
});

// ❌ Individual listeners (less efficient)
```

### 4. Lazy Audio Context
```javascript
// Only create AudioContext when needed (user interaction required)
document.addEventListener('click', initAudio, { once: true });
```

## Browser Compatibility

### Required Features
- ES6+ JavaScript (const, let, arrow functions, async/await)
- Web Audio API
- Fetch API
- LocalStorage
- CSS Flexbox/Grid
- CSS Custom Properties (variables)

### Polyfills NOT Used
We require modern browsers instead of adding polyfills to keep file size small.

**Minimum Browser Versions**:
- Chrome/Edge 90+ (2021)
- Firefox 88+ (2021)
- Safari 14+ (2020)
- iOS Safari 14+ (2020)

## Security Considerations

### 1. Input Sanitization
```javascript
function sanitizeInput(input) {
    return input
        .trim()
        .slice(0, 100)                    // Limit length
        .replace(/[<>\"']/g, '')          // Remove HTML chars
        .replace(/javascript:/gi, '');    // Remove JS protocol
}
```

### 2. URL Validation
```javascript
const ALLOWED_WEBHOOK_HOSTS = ['n8n-new.vibookers.com'];

function validateWebhookUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' &&
               ALLOWED_WEBHOOK_HOSTS.includes(parsed.hostname);
    } catch {
        return false;
    }
}
```

### 3. No Eval, No Inline Event Handlers
```html
<!-- ✅ GOOD -->
<button class="menu-btn" id="which-car-btn">Which Car?</button>
<script>
    document.getElementById('which-car-btn')
        .addEventListener('click', startWhichCar);
</script>

<!-- ❌ BAD -->
<button onclick="startWhichCar()">Which Car?</button>
```

## Deployment Architectures

### Option 1: Single File (Simplest)
```
Upload car-game.html to any web server
→ Users access directly
→ No build, no dependencies
→ Works immediately
```

### Option 2: Static Site
```
GitHub Pages / Vercel / Netlify
├── index.html (landing page)
└── car-game.html (game)
→ Free hosting
→ HTTPS included
→ Global CDN
```

### Option 3: Cloud-Integrated
```
Static Hosting + N8N + Supabase
→ Dynamic card generation (AI)
→ Progress tracking (Database)
→ Analytics and reporting
```

## Extension Points

### Adding New Game Modes

1. **Add fallback cards**
   ```javascript
   fallbackCards['new-game'] = {
       1: [/* easy cards */],
       2: [/* medium cards */],
       3: [/* hard cards */]
   };
   ```

2. **Create HTML screen**
   ```html
   <div id="new-game-screen" class="screen">
       <!-- Game UI -->
   </div>
   ```

3. **Implement game logic**
   ```javascript
   async function playNewGame() {
       gameState.currentGame = 'new-game';
       // ... game logic
   }
   ```

4. **Add menu button**
   ```html
   <button class="menu-btn btn-new-game" onclick="playNewGame()">
       New Game 🎮
   </button>
   ```

### Adding Configuration Options

```javascript
// Extend window.GAME_CONFIG
window.GAME_CONFIG = {
    webhookUrl: 'https://...',
    enableTracking: true,
    difficulty: 2,              // Start difficulty
    roundsPerGame: 3,           // Configurable rounds
    soundEnabled: true,
    animationsEnabled: true,
    // New options here
};
```

## Monitoring and Debugging

### Debug Mode
```javascript
const DEBUG = window.GAME_CONFIG?.debug ?? false;

function debug(...args) {
    if (DEBUG) console.log('[Car Game]', ...args);
}

debug('Game started:', gameState);
```

### Error Tracking
```javascript
window.addEventListener('error', (event) => {
    console.error('Game error:', event.error);

    // Optional: Send to monitoring service
    if (window.GAME_CONFIG?.errorTracking) {
        // reportError(event.error);
    }
});
```

### Performance Monitoring
```javascript
// Log performance metrics
window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
});
```

## Testing Strategy

### Manual Testing
- Open `car-game.html` in browser
- Test each game mode
- Disable network, test offline mode
- Test on mobile device
- Verify audio playback
- Check responsiveness

### Automated Testing (Future)
Could add:
- Unit tests for game logic (Jest)
- E2E tests (Playwright)
- Visual regression tests

**Current**: Manual testing only (keeping it simple)

## Troubleshooting Common Issues

See [TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) for detailed solutions.

**Quick fixes**:
- Audio not playing? → User interaction required first
- N8N timeout? → Check CORS, increase timeout
- Offline broken? → Verify fallback cards exist
- Mobile layout issues? → Test viewport meta tag

---

**Related Documents**:
- [Development Rules](./RULES.md) - Coding standards
- [Quick Reference](./QUICK_REFERENCE.md) - Common tasks
- [Database Setup](../docs/DATABASE_SETUP.md) - Supabase integration
- [N8N Setup](../docs/N8N_SETUP.md) - Webhook configuration

**Version**: 1.0
**Last Updated**: December 4, 2025
