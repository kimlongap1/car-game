# Car Game Documentation

> Complete guide for the educational car game with N8N integration and database progress tracking.

> 📋 Follows [GitHub Spec-Kit](https://github.com/github/spec-kit) standards

**Table of Contents:**
- [Quick Start](#quick-start)
- [Spec-Kit Documents](#spec-kit-documents)
- [Setup Guides](#setup-guides)
- [Database Tracking](#database-tracking)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

---

## Quick Start

### Quick Links

| Need | Read | Time |
|------|------|------|
| **First time?** | [Quick Start](./QUICK_START.md) | 5 min |
| **Deploy to production?** | [Deployment Guide](./DEPLOYMENT.md) | 10 min |
| **Track progress data?** | [Database Setup](./DATABASE_SETUP.md) | 15 min |
| **Configure N8N?** | [N8N Setup](./N8N_SETUP.md) | 10 min |
| **Stuck?** | [Troubleshooting](./TROUBLESHOOTING.md) | varies |

---

## Spec-Kit Documents

Official project documentation following [GitHub Spec-Kit](https://github.com/github/spec-kit) standards.

Located in: [`/specifications/`](../specifications/)

### 📋 SPECIFICATION.md
[Read Specification](../specifications/SPECIFICATION.md)

Defines what the product does and how users interact with it.

**Contains:**
- Product scenarios (3 detailed stories)
- Functional & non-functional requirements
- Data structures & database schema
- API endpoints (N8N webhook)
- Architecture diagrams
- Technology stack with purposes
- Success metrics

### 📜 CONSTITUTION.md
[Read Constitution](../specifications/CONSTITUTION.md)

Guiding principles and values for the project.

**Contains:**
- Mission statement
- Core values (4 principles)
- Design principles
- Decision making framework
- Product standards
- Success definition
- Non-goals & commitment

### 🗺️ PLAN.md
[Read Plan](../specifications/PLAN.md)

Implementation roadmap and technical strategy.

**Contains:**
- Current status (phase tracking)
- 5 development phases
- Technical implementation details
- Testing procedures
- Timeline & milestones
- Risk mitigation
- Resource requirements

---

## Setup Guides

| Guide | Purpose | Time |
|-------|---------|------|
| [QUICK_START.md](./QUICK_START.md) | Play the game | 5 min |
| [N8N_SETUP.md](./N8N_SETUP.md) | Configure webhooks | 10 min |
| [DATABASE_SETUP.md](./DATABASE_SETUP.md) | Add progress tracking | 15 min |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy to production | 10 min |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Fix problems | varies |

---

## What You Have

✅ **Game**: 3 interactive games (Which Car, Car Sounds, Fix Car)
✅ **Backend**: N8N workflow for dynamic card generation
✅ **Tracking**: Real-time progress tracking to Supabase PostgreSQL

---

## Project Structure

```
car-game/
├── docs/                          # Documentation
│   ├── README.md                 # This file
│   ├── QUICK_START.md            # 5-minute game overview
│   ├── DEPLOYMENT.md             # Deploy to production
│   ├── N8N_SETUP.md              # N8N webhook configuration
│   ├── DATABASE_SETUP.md          # Supabase database setup
│   └── TROUBLESHOOTING.md         # Common issues & fixes
├── car-game.html                  # Main game application
├── index.html                      # Landing page
└── README.md                       # Quick reference
```

---

## Features

### Game Features
- 🎮 3 interactive game modes for children
- 🎯 Adaptive difficulty (1-3 levels)
- 🔊 Web Audio API for sound effects
- 📱 Mobile/tablet responsive design
- 🎨 Colorful, engaging UI for kids

### N8N Integration
- 🤖 AI-powered dynamic card generation
- 📊 Card generation via Claude/Gemini LLM
- 🔄 Real-time structured output validation
- ⚡ Fast, low-latency responses

### Progress Tracking (NEW)
- 📈 Automatic session tracking
- 💾 Supabase PostgreSQL database
- 🔍 Real-time analytics queries
- 📊 Performance metrics per session
- 🎓 Learning progress analysis

---

## Setup Guides

### 1. Game Setup (Already Done ✅)

Your game is ready to play. Just open `car-game.html` in a browser.

```bash
# Local testing
open car-game.html
```

### 2. N8N Integration (Already Done ✅)

Your game is already connected to N8N webhook:
```
https://n8n-new.vibookers.com/webhook-test/car-game
```

See [N8N_SETUP.md](./N8N_SETUP.md) for details.

### 3. Database Tracking (New - 15 minutes)

Set up real-time progress tracking:
- **Step 1**: Create Supabase account (5 min)
- **Step 2**: Configure N8N workflow (5 min)
- **Step 3**: Update game code (3 min)
- **Step 4**: Test (2 min)

👉 **Start here**: [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

## Database Tracking

### What Gets Tracked

Every game session stores:
```json
{
  "child_name": "Emma",
  "game_type": "which-car",
  "correct_answers": 2,
  "total_questions": 3,
  "accuracy_percent": 66.67,
  "difficulty_level": 1,
  "time_taken_seconds": 120,
  "created_at": "2025-12-02T10:30:00Z"
}
```

### Data Flow

```
Game Session Ends
    ↓
endGameSession() called
    ↓
POST to N8N webhook
    ↓
N8N routes to PostgreSQL
    ↓
Supabase stores data
    ↓
Analytics queries available
```

### Getting Started

1. Read [DATABASE_SETUP.md](./DATABASE_SETUP.md) (15 min)
2. Follow 3 phases:
   - Supabase setup (5 min)
   - N8N workflow (5 min)
   - Game code (3 min)
3. Test and verify

**Cost**: $0 (free tier)

---

## Troubleshooting

### Common Issues

#### Game Won't Load
- Check browser console (F12)
- Verify `car-game.html` path is correct
- Try different browser

#### N8N Not Responding
- Check N8N workflow is active
- Test with curl command
- Verify webhook URL in game

#### Database Not Saving
- Verify PostgreSQL connection in N8N
- Check SSL is enabled
- Review browser console for errors

👉 **Full troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## Resources

### Documentation Files

**Setup & Deployment**
- [QUICK_START.md](./QUICK_START.md) - 5-minute overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [N8N_SETUP.md](./N8N_SETUP.md) - Webhook configuration

**Database & Tracking**
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Complete setup guide
- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) - Schema & design

**Reference**
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [FAQ.md](./FAQ.md) - Frequently asked questions
- [GLOSSARY.md](./GLOSSARY.md) - Terms & definitions

### External Resources

- [Supabase Documentation](https://supabase.com/docs)
- [N8N Docs](https://docs.n8n.io)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs)

---

## License

This project is open source and available under the MIT License.

---

## Support

For issues or questions:

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review relevant setup guide
3. Check browser console (F12) for errors
4. Check N8N workflow logs

---

**Last Updated**: December 2, 2025
**Status**: Ready for implementation ✅
