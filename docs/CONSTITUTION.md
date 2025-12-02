# Constitution

Guiding principles and values for the Car Game project.

## Mission

Create an accessible, engaging educational game for children ages 3-5 that supports learning through interactive play, with optional cloud integration for progress tracking.

## Core Values

### 1. **Accessibility First**
- Works offline without internet
- No external dependencies beyond N8N
- Keyboard + touch support
- High contrast, large touch targets
- WCAG 2.1 Level A compliance

### 2. **Child Safety**
- No personal data collection (optional tracking only)
- No external tracking or analytics by default
- Age-appropriate content only
- No third-party ads or tracking
- Parental controls via privacy options

### 3. **Educator Friendly**
- Works immediately without setup
- Optional cloud features don't block gameplay
- Progress tracking for learning insights
- No teacher authentication required
- Easily deployable

### 4. **Open & Simple**
- Single HTML file option
- Vanilla JavaScript (no build tools)
- Open source approach
- Minimal dependencies
- Clear, readable code

## Design Principles

### P1: Offline First
- Game always works locally
- Cloud features are optional enhancements
- Graceful degradation when unavailable
- No hard dependency on N8N or Supabase

### P2: Zero Friction
- No signup or authentication
- Works on any device immediately
- Play button, start game
- No installation process
- <1 second load time

### P3: Accessibility at Scale
- Large touch targets (min 48px)
- Visual + audio feedback
- High contrast colors
- Simple, clear UI
- Mobile/tablet optimized

### P4: Data Privacy
- No personal information required
- Optional tracking only
- No third-party data sharing
- Local data storage available
- GDPR/COPPA compliant

## Product Standards

### Code Quality
- Vanilla JavaScript (no frameworks)
- Clear, commented code
- No minification required
- Single file deployable
- <25 KB total size

### Documentation
- Clear, step-by-step guides
- Copy-paste examples
- No assumed knowledge
- Screenshots included
- Troubleshooting provided

### Testing
- Manual play testing required
- Works in major browsers
- Tested on iPad/mobile
- Offline mode verified
- Audio tested on speakers

### Performance
- Load time: <1 second
- Response time: <100ms
- File size: <25 KB
- Lighthouse score: 95+
- 60 FPS animations

## Decision Making

### Technical Decisions
- Prefer simplicity over features
- Use vanilla JS unless impossible
- Minimize external dependencies
- Favor offline capability
- Test on real devices

### Feature Decisions
- Does it help learning?
- Does it add complexity?
- Can it be added later?
- Does it break offline mode?
- Is it safe for children?

### Deployment Decisions
- GitHub Pages / Vercel preferred
- No backend required
- Optional N8N integration
- Optional database tracking
- No vendor lock-in

## Governance

### Maintenance
- Keep dependencies minimal
- Update security patches only
- Test changes thoroughly
- Document all modifications
- Maintain backward compatibility

### Community
- Open to feedback
- Welcome contributions
- Respect privacy concerns
- Prioritize child safety
- Be responsive to issues

## Success Definition

### For Children
- ✅ Engaging gameplay
- ✅ Learns something new
- ✅ Wants to play again
- ✅ No frustration
- ✅ Works on any device

### For Educators
- ✅ Easy to deploy
- ✅ Sees progress
- ✅ Meets learning goals
- ✅ Saves preparation time
- ✅ Supports curriculum

### For Developers
- ✅ Simple to understand
- ✅ Easy to modify
- ✅ Quick to deploy
- ✅ Minimal dependencies
- ✅ Clear documentation

## Non-Goals

### What We Won't Do
- ❌ Collect personal data without consent
- ❌ Add complex frameworks or dependencies
- ❌ Create paid features
- ❌ Sell user data
- ❌ Track children without permission
- ❌ Require user accounts
- ❌ Add unnecessary complexity

## Commitment

We commit to:
1. Keeping the game simple and accessible
2. Respecting privacy and safety
3. Supporting offline usage
4. Providing clear documentation
5. Maintaining security and performance
6. Listening to feedback
7. Making it free and open

---

**Version**: 1.0
**Adopted**: December 2, 2025
**Status**: Active
