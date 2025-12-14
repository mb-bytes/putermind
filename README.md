# PuterMind

A browser-based AI assistant powered by [Puter.js](https://puter.com/) — no backend required.

![PuterMind](assets/puterlogo-black.png)

## Features

- 💬 **AI Chat** — Conversational AI with streaming responses
- 🎨 **Image Generation** — Create images from text descriptions
- 🤖 **Multiple AI Models** — Choose from Gemini, GPT, Claude, and Grok
- 📄 **Document Analysis** — Upload and analyze PDF, DOCX, TXT, and code files
- 🖼️ **Image Analysis** — Upload images for AI-powered analysis
- 🔐 **Secure & Private** — No external backend, data stays in your browser
- 💾 **Chat History** — Persisted using Puter's cloud KV storage
- 📱 **PWA Support** — Installable on mobile devices, to install on mobiles simply add the demo link to home screen.
- 🎯 **Responsive Design** — Works seamlessly on both desktop and mobile

## Screenshots

| Desktop Interface | Mobile Interface |
|:-----------------:|:----------------:|
| ![Desktop Home](assets/screenshots/homepage.png) | ![Mobile Chat](assets/screenshots/mob-home.png) |

### Image Generation & Analysis
![Image Gen Feature](assets/screenshots/gen-image.png)

## Demo

[Live Demo](https://putermind.netlify.app/)

## Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling & Animations |
| JavaScript | Logic & Interactivity |
| [Puter.js](https://docs.puter.com/) | AI, Auth & Cloud Storage |
| [Marked.js](https://marked.js.org/) | Markdown Rendering |
| [PDF.js](https://mozilla.github.io/pdf.js/) | PDF Text Extraction |
| [Mammoth.js](https://github.com/mwilliamson/mammoth.js) | DOCX Text Extraction |

## Getting Started

### Option 1: Clone the Repository
```bash
git clone [https://github.com/mb-bytes/putermind.git](https://github.com/mb-bytes/putermind.git)
cd putermind

### Option 2: Direct Open
Simply open `index.html` in your browser.

### Option 3: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
