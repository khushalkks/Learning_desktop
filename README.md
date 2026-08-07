# 🌌 KhushalOS - Interactive Desktop Portfolio & Gaming OS

A futuristic, high-fidelity **Glassmorphic Web Desktop Simulator** replicating an interactive operating system environment. Built with React, TypeScript, Vite, and styled with a customized Tailwind CSS v4 system.

---

## 🚀 Live Demo & Key Features

*   **🤖 CortexAI Assistant:** A real-time chat application connected to the Google Gemini API (`gemini-1.5-flash`) with conversation memory, an interactive code block container (with built-in **Copy** utility), and a robust **Offline Simulation Mode** that lets users chat offline immediately using a local text generator.
*   **📂 Window Container Manager:** Drag-and-drop, resizeable windows with macOS-style circular control dots (Close, Minimize, Maximize) and focused active border glows that react to the current global theme.
*   **🌊 Floating Glass macOS-Style Dock:** A floating launcher dock centered at the bottom of the screen with smooth scale-up zoom zoom animations (`hover:scale-115 hover:-translate-y-1.5`) when hovered.
*   **🎛️ Control Center Panel:** A quick settings menu containing dynamic linear-gradient sliders for system volume and brightness, custom CRT scanline toggles, achievements stats tracker, and global style selectors.
*   **🎨 Dynamic Ambient Wallpapers:** Multi-stop diagonal gradients overlaid with slow-drifting, organic ambient aura blobs that move and scale behind the grid lines, refracting beautifully through frosted glass windows.
*   **🎹 Synthesizer Music Player:** An audio player powered by the native browser **Web Audio API Oscillators**, synthesizing synthwave arpeggios and loops in real-time.
*   **🎮 Retro Gaming Zone:** Built-in gaming center containing retro games (Snake, Space Shooter, Memory Match) that unlock custom achievements and award OS experience points (XP).
*   **✍️ Notes Pad Editor:** A local-storage-persisted note-taking application rendering text edits in real-time.

---

## 🛠️ Technology Stack & Typography

*   **Framework:** React 19, TypeScript, Vite
*   **Styles:** Tailwind CSS v4, Vanilla CSS (Glassmorphism & CRT Monitor overlay animations)
*   **State Manager:** Zustand (butter-smooth window management and system preferences)
*   **Icons:** Lucide React
*   **Fonts (Google Fonts):**
    *   **Plus Jakarta Sans:** Primary interface font for optimal readability.
    *   **Rajdhani:** Sleek, high-tech condensed Display font for headers and system titles.
    *   **Fira Code:** Twinkling monospaced coding font for the terminal and code blocks.

---

## 💻 Local Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/khushalkks/Learning_desktop.git
    cd Learning_desktop
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in browser:**
    Go to `http://localhost:5173/` and click **FAST BOOT [ESC]** followed by **SIGN IN** to access the desktop shell.

---

## 🔑 Gemini API Configuration

To enable the real-time cloud AI chatbot:
1.  **Via environment variables:** Create a `.env` file in the root directory and add your API key:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```
2.  **Via UI settings:** Alternatively, click the **Key icon** in the CortexAI app header inside the OS, paste your key, and click **Save**. The key is saved securely in your browser's `localStorage` and will persist between reloads.
