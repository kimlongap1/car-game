# Specification

Educational car game with bilingual support, text-to-speech, voice recording, custom photo learning, and optional N8N integration for progress tracking.

## Overview

The Car Game is an interactive learning application designed for children ages 3-5 with speech development needs. It provides **8 game modes** (4 built-in + 5 custom photo games) focused on educational value through play, with bilingual support (English/Vietnamese), text-to-speech, voice recording capabilities, and personalized learning using the child's real toy car photos via Google Sheets integration.

## Product Scenarios

### Scenario 1: Child Plays Game Locally

**Actor**: Child (3-5 years old)
**Goal**: Play an engaging car-themed game and learn

**Outcome**:
- Game loads immediately
- No internet required
- Audio feedback works
- Difficulty adjusts to performance
- Progress saved locally

**Success Criteria**:
- [ ] Game loads in <1 second
- [ ] Works offline with fallback cards
- [ ] Audio plays on interaction
- [ ] Game completes in <5 minutes
- [ ] Celebration screen displays on completion

---

### Scenario 2: Educator Tracks Progress Cloud

**Actor**: Educator or parent
**Goal**: Monitor child's learning progress over time

**Outcome**:
- Game sends progress to N8N
- Data stored in Supabase
- Analytics available immediately
- Session data includes accuracy, time, difficulty

**Success Criteria**:
- [ ] Data sent after each session
- [ ] Stored within 2 seconds
- [ ] Queryable via SQL
- [ ] No manual data entry required
- [ ] Privacy maintained (no PII)

---

### Scenario 3: Developer Deploys Game

**Actor**: Developer/Educator
**Goal**: Make game accessible online

**Outcome**:
- Game deployed to production
- Accessible via public URL
- All features working
- N8N connected

**Success Criteria**:
- [ ] Deployed in <10 minutes
- [ ] Webhook connected
- [ ] Database tracking enabled
- [ ] Mobile-responsive
- [ ] No build step required

---

### Scenario 4: Parent Uses Custom Photos for Personalized Learning

**Actor**: Parent with child (ages 3-5)
**Goal**: Use child's real toy cars for personalized, engaging learning

**Outcome**:
- Parent creates Google Sheet with car data
- Uploads toy car photos to OneDrive
- Pastes public photo links to Google Sheet
- Loads data into game via Sheet ID
- Child plays 5 learning games with their actual toys

**Success Criteria**:
- [ ] Google Sheet setup takes <10 minutes
- [ ] Photo links load instantly in game
- [ ] Data persists in localStorage
- [ ] 5 different learning games available
- [ ] Games support both English and Vietnamese
- [ ] No technical knowledge required

**Games Available**:
1. **What Is It?** - Identify correct car from 4 photos
2. **Spell It!** - Arrange letter tiles to spell car name
3. **Match Pairs** - Memory card game with car photos
4. **Count Cars** - Count specific cars in mixed group
5. **Color Sorting** - Drag & drop cars into color baskets

---

## Requirements

### Functional Requirements

#### FR1: Built-in Game Functionality
- Four built-in game modes:
  1. **Which Car?** - Identify colored cars and vehicle types
  2. **Car Sounds** - Tap to hear and learn car sounds
  3. **Fix Car** - Identify missing car parts
  4. **Learn Words** - Vietnamese vocabulary with voice recording
- Adaptive difficulty (levels 1-3)
- Immediate feedback (visual + audio)
- Score calculation (correct/total)
- Confetti celebrations on success

#### FR2: My Cars Learning (Custom Photos)
- Five personalized learning games using child's toy car photos:
  1. **What Is It?** - Identify correct car from 4 photo choices
  2. **Spell It!** - Arrange scrambled letters to spell car name
  3. **Match Pairs** - Memory card flip game with photos
  4. **Count Cars** - Count specific cars in mixed display
  5. **Color Sorting** - Drag & drop cars into color baskets
