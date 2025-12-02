# Specification

Educational car game with N8N integration and real-time progress tracking.

## Overview

The Car Game is an interactive learning application designed for children ages 3-5 with speech development needs. It provides three game modes focused on educational value through play, with optional cloud integration for progress tracking.

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

## Requirements

### Functional Requirements

#### FR1: Game Functionality
- Three game modes (Which Car, Car Sounds, Fix Car)
- 3-round sessions per game
- Adaptive difficulty (levels 1-3)
- Immediate feedback (visual + audio)
- Score calculation (correct/total)

#### FR2: Offline Mode
- Game playable without internet
- Fallback card deck included
- Web Audio API for sounds
- Graceful N8N failure handling

#### FR3: Cloud Integration (Optional)
- POST requests to N8N webhook
- Two action types: `get_cards`, `track_progress`
- Structured JSON responses
- Error handling with fallback

#### FR4: Progress Tracking (Optional)
- Session data stored in Supabase
- Per-session metrics captured
- SQL-queryable analytics
- Real-time data availability

---

### Non-Functional Requirements

#### NFR1: Performance
- Page load: <1 second
- Time to interactive: <1 second
- Game response: <100ms
- File size: <25 KB

#### NFR2: Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS/Android)
- Tablet optimized (iPad)

#### NFR3: Accessibility
- WCAG 2.1 Level A
- Keyboard + touch support
- Audio + visual feedback
- Large touch targets (min 48px)
- High contrast UI

#### NFR4: Safety
- No external dependencies
- No personal data collection
- Optional tracking only
- Offline playable
- Child-safe content

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
