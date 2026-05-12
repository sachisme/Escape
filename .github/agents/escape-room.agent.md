---
description: "Use when working on the GM Escape Room Angular app. Understands the game architecture, puzzle mechanics, routing, services, and component structure. Use for implementing new features, fixing bugs, or extending the game."
tools: [read, edit, search, execute]
---

You are an expert on the GM People Leaders Escape Room web application. This is an interactive Angular-based game where players solve themed puzzles across 3 rooms, then crack a final vault combination to escape.

## Project Overview

**Purpose**: An immersive escape room game for GM people leaders. Themes include navigating workplace uncertainty, AI disruption, team dynamics, and leadership conflict resolution.

**Tech Stack**:
- Angular 16 (NgModule-based, NOT standalone components)
- TypeScript ~5.0.2 (strict mode)
- Bootstrap 5 (imported in styles.css)
- Web Audio API for synthesized sound effects (no audio files)
- BrowserAnimationsModule for @angular/animations

**Build & Run**:
- Working directory: The `Escape/` folder (contains package.json)
- `npm start` → `ng serve` (may prompt for alternate port if 4200 is busy)
- `npx ng build` → production build to `dist/`
- Budget warnings on component CSS sizes and bundle size are expected and acceptable

## Game Flow & Routing

```
Landing Page (/) → Room Hub (/hub) → 3 Rooms → Vault (/vault) → Victory (/victory)
```

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | LandingPageComponent | Narrative intro with timed text sequence |
| `/hub` | RoomHubComponent | Central door selection (3 rooms as colored cards) |
| `/room/server` | SystemsRoomComponent | Room 1: Caesar cipher puzzle |
| `/room/hiring` | HiringRoomComponent | Room 2: Conflict resolution scenarios |
| `/room/calibration` | CalibrationRoomComponent | Room 3: Team assembly/org restructure |
| `/vault` | VaultComponent | 6-digit combination lock |
| `/victory` | VictoryComponent | Confetti, poem, stats |

## Room Codes & Vault

Each room yields a 2-digit code when solved:
- Room 1 (Server): **42**
- Room 2 (Hiring): **73**
- Room 3 (Calibration): **58**
- Vault combination: **427358** (concatenation of all three)

## Key Services

### GameService (`src/app/services/game.service.ts`)
- Central game state: room codes, timer, wrong attempts counter
- Methods: `startTimer()`, `stopTimer()`, `getFormattedTime()`, `addWrongAttempt()`, `setRoomCode(room, code)`, `allRoomsSolved()`, `getVaultCode()`, `reset()`

### AudioService (`src/app/services/audio.service.ts`)
- Background music: HTML5 Audio element, looped, volume 0.3, autoplay
- Sound effects via Web Audio API (synthesized, no files needed):
  - `playClick()`: 800Hz interaction feedback
  - `playSuccess()`: Major chord C-E-G
  - `playError()`: 200Hz low tone
  - `playUnlock()`: Ascending A scale
  - `playVictory()`: Triumphant C-E-G-C chord
- `toggle()`: Mute/unmute
- `init()` / `play()` / `stop()`

### StacyService (`src/app/services/stacy.service.ts`)
- Stacy is the game's sarcastic, fun AI guide persona
- Quote categories: welcome, room1Enter, room1Success, room2Enter, room2Success, room3Enter, room3Success, wrongAttempt, vaultEnter, vaultSuccess
- `getRandomQuote(category)`: Returns random quote from category

## Puzzle Mechanics

### Room 1 - Server Room (Caesar Cipher)
- Message: "THE SERVER RACK IS ON FLOOR FORTY TWO"
- Encoded with Caesar shift +3
- Player clicks letter cells to cycle A-Z until correct
- Some letters given as free hints
- Code: "42"

### Room 2 - Hiring Vault (Conflict Resolution)
- 3 ConflictScenario objects (remote vs office workplace conflicts)
- Each has 3 options with point values (+5/6/7 for correct, -2 to -5 for wrong)
- Correct = balanced solution that respects both sides
- Player selects best mediation approach for each scenario
- Code: "73"

### Room 3 - Calibration Lab (Team Assembly)
- 5 TeamMembers with skills: Alice (technical+communication), Bob (leadership+strategic), Carol (technical+collaboration), Diana (communication+conflict-resolution), Evan (strategic+communication)
- 3 Roles: Tech Lead (technical+communication), Strategy Director (strategic+leadership), Change Manager (communication+conflict-resolution)
- Player assigns members to roles; all required skills must match
- Correct: Alice→Tech Lead, Bob→Strategy Director, Diana→Change Manager
- Code: "58"

### Vault
- 6 dial inputs (0-9 each), spinUp/spinDown to cycle
- Wrong attempt: shake animation + playError()
- Correct (427358): playUnlock() → route to /victory after 2s

## Component Architecture

All components are declared in `AppModule` (src/app/app.module.ts). Key imports:
- BrowserModule, BrowserAnimationsModule, FormsModule, AppRoutingModule

Shared component: `StacyHintComponent` - displays hint messages with styling

## Design Themes

| Room | Color Palette | Gradient |
|------|--------------|----------|
| Room 1 (Server) | Neon green/dark | #0a1a0a → #1a3a1a → #2d5a2d |
| Room 2 (Hiring) | Purple/indigo | #1e1b4b → #3730a3 → #4f46e5 |
| Room 3 (Calibration) | Warm gold/orange | #7c2d12 → #b45309 → #d97706 |
| Vault | Dark metallic | Custom dark theme |
| Victory | Celebratory | Confetti particles, bright colors |

## Conventions

- Sound effects should be called on every user interaction (clicks, correct answers, errors)
- Stacy quotes should appear on room entry and puzzle completion
- All rooms have a music toggle button and back-to-hub button
- Wrong attempts are tracked via `gameService.addWrongAttempt()` which also calls `audioService.playError()`
- CSS animations: slideIn, fadeIn, slideUp used for dynamic content
- Do NOT use arrow functions in Angular templates (causes binding errors)
- Do NOT use `.filter()` or complex expressions in template interpolation—use component methods instead

## Important Gotchas

1. **No standalone components**: This project uses NgModule declarations, not `standalone: true`
2. **Template expressions**: Angular does not allow assignments or complex function calls in template bindings. Use getter methods or component properties.
3. **Port conflicts**: `ng serve` may need an alternate port. Accept the prompt.
4. **CSS budget warnings**: Component CSS files exceed 2kB budget—this is acceptable for this project.
5. **FormsModule required**: Used for `[(ngModel)]` in vault dial inputs.
6. **Web Audio Context**: Must be initialized on user gesture (first click/interaction), not on page load.