- Google Sheets integration for car data
- OneDrive public links for photo hosting
- localStorage persistence for offline access
- Setup wizard with clear instructions

#### FR3: Bilingual Support
- English and Vietnamese languages
- Language toggle button
- Text-to-speech in both languages
- Accent selection:
  - Vietnamese: Miền Nam (South) / Miền Bắc (North)
  - English: US / UK
- Smart voice detection and fallback
- Proper grammar for questions in both languages

#### FR4: Speech & Audio Features
- Web Speech API for text-to-speech
- Voice recording for pronunciation practice
- Playback of recorded audio
- Web Audio API for sound effects
- Speech toggle (on/off)
- Configurable speech rate
- Real-time pronunciation feedback

#### FR5: Offline Mode
- Built-in games playable without internet
- Fallback card deck included
- Custom cars saved to localStorage
- Graceful failure handling for cloud features

#### FR6: Cloud Integration (Optional)
- N8N webhook for progress tracking
- Google Sheets API for custom car data
- Public OneDrive links for photos
- No authentication required for read-only data
- Error handling with fallback

#### FR7: Progress Tracking (Optional)
- Session data stored in Supabase
- Per-session metrics captured
- SQL-queryable analytics
- Real-time data availability

---

### Non-Functional Requirements

#### NFR1: Performance
- Page load: <2 seconds
- Time to interactive: <2 seconds
- Game response: <100ms
- File size: ~124 KB (self-contained, no external libraries)
- Photo loading: Async, non-blocking
- localStorage read/write: <50ms

#### NFR2: Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)
- Tablet optimized (iPad)
- Web Speech API support required for TTS
- MediaRecorder API support required for voice recording

#### NFR3: Accessibility
- WCAG 2.1 Level A minimum
- Keyboard + touch support
- Audio + visual feedback
- Large touch targets (min 48px, recommended 60px)
- High contrast UI with readable fonts
- Text-to-speech for all questions
- Visual emphasis on key words (larger, colored)

#### NFR4: Safety & Privacy
- No external JavaScript libraries
- No personal data collection (built-in games)
- Optional integrations use public links only:
  - Google Sheets: Public read-only access
  - OneDrive: Public photo links
  - N8N: Anonymous progress tracking
- Child-safe content (ages 3-5)
- Offline playable after initial load
- localStorage only for preferences & custom data

#### NFR5: Usability
- No setup required for built-in games
- My Cars setup: <10 minutes for parents
- Clear visual feedback for all interactions
- Bilingual UI with easy language switching
- Self-explanatory game mechanics
- Celebration animations for positive reinforcement

---

## Data Structure

### Game Session Object

```json
{
  "action": "track_progress",
  "game_type": "which-car",
  "correct_answers": 2,
  "total_questions": 3,
  "difficulty": 1,
  "time_taken": 120,
  "child_name": "Emma",
  "session_id": "session_1733400000000",
  "metadata": {
    "accuracy_percent": 66.67
  }
}
```

### Supabase Table Schema

```sql
CREATE TABLE game_sessions (
  id BIGINT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE,
  child_name VARCHAR(100),
  game_type VARCHAR(50),
  correct_answers INT,
  total_questions INT,
  accuracy_percent FLOAT,
  difficulty_level INT,
  time_taken_seconds INT,
  session_id VARCHAR(100),
  metadata JSONB
);
```

### My Cars Google Sheets Structure

**Sheet Columns (required in header row):**

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| `car_name_en` | String | Yes | English car name | "Police Car" |
| `car_name_vi` | String | Yes | Vietnamese car name | "Xe cảnh sát" |
| `photo_url` | URL | Yes | Public OneDrive link | "https://1drv.ms/i/..." |
| `color` | String | Yes | Primary color | "White" |
| `category` | String | No | Car category | "Emergency" |
| `difficulty` | Integer | No | Difficulty level (1-3) | 1 |

**Example Sheet Data:**

