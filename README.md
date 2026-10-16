# 🎛️ MultiView Pro — Multi-Stream & Video Grid Viewer

[![Live Demo on Netlify](https://img.shields.io/badge/Live%20Demo-multivew.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://multivew.netlify.app)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-22c55e?style=for-the-badge&logo=github)](https://teom275.github.io/multiview/)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Pure%20Vanilla)-success.svg)](#)
[![Invitame un cafecito](https://img.shields.io/badge/Cafecito-Invitame%20un%20café-FFA500?style=for-the-badge&logo=coffeescript&logoColor=white)](https://cafecito.app/napalm275)

> **MultiView** is a modern, responsive web application that lets you watch multiple **YouTube** and **Twitch** streams or videos simultaneously in a customizable grid or cinema spotlight theater mode.

🚀 **Production App**: **[https://multivew.netlify.app](https://multivew.netlify.app)**  
📌 **GitHub Pages Mirror**: [https://teom275.github.io/multiview/](https://teom275.github.io/multiview/)

---

## ✨ Features

- 🇦🇷 **Packs Temáticos Curados (6 Canales + Alternativas)**:
  - 📰 **Noticias AR**: TN, C5N, LN+, Crónica HD, A24, Telefe Noticias (+ Canal 26, El Trece, TV Pública, OLGA, LUZU, Vorterix).
  - ⚽ **Deportes AR**: TyC Sports, Carburando (Automovilismo), DSports Radio, Davo Xeneize, La Cobra, River Plate Oficial (+ Boca Juniors, Flavio Azzaro *El Loco y el Cuerdo* en Kick, Kun Agüero *Slakun10* en Kick, ESPN, TNT Sports).
  - 🎮 **Top Creadores AR**: Spreen, Coscu, Davo, La Cobra, Luquitas Rodríguez, Carreraaa (+ streamers en **Kick** como Brunenger, Momo, Santutu, Kun Agüero, OLGA, LUZU).
  - 📈 **Finanzas & Mercados**: Bloomberg TV, Yahoo Finance, CNBC TV, CoinDesk Crypto, Reuters Business, Euronews Business (+ Ámbito Financiero, InvertirOnline, Ramiro Marra, Financial Times).
  - 🌍 **Noticias Internacionales**: Sky News, Al Jazeera English, DW News, France 24, ABC News Live, NBC News NOW (+ Euronews, Reuters World, BBC News, CNN Live).
- ⚡ **Modo OLED True Black**: Diseñado específicamente para pantallas OLED y AMOLED con fondo negro puro `#000000` (los píxeles se apagan físicamente para contraste infinito y 0% fuga de luz).
- ⇄ **Cambio Rápido de Canal (Swap)**: Cada pantalla cuenta con un botón `⇄` que permite reemplazar ese canal individualmente por cualquiera de las alternativas de la lista o ingresar un link nuevo sin desarmar tu muro.
- 📺 **Multi-Platform Support (YouTube + Twitch + Kick)**: Embebe transmisiones y videos de **YouTube**, canales de **Twitch** y streams de **Kick** (`kick.com/username` o `kick:username`) simultáneamente con detección automática.
- 🎯 **Spotlight / Modo Cine**: Fija un stream principal en pantalla grande mientras los demás quedan en miniatura al costado.
- 📐 **Múltiples Distribuciones (Layouts)**:
  - **Auto**: Cuadrícula responsiva automática.
  - **Spotlight**: 1 pantalla de cine + barra lateral.
  - **2 &times; 2 Grid**: Cuadrícula de 4 pantallas.
  - **3 &times; 2 Grid**: Cuadrícula de 6 pantallas (ideal para los packs de Argentina).
  - **3 &times; 3 Grid**: Muro de monitoreo de hasta 9 pantallas.
- 💾 **Persistencia Automática (`localStorage`)**: Tus canales y layout quedan guardados en tu navegador.
- 🔗 **Compartir por Enlace**: Genera un link con tus canales codificados (`#streams=...`) para que cualquiera vea exactamente tu misma pantalla.
- 📦 **Importador por Lote**: Pegá una lista de links para cargar múltiples transmisiones de una sola vez.
- ⚡ **Zero Runtime Dependencies**: HTML5 semántico, CSS3 puro y JavaScript vanilla moderno. Sin dependencias externas ni compilación requerida.

---

## 🚀 Deployment & Free Hosting

Because MultiView is a 100% client-side application with zero dependencies, you can host it for **free** on any static host.

### Option 1: GitHub Pages (Recommended — Built-in & Free)

Since this repository is on GitHub, hosting it is instant:

1. Open your repository on GitHub.
2. Go to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**:
   - Select **GitHub Actions** (the included `.github/workflows/deploy.yml` will automatically deploy your site on every push!), OR:
   - Select **Deploy from a branch**, choose branch `main` and folder `/ (root)`, then click **Save**.
4. In ~1 minute, your site will be live at:
   ```
   https://<your-username>.github.io/<repository-name>/
   ```

---

### Option 2: Netlify (1-Click Free Hosting)

MultiView includes a pre-configured `netlify.toml` with optimized caching and headers:

1. Create a free account at [Netlify.com](https://www.netlify.com/).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Connect your GitHub account and select your repository.
4. Netlify will detect `netlify.toml` automatically:
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.`
5. Click **"Deploy site"**. Your app will be live with free SSL and custom domain support at:
   ```
   https://<your-site-name>.netlify.app/
   ```

---

### Option 3: Run Locally

No Node.js or build tools required:
1. Clone or download the repository:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd multiview
   ```
   *(or `git clone https://github.com/<your-username>/multiview.git`)*
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

## ☕ Apoyar el proyecto / Donaciones

Si MultiView te resultó útil para seguir noticias, deportes o a tus creadores favoritos en vivo, podés apoyar su desarrollo invitándome un cafecito:

[![Invitame un café en cafecito.app](https://cdn.cafecito.app/imgs/buttons/button_5.png)](https://cafecito.app/napalm275)

👉 **[cafecito.app/napalm275](https://cafecito.app/napalm275)**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
