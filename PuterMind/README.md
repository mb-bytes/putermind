# PuterMind 🧠

A browser-based AI assistant powered by [Puter.js](https://puter.com/) — no backend required!

![PuterMind](assests/PuterLogo-removebg-preview.png)

## ✨ Features

- 💬 **AI Chat** — Conversational AI with streaming responses
- 🎨 **Image Generation** — Create images from text descriptions
- 🤖 **Multiple AI Models** — Choose from Gemini, GPT, Claude, and Grok
- 📄 **Document Analysis** — Upload and analyze PDF, DOCX, TXT, and code files
- 🖼️ **Image Analysis** — Upload images for AI-powered analysis
- 🔐 **Secure & Private** — No external backend, data stays in your browser
- 💾 **Chat History** — Persisted using Puter's cloud KV storage
- 📱 **PWA Support** — Installable on mobile devices
- 🎯 **Responsive Design** — Works seamlessly on desktop and mobile

## 🚀 Demo

[Live Demo](https://your-demo-link.com) _(Add your deployed URL)_

## 🛠️ Tech Stack

| Technology                                              | Purpose                  |
| ------------------------------------------------------- | ------------------------ |
| HTML5                                                   | Structure                |
| CSS3                                                    | Styling & Animations     |
| JavaScript                                              | Logic & Interactivity    |
| [Puter.js](https://docs.puter.com/)                     | AI, Auth & Cloud Storage |
| [Marked.js](https://marked.js.org/)                     | Markdown Rendering       |
| [PDF.js](https://mozilla.github.io/pdf.js/)             | PDF Text Extraction      |
| [Mammoth.js](https://github.com/mwilliamson/mammoth.js) | DOCX Text Extraction     |

## 📦 Getting Started

### Option 1: Direct Open

Simply open `index.html` in your browser.

### Option 2: Local Server

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

Then visit `http://localhost:8000`

## 🎮 Usage

1. Click **"Enter PuterMind"** to sign in with Puter
2. Select your preferred AI model from the dropdown
3. Start chatting or switch to **Image Mode** to generate images
4. Upload files (PDF, DOCX, images, code) for analysis

## 🤖 Available AI Models

| Model            | Best For                    |
| ---------------- | --------------------------- |
| Gemini 2.5 Flash | General use, fast responses |
| GPT-4.1 Nano     | Quick, efficient answers    |
| Claude Opus      | Complex reasoning tasks     |
| Claude Sonnet    | Fast, balanced responses    |
| Grok 3           | Creative & conversational   |

## 📂 Project Structure

```
PuterMind/
├── index.html      # Main HTML structure
├── style.css       # Styling & animations
├── script.js       # Core application logic
├── manifest.json   # PWA configuration
├── sw.js           # Service worker
└── assests/        # Images & icons
    ├── PuterLogo-removebg-preview.png
    ├── bgImageMain.png
    ├── icon-192.png
    └── icon-512.png
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Atique Shaikh**

- LinkedIn: [@atique-shaikh](https://www.linkedin.com/in/atique-shaikh-387468384/)
- Twitter: [@mb_bytes](https://x.com/mb_bytes)
- GitHub: [@mb-bytes](https://github.com/mb-bytes)

---

⭐ **Star this repo if you find it helpful!**
