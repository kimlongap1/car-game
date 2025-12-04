# Claude Toolkit

**AI Assistant Workspace for Car Game Project**

This directory contains essential context, rules, and guidelines to help AI assistants (like Claude) effectively contribute to this project. Read these files before making changes to understand the product, technical constraints, and development standards.

## Quick Start for AI Assistants

When working on this project, read these files in order:

1. **[CONTEXT.md](./CONTEXT.md)** - Understand what this project is and why it exists
2. **[RULES.md](./RULES.md)** - Learn the development rules and constraints
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Understand the technical implementation
4. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Common tasks and file locations

## File Guide

| File | Purpose | When to Read |
|------|---------|--------------|
| **CONTEXT.md** | Product vision, target users, domain knowledge | Before starting any work |
| **RULES.md** | Coding standards, constraints, decision-making principles | Before writing code |
| **ARCHITECTURE.md** | Technical architecture, patterns, data flows | Before implementing features |
| **QUICK_REFERENCE.md** | File locations, common tasks, troubleshooting | During development |

## Project Documentation Structure

```
car-game/
├── .claude/                    # 🤖 AI Assistant Toolkit (YOU ARE HERE)
│   ├── README.md              # This file - toolkit index
│   ├── CONTEXT.md             # Product context & domain knowledge
│   ├── RULES.md               # Development rules & constraints
│   ├── ARCHITECTURE.md         # Technical architecture & patterns
│   └── QUICK_REFERENCE.md      # Quick reference guide
│
├── specifications/             # 📋 Product Specifications (What & Why)
│   ├── SPECIFICATION.md       # Product requirements & scenarios
│   ├── CONSTITUTION.md        # Mission, values, principles
│   └── PLAN.md                # Implementation roadmap
│
├── docs/                       # 📘 User Documentation (How)
│   ├── README.md              # Docs index
│   ├── QUICK_START.md         # 5-minute overview
│   ├── DATABASE_SETUP.md       # Supabase integration
│   ├── N8N_SETUP.md           # Webhook configuration
│   ├── DEPLOYMENT.md          # Production deployment
│   └── TROUBLESHOOTING.md     # Common issues & solutions
│
└── [source files]              # 💻 Implementation
    ├── car-game.html          # Main game (single file)
    └── index.html             # Landing page
```

## Usage Guidelines for AI Assistants

### Before Starting Work

1. Read **CONTEXT.md** to understand the product vision and target users
2. Read **RULES.md** to understand coding constraints and standards
3. Review relevant sections of **ARCHITECTURE.md** for technical patterns
4. Check **QUICK_REFERENCE.md** for file locations and common patterns

### During Development

- Follow the constraints in RULES.md (especially: offline-first, no frameworks, vanilla JS)
- Maintain the single-file architecture when possible
- Test changes work offline (no internet required)
- Keep file size under 25 KB for main game file
- Preserve child safety and privacy principles

### Before Committing

- Verify code follows vanilla JS patterns (no build tools)
- Test in offline mode with fallback cards
- Ensure accessibility standards maintained (WCAG 2.1 Level A)
- Check that no personal data collection added
- Confirm changes don't break single-file deployment option

## Key Principles (Quick Reference)

1. **Offline First** - Game must work without internet
2. **Vanilla JS** - No frameworks or build tools
3. **Child Safety** - No data collection without consent
4. **Keep It Simple** - Prefer simplicity over features
5. **Single File Option** - Maintain ability to deploy as standalone HTML

## Common Tasks

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for detailed guidance on:
- Adding new game modes
- Modifying difficulty levels
- Updating N8N integration
- Testing offline functionality
- Debugging common issues

## Updating This Toolkit

When making significant project changes, update relevant files:
- New features → Update CONTEXT.md and ARCHITECTURE.md
- New constraints → Update RULES.md
- New patterns → Update ARCHITECTURE.md and QUICK_REFERENCE.md

## Questions?

If something is unclear, refer to:
1. Project specifications in `/specifications/`
2. User documentation in `/docs/`
3. Source code comments in `car-game.html`

---

**Version**: 1.0
**Created**: December 4, 2025
**Purpose**: Guide AI assistants to make effective, aligned contributions
