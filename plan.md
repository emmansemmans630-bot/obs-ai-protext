# OBS Scripture & Song Overlay Plugin Plan

Build a web-based "plugin" (OBS Browser Source) and control interface for displaying scriptures, song lyrics, and AI-powered captions/translations. The app will feature a blue and green interface, support multiple languages (European and African), include 10 Bible versions, and offer extensive customization (transitions, animations, layouts).

## Scope Summary
- **Control Dashboard:** UI to select scriptures, lyrics, and manage settings.
- **Overlay View:** A transparent/green-screen ready view to be captured by OBS.
- **AI Integration:** Simulated or API-based voice-to-text for lyrics and captions, plus scripture auto-detection.
- **Content:** 10 Bible versions (mock data/API) and song lyric management.
- **Customization:** Settings for colors (blue/green default), typography, images, and layout (lower-third vs. full screen).
- **Animations/Transitions:** CSS-based animations for overlays.

## Non-Goals
- Real OBS plugin binary (.so/.dll). This is a web-based "Browser Source" solution.
- Full-scale backend for user accounts (client-side only for this session).
- Expensive real-time AI API costs (will use Web Speech API or mock implementations).

## Assumptions & Open Questions
- **Bible Versions:** We will implement a selection of 10 common versions (KJV, NIV, etc.) using a public API or local JSON mocks.
- **Languages:** Focus on major languages in Europe (English, French, Spanish, German) and Africa (Swahili, Yoruba, Zulu, Arabic, Amharic, etc.).
- **Persistence:** All settings and song data will persist in `localStorage`.

## Affected Areas
- **Frontend (React):** Main dashboard, overlay routes, and settings panel.
- **State Management:** Custom hooks for overlay state and synchronization.
- **Components:** Lower-third components, full-screen overlay components, transition wrappers.

## Ordered Phases

### Phase 1: Core Infrastructure & State
- Setup routing (`/` for dashboard, `/overlay` for OBS).
- Implement a global state or `localStorage` sync mechanism so dashboard controls the overlay.
- Define the default Blue/Green theme.
- **Owner:** frontend_engineer

### Phase 2: Bible & Song Modules
- Integrate a Bible API or provide static data for 10 versions.
- Search/lookup UI for scriptures.
- Basic "Songbook" management (CRUD for lyrics).
- **Owner:** frontend_engineer

### Phase 3: AI Assistant & Captions
- Implement Web Speech API for real-time transcription (captions/lyrics).
- Add "Scripture Detection" logic (trigger overlay if a verse is spoken).
- Multi-language support for captions (translation mocks or API).
- **Owner:** frontend_engineer

### Phase 4: Overlay UI & Customization
- Build the actual OBS Overlay page (`/overlay`).
- Implement "Lower Third" vs "Full Screen" layouts.
- Settings panel: Color pickers, font selection, background image upload (base64/local), transition speed.
- Add CSS animations (Fade, Slide, Zoom).
- **Owner:** frontend_engineer

### Phase 5: Polishing & OBS Compatibility
- Ensure transparency and high-contrast accessibility.
- Final UI pass on the Blue/Green aesthetic.
- **Owner:** quick_fix_engineer

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Build the core application, routing, Bible/Song modules, and AI captioning.
2. quick_fix_engineer — Polish CSS, transitions, and theme consistency.

**Per-agent instructions:**

### 1. frontend_engineer
- **Phases:** 1, 2, 3, 4
- **Scope:** Create a dual-view application. 
    - `/` Dashboard: Blue/Green UI. Sidebar for Settings, Bible, Songs, and AI control.
    - `/overlay`: Minimalist view for OBS.
    - Use `localStorage` or a BroadcastChannel to sync `overlayData` between the two tabs.
    - Implement a "Scripture" tab with 10 versions (KJV, NIV, ESV, etc.).
    - Implement "AI Assistant" using `window.webkitSpeechRecognition`.
- **Files:** `src/App.tsx`, `src/components/Dashboard.tsx`, `src/components/Overlay.tsx`, `src/hooks/useOverlayState.ts`
- **Depends on:** none
- **Acceptance criteria:** Dashboard changes (text/color/layout) appear instantly in the overlay view.

### 2. quick_fix_engineer
- **Phases:** 5
- **Scope:** Fine-tune the blue/green color palette across all UI components. Ensure transitions are smooth. Fix any text overflows in lower-thirds.
- **Files:** `src/index.css`, `src/components/Overlay.tsx`
- **Depends on:** frontend_engineer
- **Acceptance criteria:** Visuals match the "blue and green" requirement perfectly; transitions are "without delay".

**Do not dispatch:**
- supabase_engineer (no database required per session constraints).
