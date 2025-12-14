# PuterMind

A browser-based AI assistant powered by [Puter.js](https://puter.com/) — no backend required.

<img width="890" height="280" alt="puterlogo-black" src="https://github.com/user-attachments/assets/84ce3aa2-c4cc-4906-b22b-307f2ff57ee2" />


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
| ![Desktop Home and Chat View] 
<img width="1920" height="909" alt="homepage" src="https://github.com/user-attachments/assets/01cdd36f-7acb-4cca-b387-94cc0d3581c7" /> 
<img width="1920" height="909" alt="chatview" src="https://github.com/user-attachments/assets/4187ec6e-1178-4555-82af-c036c52d1f37" />

|![Mobile Home and Chat View] 
<img width="1920" height="909" alt="chatview" src="https://github.com/user-attachments/assets/9b8c48b5-96f1-4bcc-a008-41dbdb2bc66a" />
<img width="411" height="794" alt="chat-mob" src="https://github.com/user-attachments/assets/e7578a9f-fb7a-41af-a9c4-c5baa77ab4c0" />
|

### Image Generation & Analysis
![Image Gen Feature]
<img width="1920" height="909" alt="gen-image" src="https://github.com/user-attachments/assets/8bc0bf17-8d7e-4c76-8b0f-80eb0bbf2911" />

## Demo

[Click here for live demo](https://putermind.netlify.app/)

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
