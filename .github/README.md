# Repository Structure

This repository is organized following GitHub best practices and [GitHub Spec-Kit](https://github.com/github/spec-kit) standards.

## Folder Organization

```
car-game/
├── specifications/              ← Project Definition (Spec-Kit)
│   ├── README.md               # Specifications index
│   ├── SPECIFICATION.md        # Product requirements
│   ├── CONSTITUTION.md         # Mission & values
│   └── PLAN.md                 # Implementation roadmap
│
├── docs/                        ← Implementation Guides
│   ├── README.md               # Documentation index
│   ├── QUICK_START.md          # 5-minute overview
│   ├── N8N_SETUP.md            # Webhook configuration
│   ├── DATABASE_SETUP.md       # Progress tracking setup
│   ├── DEPLOYMENT.md           # Deploy to production
│   └── TROUBLESHOOTING.md      # Common issues & fixes
│
├── .github/                     ← GitHub Configuration
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   ├── workflows/              # GitHub Actions
│   └── README.md               # This file
│
├── car-game.html               ← Game Application
├── index.html                  ← Landing Page
├── README.md                   ← Project Overview
└── car-game-workflow.json      ← N8N Workflow Template
```

---

## Documentation Hierarchy

### 1. **Specifications** (`/specifications/`)
What are we building and why?

- **SPECIFICATION.md** - Technical requirements & product definition
- **CONSTITUTION.md** - Mission, values, and guiding principles
- **PLAN.md** - Implementation roadmap & strategy

👉 **Start here if:** You want to understand the project at a deep level

### 2. **Documentation** (`/docs/`)
How do I use and build this?

- **README.md** - Documentation index
- **QUICK_START.md** - Get the game running (5 min)
- **N8N_SETUP.md** - Configure N8N webhook (10 min)
- **DATABASE_SETUP.md** - Add progress tracking (15 min)
- **DEPLOYMENT.md** - Deploy to production (10 min)
- **TROUBLESHOOTING.md** - Fix common problems

👉 **Start here if:** You want to use or deploy the game

### 3. **Root README** (`/README.md`)
Quick project overview

- Features overview
- Quick links to guides
- Tech stack summary
- Performance metrics

👉 **Start here if:** You're exploring the project

---

## Quick Navigation

### By Role

#### 👨‍💼 Product Manager / Decision Maker
1. Read [`/README.md`](../README.md) - Project overview
2. Read [`/specifications/SPECIFICATION.md`](../specifications/SPECIFICATION.md) - Requirements
3. Read [`/specifications/CONSTITUTION.md`](../specifications/CONSTITUTION.md) - Values
4. Read [`/specifications/PLAN.md`](../specifications/PLAN.md) - Timeline

#### 👨‍💻 Developer / Contributor
1. Read [`/README.md`](../README.md) - Quick overview
2. Read [`/specifications/SPECIFICATION.md`](../specifications/SPECIFICATION.md) - What to build
3. Read [`/specifications/CONSTITUTION.md`](../specifications/CONSTITUTION.md) - How to decide
4. Go to [`/docs/`](../docs/) - Implementation guides

#### 👩‍🏫 Educator / User
1. Read [`/README.md`](../README.md) - Overview
2. Go to [`/docs/QUICK_START.md`](../docs/QUICK_START.md) - Play the game
3. Go to [`/docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md) - Deploy it
4. Go to [`/docs/DATABASE_SETUP.md`](../docs/DATABASE_SETUP.md) - Track progress

#### 🐛 Troubleshooter
1. Check [`/docs/TROUBLESHOOTING.md`](../docs/TROUBLESHOOTING.md) - Common issues
2. Check [`/specifications/PLAN.md`](../specifications/PLAN.md) - Known issues
3. Create GitHub issue if not found

---

## Documentation Standards

All documentation follows [GitHub Spec-Kit](https://github.com/github/spec-kit) guidelines:

✅ **Clear Communication** - Written to be understood
✅ **Shared Understanding** - Everyone knows the goals
✅ **Predictable Outcomes** - Less surprises, planned approach
✅ **Scenario-Based** - Real user stories matter
✅ **Measurable Success** - Define what "done" means

---

## Standards Compliance

### Spec-Kit Documents
- ✅ SPECIFICATION.md - Product definition
- ✅ CONSTITUTION.md - Values & principles
- ✅ PLAN.md - Implementation roadmap

### Organization
- ✅ Clear folder structure
- ✅ Organized by purpose
- ✅ Easy navigation
- ✅ No redundancy

### Accessibility
- ✅ Multiple entry points
- ✅ Role-based guides
- ✅ Table of contents
- ✅ Clear links

---

## Finding What You Need

| I want to... | Go to |
|--------------|-------|
| Play the game | [docs/QUICK_START.md](../docs/QUICK_START.md) |
| Deploy the game | [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) |
| Set up N8N | [docs/N8N_SETUP.md](../docs/N8N_SETUP.md) |
| Add database | [docs/DATABASE_SETUP.md](../docs/DATABASE_SETUP.md) |
| Fix something | [docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) |
| Understand the project | [specifications/SPECIFICATION.md](../specifications/SPECIFICATION.md) |
| Know our values | [specifications/CONSTITUTION.md](../specifications/CONSTITUTION.md) |
| See the roadmap | [specifications/PLAN.md](../specifications/PLAN.md) |
| Contribute code | [specifications/CONSTITUTION.md](../specifications/CONSTITUTION.md) + [docs/](../docs/) |

---

## Maintenance

### How to Update Documentation

1. **Specifications** - Only update if product fundamentals change
2. **Docs** - Update regularly with new guides and fixes
3. **Root README** - Keep as quick reference

### File Locations

- **Spec-Kit docs**: `/specifications/` (for governance)
- **User guides**: `/docs/` (for implementation)
- **GitHub config**: `/.github/` (for automation)
- **Root**: Top-level for quick access

---

**Last Updated**: December 2, 2025
**Structure Version**: 1.0
**Status**: Production Ready
