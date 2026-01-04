# 🚗 Car Game for Kids

An interactive educational game for children ages 3-5 with **8 game modes**, bilingual support (English/Vietnamese), text-to-speech, voice recording, and custom photo learning with Google Sheets integration.

**[📚 Full Documentation](./docs/)** | **[▶️ Quick Start](./docs/QUICK_START.md)** | **[🚀 Deploy](./docs/DEPLOYMENT.md)** | **[💾 Database](./docs/DATABASE_SETUP.md)**

## Game Modes

### Built-in Games

| Game | Description | Features |
|------|-------------|----------|
| **Which Car?** | Identify colored cars & vehicles | Color recognition, vehicle types |
| **Car Sounds** | Tap to hear car sounds | Audio learning, sound matching |
| **Fix the Car** | Identify missing car parts | Parts recognition, problem-solving |
| **Learn Words** | Vietnamese vocabulary with voice recording | Speech practice, pronunciation |

### 📸 My Cars Learning (NEW!)

Use **YOUR kid's real toy car photos** for personalized learning! Load photos from OneDrive + Google Sheets.

| Game | Description | Skills Developed |
|------|-------------|------------------|
| **🎯 What Is It?** | Identify your toy cars | Recognition, memory |
| **🔤 Spell It!** | Spell car names with drag-and-drop bubbles, syllable chunking, ghost letters, puzzle reveal | Spelling, literacy, fine motor |
| **🧠 Match Pairs** | Memory card game with your photos | Memory, concentration |
| **🔢 Count Cars** | Count specific cars | Math, counting |

## Features

✨ **Kid-Friendly**
- Colorful, playful UI with large touch targets
- Celebration animations & confetti 🎉
- Sound effects using Web Audio API
- Bilingual support (English/Vietnamese)

🎤 **Speech & Audio**
- Text-to-speech (Vietnamese & English)
- Accent selection (Vietnamese North/South, English US/UK)
- Voice recording & playback
- Real-time pronunciation practice

📸 **Custom Photo Learning**
- Use YOUR kid's toy cars
- Load from Google Sheets
- OneDrive photo hosting
- 4 interactive learning games with real photos

🎮 **Works Offline**
- Built-in fallback cards
- No internet required for built-in games
- Optional N8N integration
- localStorage for custom cars

📊 **Progress Tracking**
- Session tracking
- Difficulty adjustment (3 levels)
- Performance analytics
- Supabase database support

📱 **Responsive Design**
- Desktop, tablet, mobile optimized
- iPad friendly
- Touch & mouse support

## Quick Links

| Need | Link |
|------|------|
| **5-minute overview** | [docs/QUICK_START.md](./docs/QUICK_START.md) |
| **Deploy to web** | [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) |
| **N8N setup** | [docs/N8N_SETUP.md](./docs/N8N_SETUP.md) |
| **Add database** | [docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md) |
| **Troubleshooting** | [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) |
| **All docs** | [docs/README.md](./docs/README.md) |

## Getting Started

### Play Locally
```bash
open car-game.html
```

### Setup My Cars Learning (5 minutes)

Use your kid's **real toy car photos** for personalized learning!

**Step 1: Create Google Sheet**
```
Columns: car_name_en | car_name_vi | photo_url | color | category
Example: Police Car   | Xe cảnh sát | https://1drv.ms/... | White | Emergency
```

**Step 2: Upload Photos to OneDrive**
1. Take photos of toy cars
2. Upload to OneDrive
3. Share → "Anyone with link can view"
4. Copy share links to `photo_url` column

**Step 3: Make Sheet Public**
1. Share button → "Anyone with link can view"
2. Copy Sheet ID from URL

**Step 4: Load in Game**
1. Open game → Click "📸 My Cars"
2. Paste Sheet ID
3. Click "Load My Cars"
4. Start learning with 4 custom games!

**Sample Google Sheet Template:**
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
Columns: car_name_en, car_name_vi, photo_url, color, category, difficulty
```

### Deploy to Web
See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### Add Progress Tracking
See [docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md) (15 minutes)

## Project Structure

```
car-game/
├── .claude/                  # 🤖 AI Assistant Toolkit
│   ├── README.md            # Usage guide
│   ├── CONTEXT.md           # Product context
│   ├── RULES.md             # Development rules
│   ├── ARCHITECTURE.md      # Technical architecture
│   └── QUICK_REFERENCE.md   # Common tasks
├── docs/                     # 📚 Documentation
│   ├── README.md            # Main docs index
│   ├── QUICK_START.md       # 5-minute overview
│   ├── N8N_SETUP.md         # Webhook configuration
│   ├── DATABASE_SETUP.md    # Progress tracking
│   ├── DEPLOYMENT.md        # Deploy to production
│   ├── TROUBLESHOOTING.md   # Common issues
│   └── MAKING_IT_FUN_FOR_4YEAR_OLDS.md  # Engagement tips
├── specifications/           # 📋 Product Specs
│   ├── SPECIFICATION.md     # Requirements
│   ├── CONSTITUTION.MD      # Mission & values
│   └── PLAN.md              # Roadmap
├── car-game.html            # Main game (~157 KB)
├── index.html               # Landing page
└── README.md                # This file
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla HTML/CSS/JavaScript (~157 KB) |
| **Speech** | Web Speech API (TTS + Voice Recording) |
| **Audio** | Web Audio API (sound effects) |
| **Custom Photos** | Google Sheets API + OneDrive |
| **Storage** | localStorage (offline-first) |
| **Backend** (optional) | N8N workflow |
| **Database** (optional) | Supabase PostgreSQL |
| **Hosting** | GitHub Pages, Vercel, or custom |

## Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Load Time**: <2 seconds
- **File Size**: ~157 KB (self-contained, no external libraries)
- **Features**: 8 game modes, bilingual TTS, voice recording, custom photos
- **Lighthouse**: 90+ (estimated)
- **Accessibility**: WCAG 2.1 Level A

## Safety & Privacy

✅ Works offline (built-in games)
✅ No external JavaScript libraries
✅ No personal data collected (built-in games)
✅ Optional integrations:
  - Google Sheets (for custom photos - public links only)
  - OneDrive (for photo hosting - public links only)
  - N8N (for progress tracking - anonymous)
✅ Safe for children ages 3-5
✅ localStorage only for preferences & custom car data

## Documentation

### 📋 Specifications (What & Why)
Project definition following [GitHub Spec-Kit](https://github.com/github/spec-kit)

- [SPECIFICATION.md](./specifications/SPECIFICATION.md) - Product requirements
- [CONSTITUTION.md](./specifications/CONSTITUTION.md) - Mission & values
- [PLAN.md](./specifications/PLAN.md) - Implementation roadmap

### 📘 Implementation Guides (How)

- [Full Docs Index](./docs/README.md)
- [5-Minute Quick Start](./docs/QUICK_START.md)
- [Deploy to Production](./docs/DEPLOYMENT.md)
- [N8N Webhook Setup](./docs/N8N_SETUP.md)
- [Database Progress Tracking](./docs/DATABASE_SETUP.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

### 🗂️ Repository Structure
- [View structure guide](./.github/README.md)

## License

Free for personal and educational use.

---

**[🎮 Play Now](./car-game.html)** | **[📚 Read Docs](./docs/)** | **[🚀 Deploy](./docs/DEPLOYMENT.md)**
