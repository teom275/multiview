# 🎛️ MultiView Pro — Multi-Stream & Video Grid Viewer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)
[![Platform](https://img.shields.io/badge/Platform-Web%20Browser-6366f1.svg)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Pure%20Vanilla)-success.svg)](#)

> **MultiView** is a modern, responsive web application that lets you watch multiple **YouTube** and **Twitch** streams or videos simultaneously in a customizable grid or cinema spotlight theater mode.

Designed for esports enthusiasts, multi-camera live events, study sessions with lofi music, news monitoring, and multitasking.

---

## ✨ Features

- 📺 **Multi-Platform Support**: Seamlessly embed both **YouTube** (`watch`, `live`, `shorts`, `youtu.be`, embed URLs, or raw IDs) and **Twitch** streams simultaneously.
- 🎯 **Spotlight / Theater Mode**: Pin one primary stream to an expanded cinema screen while secondary streams flank the side.
- 📐 **Multiple Layout Modes**:
  - **Auto**: Intelligently fits 1 to 9+ streams responsively based on your display size.
  - **Spotlight**: 1 large focused stream + sidebar.
  - **2 &times; 2 Grid**: Classic 4-screen quadrant view.
  - **3 &times; 3 Grid**: 9-screen surveillance/monitoring wall.
- 💾 **Automatic Persistence (`localStorage`)**: Your open streams and layout preferences are saved automatically in your browser. Refreshing or returning later preserves your setup.
- 🔗 **Instant Layout Sharing**: Generate a shareable URL containing your exact active streams and layout (`#streams=yt:id1,tw:channel2`). Send it to friends and they'll see the exact same view instantly!
- 📦 **Batch Stream Importer**: Paste multiple stream links at once (one per line) to populate your wall in seconds.
- 🚀 **Pre-built Presets**: Instant 1-click presets for Lofi Study Vibes, NASA Earth/Space Views, Synthwave, and Quad-stream demos.
- 🎛️ **Per-Stream Controls**:
  - Focus stream into Spotlight
  - Quick reload player (fixes buffering/stream drops)
  - Open stream directly on YouTube / Twitch in a new tab
  - Fullscreen individual stream or fullscreen the entire app
  - Remove stream with animated transition
- 🎨 **Sleek Cyber / Dark Dashboard**: Built with modern CSS variables, glassmorphism, responsive 16:9 aspect ratios, and custom notification toasts (no disruptive alert popups).
- ⚡ **Zero Runtime Dependencies**: Pure HTML5, CSS3, and modern vanilla JavaScript. No build step required, ultra-fast load times.

---

## 🚀 Deployment & Free Hosting

Because MultiView is a 100% client-side application with zero dependencies, you can host it for **free** on any static host.

### Option 1: GitHub Pages (Recommended — Built-in & Free)

Since this repository is already on GitHub, hosting it is instant:

1. Open your repository on GitHub: [`https://github.com/teom275/multiview`](https://github.com/teom275/multiview)
2. Go to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**:
   - Select **GitHub Actions** (the included `.github/workflows/deploy.yml` will automatically deploy your site on every push!), OR:
   - Select **Deploy from a branch**, choose branch `main` and folder `/ (root)`, then click **Save**.
4. In ~1 minute, your site will be live at:
   ```
   https://teom275.github.io/multiview/
   ```

---

### Option 2: Netlify (1-Click Free Hosting)

MultiView includes a pre-configured `netlify.toml` with optimized caching and headers:

1. Create a free account at [Netlify.com](https://www.netlify.com/).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Connect your GitHub account and select the `multiview` repository.
4. Netlify will detect `netlify.toml` automatically:
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.`
5. Click **"Deploy MultiView"**. Your app will be live at a custom URL like `https://multiview-live.netlify.app` with free SSL and custom domain support!

---

### Option 3: Run Locally

No Node.js or build tools required:
1. Clone or download the repository:
   ```bash
   git clone https://github.com/teom275/multiview.git
   cd multiview
   ```
2. Double click `index.html` to open in any web browser, or serve it locally with:
   ```bash
   # Using Node.js
   npx serve .

   # Or using Python
   python -m http.server 8080
   ```

---

## 🎮 Supported URL Formats

| Platform | Format Example | Notes |
|---|---|---|
| **YouTube** Watch | `https://www.youtube.com/watch?v=jfKfPfyJRdk` | Standard video URL |
| **YouTube** Short | `https://youtu.be/jfKfPfyJRdk` | Short link format |
| **YouTube** Live | `https://www.youtube.com/live/jfKfPfyJRdk` | Live stream URL |
| **YouTube** Shorts | `https://www.youtube.com/shorts/jfKfPfyJRdk` | YouTube Shorts |
| **YouTube** Direct ID | `jfKfPfyJRdk` | Direct 11-character video ID |
| **Twitch** Stream | `https://www.twitch.tv/shroud` | Twitch channel stream |
| **Twitch** Quick Handle | `twitch:shroud` | Quick prefix format |
| **Kick** Stream | `https://kick.com/username` | Kick stream player |

> **Note on Twitch Embeds**: Twitch requires the embed player's `parent` parameter to match the domain hosting the application. MultiView automatically detects your current domain (`localhost`, `*.github.io`, `*.netlify.app`, etc.) and sets the parent parameter dynamically so embeds work smoothly everywhere.

---

## ⌨️ Shortcuts & Controls

- <kbd>Enter</kbd> inside the URL field adds the stream immediately.
- <kbd>Esc</kbd> closes any open modal (Batch Add, Presets, Share).
- Click **"Batch"** in the navigation bar to paste multiple stream URLs at once.
- Click **"Spotlight"** on any stream card to make it your cinema screen.
- Click **"Share"** to copy a layout URL that loads your active streams for anyone who opens it.

---

## 🛠️ Project Structure

```
multiview/
├── index.html                  # Accessible semantic application markup
├── styles.css                  # Dark mode design system, responsive grid layouts
├── script.js                   # Application state, URL parser, storage & embeds
├── netlify.toml                # Netlify deployment & headers config
├── vercel.json                 # Vercel deployment configuration
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages automated deployment workflow
├── LICENSE                     # MIT License
└── README.md                   # Documentation & hosting guide
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