| car_name_en | car_name_vi | photo_url | color | category | difficulty |
|-------------|-------------|-----------|-------|----------|------------|
| Police Car | Xe cảnh sát | https://1drv.ms/i/c/abc123 | White | Emergency | 1 |
| Fire Truck | Xe cứu hỏa | https://1drv.ms/i/c/def456 | Red | Emergency | 1 |
| Taxi | Xe taxi | https://1drv.ms/i/c/ghi789 | Yellow | Transport | 1 |
| Bulldozer | Xe ủi | https://1drv.ms/i/c/jkl012 | Yellow | Construction | 2 |

**localStorage Stored Object:**

```json
{
  "myCarsSheetId": "1JFUJsgN-9HFe155MTHnqgVC33j...",
  "myCarsSheetName": "Cars",
  "myCarsData": [
    {
      "name_en": "Police Car",
      "name_vi": "Xe cảnh sát",
      "photo_url": "https://1drv.ms/i/c/abc123",
      "color": "White",
      "category": "Emergency",
      "difficulty": 1
    }
  ]
}
```

---

## API Endpoints

### N8N Webhook

**URL**: `https://n8n-new.vibookers.com/webhook-test/car-game`

#### Request 1: Get Cards
```json
{
  "action": "get_cards",
  "game_type": "which-car",
  "difficulty": 1,
  "session_score": {"correct": 0, "total": 0}
}
```

**Response**:
```json
{
  "cards": [
    {"word": "RED", "emoji": "🔴🚗", "category": "color", "difficulty": 1}
  ],
  "difficulty": 1,
  "status": "success"
}
```

#### Request 2: Track Progress
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

**Response**:
```json
{
  "success": true,
  "message": "Session tracked"
}
```

---

## Architecture

### Component Diagram

```
┌──────────────────────────┐
│   Browser (Game)         │
│  - HTML/CSS/JavaScript   │
│  - Web Audio API         │
│  - Local State           │
└────────────┬─────────────┘
             │ HTTP POST
             ▼
    ┌────────────────────┐
    │ N8N Workflow       │
    │ - Webhook Node     │
    │ - IF Node (route)  │
    │ - Agent AI (LLM)   │
    │ - PostgreSQL       │
    └────────┬───────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
  ┌────────┐   ┌─────────┐
  │ Agent  │   │Supabase │
  │ (LLM)  │   │(DB)     │
  └────────┘   └─────────┘
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Vanilla HTML/CSS/JS | Game UI |
| **Audio** | Web Audio API | Sound effects |
| **Styling** | CSS3 Flexbox/Grid | Responsive layout |
| **Backend** | N8N | Workflow automation |
| **LLM** | Claude/Gemini | Card generation |
| **Database** | Supabase PostgreSQL | Progress tracking |
| **Hosting** | GitHub Pages/Vercel | Static deployment |

---

## Success Metrics

### User Engagement
- Game completion rate (target: >80%)
- Average session duration (target: 2-5 min)
- Replay rate (target: >50%)

### Learning
- Accuracy improvement over sessions
- Difficulty progression
- Session consistency

### Technical
- Page load time (target: <1s)
- API response time (target: <100ms)
- Uptime (target: >99.5%)
- Error rate (target: <1%)

---

## Constraints

### Technical
- Must work offline (fallback mode)
- No build step required
- No external UI frameworks
- Single HTML file deployment option

### Cost
- Free tier databases only
- No hosting fees
- Optional N8N at no cost

### Privacy
- No personal data in database
- Tracking is optional
- No user authentication required

---

## Future Considerations

- [ ] Multi-language support
- [ ] Parent dashboard
- [ ] Achievement system
- [ ] Learning analytics
- [ ] Teacher reports
- [ ] Custom card creation
- [ ] Accessibility enhancements

---

**Version**: 1.0
**Last Updated**: December 2, 2025
**Status**: Production Ready
