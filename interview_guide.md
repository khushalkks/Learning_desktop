# Interview Preparation Guide - KhushalOS

This guide compiles critical questions and detailed technical answers that an interviewer may ask during your 4th-year project presentation.

---

## 1. Project Concept & Architecture

### Q1: Why did you build a browser-based OS instead of a traditional portfolio website?
- **Answer**: 
  - To showcase **state management complexity**, **performance optimization**, and **fluid user experiences** in a way that static websites cannot.
  - An operating system represents the ultimate frontend challenge: it requires concurrent window management, event-driven terminals, real-time graphics canvas loops, audio synthesis, and an achievement listener engine running synchronously in a single-page app.

### Q2: Can you describe the project structure and technology choices?
- **Answer**: 
  - **Framework**: React 19 + TypeScript + Vite. Vite offers extremely fast HMR (Hot Module Replacement) and bundling.
  - **Styles**: Tailwind CSS v4 (configured via PostCSS compile layer) for utility classes, custom animation keyframes, and neon glassmorphism effects.
  - **State Store**: Zustand. Extremely lightweight (under 1KB), requires zero boilerplate wrapper providers, and prevents unnecessary re-renders.
  - **Graphics & Audio**: HTML5 Canvas (for particles and games) and Web Audio API (for cassette arpeggiator synthesis).

---

## 2. Window Management & Draggable Mechanics

### Q3: How does your custom dragging and resizing system work without external libraries?
- **Answer**: 
  - It utilizes native React mouse event listeners (`onMouseDown`, `onMouseMove`, `onMouseUp`).
  - **Dragging**: When the user clicks the title header, we store the initial cursor `clientX`/`clientY` and current window position. During mouse move, we calculate the coordinate delta and shift the window position coordinates.
  - **Resizing**: We placed invisible borders/corner overlays around the window with custom cursors (e.g. `col-resize`, `nwse-resize`). Clicking a border calculates the cursor displacement delta and updates the width/height dimensions.
  - **Performance Optimization**: We used local React component states for coordinates (`localPos`, `localSize`) during the active dragging drag-loop to keep movements at 60fps. The coordinates are synced back to the global Zustand store only on `onMouseUp` (mouse release) to avoid state write throttling.

### Q4: How is window focus and depth stacking (z-index handling) managed?
- **Answer**: 
  - All windows are kept in an array in our global Zustand store: `windows: WindowItem[]`. Each window has a `zIndex` integer.
  - When a window is clicked or opened, we query the maximum `zIndex` of all currently open windows and increment the clicked window's z-index by 1 (`maxZIndex + 1`), then set the `activeWindowId`. This brings the focused window to the top layer.

---

## 3. Global State Management (Zustand)

### Q5: Why did you choose Zustand over Redux or standard React Context?
- **Answer**: 
  - **React Context** causes all consumer components to re-render whenever any value in the provider state changes. For a high-interaction OS (moving windows, playing audio, updating clock), this would lead to massive performance lags.
  - **Redux** introduces a lot of boilerplate files (actions, reducers, store setups, slice configs) which is overkill for a single-page portfolio application.
  - **Zustand** is a hooks-based store. Components only re-render when the specific selected states change. It operates outside the React render cycle, which allows us to trigger fast actions (like toast notifications or achievement unlocks) without stalling the DOM.

---

## 4. Web Audio API & Audio Synthesis

### Q6: How does the Music Player play arpeggios without importing audio files?
- **Answer**: 
  - It generates audio waves directly in the browser using the **Web Audio API**.
  - When the user hits "Play", we initialize an `AudioContext`.
  - We configure an `OscillatorNode` (generating different wave shapes: sawtooth, square, triangle) and connect it to a `GainNode` (to control volume envelopes).
  - A scheduler function schedules notes at specific eighth-note intervals based on the BPM (beats per minute) of the current track, selecting scale pitches (like C-minor arpeggios) dynamically.
  - This guarantees the music app works instantly offline with zero loading lag or external file dependencies.

---

## 5. HTML5 Canvas Vector Physics

### Q7: How does the Research Laboratory particle sandbox work?
- **Answer**: 
  - The canvas uses a **vector math loop** running inside a `requestAnimationFrame` render sequence.
  - Each particle has position vector coordinates `(x, y)` and velocity vectors `(vx, vy)`.
  - On every frame, we compute the distance between the mouse cursor coordinates and the particle.
  - If the particle enters the repulsion radius, we calculate the angle of repulsion and add acceleration vectors to the velocity components (`vx += cos(angle) * force`, `vy += sin(angle) * force`), driving the particles away from the cursor.
  - We implement standard elastic collisions on the canvas boundaries (bouncing them back by reversing velocity vectors, e.g. `vx = -vx` on border hits) and apply a minor friction coefficient (`0.98`) to damp velocities.

---

## 6. CSS Compile Pipeline (Tailwind v4)

### Q8: What are the key differences in Tailwind CSS v4 compared to v3?
- **Answer**: 
  - **CSS-First Configuration**: Tailwind v4 moves configurations from a JavaScript file into native CSS stylesheets. For example, theme overrides can be defined directly in CSS using `@theme` blocks.
  - **Vite Integration**: It features a native `@tailwindcss/vite` plugin that uses lightningcss for lightning-fast styling builds.
  - **Directive Consolidation**: Legacy `@tailwind base`, `@tailwind components`, and `@tailwind utilities` are replaced by a single statement: `@import "tailwindcss";`.
  - In our setup, we integrated `@tailwindcss/postcss` to provide a backward compatibility layer that maps older utility setups smoothly during compile times.
